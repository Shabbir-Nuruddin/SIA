import { supabase } from "@/integrations/supabase/client";

/**
 * Where a signed-in user should land, based on role + setup completeness.
 *
 * Role is read from profiles.role when available, but FALLS BACK to the role
 * stored in auth user_metadata (set at signup). This keeps parent/teacher
 * routing working even if the DB migration that adds profiles.role hasn't run
 * yet, or for accounts created before it ran.
 *
 *   teacher                              → /teacher
 *   parent                               → /parent
 *   student missing id/grade/section     → /student-setup
 *   student not onboarded                → /onboarding
 *   student onboarded                    → /dashboard
 */
export async function getPostAuthRoute(userId: string): Promise<string> {
  // Auth metadata role — always present for email signups, robust to missing columns.
  let metaRole: string | undefined;
  try {
    const { data } = await supabase.auth.getUser();
    metaRole = (data?.user?.user_metadata as any)?.role;
  } catch { /* ignore */ }

  let prof: any = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await supabase
      .from("profiles")
      .select("role, student_id, grade, section, onboarded")
      .eq("id", userId)
      .maybeSingle();
    prof = result.data;
    if (prof || !result.error) break;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const role = (prof?.role || metaRole || "student") as string;
  if (role === "teacher") return "/teacher";
  if (role === "parent") return "/parent";

  // student
  if (!prof?.student_id || !prof?.grade || !prof?.section) return "/student-setup";
  return prof?.onboarded ? "/dashboard" : "/onboarding";
}
