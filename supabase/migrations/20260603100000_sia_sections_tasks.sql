-- ─── SIA SECTIONS + MOCK RLS + STUDENT TASKS ─────────────────────────────────
-- Idempotent. Run in Supabase → SQL Editor after the earlier SIA migrations.

-- Class section (A/B/C…) on top of grade (year group).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS section TEXT;

-- ─── MOCK PAPERS: teacher + linked parent read ────────────────────────────────
DROP POLICY IF EXISTS sia_mock_papers_read ON mock_papers;
CREATE POLICY sia_mock_papers_read ON mock_papers FOR SELECT
  USING (
    auth.uid() = user_id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = mock_papers.user_id)
  );

-- ─── STUDENT TASKS (teacher → student) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_tasks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  subject     TEXT,
  due_date    DATE,
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE student_tasks ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS student_tasks_student_idx ON student_tasks (student_id);

-- Teachers (any) manage all tasks; students read their own + flip status.
DROP POLICY IF EXISTS sia_tasks_teacher_all   ON student_tasks;
DROP POLICY IF EXISTS sia_tasks_student_read  ON student_tasks;
DROP POLICY IF EXISTS sia_tasks_student_update ON student_tasks;

CREATE POLICY sia_tasks_teacher_all ON student_tasks FOR ALL
  USING (sia_is_teacher(auth.uid()))
  WITH CHECK (sia_is_teacher(auth.uid()));

CREATE POLICY sia_tasks_student_read ON student_tasks FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY sia_tasks_student_update ON student_tasks FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);
