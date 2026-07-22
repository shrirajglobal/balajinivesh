ALTER TABLE public.partner_leads
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.partner_leads SET updated_at = created_at WHERE updated_at IS NULL;

CREATE OR REPLACE FUNCTION public.set_partner_leads_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_partner_leads_updated_at ON public.partner_leads;
CREATE TRIGGER trg_partner_leads_updated_at
  BEFORE UPDATE ON public.partner_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_partner_leads_updated_at();