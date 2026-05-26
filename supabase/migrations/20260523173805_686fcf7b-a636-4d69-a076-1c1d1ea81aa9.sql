
-- 1) Trigger fn: accept both owner emails
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email IN ('nuruddinshabbir3@gmail.com', 'alvyu.official@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
    UPDATE public.profiles SET is_admin = true, is_pro = true WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END; $$;

-- 2) Backfill: grant admin to existing owners if their account exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email IN ('nuruddinshabbir3@gmail.com', 'alvyu.official@gmail.com')
ON CONFLICT DO NOTHING;

UPDATE public.profiles SET is_admin = true, is_pro = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('nuruddinshabbir3@gmail.com', 'alvyu.official@gmail.com')
);

-- 3) admin_ai_modifiers RLS — allow both owner emails
DROP POLICY IF EXISTS "admin reads modifiers" ON public.admin_ai_modifiers;
DROP POLICY IF EXISTS "admin inserts modifiers" ON public.admin_ai_modifiers;
DROP POLICY IF EXISTS "admin updates modifiers" ON public.admin_ai_modifiers;
DROP POLICY IF EXISTS "admin deletes modifiers" ON public.admin_ai_modifiers;

CREATE POLICY "admin reads modifiers" ON public.admin_ai_modifiers
  FOR SELECT
  USING ((auth.jwt() ->> 'email') = ANY (ARRAY['nuruddinshabbir3@gmail.com','alvyu.official@gmail.com']));

CREATE POLICY "admin inserts modifiers" ON public.admin_ai_modifiers
  FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'email') = ANY (ARRAY['nuruddinshabbir3@gmail.com','alvyu.official@gmail.com']));

CREATE POLICY "admin updates modifiers" ON public.admin_ai_modifiers
  FOR UPDATE
  USING ((auth.jwt() ->> 'email') = ANY (ARRAY['nuruddinshabbir3@gmail.com','alvyu.official@gmail.com']));

CREATE POLICY "admin deletes modifiers" ON public.admin_ai_modifiers
  FOR DELETE
  USING ((auth.jwt() ->> 'email') = ANY (ARRAY['nuruddinshabbir3@gmail.com','alvyu.official@gmail.com']));
