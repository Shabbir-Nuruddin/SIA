
-- 1. admin_ai_modifiers: replace email-based policies with has_role()
DROP POLICY IF EXISTS "admin reads modifiers" ON public.admin_ai_modifiers;
DROP POLICY IF EXISTS "admin inserts modifiers" ON public.admin_ai_modifiers;
DROP POLICY IF EXISTS "admin updates modifiers" ON public.admin_ai_modifiers;
DROP POLICY IF EXISTS "admin deletes modifiers" ON public.admin_ai_modifiers;

CREATE POLICY "admin reads modifiers" ON public.admin_ai_modifiers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin inserts modifiers" ON public.admin_ai_modifiers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin updates modifiers" ON public.admin_ai_modifiers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes modifiers" ON public.admin_ai_modifiers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. user_roles: explicitly block all writes by anon/authenticated;
-- only service_role (via triggers/edge functions) may modify roles.
CREATE POLICY "user_roles no client insert" ON public.user_roles
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "user_roles no client update" ON public.user_roles
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "user_roles no client delete" ON public.user_roles
  FOR DELETE TO anon, authenticated USING (false);

-- 3. Revoke EXECUTE on internal pgmq wrapper functions from anon/authenticated.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- 4. Pin search_path on functions missing it.
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.touch_topic_progress() SET search_path = public;
