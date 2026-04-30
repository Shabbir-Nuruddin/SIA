import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { format } from "date-fns";
import { ArrowRight, CheckCircle2, Clock, Coffee, Loader2, Play, SkipForward } from "lucide-react";
import { startPomodoro } from "@/lib/pomodoro";
import { toast } from "sonner";
import { getLocalDateString, daysFromTodayLocal } from "@/lib/dateLocal";
import { computeUrgency } from "@/lib/urgency";
import { TutorialOverlay } from "@/components/TutorialOverlay";

interface SessionRow {
  id: string;
  session_date: string;
  subject: SubjectCode | null;
  unit_number: number | null;
  topic_name: string | null;
  method: string;
  start_time: string | null;
  duration_minutes: number;
  status: string;
  why_now_text: string | null;
  order_index: number;
}

interface UnitRow {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;
  target_grade: string | null;
  current_grade: string | null;
}

const subjectClass: Record<string, string> = {
  mathematics: "subj-maths",
  biology: "subj-biology",
  chemistry: "subj-chemistry",
  physics: "subj-physics",
};

const methodLabel: Record<string, string> = {
  active_recall: "Active Recall · Learn",
  spaced_repetition: "Spaced Repetition Review",
  interleaved_practice: "Interleaved Practice",
  mock_conditions: "Mock Conditions",
  review: "Targeted Review",
  practice: "Practice Questions",
};

function formatTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  const ampm = hr >= 12 ? "PM" : "AM";
  const h12 = ((hr + 11) % 12) + 1;
  return `${h12}:${m} ${ampm}`;
}

function endTime(start: string | null, mins: number) {
  if (!start) return "";
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return formatTime(`${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}:00`);
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [profile, setProfile] = useState<{ first_name: string | null; onboarded: boolean } | null>(null);

  const todayISO = getLocalDateString();

  const load = async () => {
    if (!user) return;
    const [s, u, p] = await Promise.all([
      supabase.from("roadmap_sessions").select("*").eq("user_id", user.id).eq("session_date", todayISO).order("order_index"),
      supabase.from("user_subjects").select("subject,unit_number,unit_name,exam_date").eq("user_id", user.id).order("exam_date"),
      supabase.from("profiles").select("first_name,onboarded").eq("id", user.id).single(),
    ]);
    if (s.data) setSessions(s.data as SessionRow[]);
    if (u.data) setUnits(u.data as UnitRow[]);
    if (p.data) setProfile(p.data as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  if (loading) return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  if (units.length === 0) return <Navigate to="/onboarding" replace />;

  const nearest = units[0];
  const days = daysFromTodayLocal(nearest.exam_date);
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening";
  const name = profile?.first_name || "Student";
  const greetTail =
    hr < 12 ? `${SUBJECTS[nearest.subject].name} ${nearest.unit_name} is in ${days} days.`
    : hr < 18 ? `${days} days to ${nearest.unit_name}. Here's today's plan.`
    : `${days} days left. Even tonight matters.`;

  const pendingCount = sessions.filter(s => s.status === "pending").length;
  const completedCount = sessions.filter(s => s.status === "complete").length;
  const allDone = sessions.length > 0 && pendingCount === 0;

  // Compute readiness score (0-100)
  const readiness = Math.max(0, Math.min(100, Math.round(
    50 + (completedCount * 6) - Math.max(0, sessions.length - completedCount) * 3 - Math.max(0, 30 - days)
  )));
  const readyColor = readiness >= 70 ? "hsl(var(--success))" : readiness >= 40 ? "hsl(var(--accent))" : "hsl(var(--urgent))";
  const readyLine = readiness >= 70 ? "You're on track. Keep the consistency."
                  : readiness >= 40 ? "Getting there. Don't skip sessions."
                  : "Urgency is high. Follow the plan closely.";

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("roadmap_sessions").update({
      status,
      completed_at: status === "complete" ? new Date().toISOString() : null,
    }).eq("id", id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    window.dispatchEvent(new CustomEvent("apex-roadmap-change"));
  };

  const startSession = (s: SessionRow) => {
    if (s.status === "complete") return;
    startPomodoro({ minutes: Math.min(60, Math.max(15, s.duration_minutes)), topic: s.topic_name || undefined });
    updateStatus(s.id, "in_progress");
    toast.success("Focus session started. Pomodoro running.");
  };

  return (
    <AppLayout>
      <div className="p-5 md:p-8 max-w-7xl mx-auto animate-fade-in">
        {/* Greeting */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
            {format(new Date(), "EEEE · d MMMM")}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            {greet}, {name}.
          </h1>
          <p className="text-muted-foreground mt-1 text-[15px]">{greetTail}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column — Today's plan */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Today's plan</h2>
              <span className="text-xs font-mono text-muted-foreground tabular">
                {completedCount}/{sessions.length} complete
              </span>
            </div>

            {sessions.length === 0 && (
              <div className="surface p-8 text-center">
                <p className="text-muted-foreground text-sm mb-4">Your plan hasn't been built yet.</p>
                <Link to="/onboarding"><Button className="btn-primary">Complete setup to generate your roadmap</Button></Link>
              </div>
            )}

            {sessions.map((s, i) => {
              const meta = s.subject ? SUBJECTS[s.subject] : null;
              const subjClass = s.subject ? subjectClass[s.subject] : "";
              const unitName = meta?.units.find(u => u.number === s.unit_number)?.name;
              const isComplete = s.status === "complete";
              const isInProgress = s.status === "in_progress";
              const isSkipped = s.status === "skipped";

              return (
                <div key={s.id}>
                  <div
                    className={`surface ${subjClass} p-5 ${isComplete ? "opacity-50" : ""} ${isInProgress ? "ring-2 ring-primary/40" : ""}`}
                    style={isSkipped ? { borderLeftColor: "hsl(var(--accent))" } : {}}
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-2 tabular">
                      <span>{formatTime(s.start_time)} – {endTime(s.start_time, s.duration_minutes)}</span>
                      <span className="flex items-center gap-1.5">
                        {isComplete ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Clock className="h-3.5 w-3.5" />}
                        <span className="uppercase tracking-wider">
                          {isComplete ? "Done" : isInProgress ? "In progress" : isSkipped ? "Skipped" : "Focus"} · {s.duration_minutes}m
                        </span>
                      </span>
                    </div>

                    {meta && (
                      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                        {meta.name} · Unit {s.unit_number}
                      </div>
                    )}
                    <div className="text-[17px] font-semibold leading-tight mb-1">
                      {s.topic_name || (meta ? unitName : "Mixed practice")}
                    </div>
                    <div className="text-xs text-primary mb-3">
                      Method: {methodLabel[s.method] || s.method}
                    </div>

                    {s.why_now_text && (
                      <div className="text-[13px] text-muted-foreground leading-relaxed border-l-2 border-border pl-3 italic mb-4">
                        Why now: {s.why_now_text}
                      </div>
                    )}

                    {!isComplete && (
                      <div className="flex flex-wrap gap-2">
                        {s.subject && (
                          <Link to={`/questions?subject=${s.subject}&unit=${s.unit_number}${s.topic_name ? `&topic=${encodeURIComponent(s.topic_name)}` : ""}`}>
                            <Button onClick={() => startSession(s)} className="btn-primary h-9 px-4 text-sm">
                              <Play className="h-3.5 w-3.5 mr-1.5" fill="currentColor" />
                              {isInProgress ? "Continue" : "Start session"}
                            </Button>
                          </Link>
                        )}
                        {!s.subject && (
                          <Button onClick={() => startSession(s)} className="btn-primary h-9 px-4 text-sm">
                            <Play className="h-3.5 w-3.5 mr-1.5" fill="currentColor" />Start
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => updateStatus(s.id, "complete")} className="h-9 px-3 text-sm">
                          Mark complete
                        </Button>
                        <Button variant="ghost" onClick={() => updateStatus(s.id, "skipped")} className="h-9 px-3 text-sm text-muted-foreground">
                          <SkipForward className="h-3.5 w-3.5 mr-1.5" />Skip
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Insert short break between focus sessions, long break every 4 */}
                  {!isComplete && i < sessions.length - 1 && (
                    <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground font-mono ml-1">
                      <Coffee className="h-3 w-3" />
                      {(i + 1) % 4 === 0 ? "Long break — 20 min. Walk. No phone." : "Short break — 5 min. Step away."}
                    </div>
                  )}
                </div>
              );
            })}

            {allDone && (
              <div className="surface subj-biology p-6 mt-4">
                <div className="flex items-center gap-2 text-success font-bold text-sm mb-2">
                  <CheckCircle2 className="h-4 w-4" />TODAY'S PLAN COMPLETE
                </div>
                <p className="text-[15px] mb-1">{name}, you finished today's sessions.</p>
                <p className="text-muted-foreground text-sm">
                  {days} days remaining until {SUBJECTS[nearest.subject].name} {nearest.unit_name}.
                </p>
                <Link to="/roadmap" className="inline-block mt-4">
                  <Button variant="outline" size="sm">See tomorrow's plan <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right column — Sticky widgets */}
          <aside className="space-y-4 lg:sticky lg:top-14 self-start">
            {/* Readiness gauge */}
            <div className="surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-3">Exam readiness</div>
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 100 60" className="w-24 h-14 shrink-0">
                  <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={readyColor} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={126} strokeDashoffset={126 * (1 - readiness / 100)} />
                </svg>
                <div>
                  <div className="font-mono text-3xl font-bold tabular" style={{ color: readyColor }}>{readiness}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{readyLine}</p>
            </div>

            {/* Today's stats */}
            <div className="surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-3">Today</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-mono tabular font-semibold">{completedCount} / {sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study time</span>
                  <span className="font-mono tabular font-semibold">
                    {sessions.filter(s => s.status === "complete").reduce((a, s) => a + s.duration_minutes, 0)} min
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming exams */}
            <div className="surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-3">Upcoming exams</div>
              <div className="space-y-2.5">
                {units.slice(0, 4).map(u => {
                  const d = daysFromTodayLocal(u.exam_date);
                  return (
                    <div key={`${u.subject}-${u.unit_number}`} className="flex items-center gap-2.5 text-sm">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{
                        background: u.subject === "mathematics" ? "hsl(var(--subject-maths))"
                          : u.subject === "biology" ? "hsl(var(--subject-biology))"
                          : u.subject === "chemistry" ? "hsl(var(--subject-chemistry))"
                          : "hsl(var(--subject-physics))"
                      }} />
                      <div className="flex-1 min-w-0 truncate text-xs">{SUBJECTS[u.subject].name} U{u.unit_number}</div>
                      <div className="font-mono text-xs tabular font-semibold" style={{ color: d < 30 ? "hsl(var(--accent))" : undefined }}>
                        {d}d
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
