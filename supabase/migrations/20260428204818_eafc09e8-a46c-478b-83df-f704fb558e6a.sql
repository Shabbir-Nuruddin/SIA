
-- Per-unit subject enrollment
ALTER TABLE public.user_subjects ADD COLUMN IF NOT EXISTS unit_number INTEGER;
ALTER TABLE public.user_subjects ADD COLUMN IF NOT EXISTS unit_name TEXT;
ALTER TABLE public.user_subjects ADD COLUMN IF NOT EXISTS paper_duration_minutes INTEGER;

-- Wipe legacy rows so unit_number can be NOT NULL going forward
DELETE FROM public.user_subjects WHERE unit_number IS NULL;

ALTER TABLE public.user_subjects ALTER COLUMN unit_number SET NOT NULL;
ALTER TABLE public.user_subjects ALTER COLUMN unit_name SET NOT NULL;
ALTER TABLE public.user_subjects ALTER COLUMN paper_duration_minutes SET NOT NULL;

-- Allow multiple units per (user,subject); ensure uniqueness per unit
CREATE UNIQUE INDEX IF NOT EXISTS user_subjects_user_subject_unit_idx
  ON public.user_subjects (user_id, subject, unit_number);

-- Optional unit context on questions / sessions
ALTER TABLE public.ai_questions ADD COLUMN IF NOT EXISTS unit_number INTEGER;
ALTER TABLE public.study_sessions ADD COLUMN IF NOT EXISTS unit_number INTEGER;

-- Mock papers
CREATE TABLE IF NOT EXISTS public.mock_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject subject_code NOT NULL,
  units INTEGER[] NOT NULL,
  topics TEXT[] NOT NULL DEFAULT '{}',
  question_types TEXT[] NOT NULL DEFAULT '{}',
  total_marks INTEGER NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  difficulty_mix TEXT NOT NULL DEFAULT 'mixed',
  status TEXT NOT NULL DEFAULT 'in_progress',
  awarded_marks INTEGER,
  estimated_grade TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own mocks select" ON public.mock_papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own mocks insert" ON public.mock_papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own mocks update" ON public.mock_papers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own mocks delete" ON public.mock_papers FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.mock_paper_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mock_paper_id UUID NOT NULL REFERENCES public.mock_papers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  question_index INTEGER NOT NULL,
  topic TEXT NOT NULL,
  question_type TEXT NOT NULL,
  command_word TEXT,
  question_text TEXT NOT NULL,
  marks INTEGER NOT NULL,
  options JSONB,
  mark_scheme TEXT,
  model_answer TEXT,
  student_answer TEXT,
  awarded_marks INTEGER,
  feedback TEXT,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_paper_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own mockq select" ON public.mock_paper_questions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own mockq insert" ON public.mock_paper_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own mockq update" ON public.mock_paper_questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own mockq delete" ON public.mock_paper_questions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS mock_paper_questions_paper_idx
  ON public.mock_paper_questions (mock_paper_id, question_index);
