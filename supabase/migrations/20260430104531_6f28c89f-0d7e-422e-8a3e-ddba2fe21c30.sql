-- Topic-level progress tracking for diagnostic quiz baseline + ongoing session results.
-- Used to flag weak topics (score < 40%) for earlier scheduling and extra reviews.
CREATE TABLE IF NOT EXISTS public.topic_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  unit_number INTEGER,
  topic_name TEXT NOT NULL,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  questions_correct INTEGER NOT NULL DEFAULT 0,
  last_score_percent INTEGER,
  weak_flag BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject, unit_number, topic_name)
);

ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own topic_progress select" ON public.topic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own topic_progress insert" ON public.topic_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own topic_progress update" ON public.topic_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own topic_progress delete" ON public.topic_progress FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_topic_progress_user ON public.topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_weak ON public.topic_progress(user_id, weak_flag) WHERE weak_flag = true;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.touch_topic_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_topic_progress ON public.topic_progress;
CREATE TRIGGER trg_touch_topic_progress
BEFORE UPDATE ON public.topic_progress
FOR EACH ROW EXECUTE FUNCTION public.touch_topic_progress();