ALTER TABLE public.market_updates
ADD COLUMN IF NOT EXISTS is_weekly_roundup boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS market_updates_is_weekly_roundup_idx
ON public.market_updates (is_weekly_roundup, update_date DESC);