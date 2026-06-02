-- ─── SIA TRANSFORM MIGRATION ─────────────────────────────────────────────────
-- Run in: Supabase Dashboard → SQL Editor → New Query

-- ─── PROFILES: add SIA columns ────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_id TEXT DEFAULT 'SIA';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT TRUE;

-- Back-fill email from auth.users for existing rows
UPDATE profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;

-- Add check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('student', 'teacher', 'parent'));
  END IF;
END $$;

-- ─── PARENT-CHILD LINKS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parent_child_links (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  child_email TEXT NOT NULL,
  child_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TEACHER-CLASS LINKS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teacher_class_links (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject     TEXT,
  year_group  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WEAK TOPICS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weak_topics (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL,
  topic           TEXT NOT NULL,
  weakness_score  NUMERIC(3,2) DEFAULT 0,
  last_tested_at  TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STUDY SESSIONS: add SIA tracking columns ─────────────────────────────────
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS notes_generated  BOOLEAN DEFAULT FALSE;
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS mock_attempted   BOOLEAN DEFAULT FALSE;
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS mock_score       NUMERIC(5,2);
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS roadmap_position JSONB;
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS session_date     DATE DEFAULT CURRENT_DATE;

UPDATE study_sessions
SET session_date = completed_at::date
WHERE session_date IS NULL AND completed_at IS NOT NULL;

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE parent_child_links  ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_class_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_topics         ENABLE ROW LEVEL SECURITY;

-- Drop before recreate (avoids "already exists" errors on re-runs)
DROP POLICY IF EXISTS "parents_own_links"                     ON parent_child_links;
DROP POLICY IF EXISTS "teachers_own_links"                    ON teacher_class_links;
DROP POLICY IF EXISTS "students_own_weak_topics"              ON weak_topics;
DROP POLICY IF EXISTS "teachers_read_student_weak_topics"     ON weak_topics;
DROP POLICY IF EXISTS "parents_read_child_sessions"           ON study_sessions;
DROP POLICY IF EXISTS "teachers_read_student_sessions"        ON study_sessions;
DROP POLICY IF EXISTS "parents_read_child_profiles"           ON profiles;
DROP POLICY IF EXISTS "teachers_read_student_profiles"        ON profiles;
DROP POLICY IF EXISTS "parents_read_child_topic_progress"     ON topic_progress;
DROP POLICY IF EXISTS "teachers_read_student_topic_progress"  ON topic_progress;

CREATE POLICY "parents_own_links"
  ON parent_child_links FOR ALL USING (auth.uid() = parent_id);

CREATE POLICY "teachers_own_links"
  ON teacher_class_links FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "students_own_weak_topics"
  ON weak_topics FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "teachers_read_student_weak_topics"
  ON weak_topics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM teacher_class_links
    WHERE teacher_id = auth.uid() AND student_id = weak_topics.student_id
  ));

CREATE POLICY "parents_read_child_sessions"
  ON study_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM parent_child_links
    WHERE parent_id = auth.uid() AND child_id = study_sessions.user_id AND verified = TRUE
  ));

CREATE POLICY "teachers_read_student_sessions"
  ON study_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM teacher_class_links
    WHERE teacher_id = auth.uid() AND student_id = study_sessions.user_id
  ));

CREATE POLICY "parents_read_child_profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM parent_child_links
      WHERE parent_id = auth.uid() AND child_id = profiles.id AND verified = TRUE
    )
  );

CREATE POLICY "teachers_read_student_profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM teacher_class_links
      WHERE teacher_id = auth.uid() AND student_id = profiles.id
    )
  );

CREATE POLICY "parents_read_child_topic_progress"
  ON topic_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM parent_child_links
    WHERE parent_id = auth.uid() AND child_id = topic_progress.user_id AND verified = TRUE
  ));

CREATE POLICY "teachers_read_student_topic_progress"
  ON topic_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM teacher_class_links
    WHERE teacher_id = auth.uid() AND student_id = topic_progress.user_id
  ));
