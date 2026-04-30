-- Plan tier
DO $$ BEGIN
  CREATE TYPE public.plan_tier AS ENUM ('free', 'pro', 'advanced');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan public.plan_tier NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS questions_today_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS questions_today_reset_at date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS notes_week_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes_week_reset_at date NOT NULL DEFAULT CURRENT_DATE;
-- tutor_message_count already exists on profiles; reuse it for lifetime tutor cap.