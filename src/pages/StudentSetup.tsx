import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyRole } from "@/lib/useMyRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YEAR_GROUPS } from "@/lib/studentMetrics";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Loader2, ArrowRight, IdCard, GraduationCap } from "lucide-react";

const RED = "#C8102E";
const RED_DARK = "#7A0A1C";

const StudentSetup = () => {
  const { user } = useAuth();
  const { profile, loading } = useMyRole();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Prefill if returning to edit
  useEffect(() => {
    if (profile?.student_id) setStudentId(profile.student_id);
    if (profile?.grade) setGrade(profile.grade);
  }, [profile?.student_id, profile?.grade]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fdf8f8" }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: RED }} />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  // Only students complete this step.
  if (profile && profile.role !== "student") {
    return <Navigate to={profile.role === "teacher" ? "/teacher" : "/parent"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = studentId.trim();
    if (!id) { toast.error("Please enter your Student ID."); return; }
    if (!grade) { toast.error("Please select your year group."); return; }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ student_id: id, grade } as any)
        .eq("id", user.id);

      if (error) {
        // Unique-index violation → another account already uses this ID.
        if ((error as any).code === "23505" || /duplicate|unique/i.test(error.message)) {
          toast.error("That Student ID is already registered to another account.");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Student details saved.");
      navigate(profile?.onboarded ? "/dashboard" : "/onboarding", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{ background: "#fdf8f8", fontFamily: "'Source Sans 3','Inter',sans-serif" }}>
      <SEO title="Student setup — SIA Smart Revision" description="Confirm your SIA student details." path="/student-setup" noindex />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4" style={{ background: RED }}>
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
            Welcome to SIA Smart Revision
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#777" }}>
            Confirm your student details so your teachers and parents can follow your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-7 shadow-sm space-y-5" style={{ borderColor: "#f0e0e2" }}>
          <div className="space-y-1.5">
            <Label htmlFor="student_id" className="flex items-center gap-1.5">
              <IdCard className="h-4 w-4" style={{ color: RED }} /> Student ID
            </Label>
            <Input
              id="student_id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. SIA-10234"
              required
              maxLength={40}
              className="h-11"
            />
            <p className="text-xs" style={{ color: "#999" }}>
              Use your official SIA student number. Your parent will enter this exact ID to link to your account.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="grade">Year group</Label>
            <div className="grid grid-cols-2 gap-2">
              {YEAR_GROUPS.map((g) => {
                const active = grade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className="py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={{
                      borderColor: active ? RED : "#e5e7eb",
                      background: active ? RED : "#fff",
                      color: active ? "#fff" : "#374151",
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" disabled={saving} className="h-12 w-full text-base font-semibold text-white" style={{ background: RED }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudentSetup;
