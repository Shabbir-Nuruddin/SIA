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
  // Already-onboarded users predate the diagnostic — never bounce them back.
  if (data.onboarded) return "/dashboard";
  if (!data.diagnostic_completed) return "/diagnostic";
  return "/onboarding";
}
