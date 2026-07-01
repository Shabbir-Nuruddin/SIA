-- ============================================================================
-- SIA — one-paste demo readiness seed: HPL target ready in the Parent portal.
--
-- Run ONCE in the Supabase SQL Editor for the live project
-- (Supabase dashboard → project mjyqaioaasuyxsqtulfr → SQL Editor).
-- Safe to run more than once.
--
-- What this does:
--   1. Sets the Demo Student's profiles.student_id to "SIA-DEMO" (if not
--      already set) so the Demo Parent can link to it.
--   2. Links Demo Parent → Demo Student (same effect as typing "SIA-DEMO"
--      into "Link a child" on the Parent dashboard).
--   3. Inserts one ready-made HPL learning target from the Demo Teacher, so
--      it's already showing in the Demo Parent dashboard for a live demo —
--      no need to wait on a live AI generation call.
--
-- Requires the three demo accounts to already exist:
--   demo.student@sia-revision.com / demo.teacher@sia-revision.com /
--   demo.parent@sia-revision.com  (the Auth page's "Try a demo" buttons will
--   say "ask the admin to run the demo SQL" if any of them are missing).
-- ============================================================================

DO $$
DECLARE
  v_student uuid;
  v_teacher uuid;
  v_parent  uuid;
BEGIN
  SELECT id INTO v_student FROM auth.users WHERE lower(email) = 'demo.student@sia-revision.com';
  SELECT id INTO v_teacher FROM auth.users WHERE lower(email) = 'demo.teacher@sia-revision.com';
  SELECT id INTO v_parent  FROM auth.users WHERE lower(email) = 'demo.parent@sia-revision.com';

  IF v_student IS NULL OR v_teacher IS NULL OR v_parent IS NULL THEN
    RAISE EXCEPTION 'One or more demo accounts do not exist yet — create demo.student@ / demo.teacher@ / demo.parent@sia-revision.com first, sign each in once, then re-run this script.';
  END IF;

  -- Make sure each demo account has a profiles row (created on first sign-in;
  -- this is just a safety net if one hasn't signed in yet).
  INSERT INTO public.profiles (id) VALUES (v_student) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.profiles (id) VALUES (v_teacher) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.profiles (id) VALUES (v_parent)  ON CONFLICT (id) DO NOTHING;

  -- 1. Roles + a stable, linkable Student ID for the demo student.
  UPDATE public.profiles SET role = 'student' WHERE id = v_student AND role IS DISTINCT FROM 'student';
  UPDATE public.profiles SET role = 'teacher' WHERE id = v_teacher AND role IS DISTINCT FROM 'teacher';
  UPDATE public.profiles SET role = 'parent'  WHERE id = v_parent  AND role IS DISTINCT FROM 'parent';
  UPDATE public.profiles SET student_id = 'SIA-DEMO'
  WHERE id = v_student AND student_id IS DISTINCT FROM 'SIA-DEMO';

  -- 2. Link Demo Parent → Demo Student.
  INSERT INTO public.sia_parent_child (parent_id, child_id)
  VALUES (v_parent, v_student)
  ON CONFLICT (parent_id, child_id) DO NOTHING;

  -- 3. Ready-made HPL target (only inserted if this student has none yet, so
  -- re-running this script doesn't pile up duplicate targets).
  IF NOT EXISTS (SELECT 1 FROM public.student_targets WHERE student_id = v_student) THEN
    INSERT INTO public.student_targets (student_id, teacher_id, period, content, status)
    VALUES (
      v_student, v_teacher, 'This week',
      E'**Keep building consistency this week.**\n\n' ||
      E'1. Complete a fresh set of topical questions on your lowest-scoring topic — builds *Hard-working: perseverance*.\n' ||
      E'2. Sit one mock paper and read every piece of examiner feedback before moving on, not just the score — builds *Meta-thinking*.\n' ||
      E'3. Finish your next few roadmap sessions to protect your streak — builds *Realising*.\n\n' ||
      E'The foundations are there — a focused week here will show up in your mock average. Keep it up!',
      'sent'
    );
  END IF;
END $$;

-- Done. Sign in as demo.parent@sia-revision.com and open the Parent dashboard
-- — the target above appears under "Targets from teacher" immediately.
-- Sign in as demo.teacher@sia-revision.com → Teacher Analytics: the Demo
-- Student now appears at the top of the table (pinned ahead of the sample
-- students) with a working "🎯 Target" button that saves for real.
