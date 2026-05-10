
CREATE TABLE IF NOT EXISTS public.admin_ai_modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature text NOT NULL,
  board text NOT NULL DEFAULT 'all',
  instruction text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);
ALTER TABLE public.admin_ai_modifiers ENABLE ROW LEVEL SECURITY;
-- Only the admin email can manage modifiers from the client.
CREATE POLICY "admin reads modifiers"
  ON public.admin_ai_modifiers FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'nuruddinshabbir3@gmail.com');
CREATE POLICY "admin inserts modifiers"
  ON public.admin_ai_modifiers FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'email') = 'nuruddinshabbir3@gmail.com');
CREATE POLICY "admin updates modifiers"
  ON public.admin_ai_modifiers FOR UPDATE
  USING ((auth.jwt() ->> 'email') = 'nuruddinshabbir3@gmail.com');
CREATE POLICY "admin deletes modifiers"
  ON public.admin_ai_modifiers FOR DELETE
  USING ((auth.jwt() ->> 'email') = 'nuruddinshabbir3@gmail.com');
CREATE INDEX IF NOT EXISTS admin_ai_modifiers_lookup
  ON public.admin_ai_modifiers (feature, board, is_active);
