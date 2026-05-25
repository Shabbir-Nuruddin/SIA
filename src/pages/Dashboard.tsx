import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { ArrowRight, CalendarPlus, CheckCircle2, Flame, Loader2, Play, SkipForward, Activity } from "lucide-react";
import { startPomodoro } from "@/lib/pomodoro";
import { toast } from "sonner";
import { getLocalDateString, daysFromTodayLocal } from "@/lib/dateLocal";
import { computeUrgency } from "@/lib/urgency";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { syncProAfterCheckout } from "@/lib/dodo";
import { useSidebarMode } from "@/lib/sidebarMode";

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

interface ExamRow {
  id: string;
  name: string;
  exam_date: string;
  subject: SubjectCode | null;
  is_active: boolean;
}

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

// Modules — five immersive entry tiles. Reuses existing routes/labels — no nav changes.
const MODULES: { to: string; label: string; sub: string; emoji: string; tint: string }[] = [
  { to: "/notes",       label: "Notes",      sub: "Open your notebook · structured per topic",     emoji: "📖", tint: "violet" },
  { to: "/questions",   label: "Practice",   sub: "Topical questions, exam-style, instant marking", emoji: "⚡", tint: "amber" },
  { to: "/mock-papers", label: "Mock Paper", sub: "Full timed papers under exam conditions",        emoji: "🎯", tint: "rose" },
  { to: "/roadmap",     label: "Roadmap",    sub: "Your progressive journey to the exam",           emoji: "🗺️", tint: "teal" },
  { to: "/podcast",     label: "Podcast",    sub: "Hands-free revision — listen on the go",         emoji: "🎧", tint: "indigo" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [profile, setProfile] = useState<{ first_name: string | null; onboarded: boolean; tutorial_completed: boolean; current_streak?: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const todayISO = getLocalDateString();

  // Force the icon-rail while on dashboard. Restore on leave.
  const { mode, setMode } = useSidebarMode();
  useEffect(() => {
    const previous = mode;
    if (mode !== "rail") setMode("rail");
    return () => { setMode(previous); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (units.length === 0) return;
    const ms = (() => { const next = new Date(); next.setHours(24, 0, 5, 0); return next.getTime() - Date.now(); })();
    const t = setTimeout(() => load(), ms);
    return () => clearTimeout(t);
  }, [units.length]);

  if (loading) return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  if (units.length === 0) return <Navigate to="/onboarding" replace />;

  const hasExams = exams.length > 0;
  const nearestExam = hasExams ? exams[0] : null;
  const unitForNearest = nearestExam ? units.find(u => u.subject === nearestExam.subject) ?? units[0] : units[0];
  const days = nearestExam ? daysFromTodayLocal(nearestExam.exam_date) : null;

  const pendingCount = sessions.filter(s => s.status === "pending").length;
  const completedCount = sessions.filter(s => s.status === "complete").length;
  const allDone = sessions.length > 0 && pendingCount === 0;

  const urgency = hasExams
    ? computeUrgency(exams.map(ex => ({
        exam_date: ex.exam_date,
        target_grade: unitForNearest?.target_grade ?? null,
        current_grade: unitForNearest?.current_grade ?? null,
      })))
    : { score: 0, daysToNearest: 0, gradeGap: 0, level: "calm" as const,
        message: "Add an exam date to start the urgency clock.",
        colorVar: "rgba(242,239,233,0.5)" };

  // Map urgency level to violet/amber palette per brief.
  const urgencyColor = urgency.score >= 70 ? "#F59E0B" : urgency.score >= 40 ? "#C4B5FD" : "rgba(242,239,233,0.55)";
  const urgencyLabel = urgency.score >= 70 ? "URGENT" : urgency.score >= 40 ? "MODERATE" : "ON TRACK";

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

  // Find the "current" slot — first in_progress, else first pending.
  const currentId = sessions.find(s => s.status === "in_progress")?.id
                  ?? sessions.find(s => s.status === "pending")?.id;

  return (
    <AppLayout>
      <div className="dashboard-shell">
        <div className="dash-grain" />

        {/* TOP BAR — minimal status strip */}
        <header className="dash-topbar">
          <div className="dash-h text-lg pl-12 lg:pl-2" style={{ fontWeight: 600 }}>
            MakeMeRevise
          </div>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="dash-chip dash-chip-violet">
              <Activity className="h-3 w-3" />
              <span className="dash-mono">URG {urgency.score}</span>
              <span className="opacity-60">· {urgencyLabel}</span>
            </span>
            <span className="dash-chip dash-chip-amber">
              <Flame className="h-3 w-3" />
              <span className="dash-mono">{profile?.current_streak ?? 0}d</span>
            </span>
            {nearestExam && (
              <span className="dash-chip">
                <span className="dash-mono">{days}d</span>
                <span className="opacity-70">→ {nearestExam.name}</span>
              </span>
            )}
          </div>
        </header>

        <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto relative">
          {/* No exam-dates nudge */}
          {!hasExams && (
            <div className="mb-8 flex flex-wrap items-center gap-3 p-5 rounded-2xl"
                 style={{ background: "var(--dash-amber-soft)", border: "1px solid rgba(245,158,11,0.35)" }}>
              <CalendarPlus className="h-5 w-5" style={{ color: "var(--dash-amber)" }} />
              <div className="flex-1 min-w-[200px] text-sm">
                <div className="font-semibold">No exam dates set yet.</div>
                <div className="opacity-70 text-xs">Add real dates so the countdown and urgency clock reflect what actually matters.</div>
              </div>
              <Link to="/exams"><Button size="sm" className="rounded-full" style={{ background: "var(--dash-amber)", color: "#1a1300" }}>Add exam dates</Button></Link>
            </div>
          )}

          {/* MODULES — 5 stacked full-width immersive tiles */}
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="dash-h text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Choose your workspace</h2>
              <span className="dash-mono text-[10px] opacity-50 tracking-[0.22em] uppercase">Modules</span>
            </div>
            <div className="space-y-3">
              {MODULES.map(m => (
                <Link key={m.to} to={m.to} className={`dash-tile tint-${m.tint}`}>
                  <div className="dash-tile-bg" />
                  <div className="dash-grain" style={{ opacity: 0.18 }} />
                  <div className="dash-tile-content">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="dash-tile-icon">{m.emoji}</div>
                      <div className="min-w-0">
                        <h3>{m.label}</h3>
                        <p className="truncate">{m.sub}</p>
                      </div>
                    </div>
                    <div className="dash-tile-cta hidden md:flex">
                      Enter <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* TIMELINE STRIP — today's plan */}
          <section className="mb-16">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="dash-h text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Today's plan</h2>
              <span className="dash-mono text-[10px] opacity-50 tracking-[0.22em] uppercase">
                {completedCount}/{sessions.length} complete
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="p-8 rounded-2xl text-center" style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-line)" }}>
                <p className="opacity-70 text-sm mb-4">Your plan hasn't been built yet.</p>
                <Link to="/onboarding"><Button className="rounded-full" style={{ background: "var(--dash-violet)" }}>Complete setup to generate your roadmap</Button></Link>
              </div>
            ) : (
              <div className="dash-timeline">
                <div className="dash-timeline-rail">
                  {sessions.map((s, i) => {
                    const meta = s.subject ? SUBJECTS[s.subject] : null;
                    const unitName = meta?.units.find(u => u.number === s.unit_number)?.name;
                    const isComplete = s.status === "complete";
                    const isSkipped = s.status === "skipped";
                    const isInProgress = s.status === "in_progress";
                    const isNow = s.id === currentId && !isComplete;
                    const stateClass = isComplete ? "is-done" : isSkipped ? "is-skipped" : isNow ? "is-now" : "";

                    return (
                      <div key={s.id} className={`dash-tslot ${stateClass}`} {...(i === 0 ? { "data-tutorial": "first-session" } : {})}>
                        <div className="dash-tslot-time">{formatTime(s.start_time)} – {endTime(s.start_time, s.duration_minutes)} · {s.duration_minutes}m</div>
                        {meta && <div className="dash-tslot-meta dash-mono uppercase tracking-wider">{meta.name} · Unit {s.unit_number}</div>}
                        <div className="dash-tslot-title">{s.topic_name || (meta ? unitName : "Mixed practice")}</div>
                        <div className="dash-tslot-meta" style={{ color: "var(--dash-violet)" }}>{methodLabel[s.method] || s.method}</div>
                        {!isComplete && (
                          <div className="dash-tslot-actions">
                            {s.subject ? (
                              <Link to={`/questions?subject=${s.subject}&unit=${s.unit_number}${s.topic_name ? `&topic=${encodeURIComponent(s.topic_name)}` : ""}`}>
                                <Button onClick={() => startSession(s)} size="sm" className="h-8 rounded-full px-3 text-xs"
                                        style={{ background: "var(--dash-violet)", color: "#fff" }}
                                        {...(i === 0 ? { "data-tutorial": "begin-button" } : {})}>
                                  <Play className="h-3 w-3 mr-1.5" fill="currentColor" />
                                  {isInProgress ? "Continue" : "Start"}
                                </Button>
                              </Link>
                            ) : (
                              <Button onClick={() => startSession(s)} size="sm" className="h-8 rounded-full px-3 text-xs" style={{ background: "var(--dash-violet)", color: "#fff" }}>
                                <Play className="h-3 w-3 mr-1.5" fill="currentColor" />Start
                              </Button>
                            )}
                            <Button onClick={() => updateStatus(s.id, "complete")} size="sm" variant="outline" className="h-8 rounded-full px-3 text-xs border-[rgba(242,239,233,0.18)] bg-transparent hover:bg-white/5 text-[#F2EFE9]">
                              Done
                            </Button>
                            <Button onClick={() => updateStatus(s.id, "skipped")} size="sm" variant="ghost" className="h-8 rounded-full px-2 text-xs text-[rgba(242,239,233,0.55)] hover:bg-white/5">
                              <SkipForward className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {isComplete && (
                          <div className="dash-tslot-meta flex items-center gap-1.5 mt-2" style={{ color: "#22c55e" }}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {allDone && (
              <div className="mt-6 p-6 rounded-2xl" style={{ background: "var(--dash-surface)", border: "1px solid rgba(124,58,237,0.35)" }}>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "#22c55e" }}>
                  <CheckCircle2 className="h-4 w-4" /><span className="dash-mono tracking-widest">TODAY'S PLAN COMPLETE</span>
                </div>
                <p className="dash-h text-lg mb-1">{profile?.first_name || "Student"}, you finished today's sessions.</p>
                <p className="text-sm opacity-70">{nearestExam ? `${days} days remaining until ${nearestExam.name}.` : "Add an exam date to see your countdown."}</p>
                <Link to="/roadmap" className="inline-block mt-4">
                  <Button size="sm" variant="outline" className="rounded-full border-[rgba(242,239,233,0.18)] bg-transparent text-[#F2EFE9] hover:bg-white/5">
                    See tomorrow's plan <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* FLOATING STATUS BUTTON → drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <button className="dash-fab" data-tutorial="urgency-gauge" aria-label="Open status panel">
              <span className="dash-fab-dot" style={{ background: urgencyColor }} />
              <span className="dash-mono">URG {urgency.score}</span>
              <span className="opacity-50">·</span>
              <Flame className="h-3.5 w-3.5" style={{ color: "var(--dash-amber)" }} />
              <span className="dash-mono">{profile?.current_streak ?? 0}d</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="dash-drawer-body w-[360px] sm:w-[400px] p-6 border-l border-[rgba(242,239,233,0.08)]">
            <div className="space-y-4">
              <div>
                <div className="dash-drawer-label mb-2">Status</div>
                <h3 className="dash-drawer-h text-2xl" style={{ fontWeight: 600 }}>Today's pulse</h3>
              </div>

              {/* Urgency */}
              <div className="dash-drawer-card">
                <div className="dash-drawer-label mb-3">Urgency</div>
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 100 60" className="w-24 h-14 shrink-0">
                    <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(242,239,233,0.12)" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={urgencyColor} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={126} strokeDashoffset={126 * (1 - urgency.score / 100)}
                      style={{ transition: "stroke-dashoffset 800ms ease-out" }} />
                  </svg>
                  <div>
                    <div className="dash-drawer-h text-3xl tabular-nums" style={{ color: urgencyColor }}>{urgency.score}</div>
                    <div className="dash-mono text-[10px] opacity-60 tracking-widest">{urgencyLabel}</div>
                  </div>
                </div>
                <p className="text-xs opacity-70 mt-3 leading-relaxed">{urgency.message}</p>
                <p className="dash-mono text-[10px] opacity-50 mt-1.5">
                  {urgency.daysToNearest}d to nearest exam{urgency.gradeGap > 0 ? ` · gap ${urgency.gradeGap}` : ""}
                </p>
              </div>

              {/* Today */}
              <div className="dash-drawer-card">
                <div className="dash-drawer-label mb-3">Today</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="opacity-60">Sessions</span><span className="dash-mono">{completedCount} / {sessions.length}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Study time</span>
                    <span className="dash-mono" style={{ color: "var(--dash-amber)" }}>
                      {sessions.filter(s => s.status === "complete").reduce((a, s) => a + s.duration_minutes, 0)} min
                    </span>
                  </div>
                  <div className="flex justify-between"><span className="opacity-60">Streak</span>
                    <span className="dash-mono flex items-center gap-1.5"><Flame className="h-3 w-3" style={{ color: "var(--dash-amber)" }} />{profile?.current_streak ?? 0}d</span>
                  </div>
                </div>
              </div>

              {/* Upcoming exams */}
              <div className="dash-drawer-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="dash-drawer-label">Upcoming exams</div>
                  <Link to="/exams" onClick={() => setDrawerOpen(false)} className="text-[10px] opacity-70 hover:opacity-100 underline" style={{ color: "var(--dash-amber)" }}>Manage</Link>
                </div>
                {hasExams ? (
                  <div className="space-y-2.5">
                    {exams.slice(0, 6).map(ex => {
                      const d = daysFromTodayLocal(ex.exam_date);
                      const sc = ex.subject;
                      const dot = sc === "mathematics" ? "#60a5fa" : sc === "biology" ? "#34d399" : sc === "chemistry" ? "#a78bfa" : sc === "physics" ? "#f59e0b" : "rgba(242,239,233,0.4)";
                      return (
                        <div key={ex.id} className="flex items-center gap-2.5 text-sm">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: dot }} />
                          <div className="flex-1 min-w-0 truncate text-xs">{ex.name}</div>
                          <div className="dash-mono text-xs" style={{ color: d < 30 ? "var(--dash-amber)" : "var(--dash-text)" }}>{d}d</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs opacity-70 space-y-2">
                    <p>No exam dates yet.</p>
                    <Link to="/exams" onClick={() => setDrawerOpen(false)}>
                      <Button size="sm" variant="outline" className="w-full rounded-full border-[rgba(242,239,233,0.18)] bg-transparent text-[#F2EFE9] hover:bg-white/5">
                        <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />Add exam dates
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
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
