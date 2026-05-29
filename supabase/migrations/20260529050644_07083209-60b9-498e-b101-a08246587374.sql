-- Prevent users from self-modifying privileged fields on their profile.
-- Sensitive columns can only be changed by service_role (edge functions, webhooks, triggers).

CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW.is_admin              := OLD.is_admin;
  NEW.is_pro                := OLD.is_pro;
  NEW.plan                  := OLD.plan;
  NEW.trial_start_date      := OLD.trial_start_date;
  NEW.dodo_subscription_id  := OLD.dodo_subscription_id;
  NEW.dodo_customer_id      := OLD.dodo_customer_id;
  NEW.subscription_status   := OLD.subscription_status;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_sensitive_fields_trg ON public.profiles;
CREATE TRIGGER protect_profile_sensitive_fields_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_sensitive_fields();

REVOKE EXECUTE ON FUNCTION public.protect_profile_sensitive_fields() FROM anon, authenticated;