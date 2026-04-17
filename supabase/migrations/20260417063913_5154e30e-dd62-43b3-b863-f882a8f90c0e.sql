-- Auto-trigger embed-content edge function when blog posts or market updates are published.
-- Uses pg_net to make async HTTP calls so publishing isn't blocked.

-- Ensure pg_net is enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Helper: invoke the embed-content function for a single source
CREATE OR REPLACE FUNCTION public.trigger_embed_content(_source_type text, _source_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _url text := 'https://xkyuyukppeaencmhakbu.supabase.co/functions/v1/embed-content-single';
  _service_key text;
BEGIN
  -- Read service role key from vault if present, else from current setting
  BEGIN
    SELECT decrypted_secret INTO _service_key FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    _service_key := NULL;
  END;

  -- Fire-and-forget POST. The receiving function uses its own service role key,
  -- so we just need a valid Authorization header to satisfy verify_jwt if enabled.
  PERFORM extensions.http_post(
    url := _url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('source_type', _source_type, 'source_id', _source_id)
  );
EXCEPTION WHEN OTHERS THEN
  -- Never block the original write
  RAISE WARNING 'trigger_embed_content failed: %', SQLERRM;
END;
$$;

-- Blog posts: re-embed when status becomes 'published' or content changes while published
CREATE OR REPLACE FUNCTION public.on_blog_post_published()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND (
    TG_OP = 'INSERT'
    OR OLD.status IS DISTINCT FROM NEW.status
    OR OLD.content IS DISTINCT FROM NEW.content
    OR OLD.title IS DISTINCT FROM NEW.title
    OR OLD.excerpt IS DISTINCT FROM NEW.excerpt
  ) THEN
    PERFORM public.trigger_embed_content('blog_post', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_blog_post_embed ON public.blog_posts;
CREATE TRIGGER trg_blog_post_embed
AFTER INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.on_blog_post_published();

-- Market updates: same pattern
CREATE OR REPLACE FUNCTION public.on_market_update_published()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND (
    TG_OP = 'INSERT'
    OR OLD.status IS DISTINCT FROM NEW.status
    OR OLD.headline IS DISTINCT FROM NEW.headline
    OR OLD.summary IS DISTINCT FROM NEW.summary
    OR OLD.what_it_means IS DISTINCT FROM NEW.what_it_means
  ) THEN
    PERFORM public.trigger_embed_content('market_update', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_market_update_embed ON public.market_updates;
CREATE TRIGGER trg_market_update_embed
AFTER INSERT OR UPDATE ON public.market_updates
FOR EACH ROW EXECUTE FUNCTION public.on_market_update_published();

-- Academy chapters: re-embed when published or content changes
CREATE OR REPLACE FUNCTION public.on_learning_chapter_published()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_published = true AND (
    TG_OP = 'INSERT'
    OR OLD.is_published IS DISTINCT FROM NEW.is_published
    OR OLD.content_markdown IS DISTINCT FROM NEW.content_markdown
    OR OLD.title IS DISTINCT FROM NEW.title
    OR OLD.summary IS DISTINCT FROM NEW.summary
  ) THEN
    PERFORM public.trigger_embed_content('academy_chapter', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_learning_chapter_embed ON public.learning_chapters;
CREATE TRIGGER trg_learning_chapter_embed
AFTER INSERT OR UPDATE ON public.learning_chapters
FOR EACH ROW EXECUTE FUNCTION public.on_learning_chapter_published();