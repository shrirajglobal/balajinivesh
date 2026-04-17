-- =========================================================
-- PHASE 5: Newsletter & Lightweight CRM
-- =========================================================

-- 1. SUBSCRIBERS (double opt-in)
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  source text NOT NULL DEFAULT 'footer',
  language text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed','bounced')),
  confirmation_token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  unsubscribe_token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscribers_status ON public.subscribers (status);
CREATE INDEX idx_subscribers_email ON public.subscribers (lower(email));

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a pending signup (rate-limited at edge function level)
CREATE POLICY "Anyone can subscribe"
  ON public.subscribers
  FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "Admins manage subscribers"
  ON public.subscribers
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 2. NEWSLETTER CAMPAIGNS
CREATE TABLE public.newsletter_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  preheader text,
  html_body text NOT NULL,
  source_type text NOT NULL DEFAULT 'custom' CHECK (source_type IN ('market_update','blog_post','custom')),
  source_id uuid,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sending','sent','failed')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  opened_count integer NOT NULL DEFAULT 0,
  clicked_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaigns"
  ON public.newsletter_campaigns
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 3. NEWSLETTER SENDS (per recipient log)
CREATE TABLE public.newsletter_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','bounced','opened','clicked')),
  open_token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  opened_at timestamptz,
  first_clicked_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_newsletter_sends_campaign ON public.newsletter_sends (campaign_id);
CREATE INDEX idx_newsletter_sends_open_token ON public.newsletter_sends (open_token);

ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view sends"
  ON public.newsletter_sends
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. CONTACT SUBMISSIONS (was fire-and-forget previously)
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  source text DEFAULT 'contact_page',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- 5. LEAD INBOX (unified CRM)
CREATE TABLE public.lead_inbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('contact','gift_claim','partner_application','risk_profiler','newsletter','health_check','sip_goal')),
  source_id uuid,
  name text,
  email text,
  phone text,
  payload jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','converted','closed')),
  notes text,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_inbox_status ON public.lead_inbox (status);
CREATE INDEX idx_lead_inbox_source ON public.lead_inbox (source);
CREATE INDEX idx_lead_inbox_created ON public.lead_inbox (created_at DESC);

ALTER TABLE public.lead_inbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead inbox"
  ON public.lead_inbox
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 6. AUTO-FUNNEL TRIGGERS — funnel signups into lead_inbox
CREATE OR REPLACE FUNCTION public.funnel_to_lead_inbox()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'contact_submissions' THEN
    INSERT INTO public.lead_inbox (source, source_id, name, email, phone, payload)
    VALUES ('contact', NEW.id, NEW.name, NEW.email, NEW.phone,
      jsonb_build_object('subject', NEW.subject, 'message', NEW.message));
  ELSIF TG_TABLE_NAME = 'gift_claims' THEN
    INSERT INTO public.lead_inbox (source, source_id, name, phone, payload)
    VALUES ('gift_claim', NEW.id, NEW.full_name, NEW.phone,
      jsonb_build_object('segment', NEW.segment, 'city', NEW.city, 'pincode', NEW.pincode));
  ELSIF TG_TABLE_NAME = 'partner_applications' THEN
    INSERT INTO public.lead_inbox (source, source_id, name, email, phone, payload)
    VALUES ('partner_application', NEW.id, NEW.full_name, NEW.email, NEW.phone,
      jsonb_build_object('city', NEW.city, 'profession', NEW.profession));
  ELSIF TG_TABLE_NAME = 'subscribers' AND NEW.status = 'confirmed' THEN
    INSERT INTO public.lead_inbox (source, source_id, name, email, payload)
    VALUES ('newsletter', NEW.id, NEW.name, NEW.email,
      jsonb_build_object('source', NEW.source, 'language', NEW.language));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_contact_to_inbox
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.funnel_to_lead_inbox();

CREATE TRIGGER trg_gift_to_inbox
  AFTER INSERT ON public.gift_claims
  FOR EACH ROW EXECUTE FUNCTION public.funnel_to_lead_inbox();

CREATE TRIGGER trg_partner_to_inbox
  AFTER INSERT ON public.partner_applications
  FOR EACH ROW EXECUTE FUNCTION public.funnel_to_lead_inbox();

CREATE TRIGGER trg_subscriber_to_inbox
  AFTER UPDATE OF status ON public.subscribers
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND OLD.status IS DISTINCT FROM 'confirmed')
  EXECUTE FUNCTION public.funnel_to_lead_inbox();

-- 7. updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_subscribers_updated BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON public.newsletter_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_lead_inbox_updated BEFORE UPDATE ON public.lead_inbox
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();