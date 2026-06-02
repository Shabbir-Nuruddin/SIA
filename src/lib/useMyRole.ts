import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type SiaRole = "student" | "teacher" | "parent";

export interface MyProfile {
  role: SiaRole;
  first_name: string | null;
  last_name: string | null;
  student_id: string | null;
  grade: string | null;
  section: string | null;
  onboarded: boolean;
}

/** Loads the signed-in user's SIA role + identity fields. */
export function useMyRole() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let alive = true;
    supabase
      .from("profiles")
      .select("role, first_name, last_name, student_id, grade, section, onboarded")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        const d = (data as any) || {};
        setProfile({
          role: (d.role || "student") as SiaRole,
          first_name: d.first_name ?? null,
          last_name: d.last_name ?? null,
          student_id: d.student_id ?? null,
          grade: d.grade ?? null,
          section: d.section ?? null,
          onboarded: !!d.onboarded,
        });
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user, authLoading]);

  return { user, profile, loading: loading || authLoading };
}
