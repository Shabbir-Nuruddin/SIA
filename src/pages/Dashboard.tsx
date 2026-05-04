import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { format } from "date-fns";
import { ArrowRight, CalendarPlus, CheckCircle2, Clock, Coffee, Loader2, Play, SkipForward } from "lucide-react";
import { startPomodoro } from "@/lib/pomodoro";
import { toast } from "sonner";
import { getLocalDateString, daysFromTodayLocal } from "@/lib/dateLocal";
import { computeUrgency } from "@/lib/urgency";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { syncProAfterCheckout } from "@/lib/dodo";

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

interface ExamRow {
  id: string;
  name: string;
  exam_date: string;
  subject: SubjectCode | null;
  is_active: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [profile, setProfile] = useState<{ first_name: string | null; onboarded: boolean; tutorial_completed: boolean } | null>(null);

  const todayISO = getLocalDateString();

  const load = async () => {
    if (!user) return;
    const [s, u, p, e] = await Promise.all([
      supabase.from("roadmap_sessions").select("*").eq("user_id", user.id).eq("session_date", todayISO).order("order_index"),
      supabase.from("user_subjects").select("subject,unit_number,unit_name,exam_date,target_grade,current_grade").eq("user_id", user.id).order("exam_date"),
      supabase.from("profiles").select("first_name,onboarded,tutorial_completed").eq("id", user.id).single(),
      supabase.from("exams").select("id,name,exam_date,subject,is_active").eq("user_id", user.id).eq("is_active", true).order("exam_date"),
    ]);
    if (s.data) setSessions(s.data as SessionRow[]);
    if (u.data) setUnits(u.data as UnitRow[]);
    if (p.data) setProfile(p.data as any);
    if (e.data) setExams(e.data as ExamRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    if (!user || searchParams.get("checkout") !== "success") return;
    let cancelled = false;
    const run = async () => {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const isPro = await syncProAfterCheckout();
        if (cancelled) return;
        if (isPro) {
          toast.success("You're on Pro now 🎉");
          searchParams.delete("checkout");
          setSearchParams(searchParams, { replace: true });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      toast.info("Payment received. Your Pro access may take a minute to appear — please refresh shortly if it has not updated.");
    };
    void run();
    return () => { cancelled = true; };
  }, [user, searchParams, setSearchParams]);

  // Re-tick at midnight so urgency refreshes daily without a reload.
  useEffect(() => {
    if (units.length === 0) return;
    const ms = (() => {
      const next = new Date(); next.setHours(24, 0, 5, 0);
      return next.getTime() - Date.now();
    })();
    const t = setTimeout(() => load(), ms);
    return () => clearTimeout(t);
  }, [units.length]);

  if (loading) return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  if (units.length === 0) return <Navigate to="/onboarding" replace />;

  const hasExams = exams.length > 0;
  const nearestExam = hasExams ? exams[0] : null;
  // Map exams onto the matching user_subjects row (for grade gap context),
  // falling back to the first unit if no subject match.
  const unitForNearest = nearestExam
    ? units.find(u => u.subject === nearestExam.subject) ?? units[0]
    : units[0];
  const days = nearestExam ? daysFromTodayLocal(nearestExam.exam_date) : null;
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening";
  const name = profile?.first_name || "Student";
  const greetTail = !nearestExam
    ? "No exam dates set yet — add them so we can pace your plan."
    : hr < 12 ? `${nearestExam.name} is in ${days} days.`
    : hr < 18 ? `${days} days to ${nearestExam.name}. Here's today's plan.`
    : `${days} days left until ${nearestExam.name}. Even tonight matters.`;

  const pendingCount = sessions.filter(s => s.status === "pending").length;
  const completedCount = sessions.filter(s => s.status === "complete").length;
  const allDone = sessions.length > 0 && pendingCount === 0;

  // Urgency score uses real exams when present; otherwise zero.
  const urgency = hasExams
    ? computeUrgency(exams.map(ex => ({
        exam_date: ex.exam_date,
        target_grade: unitForNearest?.target_grade ?? null,
        current_grade: unitForNearest?.current_grade ?? null,
      })))
    : { score: 0, daysToNearest: 0, gradeGap: 0, level: "calm" as const,
        message: "Add an exam date to start the urgency clock.",
        colorVar: "hsl(var(--muted-foreground))" };


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

        {!hasExams && (
          <div className="surface p-4 mb-5 flex flex-wrap items-center gap-3 border-l-4" style={{ borderLeftColor: "hsl(var(--accent))" }}>
            <CalendarPlus className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1 min-w-[200px] text-sm">
              <div className="font-semibold">No exam dates set yet.</div>
              <div className="text-muted-foreground text-xs">Add your real exam dates so the roadmap, urgency score, and countdowns reflect what actually matters.</div>
            </div>
            <Link to="/exams"><Button size="sm" className="btn-primary">Add exam dates</Button></Link>
          </div>
        )}

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
                <div key={s.id} {...(i === 0 ? { "data-tutorial": "first-session" } : {})}>
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
                            <Button onClick={() => startSession(s)} className="btn-primary h-9 px-4 text-sm" {...(i === 0 ? { "data-tutorial": "begin-button" } : {})}>
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
                  {nearestExam ? `${days} days remaining until ${nearestExam.name}.` : "Add an exam date to see your countdown."}
                </p>
                <Link to="/roadmap" className="inline-block mt-4">
                  <Button variant="outline" size="sm">See tomorrow's plan <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right column — Sticky widgets */}
          <aside className="space-y-4 lg:sticky lg:top-14 self-start">
            {/* Urgency gauge */}
            <div className="surface p-5" data-tutorial="urgency-gauge">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-3">Urgency score</div>
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 100 60" className="w-24 h-14 shrink-0">
                  <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={urgency.colorVar} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={126} strokeDashoffset={126 * (1 - urgency.score / 100)}
                    style={{ transition: "stroke-dashoffset 800ms ease-out, stroke 400ms ease-out" }} />
                </svg>
                <div>
                  <div className="font-mono text-3xl font-bold tabular" style={{ color: urgency.colorVar }}>{urgency.score}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{urgency.message}</p>
              <p className="text-[10px] font-mono text-muted-foreground/70 mt-1.5 tabular">
                {urgency.daysToNearest}d to nearest exam{urgency.gradeGap > 0 ? ` · gap ${urgency.gradeGap}` : ""}
              </p>
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
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Upcoming exams</div>
                <Link to="/exams" className="text-[10px] text-primary hover:underline">Manage</Link>
              </div>
              {hasExams ? (
                <div className="space-y-2.5">
                  {exams.slice(0, 5).map(ex => {
                    const d = daysFromTodayLocal(ex.exam_date);
                    const sc = ex.subject;
                    return (
                      <div key={ex.id} className="flex items-center gap-2.5 text-sm">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{
                          background: sc === "mathematics" ? "hsl(var(--subject-maths))"
                            : sc === "biology" ? "hsl(var(--subject-biology))"
                            : sc === "chemistry" ? "hsl(var(--subject-chemistry))"
                            : sc === "physics" ? "hsl(var(--subject-physics))"
                            : "hsl(var(--muted-foreground))"
                        }} />
                        <div className="flex-1 min-w-0 truncate text-xs">{ex.name}</div>
                        <div className="font-mono text-xs tabular font-semibold" style={{ color: d < 30 ? "hsl(var(--accent))" : undefined }}>
                          {d}d
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>No exam dates yet.</p>
                  <Link to="/exams"><Button size="sm" variant="outline" className="w-full"><CalendarPlus className="h-3.5 w-3.5 mr-1.5" />Add exam dates</Button></Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      {profile && !profile.tutorial_completed && sessions.length > 0 && (
        <TutorialOverlay
          firstName={profile.first_name || "Student"}
          daysToExam={urgency.daysToNearest}
          onFinish={async () => {
            await supabase.from("profiles").update({ tutorial_completed: true }).eq("id", user!.id);
            setProfile(p => p ? { ...p, tutorial_completed: true } : p);
          }}
        />
      )}
    </AppLayout>
  );
};

export default Dashboard;
