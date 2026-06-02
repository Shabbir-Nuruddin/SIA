-- ─── SIA ROLE LINKING ────────────────────────────────────────────────────────
-- Student ID + grade on profiles, parent→child links, teacher school-wide read.
-- Idempotent: safe to run multiple times. Run in Supabase → SQL Editor.

-- ─── PROFILES: role + student identity ────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role       TEXT NOT NULL DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade      TEXT;

-- Keep role values sane
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

-- One student per ID (case-insensitive). Parents link by typing this exact ID.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_student_id_unique
  ON profiles (lower(student_id)) WHERE student_id IS NOT NULL;

-- ─── PARENT ↔ CHILD LINKS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sia_parent_child (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (parent_id, child_id)
);
ALTER TABLE sia_parent_child ENABLE ROW LEVEL SECURITY;

-- ─── HELPERS (SECURITY DEFINER bypasses RLS → no recursion) ────────────────────
CREATE OR REPLACE FUNCTION sia_is_teacher(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = uid AND role = 'teacher');
$$;
GRANT EXECUTE ON FUNCTION sia_is_teacher(UUID) TO authenticated;

-- Parent links a child by the student's self-chosen ID. Runs as definer so the
-- parent can resolve a student they aren't linked to yet (RLS would block a
-- normal SELECT). Returns the matched child's id + name, or an error message.
CREATE OR REPLACE FUNCTION sia_link_child(p_student_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_child  UUID;
  v_name   TEXT;
BEGIN
  IF v_parent IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'You must be signed in.');
  END IF;
  IF coalesce(trim(p_student_id), '') = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Please enter a Student ID.');
  END IF;

  SELECT id, trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
    INTO v_child, v_name
    FROM profiles
    WHERE lower(student_id) = lower(trim(p_student_id)) AND role = 'student'
    LIMIT 1;

  IF v_child IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No student found with that ID. Ask your child to confirm the Student ID shown on their account.');
  END IF;

  INSERT INTO sia_parent_child (parent_id, child_id)
    VALUES (v_parent, v_child)
    ON CONFLICT (parent_id, child_id) DO NOTHING;

  RETURN jsonb_build_object('ok', true, 'child_id', v_child, 'child_name', nullif(v_name, ''));
END;
$$;
GRANT EXECUTE ON FUNCTION sia_link_child(TEXT) TO authenticated;

-- ─── RLS POLICIES ─────────────────────────────────────────────────────────────
-- Parents manage their own link rows.
DROP POLICY IF EXISTS sia_parent_links_own ON sia_parent_child;
CREATE POLICY sia_parent_links_own ON sia_parent_child FOR ALL
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

-- Profiles: self + any teacher + a linked parent may read.
DROP POLICY IF EXISTS sia_profiles_read ON profiles;
CREATE POLICY sia_profiles_read ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = profiles.id)
  );

-- Study sessions: self + teacher + linked parent.
DROP POLICY IF EXISTS sia_sessions_read ON study_sessions;
CREATE POLICY sia_sessions_read ON study_sessions FOR SELECT
  USING (
    auth.uid() = user_id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = study_sessions.user_id)
  );

-- Topic progress: self + teacher + linked parent.
DROP POLICY IF EXISTS sia_topic_progress_read ON topic_progress;
CREATE POLICY sia_topic_progress_read ON topic_progress FOR SELECT
  USING (
    auth.uid() = user_id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = topic_progress.user_id)
  );

-- User subjects (target/current grades): self + teacher + linked parent.
DROP POLICY IF EXISTS sia_user_subjects_read ON user_subjects;
CREATE POLICY sia_user_subjects_read ON user_subjects FOR SELECT
  USING (
    auth.uid() = user_id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = user_subjects.user_id)
  );
