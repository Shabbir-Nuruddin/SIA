import { supabase } from "@/integrations/supabase/client";

/**
 * Where a signed-in user should land, based on role + setup completeness:
 *   teacher                              → /teacher
 *   parent                               → /parent
 *   student missing student_id/grade     → /student-setup
 *   student not onboarded                → /onboarding
 *   student onboarded                    → /dashboard
 */
export async function getPostAuthRoute(userId: string): Promise<string> {
  let data: any = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await supabase
      .from("profiles")
      .select("role, student_id, grade, section, onboarded")
      .eq("id", userId)
      .maybeSingle();
    data = result.data;
    if (data || !result.error) break;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const role = (data?.role || "student") as string;
  if (role === "teacher") return "/teacher";
  if (role === "parent") return "/parent";

  // student
  if (!data?.student_id || !data?.grade || !data?.section) return "/student-setup";
  return data?.onboarded ? "/dashboard" : "/onboarding";
}
