import { supabase } from "@/integrations/supabase/client";

/**
 * Where a signed-in user should land:
 *   onboarded → /dashboard
 *   otherwise → /onboarding
 */
export async function getPostAuthRoute(userId: string): Promise<string> {
  let data: { onboarded: boolean } | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userId)
      .maybeSingle();
    data = result.data;
    if (data || !result.error) break;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return data?.onboarded ? "/dashboard" : "/onboarding";
}
