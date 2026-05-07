
CREATE TABLE IF NOT EXISTS public.cached_topic_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board text NOT NULL DEFAULT 'edexcel',
  subject text NOT NULL,
  unit_number integer NOT NULL,
  topic text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (board, subject, unit_number, topic)
);

ALTER TABLE public.cached_topic_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cached notes readable by all authenticated"
ON public.cached_topic_notes FOR SELECT
TO authenticated
USING (true);
