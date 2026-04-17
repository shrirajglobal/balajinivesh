-- =========================================================================
-- PHASE 6 — Foundation: pgvector RAG + Locator + Videos + Forum
-- =========================================================================

-- ---- 1. Enable pgvector ---------------------------------------------------
CREATE EXTENSION IF NOT EXISTS vector;

-- ---- 2. content_embeddings (RAG knowledge base) --------------------------
CREATE TABLE public.content_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL CHECK (source_type IN ('blog_post','market_update','academy_chapter','faq')),
  source_id UUID NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  url TEXT,
  content TEXT NOT NULL,
  embedding vector(768),                      -- gemini-embedding-001 (768 dim)
  token_count INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id, chunk_index)
);

CREATE INDEX content_embeddings_vec_idx
  ON public.content_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX content_embeddings_source_idx
  ON public.content_embeddings (source_type, source_id);

ALTER TABLE public.content_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage embeddings"
  ON public.content_embeddings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER content_embeddings_updated_at
  BEFORE UPDATE ON public.content_embeddings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Vector search function (called by chatbot edge function)
CREATE OR REPLACE FUNCTION public.match_content_embeddings(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  source_type TEXT,
  source_id UUID,
  title TEXT,
  url TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ce.id, ce.source_type, ce.source_id, ce.title, ce.url, ce.content,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM public.content_embeddings ce
  WHERE ce.embedding IS NOT NULL
    AND 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ---- 3. chat_conversations + chat_messages -------------------------------
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,                                 -- NULL = anonymous visitor
  session_id TEXT NOT NULL,                     -- browser-side UUID for anon users
  title TEXT,
  source TEXT NOT NULL DEFAULT 'widget',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_conversations_session_idx ON public.chat_conversations (session_id);
CREATE INDEX chat_conversations_user_idx ON public.chat_conversations (user_id);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat conversation"
  ON public.chat_conversations FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Owner reads own conversation"
  ON public.chat_conversations FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all conversations"
  ON public.chat_conversations FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage conversations"
  ON public.chat_conversations FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_conv_idx ON public.chat_messages (conversation_id, created_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Insert is gated through the edge function (service role) so we don't need a public insert policy here.
CREATE POLICY "Admins read all messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owner reads own messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
    )
  );

-- ---- 4. partner_service_areas (MFD Locator) ------------------------------
CREATE TABLE public.partner_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  pincode TEXT NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
  city TEXT,
  state TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (partner_id, pincode)
);

CREATE INDEX partner_service_areas_pincode_idx ON public.partner_service_areas (pincode);
CREATE INDEX partner_service_areas_city_idx ON public.partner_service_areas (lower(city));

ALTER TABLE public.partner_service_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service areas readable by everyone"
  ON public.partner_service_areas FOR SELECT TO public USING (true);

CREATE POLICY "Admins manage service areas"
  ON public.partner_service_areas FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners manage their own service areas"
  ON public.partner_service_areas FOR ALL TO authenticated
  USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()))
  WITH CHECK (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()));

-- Locator search function (pincode exact → city fallback)
CREATE OR REPLACE FUNCTION public.find_partners_by_location(
  _pincode TEXT DEFAULT NULL,
  _city TEXT DEFAULT NULL,
  _limit INT DEFAULT 10
)
RETURNS TABLE (
  partner_id UUID,
  full_name TEXT,
  city TEXT,
  pincode TEXT,
  arn_number TEXT,
  match_type TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Exact pincode match first
  SELECT
    p.id, prof.full_name, sa.city, sa.pincode, p.arn_number,
    'pincode'::text AS match_type
  FROM public.partners p
  JOIN public.partner_service_areas sa ON sa.partner_id = p.id
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  WHERE p.status = 'active'::partner_status
    AND _pincode IS NOT NULL
    AND sa.pincode = _pincode
  UNION
  -- City fallback
  SELECT
    p.id, prof.full_name, sa.city, sa.pincode, p.arn_number,
    'city'::text AS match_type
  FROM public.partners p
  JOIN public.partner_service_areas sa ON sa.partner_id = p.id
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  WHERE p.status = 'active'::partner_status
    AND _city IS NOT NULL
    AND lower(sa.city) = lower(_city)
    AND (_pincode IS NULL OR sa.pincode <> _pincode)
  LIMIT _limit;
$$;

-- ---- 5. video_resources (Video Explainer Series) -------------------------
CREATE TABLE public.video_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT NOT NULL,                     -- bare YouTube video ID
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general','sip_basics','market_education','partner_training','nism_prep','homemakers','kids')),
  audience TEXT NOT NULL DEFAULT 'investor'
    CHECK (audience IN ('investor','partner','all')),
  duration_seconds INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX video_resources_pub_idx ON public.video_resources (is_published, display_order);
CREATE INDEX video_resources_cat_idx ON public.video_resources (category);

ALTER TABLE public.video_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published videos readable by everyone"
  ON public.video_resources FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Admins read all videos"
  ON public.video_resources FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage videos"
  ON public.video_resources FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER video_resources_updated_at
  BEFORE UPDATE ON public.video_resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---- 6. forum_threads + forum_posts (Community Q&A, moderated) -----------
CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general','sip','tax','nism_prep','market','partner_only')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','locked')),
  reply_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX forum_threads_status_idx ON public.forum_threads (status, last_activity_at DESC);
CREATE INDEX forum_threads_user_idx ON public.forum_threads (user_id);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved threads readable by everyone"
  ON public.forum_threads FOR SELECT TO public
  USING (status = 'approved' OR status = 'locked');

CREATE POLICY "Authors read own threads"
  ON public.forum_threads FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins read all threads"
  ON public.forum_threads FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users create threads"
  ON public.forum_threads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins manage all threads"
  ON public.forum_threads FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER forum_threads_updated_at
  BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX forum_posts_thread_idx ON public.forum_posts (thread_id, created_at);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved posts readable by everyone"
  ON public.forum_posts FOR SELECT TO public
  USING (status = 'approved');

CREATE POLICY "Authors read own posts"
  ON public.forum_posts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins read all posts"
  ON public.forum_posts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users create posts"
  ON public.forum_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins manage all posts"
  ON public.forum_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: bump thread reply count + last_activity when an approved post is added
CREATE OR REPLACE FUNCTION public.bump_forum_thread_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE public.forum_threads
    SET reply_count = (
        SELECT COUNT(*) FROM public.forum_posts
        WHERE thread_id = NEW.thread_id AND status = 'approved'
      ),
      last_activity_at = now()
    WHERE id = NEW.thread_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER forum_posts_bump_thread
  AFTER INSERT OR UPDATE OF status ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.bump_forum_thread_activity();