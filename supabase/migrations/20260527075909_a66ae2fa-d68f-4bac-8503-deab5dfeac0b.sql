
-- 1. Add module_key to learning_modules
ALTER TABLE public.learning_modules
  ADD COLUMN IF NOT EXISTS module_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS learning_modules_module_key_uidx
  ON public.learning_modules(module_key) WHERE module_key IS NOT NULL;

-- 2. Add structured fields to learning_chapters
ALTER TABLE public.learning_chapters
  ADD COLUMN IF NOT EXISTS chapter_number INTEGER,
  ADD COLUMN IF NOT EXISTS module_key TEXT,
  ADD COLUMN IF NOT EXISTS plain_english TEXT,
  ADD COLUMN IF NOT EXISTS real_world TEXT,
  ADD COLUMN IF NOT EXISTS quick_recap JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS exam_traps_list JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS last_updated DATE;

CREATE UNIQUE INDEX IF NOT EXISTS learning_chapters_slug_uidx
  ON public.learning_chapters(slug);

-- 3. Hide legacy modules (preserve data + progress)
UPDATE public.learning_modules
   SET is_published = false
 WHERE module_key IS NULL;

-- 4. Seed the 8 official NISM V-A modules (idempotent on module_key)
INSERT INTO public.learning_modules
  (slug, module_key, title, subtitle, description, audience, cover_emoji,
   pass_percentage, issues_certificate, certificate_label, display_order, is_published)
VALUES
  ('investment-landscape', 'investment_landscape',
   'Investment Landscape',
   'Foundation of Indian financial markets',
   'Risk-return basics, market structure, and why mutual funds exist (Chapters 1–5).',
   'partner', '🌐', 70, false, NULL, 1, true),

  ('mutual-fund-structure', 'mutual_fund_structure',
   'Mutual Fund Structure & Constituents',
   'How a mutual fund is built',
   'Sponsor, Trustee, AMC, RTA, Custodian and Auditors (Chapters 6–10).',
   'partner', '🏛️', 70, false, NULL, 2, true),

  ('legal-regulatory', 'legal_regulatory',
   'Legal & Regulatory Framework',
   'SEBI, AMFI and investor protection',
   'SEBI MF Regulations 1996, AMFI, KYC/PMLA, ARN code of conduct (Chapters 11–15).',
   'partner', '⚖️', 75, false, NULL, 3, true),

  ('offer-documents', 'offer_documents',
   'Scheme-Related Offer Documents',
   'SID, SAI and KIM',
   'How to read and explain the three official scheme documents (Chapters 16–18).',
   'partner', '📄', 70, false, NULL, 4, true),

  ('scheme-types', 'scheme_types',
   'Fund Types & Categorisation',
   'Equity, debt, hybrid and beyond',
   'SEBI scheme categorisation and how each fund category behaves (Chapters 19–27).',
   'partner', '🧩', 70, true, 'Product Knowledge Certified', 5, true),

  ('financial-planning', 'financial_planning',
   'Financial Planning & Goal-Based Investing',
   'From need analysis to SIPs',
   'Time value of money, risk profiling, asset allocation and SIP/SWP/STP (Chapters 28–33).',
   'partner', '🎯', 75, true, 'Financial Planning Practitioner', 6, true),

  ('distribution-operations', 'distribution_operations',
   'Distribution, Operations & Investor Services',
   'Day-to-day distributor workflow',
   'ARN registration, transactions, NAV cut-off, CAS, nomination and grievance (Chapters 34–39).',
   'partner', '🛠️', 70, false, NULL, 7, true),

  ('taxation-accounting', 'taxation_accounting',
   'Taxation & Accounting',
   'Numbers a distributor must know',
   'FY 2024-25 equity/debt taxation, expense ratio and fund accounting (Chapters 40–42).',
   'partner', '🧾', 80, true, 'NISM V-A Ready', 8, true)
ON CONFLICT (slug) DO UPDATE
   SET module_key       = EXCLUDED.module_key,
       title            = EXCLUDED.title,
       subtitle         = EXCLUDED.subtitle,
       description      = EXCLUDED.description,
       cover_emoji      = EXCLUDED.cover_emoji,
       pass_percentage  = EXCLUDED.pass_percentage,
       issues_certificate = EXCLUDED.issues_certificate,
       certificate_label  = EXCLUDED.certificate_label,
       display_order    = EXCLUDED.display_order,
       is_published     = true;
