
-- Trigger-only functions: revoke EXECUTE from clients.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_owner_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.unlock_next_node() FROM PUBLIC, anon, authenticated;
