-- Categories (content pillars)
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  audience TEXT NOT NULL DEFAULT 'investor', -- 'investor' | 'partner' | 'both'
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories readable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.blog_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_blog_categories_updated BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tags
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags readable by everyone" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Admins manage tags" ON public.blog_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- markdown
  cover_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  audience TEXT NOT NULL DEFAULT 'investor', -- 'investor' | 'partner' | 'both'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'scheduled' | 'published' | 'archived'
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  reading_time_minutes INTEGER,
  author_name TEXT NOT NULL DEFAULT 'Balaji Nivesh',
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts readable by everyone" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins read all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_blog_posts_status_pub ON public.blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_posts_audience ON public.blog_posts(audience);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);

-- Post <-> Tag join
CREATE TABLE public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Post tags readable by everyone" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Admins manage post tags" ON public.blog_post_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- AI generation jobs
CREATE TABLE public.blog_generation_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  audience TEXT NOT NULL DEFAULT 'investor',
  ai_provider TEXT NOT NULL DEFAULT 'lovable_ai',
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  status TEXT NOT NULL DEFAULT 'queued', -- queued | processing | ready_for_review | published | failed
  scheduled_publish_at TIMESTAMP WITH TIME ZONE,
  generated_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  error_message TEXT,
  raw_output JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_generation_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage generation jobs" ON public.blog_generation_jobs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_blog_jobs_updated BEFORE UPDATE ON public.blog_generation_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed content pillars from the strategy doc
INSERT INTO public.blog_categories (slug, name, description, audience, display_order) VALUES
  ('sip-basics', 'SIP Basics', 'Systematic Investment Plan fundamentals for new investors', 'investor', 1),
  ('mutual-fund-basics', 'Mutual Fund Basics', 'How mutual funds work, types, and key concepts', 'investor', 2),
  ('tax-planning', 'Tax Planning', 'ELSS, Section 80C, capital gains and tax-efficient investing', 'investor', 3),
  ('goal-planning', 'Goal Planning', 'Child education, retirement, wedding, home purchase planning', 'investor', 4),
  ('local-context', 'Local Context (Bengal)', 'West Bengal specific investor education and culture', 'investor', 5),
  ('market-literacy', 'Market Literacy', 'Understanding markets, indices, asset classes', 'investor', 6),
  ('nism-prep', 'NISM Prep', 'NISM Series V-A exam preparation for distributors', 'partner', 10),
  ('partner-skills', 'Partner Skills', 'Sales, pitching, client conversations and onboarding', 'partner', 11),
  ('compliance-ethics', 'Compliance & Ethics', 'SEBI/AMFI rules, code of conduct, ethical practice', 'partner', 12),
  ('product-knowledge', 'Product Knowledge', 'Deep dives into MF/Bond/Insurance/IPO products for distributors', 'partner', 13);