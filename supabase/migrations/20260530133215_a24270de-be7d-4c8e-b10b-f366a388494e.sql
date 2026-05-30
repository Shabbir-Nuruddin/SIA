
CREATE TABLE public.flashcard_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  card_key TEXT NOT NULL,
  subject TEXT,
  unit_number INTEGER,
  topic TEXT,
  board TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  box INTEGER NOT NULL DEFAULT 1,
  due_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  correct_streak INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, card_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcard_reviews TO authenticated;
GRANT ALL ON public.flashcard_reviews TO service_role;

ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own flashcard_reviews select" ON public.flashcard_reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own flashcard_reviews insert" ON public.flashcard_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own flashcard_reviews update" ON public.flashcard_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own flashcard_reviews delete" ON public.flashcard_reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_flashcard_reviews_due ON public.flashcard_reviews (user_id, due_at);
CREATE INDEX idx_flashcard_reviews_topic ON public.flashcard_reviews (user_id, subject, topic);

CREATE TRIGGER flashcard_reviews_touch
  BEFORE UPDATE ON public.flashcard_reviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_topic_progress();
