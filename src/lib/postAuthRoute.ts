import { supabase } from "@/integrations/supabase/client";

/**
 * Where a signed-in user should land:
 *   onboarded → /dashboard
 *   otherwise → /onboarding
 */
export async function getPostAuthRoute(userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", userId)
    .maybeSingle();
  return data?.onboarded ? "/dashboard" : "/onboarding";
}
