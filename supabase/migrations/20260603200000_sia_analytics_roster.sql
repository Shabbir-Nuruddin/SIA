-- ─── SIA ANALYTICS RLS + STUDENT ROSTER ──────────────────────────────────────
-- Idempotent. Run in Supabase → SQL Editor after the earlier SIA migrations.

-- ─── roadmap_nodes: teacher + linked parent read (for roadmap completion %) ────
DROP POLICY IF EXISTS sia_roadmap_read ON roadmap_nodes;
CREATE POLICY sia_roadmap_read ON roadmap_nodes FOR SELECT
  USING (
    auth.uid() = user_id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = roadmap_nodes.user_id)
  );

-- ─── user_activity: teacher + linked parent read (time on platform) ────────────
DROP POLICY IF EXISTS sia_activity_read ON user_activity;
CREATE POLICY sia_activity_read ON user_activity FOR SELECT
  USING (
    auth.uid() = user_id
    OR sia_is_teacher(auth.uid())
    OR EXISTS (SELECT 1 FROM sia_parent_child l WHERE l.parent_id = auth.uid() AND l.child_id = user_activity.user_id)
  );

-- ─── STUDENT ROSTER (master list of valid student IDs) ────────────────────────
-- Pre-load this with the school's real students. When a student signs up and
-- enters their Student ID, the app fills their name/grade/section from here.
CREATE TABLE IF NOT EXISTS student_roster (
  student_id  TEXT PRIMARY KEY,
  first_name  TEXT,
  last_name   TEXT,
  grade       TEXT,
  section     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE student_roster ENABLE ROW LEVEL SECURITY;

-- Any signed-in user may look up a roster entry (names only — not sensitive).
DROP POLICY IF EXISTS sia_roster_read ON student_roster;
CREATE POLICY sia_roster_read ON student_roster FOR SELECT
  USING (auth.role() = 'authenticated');

-- Teachers may manage the roster (add/import students).
DROP POLICY IF EXISTS sia_roster_teacher_manage ON student_roster;
CREATE POLICY sia_roster_teacher_manage ON student_roster FOR ALL
  USING (sia_is_teacher(auth.uid()))
  WITH CHECK (sia_is_teacher(auth.uid()));

-- ─── EXAMPLE: import your students like this (edit + run) ──────────────────────
-- INSERT INTO student_roster (student_id, first_name, last_name, grade, section) VALUES
--   ('SIA-10234', 'Ahmed',  'Al-Rashidi', 'Year 12', 'A'),
--   ('SIA-10235', 'Sara',   'Khan',       'Year 12', 'A'),
--   ('SIA-11045', 'Yusuf',  'Patel',      'Year 13', 'B')
-- ON CONFLICT (student_id) DO UPDATE
--   SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name,
--       grade = EXCLUDED.grade, section = EXCLUDED.section;
