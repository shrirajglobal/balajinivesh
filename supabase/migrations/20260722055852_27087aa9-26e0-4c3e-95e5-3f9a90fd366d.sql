
ALTER TABLE public.partner_leads
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'warm',
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS expected_investment_amount numeric,
  ADD COLUMN IF NOT EXISTS next_follow_up_date date,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;

-- Add priority check constraint (idempotent)
DO $$ BEGIN
  ALTER TABLE public.partner_leads
    ADD CONSTRAINT partner_leads_priority_check CHECK (priority IN ('hot','warm','cold'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Replace/refresh the status check to the CRM pipeline values
ALTER TABLE public.partner_leads DROP CONSTRAINT IF EXISTS partner_leads_status_check;
ALTER TABLE public.partner_leads
  ADD CONSTRAINT partner_leads_status_check
  CHECK (status IN ('new','contacted','interested','meeting_scheduled','converted','not_interested'));

-- Activities table
CREATE TABLE IF NOT EXISTS public.partner_lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.partner_leads(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('note','call','whatsapp','meeting','status_change')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.partner_lead_activities (lead_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_lead_activities TO authenticated;
GRANT ALL ON public.partner_lead_activities TO service_role;

ALTER TABLE public.partner_lead_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners manage their own lead activities" ON public.partner_lead_activities;
CREATE POLICY "Partners manage their own lead activities"
  ON public.partner_lead_activities FOR ALL TO authenticated
  USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()))
  WITH CHECK (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins view all lead activities" ON public.partner_lead_activities;
CREATE POLICY "Admins view all lead activities"
  ON public.partner_lead_activities FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
