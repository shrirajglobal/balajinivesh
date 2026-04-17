-- ============================================================
-- Phase 3: Partner Learning University
-- ============================================================

-- Modules ----------------------------------------------------
CREATE TABLE public.learning_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  audience TEXT NOT NULL DEFAULT 'partner',
  cover_emoji TEXT DEFAULT '📘',
  display_order INTEGER NOT NULL DEFAULT 0,
  total_chapters INTEGER NOT NULL DEFAULT 0,
  pass_percentage INTEGER NOT NULL DEFAULT 70,
  issues_certificate BOOLEAN NOT NULL DEFAULT false,
  certificate_label TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_learning_modules_audience ON public.learning_modules(audience);
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules readable by authenticated"
  ON public.learning_modules FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "Admins manage modules"
  ON public.learning_modules FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON public.learning_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Chapters ---------------------------------------------------
CREATE TABLE public.learning_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content_markdown TEXT NOT NULL DEFAULT '',
  bengali_glossary JSONB DEFAULT '{}'::jsonb,
  exam_traps TEXT,
  estimated_minutes INTEGER NOT NULL DEFAULT 8,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, slug)
);

CREATE INDEX idx_chapters_module ON public.learning_chapters(module_id, display_order);
ALTER TABLE public.learning_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chapters readable by authenticated"
  ON public.learning_chapters FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "Admins manage chapters"
  ON public.learning_chapters FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_learning_chapters_updated_at
  BEFORE UPDATE ON public.learning_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Quiz questions ---------------------------------------------
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.learning_chapters(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_module ON public.quiz_questions(module_id);
CREATE INDEX idx_quiz_chapter ON public.quiz_questions(chapter_id);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions readable by authenticated"
  ON public.quiz_questions FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins manage questions"
  ON public.quiz_questions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Quiz attempts (for spaced repetition) ----------------------
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.learning_chapters(id) ON DELETE SET NULL,
  selected_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_seconds INTEGER,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_attempts_review ON public.quiz_attempts(user_id, next_review_at);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own attempts"
  ON public.quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own attempts"
  ON public.quiz_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins view all attempts"
  ON public.quiz_attempts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Per-chapter completion -------------------------------------
CREATE TABLE public.partner_chapter_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.learning_chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id)
);

CREATE INDEX idx_chapter_progress_user ON public.partner_chapter_progress(user_id, module_id);
ALTER TABLE public.partner_chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own chapter progress"
  ON public.partner_chapter_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all chapter progress"
  ON public.partner_chapter_progress FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Per-module aggregate ---------------------------------------
CREATE TABLE public.partner_module_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  chapters_completed INTEGER NOT NULL DEFAULT 0,
  quiz_score_pct NUMERIC,
  best_quiz_score_pct NUMERIC,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

CREATE INDEX idx_module_progress_user ON public.partner_module_progress(user_id);
ALTER TABLE public.partner_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own module progress"
  ON public.partner_module_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all module progress"
  ON public.partner_module_progress FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_partner_module_progress_updated_at
  BEFORE UPDATE ON public.partner_module_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Learning certificates --------------------------------------
CREATE TABLE public.learning_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  module_title TEXT NOT NULL,
  score_pct NUMERIC,
  pdf_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

CREATE INDEX idx_learning_certs_user ON public.learning_certificates(user_id);
ALTER TABLE public.learning_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own learning certificates"
  ON public.learning_certificates FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own learning certificates"
  ON public.learning_certificates FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage learning certificates"
  ON public.learning_certificates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Helper: keep total_chapters synced -------------------------
CREATE OR REPLACE FUNCTION public.sync_module_chapter_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.learning_modules
  SET total_chapters = (
    SELECT COUNT(*) FROM public.learning_chapters
    WHERE module_id = COALESCE(NEW.module_id, OLD.module_id) AND is_published = true
  )
  WHERE id = COALESCE(NEW.module_id, OLD.module_id);
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_module_chapter_count
  AFTER INSERT OR UPDATE OR DELETE ON public.learning_chapters
  FOR EACH ROW EXECUTE FUNCTION public.sync_module_chapter_count();

-- Seed the 4 modules ----------------------------------------
INSERT INTO public.learning_modules (slug, title, subtitle, description, audience, cover_emoji, display_order, pass_percentage, issues_certificate, certificate_label) VALUES
  ('nism-v-a-prep', 'NISM V-A Mutual Fund Distributors Prep', 'Pass NISM-Series-V-A on the first attempt',
   'Complete preparation for the NISM Series V-A Mutual Fund Distributors Certification. 10 chapters covering products, taxation, regulations, and investor service — plus 3 mock tests.',
   'partner', '🎓', 1, 60, true, 'NISM V-A Preparation Certificate'),
  ('product-knowledge', 'Product Knowledge Mastery', 'Equity, debt, hybrid, ELSS, index funds & more',
   'Deep-dive into the full spectrum of mutual fund products — when each works, who it suits, taxation, and how to explain them in plain language.',
   'partner', '📚', 2, 70, true, 'Product Knowledge Certificate'),
  ('sales-pitching', 'Sales & Pitching Conversations', 'Real-world dialogues with real-world objections',
   '12 simulated investor conversations — first-time SIP investor, FD-only saver, market-correction panic, retirement planner — with the SEBI-compliant scripts that work.',
   'partner', '🤝', 3, 70, false, NULL),
  ('compliance-ethics', 'Compliance & Ethics for Distributors', 'Stay on the right side of SEBI & AMFI',
   'KYC, suitability, mis-selling red flags, advertisement code, ARN renewal — what every distributor must know to keep their license safe.',
   'partner', '⚖️', 4, 80, true, 'Compliance & Ethics Certificate');