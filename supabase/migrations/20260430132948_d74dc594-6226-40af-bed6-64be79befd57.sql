-- Exams: scheduled tests (mock, board, term, school) with topic/unit selection per exam.
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'school' CHECK (exam_type IN ('mock','board','term','school','other')),
  exam_date DATE NOT NULL,
  subject TEXT,
  unit_numbers INTEGER[] NOT NULL DEFAULT '{}',
  topics TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own exams select" ON public.exams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own exams insert" ON public.exams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own exams update" ON public.exams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own exams delete" ON public.exams FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_exams_user_date ON public.exams(user_id, exam_date);

CREATE TRIGGER touch_exams_updated_at BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.touch_topic_progress();