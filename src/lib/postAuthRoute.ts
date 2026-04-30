import { supabase } from "@/integrations/supabase/client";

/**
 * Determine where a signed-in user should land based on their progress:
 *   no diagnostic → /diagnostic
 *   diagnostic done but not onboarded → /onboarding
 *   fully set up → /dashboard
 */
export async function getPostAuthRoute(userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("onboarded,diagnostic_completed")
    .eq("id", userId)
    .maybeSingle();
  if (!data) return "/diagnostic";
  if (!data.diagnostic_completed) return "/diagnostic";
  if (!data.onboarded) return "/onboarding";
  return "/dashboard";
}
