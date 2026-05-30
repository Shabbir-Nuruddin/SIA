-- Prevent users from spoofing admin replies by setting is_admin_reply=true on insert.
-- A trigger overrides whatever the client sent based on actual role.
CREATE OR REPLACE FUNCTION public.enforce_feedback_reply_admin_flag()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.is_admin_reply := public.has_role(NEW.author_id, 'admin'::app_role);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS feedback_replies_enforce_admin_flag ON public.feedback_replies;
CREATE TRIGGER feedback_replies_enforce_admin_flag
BEFORE INSERT OR UPDATE ON public.feedback_replies
FOR EACH ROW
EXECUTE FUNCTION public.enforce_feedback_reply_admin_flag();