import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { format } from "date-fns";
import { ArrowRight, CalendarPlus, CheckCircle2, Clock, Coffee, Flame, Loader2, Play, SkipForward } from "lucide-react";
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
  const [profile, setProfile] = useState<{ first_name: string | null; onboarded: boolean; tutorial_completed: boolean; current_streak?: number } | null>(null);

  const todayISO = getLocalDateString();

  const load = async () => {
    if (!user) return;
    const [s, u, p, e] = await Promise.all([
      supabase.from("roadmap_sessions").select("*").eq("user_id", user.id).eq("session_date", todayISO).order("order_index"),
      supabase.from("user_subjects").select("subject,unit_number,unit_name,exam_date,target_grade,current_grade").eq("user_id", user.id).order("exam_date"),
      supabase.from("profiles").select("first_name,onboarded,tutorial_completed,current_streak").eq("id", user.id).single(),
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
      <div className="px-6 md:px-10 py-8 md:py-10 animate-fade-in">
        {/* HERO — full-bleed emerald with gold trim */}
        <div className="relative overflow-hidden rounded-3xl mb-8 border border-border" style={{
          background: "linear-gradient(135deg, hsl(160 70% 12%) 0%, hsl(160 55% 18%) 45%, hsl(160 40% 14%) 100%)"
        }}>
          {/* gold etched grid */}
          <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(hsl(43 80% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 80% 60%) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          {/* gold radial bloom */}
          <div aria-hidden className="absolute -right-32 -top-32 h-96 w-96 rounded-full" style={{
            background: "radial-gradient(circle, hsl(43 70% 50% / 0.25), transparent 65%)"
          }} />
          {/* gold filament line */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-px" style={{
            background: "linear-gradient(90deg, transparent, hsl(43 70% 58% / 0.5), transparent)"
          }} />

          <div className="relative px-7 py-8 md:px-10 md:py-10">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-mono gold-text mb-3">
              <span className="h-px w-8 bg-current opacity-50" />
              {format(new Date(), "EEEE · d MMMM yyyy")}
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight text-foreground">
              {greet}, <span className="warm-gradient-text">{name}</span>.
            </h1>
            <p className="mt-4 text-foreground/75 text-base md:text-lg max-w-2xl font-light leading-relaxed">{greetTail}</p>
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="chip chip-amber"><Flame className="h-3 w-3" />{(profile?.current_streak ?? 0)} day streak</span>
              {nearestExam && <span className="chip chip-rose">⏳ {days}d to {nearestExam.name}</span>}
              <span className="chip chip-teal">✓ {completedCount}/{sessions.length} today</span>
            </div>
          </div>
        </div>

        {/* BENTO GRID — quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { to: "/notes",       label: "Notes",     emoji: "📖", color: "violet", sub: "Open your notebook" },
            { to: "/questions",   label: "Practice",  emoji: "⚡", color: "amber",  sub: "Topical questions" },
            { to: "/mock-papers", label: "Mock Paper",emoji: "🎯", color: "rose",   sub: "Exam conditions" },
            { to: "/roadmap",     label: "Roadmap",   emoji: "🗺️", color: "teal",   sub: "Your journey" },
          ].map(q => (
            <Link key={q.to} to={q.to} className={`quick-card ${q.color} group`}>
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{q.emoji}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
              </div>
              <div className="font-display text-xl font-semibold leading-tight">{q.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{q.sub}</div>
            </Link>
          ))}
        </div>

        {!hasExams && (
          <div className="premium-card-gold p-5 mb-6 flex flex-wrap items-center gap-3">
            <CalendarPlus className="h-5 w-5 gold-text shrink-0" />
            <div className="flex-1 min-w-[200px] text-sm">
              <div className="font-semibold">No exam dates set yet.</div>
              <div className="text-muted-foreground text-xs">Add your real exam dates so the roadmap, urgency score and countdowns reflect what actually matters.</div>
            </div>
            <Link to="/exams"><Button size="sm" className="btn-primary rounded-xl">Add exam dates</Button></Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's plan — left, spans 2 */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />Today's plan
              </h2>
              <span className="text-xs font-mono text-muted-foreground tabular">
                {completedCount}/{sessions.length} complete
              </span>
            </div>

            {sessions.length === 0 && (
              <div className="premium-card p-8 text-center">
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
                    className={`premium-card ${subjClass} p-5 ${isComplete ? "opacity-50" : ""} ${isInProgress ? "ring-2 ring-accent/40" : ""}`}
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
                    <div className="text-[17px] font-semibold leading-tight mb-1 font-display">
                      {s.topic_name || (meta ? unitName : "Mixed practice")}
                    </div>
                    <div className="text-xs gold-text mb-3">
                      Method: {methodLabel[s.method] || s.method}
                    </div>

                    {s.why_now_text && (
                      <div className="text-[13px] text-muted-foreground leading-relaxed border-l-2 border-accent/30 pl-3 italic mb-4">
                        Why now: {s.why_now_text}
                      </div>
                    )}

                    {!isComplete && (
                      <div className="flex flex-wrap gap-2">
                        {s.subject && (
                          <Link to={`/questions?subject=${s.subject}&unit=${s.unit_number}${s.topic_name ? `&topic=${encodeURIComponent(s.topic_name)}` : ""}`}>
                            <Button onClick={() => startSession(s)} className="btn-primary h-9 px-4 text-sm rounded-xl" {...(i === 0 ? { "data-tutorial": "begin-button" } : {})}>
                              <Play className="h-3.5 w-3.5 mr-1.5" fill="currentColor" />
                              {isInProgress ? "Continue" : "Start session"}
                            </Button>
                          </Link>
                        )}
                        {!s.subject && (
                          <Button onClick={() => startSession(s)} className="btn-primary h-9 px-4 text-sm rounded-xl">
                            <Play className="h-3.5 w-3.5 mr-1.5" fill="currentColor" />Start
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => updateStatus(s.id, "complete")} className="h-9 px-3 text-sm rounded-xl">
                          Mark complete
                        </Button>
                        <Button variant="ghost" onClick={() => updateStatus(s.id, "skipped")} className="h-9 px-3 text-sm text-muted-foreground rounded-xl">
                          <SkipForward className="h-3.5 w-3.5 mr-1.5" />Skip
                        </Button>
                      </div>
                    )}
                  </div>

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
              <div className="premium-card-gold p-6 mt-4">
                <div className="flex items-center gap-2 text-success font-bold text-sm mb-2">
                  <CheckCircle2 className="h-4 w-4" />TODAY'S PLAN COMPLETE
                </div>
                <p className="text-[15px] mb-1 font-display">{name}, you finished today's sessions.</p>
                <p className="text-muted-foreground text-sm">
                  {nearestExam ? `${days} days remaining until ${nearestExam.name}.` : "Add an exam date to see your countdown."}
                </p>
                <Link to="/roadmap" className="inline-block mt-4">
                  <Button variant="outline" size="sm" className="rounded-xl">See tomorrow's plan <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right column — Bento widgets */}
          <aside className="space-y-4 lg:sticky lg:top-14 self-start">
            {/* Urgency gauge */}
            <div className="premium-card p-5" data-tutorial="urgency-gauge">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono mb-3 flex items-center gap-2">
                <span className="h-px w-4 bg-accent" />Urgency
              </div>
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 100 60" className="w-24 h-14 shrink-0">
                  <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={urgency.colorVar} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={126} strokeDashoffset={126 * (1 - urgency.score / 100)}
                    style={{ transition: "stroke-dashoffset 800ms ease-out, stroke 400ms ease-out" }} />
                </svg>
                <div>
                  <div className="font-display text-3xl font-bold tabular" style={{ color: urgency.colorVar }}>{urgency.score}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{urgency.message}</p>
              <p className="text-[10px] font-mono text-muted-foreground/70 mt-1.5 tabular">
                {urgency.daysToNearest}d to nearest exam{urgency.gradeGap > 0 ? ` · gap ${urgency.gradeGap}` : ""}
              </p>
            </div>

            {/* Today's stats */}
            <div className="premium-card p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono mb-3 flex items-center gap-2">
                <span className="h-px w-4 bg-accent" />Today
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-mono tabular font-semibold">{completedCount} / {sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study time</span>
                  <span className="font-mono tabular font-semibold gold-text">
                    {sessions.filter(s => s.status === "complete").reduce((a, s) => a + s.duration_minutes, 0)} min
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming exams */}
            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono flex items-center gap-2">
                  <span className="h-px w-4 bg-accent" />Upcoming exams
                </div>
                <Link to="/exams" className="text-[10px] gold-text hover:underline">Manage</Link>
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
                  <Link to="/exams"><Button size="sm" variant="outline" className="w-full rounded-xl"><CalendarPlus className="h-3.5 w-3.5 mr-1.5" />Add exam dates</Button></Link>
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
