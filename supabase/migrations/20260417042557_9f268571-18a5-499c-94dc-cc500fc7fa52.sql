-- Integration settings table for managing third-party API connections
CREATE TABLE public.integration_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'ai_provider', 'market_data', 'email', 'whatsapp', 'analytics'
  provider_key TEXT NOT NULL, -- e.g., 'lovable_ai', 'openai', 'resend', 'twilio', 'ga4'
  display_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}'::jsonb, -- non-secret config (model name, endpoint, measurement ID, etc.)
  secret_names TEXT[] DEFAULT ARRAY[]::TEXT[], -- references to Supabase edge function secret names
  last_test_status TEXT, -- 'success', 'failed', null
  last_test_at TIMESTAMP WITH TIME ZONE,
  last_test_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (category, provider_key)
);

ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage integration settings"
ON public.integration_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_integration_settings_updated_at
BEFORE UPDATE ON public.integration_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Site settings table for global configuration (ARN, AMFI, etc.)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings readable by everyone"
ON public.site_settings
FOR SELECT
USING (is_public = true);

CREATE POLICY "Admins can view all settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description, is_public) VALUES
  ('arn_number', 'ARN-XXXXXX', 'AMFI Registration Number', true),
  ('arn_holder_name', 'Balaji Nivesh', 'Name of ARN holder', true),
  ('amfi_registration_date', '', 'Date of AMFI registration', true),
  ('euin_number', '', 'Employee Unique Identification Number', true),
  ('contact_email', 'contact@balajinivesh.com', 'Primary contact email', true),
  ('contact_phone', '', 'Primary contact phone', true),
  ('whatsapp_number', '', 'WhatsApp business number', true);

-- Seed default integration providers (disabled by default, except Lovable AI)
INSERT INTO public.integration_settings (category, provider_key, display_name, enabled, is_default, config, secret_names) VALUES
  ('ai_provider', 'lovable_ai', 'Lovable AI Gateway', true, true, '{"default_model": "google/gemini-3-flash-preview", "available_models": ["google/gemini-3-flash-preview", "google/gemini-2.5-pro", "google/gemini-2.5-flash", "openai/gpt-5", "openai/gpt-5-mini"]}'::jsonb, ARRAY['LOVABLE_API_KEY']),
  ('ai_provider', 'openai', 'OpenAI Direct', false, false, '{"default_model": "gpt-4o-mini"}'::jsonb, ARRAY['OPENAI_API_KEY']),
  ('ai_provider', 'anthropic', 'Anthropic Claude', false, false, '{"default_model": "claude-3-5-sonnet-20241022"}'::jsonb, ARRAY['ANTHROPIC_API_KEY']),
  ('ai_provider', 'perplexity', 'Perplexity', false, false, '{"default_model": "llama-3.1-sonar-small-128k-online"}'::jsonb, ARRAY['PERPLEXITY_API_KEY']),
  ('market_data', 'alpha_vantage', 'Alpha Vantage', false, false, '{"endpoint": "https://www.alphavantage.co/query"}'::jsonb, ARRAY['ALPHA_VANTAGE_API_KEY']),
  ('market_data', 'nse_india', 'NSE India', false, false, '{"endpoint": "https://www.nseindia.com/api"}'::jsonb, ARRAY[]::TEXT[]),
  ('email', 'resend', 'Resend', false, true, '{"from_email": "noreply@balajinivesh.com", "from_name": "Balaji Nivesh"}'::jsonb, ARRAY['RESEND_API_KEY']),
  ('whatsapp', 'twilio', 'Twilio WhatsApp', false, true, '{"from_number": ""}'::jsonb, ARRAY['TWILIO_API_KEY', 'TWILIO_ACCOUNT_SID']),
  ('analytics', 'ga4', 'Google Analytics 4', false, true, '{"measurement_id": ""}'::jsonb, ARRAY[]::TEXT[]),
  ('analytics', 'gtm', 'Google Tag Manager', false, false, '{"container_id": ""}'::jsonb, ARRAY[]::TEXT[]),
  ('analytics', 'search_console', 'Google Search Console', false, false, '{"verification_token": ""}'::jsonb, ARRAY[]::TEXT[]);