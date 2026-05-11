import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";
import { ClarityLayout } from "@/components/ClarityCompass/ClarityLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { clarityDb } from "@/types/clarity-types";
import { ClarityProfile as ClarityProfileType, ClarityResults } from "@/types/clarity.types";
import { toast } from "sonner";

interface QuizSession {
  created_at: string;
}

interface ProfileData extends ClarityProfileType {}

export function ClarityProfile(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [results, setResults] = useState<ClarityResults[]>([]);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!user) {
        navigate("/clarity-compass");
        return;
      }

      try {
        const [profileRes, resultsRes, sessionsRes] = await Promise.all([
          clarityDb
            .from("clarity_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single(),
          clarityDb
            .from("clarity_results")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          clarityDb
            .from("clarity_quiz_sessions")
            .select("created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (profileRes.data) setProfile(profileRes.data as ProfileData);
        if (resultsRes.data) setResults(resultsRes.data as ClarityResults[]);
        if (sessionsRes.data) setSessions(sessionsRes.data as QuizSession[]);
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleReset = async (): Promise<void> => {
    if (!user) return;
    setResetting(true);

    try {
      // Delete from all tables
      await Promise.all([
        clarityDb.from("clarity_profiles").delete().eq("user_id", user.id),
        clarityDb.from("clarity_results").delete().eq("user_id", user.id),
        clarityDb.from("clarity_quiz_sessions").delete().eq("user_id", user.id),
      ]);

      // Clear localStorage
      localStorage.removeItem("clarity_analysis");
      localStorage.removeItem("clarity_selected_career");

      toast.success("Everything reset. Ready for a fresh start!");
      setShowResetModal(false);
      navigate("/clarity-compass");
    } catch (err) {
      console.error("Failed to reset", err);
      toast.error("Failed to reset");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <ClarityLayout>
        <div className="flex-1 flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </ClarityLayout>
    );
  }

  if (!profile) {
    return (
      <ClarityLayout>
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center">
            <p className="text-muted-foreground mb-6">
              You haven't completed your profile yet.
            </p>
            <Button
              onClick={() => navigate("/clarity-compass/onboarding")}
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" /> Create your profile
            </Button>
          </div>
        </div>
      </ClarityLayout>
    );
  }

  const completedMilestones = results[0]
    ? Object.values(results[0].milestone_checks || {}).filter((v) => v).length
    : 0;
  const totalMilestones = results[0]?.roadmap?.phases.reduce(
    (sum, phase) => sum + phase.milestones.length,
    0
  ) || 0;
  const progressPercent = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  return (
    <ClarityLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 pb-12">
          {/* Profile Card */}
          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>

            {/* Subjects */}
            {profile.subjects.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Subjects
                </p>
                <p className="text-sm text-foreground">
                  {profile.subjects.map((s) => s.subject).join(", ")}
                </p>
              </div>
            )}

            {/* Hobbies */}
            {profile.hobbies.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Hobbies
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((h) => (
                    <span
                      key={h}
                      className="text-xs bg-primary/10 text-primary rounded px-2 py-1"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {profile.strengths.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Strengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-primary/10 text-primary rounded px-2 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dislikes */}
            {profile.dislikes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Dislikes
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.dislikes.map((d) => (
                    <span
                      key={d}
                      className="text-xs bg-muted text-muted-foreground rounded px-2 py-1"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => navigate("/clarity-compass/onboarding")}
              className="w-full"
            >
              Edit profile
            </Button>
          </section>

          {/* Roadmap Progress */}
          {results.length > 0 && results[0].roadmap && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-foreground">
                {completedMilestones} of {totalMilestones} milestones completed
              </h3>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{progressPercent}% complete</p>
            </section>
          )}

          {/* Quiz History */}
          {sessions.length > 0 && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-foreground">Quiz History</h3>
              <div className="space-y-2">
                {sessions.map((session, idx) => {
                  const date = new Date(session.created_at).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  );
                  const topCareer = results[idx]?.career_matches?.[0]?.career || "Completed";
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground">{date}</span>
                      <span className="text-foreground font-semibold">{topCareer}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Actions */}
          <section className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/clarity-compass/quiz")}
              className="flex-1"
            >
              Retake quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResetModal(true)}
              className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              Reset everything
            </Button>
          </section>

          {/* Reset Modal */}
          {showResetModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full space-y-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">Reset Everything?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This will permanently delete your profile, results, and quiz history.
                      This cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReset}
                    disabled={resetting}
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {resetting ? "Resetting..." : "Reset"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClarityLayout>
  );
}
