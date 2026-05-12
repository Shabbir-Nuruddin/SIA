-- Migration: Smart Calendar & Confidence Tracking Tables
-- Created for ApexRevise roadmap calendar feature

-- User availability (blocked slots + hours per day)
CREATE TABLE IF NOT EXISTS public.user_availability (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  blocked_slots JSONB NOT NULL DEFAULT '{}'::jsonb,
  hours_per_day NUMERIC(4,1) NOT NULL DEFAULT 3,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own availability"
  ON public.user_availability FOR ALL USING (auth.uid() = user_id);

-- Topic confidence per user
CREATE TABLE IF NOT EXISTS public.user_topic_confidence (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL,
  topic           TEXT NOT NULL,
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('weak','ok','strong')),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject, topic)
);
ALTER TABLE public.user_topic_confidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own topic confidence"
  ON public.user_topic_confidence FOR ALL USING (auth.uid() = user_id);

-- Subject enrollment (separate from profile subjects for the calendar)
CREATE TABLE IF NOT EXISTS public.user_subjects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_code TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_code)
);
ALTER TABLE public.user_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subjects"
  ON public.user_subjects FOR ALL USING (auth.uid() = user_id);

-- Generated study plan (cached per user)
CREATE TABLE IF NOT EXISTS public.user_study_plan (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_json   JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_study_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own study plan"
  ON public.user_study_plan FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_topic_confidence_user ON public.user_topic_confidence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subjects_user ON public.user_subjects(user_id);
