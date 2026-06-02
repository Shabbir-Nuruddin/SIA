import { supabase } from "@/integrations/supabase/client";

interface ProfileRoute {
  role: string;
  approved: boolean;
  onboarded: boolean;
}

export async function getPostAuthRoute(userId: string): Promise<string> {
  let data: ProfileRoute | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await supabase
      .from("profiles")
      .select("role,approved,onboarded")
      .eq("id", userId)
      .maybeSingle();
    data = result.data as ProfileRoute | null;
    if (data || !result.error) break;
    await new Promise((r) => setTimeout(r, 300));
  }

  if (!data) return "/onboarding";

  const role = (data.role as string) ?? "student";
  const approved = (data.approved as boolean) ?? true;

  if (role === "teacher" || role === "parent") {
    if (!approved) return "/auth/pending-approval";
    return role === "teacher" ? "/dashboard/teacher" : "/dashboard/parent";
  }

  return data.onboarded ? "/dashboard" : "/onboarding";
}
