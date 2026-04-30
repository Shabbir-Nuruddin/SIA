-- Roadmap sessions: the day-by-day study plan
CREATE TABLE public.roadmap_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_date DATE NOT NULL,
  subject TEXT,
  unit_number INTEGER,
  topic_name TEXT,
  method TEXT NOT NULL DEFAULT 'practice',
  start_time TIME,
  duration_minutes INTEGER NOT NULL DEFAULT 25,
  status TEXT NOT NULL DEFAULT 'pending',
  why_now_text TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own roadmap select" ON public.roadmap_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own roadmap insert" ON public.roadmap_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own roadmap update" ON public.roadmap_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own roadmap delete" ON public.roadmap_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_roadmap_user_date ON public.roadmap_sessions(user_id, session_date);

-- Add study preferences columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS study_start_time TIME NOT NULL DEFAULT '16:00:00',
  ADD COLUMN IF NOT EXISTS hours_per_day INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS exam_board TEXT NOT NULL DEFAULT 'edexcel';