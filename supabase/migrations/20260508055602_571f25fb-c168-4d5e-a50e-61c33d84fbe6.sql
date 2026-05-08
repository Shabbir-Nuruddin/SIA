
-- Clear notes cache for full regeneration with the improved prompt
DELETE FROM public.cached_topic_notes;

-- FAQ topical exam-questions cache (shared across all users)
CREATE TABLE IF NOT EXISTS public.cached_faq_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  questions jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (board, subject, topic)
);
ALTER TABLE public.cached_faq_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq questions readable by authenticated"
  ON public.cached_faq_questions FOR SELECT
  TO authenticated USING (true);

-- Educational images cache (shared)
CREATE TABLE IF NOT EXISTS public.cached_topic_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board text NOT NULL,
  subject text NOT NULL,
  unit_number int NOT NULL,
  topic text NOT NULL,
  images jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (board, subject, unit_number, topic)
);
ALTER TABLE public.cached_topic_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topic images readable by authenticated"
  ON public.cached_topic_images FOR SELECT
  TO authenticated USING (true);
