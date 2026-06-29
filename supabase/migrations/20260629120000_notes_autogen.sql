-- Notes Auto-Generator control table.
-- Backs the admin panel ON/OFF switch that bulk-pre-generates notes into the
-- shared cache (public.cached_topic_notes). A single row (id = 1) holds the
-- enabled flag + which boards to sweep. Only admins can read/flip it.
--
-- NOTE: this table only stores the *switch*. "What is already generated" is read
-- directly from public.cached_topic_notes (a topic is done once a cached row
-- exists), so progress is always accurate and resumable with no extra bookkeeping.

CREATE TABLE IF NOT EXISTS public.notes_autogen_control (
  id smallint PRIMARY KEY DEFAULT 1,
  enabled boolean NOT NULL DEFAULT false,
  boards text[] NOT NULL DEFAULT ARRAY['edexcel-igcse', 'edexcel-ial'],
  last_topic text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notes_autogen_control_singleton CHECK (id = 1)
);

INSERT INTO public.notes_autogen_control (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.notes_autogen_control ENABLE ROW LEVEL SECURITY;

-- Admin check that works even if the admin-role trigger/migration never ran on
-- this backend (e.g. a fresh Lovable Cloud DB): allow the owner email from the
-- JWT, OR a user_roles admin row. Keeps the panel switch usable out of the box.
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
