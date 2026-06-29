-- ============================================================================
-- SIA — one-paste fix for the admin panel + Notes Auto-Generator.
--
-- Run this ONCE in the Supabase SQL Editor for the live project
-- (Supabase dashboard → project mjyqaioaasuyxsqtulfr → SQL Editor).
--
-- It does two things:
--   1. Grants your account admin (user_roles row + profiles.is_admin) so the
--      existing admin edge functions (Gemini keys, user list) stop returning 403.
--   2. Creates the notes_autogen_control table the ON/OFF switch needs.
--
-- Safe to run more than once.
-- ============================================================================

-- 1. GRANT ADMIN TO THE OWNER ACCOUNT --------------------------------------
-- Adds the user_roles 'admin' row (used by admin-ai-keys / admin-delete-user)
-- and sets profiles.is_admin (used by admin-list-users).
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE lower(email) = 'nuruddinshabbir3@gmail.com'
ON CONFLICT DO NOTHING;

UPDATE public.profiles SET is_admin = true
WHERE id IN (SELECT id FROM auth.users WHERE lower(email) = 'nuruddinshabbir3@gmail.com');

-- 2. NOTES AUTO-GENERATOR CONTROL TABLE ------------------------------------
CREATE TABLE IF NOT EXISTS public.notes_autogen_control (
  id smallint PRIMARY KEY DEFAULT 1,
  enabled boolean NOT NULL DEFAULT false,
  boards text[] NOT NULL DEFAULT ARRAY['edexcel-igcse', 'edexcel-ial'],
  subjects text[] NOT NULL DEFAULT ARRAY['mathematics', 'biology', 'chemistry', 'physics'],
  last_topic text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notes_autogen_control_singleton CHECK (id = 1)
);

-- Add the subjects column if the table already existed before this feature.
ALTER TABLE public.notes_autogen_control
  ADD COLUMN IF NOT EXISTS subjects text[] NOT NULL
  DEFAULT ARRAY['mathematics', 'biology', 'chemistry', 'physics'];

INSERT INTO public.notes_autogen_control (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.notes_autogen_control ENABLE ROW LEVEL SECURITY;

-- Admin check that works even if the admin-role trigger never ran here: allow
-- the owner email from the JWT, OR a user_roles admin row.
CREATE OR REPLACE FUNCTION public.is_sia_admin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT
    lower(coalesce(auth.jwt() ->> 'email', '')) IN ('nuruddinshabbir3@gmail.com', 'alvyu.official@gmail.com')
    OR public.has_role(auth.uid(), 'admin');
$$;

DROP POLICY IF EXISTS "autogen control admin read" ON public.notes_autogen_control;
CREATE POLICY "autogen control admin read"
ON public.notes_autogen_control FOR SELECT
TO authenticated
USING (public.is_sia_admin());

DROP POLICY IF EXISTS "autogen control admin update" ON public.notes_autogen_control;
CREATE POLICY "autogen control admin update"
ON public.notes_autogen_control FOR UPDATE
TO authenticated
USING (public.is_sia_admin())
WITH CHECK (public.is_sia_admin());

-- Done. Sign out and back in once so your session token refreshes, then reload
-- /admin. The Gemini keys should appear and the Notes Auto-Generator switch works.
