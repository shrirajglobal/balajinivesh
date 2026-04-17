-- Market Updates table
CREATE TABLE public.market_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_date DATE NOT NULL,
  
  -- Market data (numeric values)
  sensex_close NUMERIC,
  sensex_change NUMERIC,
  sensex_change_pct NUMERIC,
  nifty_close NUMERIC,
  nifty_change NUMERIC,
  nifty_change_pct NUMERIC,
  bank_nifty_close NUMERIC,
  bank_nifty_change_pct NUMERIC,
  gold_price NUMERIC,
  gold_change_pct NUMERIC,
  silver_price NUMERIC,
  silver_change_pct NUMERIC,
  crude_price NUMERIC,
  crude_change_pct NUMERIC,
  usd_inr NUMERIC,
  usd_inr_change_pct NUMERIC,
  
  -- AI-generated content
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  what_it_means TEXT,
  key_movers JSONB DEFAULT '[]'::jsonb,
  market_sentiment TEXT,
  
  -- Workflow
  status TEXT NOT NULL DEFAULT 'draft',
  ai_generated BOOLEAN NOT NULL DEFAULT true,
  ai_provider TEXT DEFAULT 'lovable_ai',
  ai_model TEXT,
  raw_ai_output JSONB,
  data_source TEXT,
  
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  view_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  
  CONSTRAINT market_updates_status_check CHECK (status IN ('draft', 'approved', 'published', 'archived'))
);

CREATE UNIQUE INDEX idx_market_updates_date ON public.market_updates(update_date);
CREATE INDEX idx_market_updates_status ON public.market_updates(status);
CREATE INDEX idx_market_updates_published_at ON public.market_updates(published_at DESC) WHERE status = 'published';

ALTER TABLE public.market_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published market updates readable by everyone"
ON public.market_updates FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins read all market updates"
ON public.market_updates FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage market updates"
ON public.market_updates FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_market_updates_updated_at
BEFORE UPDATE ON public.market_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed automation mode setting
INSERT INTO public.site_settings (setting_key, setting_value, description, is_public)
VALUES 
  ('market_updates_automation_mode', 'semi_auto', 'Automation level: assisted | semi_auto | full_auto', false),
  ('market_updates_publish_time', '17:00', 'Daily publish time IST (HH:MM)', false)
ON CONFLICT (setting_key) DO NOTHING;