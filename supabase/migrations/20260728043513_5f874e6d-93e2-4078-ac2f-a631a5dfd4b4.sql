
-- 1. chat_conversations: lead capture columns
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS lead_name text,
  ADD COLUMN IF NOT EXISTS lead_phone text,
  ADD COLUMN IF NOT EXISTS lead_captured_at timestamptz,
  ADD COLUMN IF NOT EXISTS lead_action text;

-- 2. Admin read policies on chat tables
CREATE POLICY "Admins can view all chat conversations"
  ON public.chat_conversations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. partner_leads: google event id
ALTER TABLE public.partner_leads
  ADD COLUMN IF NOT EXISTS google_event_id text;

-- 4. partner_google_connections table
CREATE TABLE IF NOT EXISTS public.partner_google_connections (
  partner_id uuid PRIMARY KEY REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  connection_key text NOT NULL,
  google_email text,
  connected_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_google_connections TO authenticated;
GRANT ALL ON public.partner_google_connections TO service_role;

ALTER TABLE public.partner_google_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners manage own google connection"
  ON public.partner_google_connections FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins view all google connections"
  ON public.partner_google_connections FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_partner_google_connections_updated_at
  BEFORE UPDATE ON public.partner_google_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Seed Google review site_settings keys
INSERT INTO public.site_settings (setting_key, setting_value, description, is_public)
VALUES
  ('google_review_url', 'https://share.google/IK6J7sBBQJRY6TR55', 'Google Business Profile review link', true),
  ('google_rating', '', 'Google rating out of 5 (e.g. 4.8)', true),
  ('google_review_count', '', 'Total number of Google reviews', true)
ON CONFLICT (setting_key) DO NOTHING;
