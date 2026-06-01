import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { formattedHtmlProps } from "@/lib/formatText";
import { startPomodoro } from "@/lib/pomodoro";
import { generateRoadmapForUser, type RoadmapNodeRow, type NodeType } from "@/lib/roadmapNodes";
import { notificationsPermission, requestNotificationPermission, showNotification } from "@/lib/notifications";
import { ChallengeRunner } from "@/components/ChallengeRunner";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  BookOpen, Repeat, FileText, Coffee, Lock, CheckCircle2, ArrowRight, Loader2,
  ChevronLeft, ChevronRight, X, Crown, Calendar, Map as MapIcon, Layers, Zap,
  Target, TrendingUp, AlertTriangle, Plus, Bell,
} from "lucide-react";
import FlashcardDeck from "@/components/FlashcardDeck";
import { useSubscription } from "@/hooks/useSubscription";
import {
  format, parseISO, differenceInDays, isToday, isTomorrow,
  addDays, startOfWeek, eachDayOfInterval,
} from "date-fns";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUBJECT_COLOR: Record<SubjectCode, string> = {
  mathematics: "#3B82F6",
  biology:     "#16A34A",
  chemistry:   "#9333EA",
  physics:     "#F97316",
};

const NODE_ACCENT: Record<NodeType, string> = {
  learn:  "#3B82F6",
  review: "#D97706",
  mock:   "#DC2626",
  break:  "#16A34A",
};

const NODE_BG: Record<NodeType, string> = {
  learn:  "rgba(59,130,246,0.06)",
  review: "rgba(217,119,6,0.06)",
  mock:   "rgba(220,38,38,0.06)",
  break:  "rgba(22,163,74,0.06)",
};

type BusySlot = {
  id: string;
  dayOfWeek: number; // 1 = Mon … 7 = Sun
  startHour: number;
  endHour: number;
  label: string;
};

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BUSY_PRESETS = ["😴 Sleeping", "🍽 Eating", "🚗 Commuting", "🏋 Sports/Gym", "💼 Work/School", "🏠 Other"];

// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP PAGE
// ─────────────────────────────────────────────────────────────────────────────

const RoadmapPage = () => {
  const { user } = useAuth();
  const { isPro, loading: subLoading, refresh: refreshSub, upgrade } = useSubscription();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep]       = useState(0);
  const [nodes, setNodes]           = useState<RoadmapNodeRow[]>([]);
  const [profile, setProfile]       = useState<{
    first_name: string | null; current_streak: number;
    notification_enabled: boolean; notification_prompted: boolean; notification_time: string;
  } | null>(null);
  const [units, setUnits] = useState<{
    subject: SubjectCode; unit_number: number; unit_name: string; exam_date: string;
  }[]>([]);
  const [exams, setExams] = useState<{
    subject: SubjectCode | null; exam_date: string; name: string; is_active: boolean;
  }[]>([]);

  const [activeNodeId, setActiveNodeId]         = useState<string | null>(null);
  const [activeStartStage, setActiveStartStage] = useState<"notes" | "elaboration">("notes");
  const [mainView, setMainView]                 = useState<"journey" | "calendar" | "thisweek">("journey");
  const [challengeNode, setChallengeNode]       = useState<RoadmapNodeRow | null>(null);
  const [showNotifPrompt, setShowNotifPrompt]   = useState(false);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Busy slots — stored per-user in localStorage
  const [busySlots, setBusySlots]   = useState<BusySlot[]>([]);
  const [showAddBusy, setShowAddBusy] = useState(false);
  const [newBusy, setNewBusy]       = useState<Omit<BusySlot, "id">>({
    dayOfWeek: 7, startHour: 22, endHour: 7, label: "😴 Sleeping",
  });
  const [calWeekStart, setCalWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`busy-${user.id}`);
    if (stored) setBusySlots(JSON.parse(stored));
  }, [user]);

  const saveBusySlots = (slots: BusySlot[]) => {
    setBusySlots(slots);
    if (user) localStorage.setItem(`busy-${user.id}`, JSON.stringify(slots));
  };

  // ── Data loading ──────────────────────────────────────────────────────────

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [n, p, u, e] = await Promise.all([
      supabase.from("roadmap_nodes").select("*").eq("user_id", user.id).order("node_order"),
      supabase.from("profiles")
        .select("first_name,current_streak,notification_enabled,notification_prompted,notification_time")
        .eq("id", user.id).single(),
      supabase.from("user_subjects")
        .select("subject,unit_number,unit_name,exam_date").eq("user_id", user.id).order("exam_date"),
      supabase.from("exams")
        .select("subject,exam_date,name,is_active").eq("user_id", user.id)
        .eq("is_active", true).order("exam_date"),
    ]);
    if (n.data) setNodes(n.data as RoadmapNodeRow[]);
    if (p.data) setProfile(p.data as any);
    if (u.data) setUnits(u.data as any);
    if (e.data) setExams(e.data as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    if (!profile || !nodes.length) return;
    if (!profile.notification_prompted && notificationsPermission() === "default") {
      setShowNotifPrompt(true);
    }
  }, [profile, nodes.length]);

  useEffect(() => {
    if (loading || nodes.length === 0) return;
    const first = nodes.find(n => n.status === "unlocked" || n.status === "in_progress");
    if (first) setTimeout(() => nodeRefs.current[first.id]?.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
  }, [loading]);

  useEffect(() => {
    if (loading || nodes.length === 0) return;
    const continueId = searchParams.get("continue");
    if (!continueId) return;
    const target = nodes.find(n => n.id === continueId);
    if (target && target.node_type === "learn" && (target.status === "unlocked" || target.status === "in_progress")) {
      setActiveNodeId(continueId);
      setActiveStartStage("elaboration");
      setTimeout(() => nodeRefs.current[continueId]?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    }
    searchParams.delete("continue");
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line
  }, [loading, nodes.length]);

  // ── Generate ──────────────────────────────────────────────────────────────

  const handleGenerate = async (overrideHorizonDays?: number) => {
    if (!user) return;
    setGenerating(true);
    setGenStep(0);
    const steps = [
      "Analysing your syllabus…",
      "Scheduling topics across days…",
      "Adding spaced repetition reviews…",
      "Inserting mock papers…",
      "Building your path…",
    ];
    const tick = setInterval(() => setGenStep(s => Math.min(s + 1, steps.length - 1)), 700);
    try {
      const res = await generateRoadmapForUser(user.id, overrideHorizonDays ? { overrideHorizonDays } : {});
      if (res.inserted === 0) {
        if (units.length === 0) {
          toast.error("No subjects found. Complete onboarding first.");
          navigate("/onboarding");
        } else {
          toast.error("No future exam dates. Pick an option below to continue.");
        }
        return;
      }
      await load();
      toast.success(`Roadmap built — ${res.inserted} sessions across your path.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Roadmap build failed");
    } finally {
      clearInterval(tick);
      setGenerating(false);
    }
  };

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    if (user) {
      await supabase.from("profiles").update({
        notification_enabled: perm === "granted",
        notification_prompted: true,
      }).eq("id", user.id);
    }
    setShowNotifPrompt(false);
    if (perm === "granted") {
      toast.success("Reminders on. We'll notify you at your study time.");
      showNotification("Make Me Revise Reminders enabled", "We'll ping you when your next session is due.");
    }
  };

  const handleDismissNotifPrompt = async () => {
    if (user) await supabase.from("profiles").update({ notification_prompted: true }).eq("id", user.id);
    setShowNotifPrompt(false);
  };

  const updateNodeStatus = async (id: string, patch: Partial<RoadmapNodeRow>) => {
    const { error } = await supabase.from("roadmap_nodes").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    await load();
    window.dispatchEvent(new CustomEvent("apex-roadmap-change"));
    return true;
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const grouped = useMemo(() => {
    const byDate = new Map<string, RoadmapNodeRow[]>();
    for (const n of nodes) {
      const arr = byDate.get(n.scheduled_date) ?? [];
      arr.push(n);
      byDate.set(n.scheduled_date, arr);
    }
    return Array.from(byDate.entries()).sort(([a], [b]) => a < b ? -1 : 1);
  }, [nodes]);

  const completed    = nodes.filter(n => n.status === "complete").length;
  const total        = nodes.length;
  const pct          = total === 0 ? 0 : Math.round((completed / total) * 100);
  const nearestExam  = exams[0] ?? null;
  const daysToNearest = nearestExam
    ? Math.max(0, differenceInDays(parseISO(nearestExam.exam_date), new Date()))
    : null;

  // Journey groups — one row per subject+unit (breaks excluded)
  const journeyGroups = useMemo(() => {
    const groups = new Map<string, {
      subject: SubjectCode; unit_number: number; unit_name: string; nodes: RoadmapNodeRow[];
    }>();
    for (const node of nodes) {
      if (node.node_type === "break") continue;
      const key = `${node.subject}-${node.unit_number}`;
      if (!groups.has(key)) {
        groups.set(key, {
          subject:     node.subject as SubjectCode,
          unit_number: node.unit_number ?? 0,
          unit_name:   node.unit_name ?? "",
          nodes:       [],
        });
      }
      groups.get(key)!.nodes.push(node);
    }
    return Array.from(groups.values());
  }, [nodes]);

  // Calendar week
  const weekDays = useMemo(
    () => eachDayOfInterval({ start: calWeekStart, end: addDays(calWeekStart, 6) }),
    [calWeekStart]
  );

  const sessionsByDay = useMemo(() => {
    const m = new Map<string, RoadmapNodeRow[]>();
    for (const n of nodes) {
      if (n.node_type === "break") continue;
      const arr = m.get(n.scheduled_date) ?? [];
      arr.push(n);
      m.set(n.scheduled_date, arr);
    }
    return m;
  }, [nodes]);

  // This Week analysis (computed, no AI call needed)
  const thisWeekAnalysis = useMemo(() => {
    const now     = new Date();
    const weekEnd = addDays(now, 7);
    const thisWeekNodes = nodes.filter(n => {
      const d = parseISO(n.scheduled_date);
      return d >= now && d <= weekEnd && n.node_type !== "break";
    });
    const subjectMap: Record<string, { learn: number; review: number; mock: number }> = {};
    for (const n of thisWeekNodes) {
      if (!n.subject) continue;
      if (!subjectMap[n.subject]) subjectMap[n.subject] = { learn: 0, review: 0, mock: 0 };
      (subjectMap[n.subject] as any)[n.node_type]++;
    }
    const nearest = exams[0];
    let recommendation =
      "No exam dates set yet. Add exam dates in the Exams tab to get a personalised study plan.";
    if (nearest) {
      const days   = Math.max(0, differenceInDays(parseISO(nearest.exam_date), now));
      const sub    = nearest.subject ? SUBJECTS[nearest.subject as SubjectCode]?.name ?? nearest.name : nearest.name;
      const perDay = Math.ceil(thisWeekNodes.length / 7);
      if (days <= 7)
        recommendation = `🚨 ${sub} exam is in ${days} day${days === 1 ? "" : "s"}. Switch exclusively to mock papers and weak topic reviews.`;
      else if (days <= 21)
        recommendation = `⚡ ${days} days to ${sub}. Prioritise spaced reviews and start timed practice papers this week.`;
      else if (days <= 42)
        recommendation = `📚 ${days} days to ${sub}. Build strong foundations — complete all learn nodes before consolidation starts.`;
      else
        recommendation = `🗓 ${days} days to your nearest exam. ${perDay} session${perDay === 1 ? "" : "s"} per day keeps you on track.`;
    }
    const dailyPlan: { date: Date; nodes: RoadmapNodeRow[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const d   = addDays(now, i);
      const str = format(d, "yyyy-MM-dd");
      dailyPlan.push({ date: d, nodes: sessionsByDay.get(str) ?? [] });
    }
    return { thisWeekNodes, subjectMap, recommendation, dailyPlan };
  }, [nodes, exams, sessionsByDay]);

  // ── Loading / Generating states ───────────────────────────────────────────

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (generating) {
    const steps = [
      "Analysing your syllabus…",
      "Scheduling topics across days…",
      "Adding spaced repetition reviews…",
      "Inserting mock papers…",
      "Building your path…",
    ];
    return (
      <AppLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
          <div className="surface p-10 max-w-md w-full">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-6">Building your path</h2>
            <ul className="space-y-3 text-left">
              {steps.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 text-sm ${i <= genStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {i < genStep
                    ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    : i === genStep
                      ? <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                      : <div className="h-4 w-4 rounded-full border border-border shrink-0" />}
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────

  if (nodes.length === 0) {
    if (units.length === 0) {
      return (
        <AppLayout>
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <div className="surface p-10 max-w-md">
              <h2 className="text-2xl font-bold mb-2">No subjects yet</h2>
              <p className="text-muted-foreground text-sm mb-6">Complete onboarding to generate your revision path.</p>
              <Link to="/onboarding"><Button className="btn-primary">Set up subjects</Button></Link>
            </div>
          </div>
        </AppLayout>
      );
    }
    const todayStart   = new Date(); todayStart.setHours(0, 0, 0, 0);
    const hasFutureExam = units.some(u => parseISO(u.exam_date).getTime() > todayStart.getTime());
    const subjectNames  = Array.from(new Set(units.map(u => SUBJECTS[u.subject].name))).join(", ");
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <div className="surface p-8 md:p-10 max-w-lg w-full">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
              <MapIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {hasFutureExam ? "Build your revision path" : "How should we plan your revision?"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {hasFutureExam
                ? "We'll sequence your topics by exam urgency, interleave subjects, and auto-schedule spaced reviews and mock papers."
                : <>You're set up for <span className="text-foreground font-medium">{subjectNames}</span>, but you don't have a future exam date.</>}
            </p>
            {hasFutureExam ? (
              <Button onClick={() => handleGenerate()} className="btn-primary">Generate my roadmap</Button>
            ) : (
              <div className="space-y-3 text-left">
                <button onClick={() => navigate("/onboarding")} className="surface surface-hover p-4 w-full flex items-start gap-3 text-left">
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">📅</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Set my exam date</div>
                    <div className="text-xs text-muted-foreground">Recommended — schedules urgency, mocks and reviews against your real exam.</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>
                {[
                  { days: 28, label: "4-week sprint",    sub: "Tight, intense — for a quick brush-up." },
                  { days: 56, label: "8-week plan",      sub: "Balanced pace across all your topics." },
                  { days: 84, label: "12-week deep plan", sub: "Slower, with more spaced reviews." },
                ].map(opt => (
                  <button key={opt.days} onClick={() => handleGenerate(opt.days)} className="surface surface-hover p-4 w-full flex items-start gap-3 text-left">
                    <div className="h-8 w-8 rounded-md bg-secondary text-foreground flex items-center justify-center shrink-0">📚</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.sub}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  const firstName    = profile?.first_name || "Your";
  const nextExamLabel = nearestExam
    ? (nearestExam.subject ? SUBJECTS[nearestExam.subject].name : nearestExam.name)
    : null;

  return (
    <AppLayout>
      <div className="animate-fade-in">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <header
          className="relative overflow-hidden border-b border-border"
          style={{ background: "linear-gradient(135deg, hsl(160 70% 10%) 0%, hsl(160 55% 16%) 60%, hsl(160 40% 12%) 100%)" }}
        >
          {/* Grid texture */}
          <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(hsl(43 80% 60%) 1px,transparent 1px),linear-gradient(90deg,hsl(43 80% 60%) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          {/* Gold glow */}
          <div aria-hidden className="absolute -left-32 -top-32 h-96 w-96 rounded-full pointer-events-none" style={{
            background: "radial-gradient(circle,hsl(43 70% 50%/0.18),transparent 65%)",
          }} />

          <div className="relative px-5 md:px-10 py-7 md:py-9">
            {/* Exam countdown pill */}
            {nearestExam && daysToNearest !== null && nextExamLabel && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold mb-4"
                style={{
                  background: daysToNearest <= 7
                    ? "rgba(220,38,38,0.15)" : daysToNearest <= 21
                    ? "rgba(217,119,6,0.15)" : "rgba(22,163,74,0.12)",
                  border: `1px solid ${daysToNearest <= 7 ? "rgba(220,38,38,0.4)" : daysToNearest <= 21 ? "rgba(217,119,6,0.4)" : "rgba(22,163,74,0.3)"}`,
                  color: daysToNearest <= 7 ? "#f87171" : daysToNearest <= 21 ? "#fbbf24" : "#4ade80",
                }}
              >
                <AlertTriangle className="h-3 w-3" />
                {daysToNearest === 0
                  ? `${nextExamLabel} exam is TODAY`
                  : `${nextExamLabel} exam in ${daysToNearest} day${daysToNearest === 1 ? "" : "s"}`}
              </div>
            )}

            <h1 className="font-display text-3xl md:text-4xl tracking-tight text-white">
              {firstName}'s <span className="warm-gradient-text">Revision Journey</span>
            </h1>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-5 mt-4">
              {[
                { label: "Progress",       value: `${pct}%` },
                { label: "Sessions done",  value: `${completed} / ${total}` },
                { label: "Streak",         value: `${profile?.current_streak ?? 0} days 🔥` },
                { label: "Days planned",   value: String(grouped.length) },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-white tabular-nums">{s.value}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest font-mono">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-5 max-w-sm">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct === 100
                      ? "#4ade80"
                      : "linear-gradient(90deg,#34d399,#fbbf24)",
                  }}
                />
              </div>
            </div>

            {/* View tabs */}
            <div className="flex items-center gap-2 mt-6 flex-wrap">
              {([
                { id: "journey",  label: "Journey",   Icon: MapIcon },
                { id: "calendar", label: "Calendar",  Icon: Calendar },
                { id: "thisweek", label: "This Week",  Icon: TrendingUp },
              ] as const).map(v => (
                <button
                  key={v.id}
                  onClick={() => setMainView(v.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainView === v.id
                      ? "bg-white/15 text-white border border-white/30 shadow-sm"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  <v.Icon className="h-3.5 w-3.5" />{v.label}
                </button>
              ))}
              <button
                onClick={() => handleGenerate()}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70 transition-all"
              >
                Regenerate
              </button>
            </div>
          </div>
        </header>

        {/* Notification prompt */}
        {showNotifPrompt && (
          <div className="px-5 md:px-10 pt-4">
            <div className="surface p-4 flex items-start gap-3 animate-in-up">
              <Bell className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium">Get a reminder when your next study session starts?</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={handleEnableNotifications} className="btn-primary h-8 text-xs">Allow</Button>
                  <Button size="sm" variant="ghost" onClick={handleDismissNotifPrompt} className="h-8 text-xs">Not now</Button>
                </div>
              </div>
              <button onClick={handleDismissNotifPrompt}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            JOURNEY VIEW
        ══════════════════════════════════════════════════════════════════ */}
        {mainView === "journey" && (
          <div className="px-4 md:px-8 py-6 space-y-4">

            {/* Today's active session card */}
            {(() => {
              const todayStr  = format(new Date(), "yyyy-MM-dd");
              const todayNodes = sessionsByDay.get(todayStr) ?? [];
              const active = todayNodes.find(n => n.status === "unlocked" || n.status === "in_progress");
              if (!active) return null;
              const color = SUBJECT_COLOR[active.subject as SubjectCode];
              const subName = SUBJECTS[active.subject as SubjectCode]?.name ?? active.subject;
              return (
                <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}20` }}
                  >
                    {active.node_type === "learn"   ? <BookOpen className="h-5 w-5" style={{ color }} /> :
                     active.node_type === "review"  ? <Repeat   className="h-5 w-5 text-amber-500" /> :
                                                      <FileText  className="h-5 w-5 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-0.5">
                      Today's next session
                    </div>
                    <div className="font-semibold truncate">{active.topic_name ?? subName}</div>
                    <div className="text-xs text-muted-foreground">{subName} · {active.unit_code} · ~25 min</div>
                  </div>
                  <Button
                    size="sm"
                    className="btn-primary shrink-0"
                    onClick={() => {
                      if (active.node_type === "learn")
                        navigate(`/roadmap/topic/${active.id}/notes`);
                      else if (active.node_type === "review")
                        navigate(`/questions?subject=${active.subject}&unit=${active.unit_number}&topic=${encodeURIComponent(active.topic_name ?? "")}&node=${active.id}`);
                      else if (active.node_type === "mock")
                        navigate(`/mock-papers/new?subject=${active.subject}&unit=${active.unit_number}`);
                      else
                        setActiveNodeId(active.id);
                    }}
                  >
                    Start now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })()}

            {/* Unit journey rows */}
            {journeyGroups.map(group => {
              const color    = SUBJECT_COLOR[group.subject];
              const emoji    = SUBJECTS[group.subject]?.emoji ?? "📚";
              const doneCount = group.nodes.filter(n => n.status === "complete").length;
              const gPct     = group.nodes.length === 0 ? 0 : Math.round((doneCount / group.nodes.length) * 100);

              return (
                <div
                  key={`${group.subject}-${group.unit_number}`}
                  className="rounded-2xl border border-border overflow-hidden bg-card/40"
                >
                  {/* Unit header */}
                  <div
                    className="px-5 py-4 flex items-center gap-3 border-b border-border/60"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    <span className="text-xl leading-none">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                        {SUBJECTS[group.subject]?.name} · Unit {group.unit_number}
                      </div>
                      <div className="text-sm font-semibold truncate">{group.unit_name}</div>
                    </div>
                    {/* Unit progress */}
                    <div className="shrink-0 flex items-center gap-3">
                      <div className="hidden sm:block w-24 h-1.5 rounded-full bg-card overflow-hidden border border-border">
                        <div className="h-full rounded-full transition-all" style={{ width: `${gPct}%`, background: color }} />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold tabular-nums" style={{ color }}>{gPct}%</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{doneCount}/{group.nodes.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal scrollable node path */}
                  <div className="px-5 py-5 overflow-x-auto">
                    <div className="flex items-start min-w-max">
                      {group.nodes.map((node, ni) => {
                        const isLocked   = node.status === "locked";
                        const isDone     = node.status === "complete";
                        const isActive   = node.status === "unlocked" || node.status === "in_progress";
                        const isExpanded = activeNodeId === node.id;

                        const handleClick = () => {
                          if (isLocked) return;
                          if (node.node_type === "learn")
                            navigate(`/roadmap/topic/${node.id}/notes`);
                          else if (node.node_type === "review")
                            navigate(`/questions?subject=${node.subject}&unit=${node.unit_number}&topic=${encodeURIComponent(node.topic_name ?? "")}&node=${node.id}`);
                          else if (node.node_type === "mock")
                            navigate(`/mock-papers/new?subject=${node.subject}&unit=${node.unit_number}`);
                          else
                            setActiveNodeId(isExpanded ? null : node.id);
                        };

                        return (
                          <div key={node.id} className="flex items-center" ref={el => nodeRefs.current[node.id] = el}>
                            <div className="flex flex-col items-center gap-2 w-[76px]">
                              <button
                                onClick={handleClick}
                                title={node.topic_name ?? node.node_type}
                                className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isDone    ? "border-green-500 bg-green-500/15"
                                  : isActive ? "border-current"
                                  : "border-border bg-card/40 opacity-35 cursor-default"
                                }`}
                                style={isActive ? {
                                  borderColor: color,
                                  boxShadow: `0 0 0 3px ${color}20`,
                                } : isDone ? {} : {}}
                              >
                                {isDone
                                  ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  : isLocked
                                    ? <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    : node.node_type === "learn"
                                      ? <BookOpen className="h-4 w-4" style={{ color }} />
                                      : node.node_type === "review"
                                        ? <Repeat className="h-4 w-4 text-amber-500" />
                                        : node.node_type === "mock"
                                          ? <FileText className="h-4 w-4 text-red-400" />
                                          : <Coffee className="h-4 w-4 text-green-500" />}
                              </button>
                              <div className="text-center px-0.5 w-[74px]">
                                <div
                                  className={`text-[9px] leading-snug text-center ${isLocked ? "text-muted-foreground/35" : "text-muted-foreground"}`}
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {node.topic_name ?? node.node_type}
                                </div>
                                {isDone && node.score_percent != null && (
                                  <div className="text-[8px] text-green-500 font-mono mt-0.5">{node.score_percent}%</div>
                                )}
                              </div>
                            </div>

                            {/* Connector line */}
                            {ni < group.nodes.length - 1 && (
                              <div
                                className="w-4 h-px shrink-0 mb-6"
                                style={{
                                  background: group.nodes[ni + 1].status !== "locked"
                                    ? `${color}55`
                                    : "hsl(var(--border))",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inline break node card */}
                  {activeNodeId && (() => {
                    const bn = group.nodes.find(n => n.id === activeNodeId);
                    if (!bn || bn.node_type !== "break") return null;
                    return (
                      <div className="px-5 pb-5">
                        <NodeCard
                          node={bn}
                          isActive
                          onActivate={() => {}}
                          onClose={() => setActiveNodeId(null)}
                          onComplete={async () => {
                            await updateNodeStatus(bn.id, { status: "complete", completed_at: new Date().toISOString() } as any);
                            setActiveNodeId(null);
                          }}
                        />
                      </div>
                    );
                  })()}
                </div>
              );
            })}

            {/* Pro gate */}
            {!subLoading && !isPro && (
              <div className="surface p-8 text-center border-dashed rounded-2xl">
                <Crown className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">Full journey locked</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Free plan shows your first 3 days. Upgrade to see your complete journey, unlimited sessions and AI tools.
                </p>
                <Button
                  className="btn-primary"
                  onClick={async () => { try { await upgrade(); } catch { toast.error("Checkout unavailable"); } }}
                >
                  <Crown className="h-4 w-4 mr-2" /> Upgrade to Pro
                </Button>
                <button
                  onClick={async () => { await refreshSub(); toast.success("Subscription refreshed"); }}
                  className="block mt-3 text-xs text-muted-foreground hover:text-primary underline underline-offset-4 mx-auto"
                >
                  Already subscribed? Restore access
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CALENDAR VIEW
        ══════════════════════════════════════════════════════════════════ */}
        {mainView === "calendar" && (
          <div className="px-4 md:px-8 py-6 space-y-5">

            {/* Calendar toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{format(calWeekStart, "MMMM yyyy")}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(calWeekStart, "d MMM")} — {format(addDays(calWeekStart, 6), "d MMM")}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setCalWeekStart(d => addDays(d, -7))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCalWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCalWeekStart(d => addDays(d, 7))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddBusy(true)} className="gap-1.5 ml-1">
                  <Plus className="h-3.5 w-3.5" /> Add busy slot
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              {(Object.keys(SUBJECT_COLOR) as SubjectCode[]).map(subj => (
                <div key={subj} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded" style={{ background: SUBJECT_COLOR[subj] }} />
                  {SUBJECTS[subj]?.name ?? subj}
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-muted-foreground/25" />
                Busy
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-success/40" />
                Done
              </div>
            </div>

            {/* Week grid */}
            <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {weekDays.map(day => (
                  <div
                    key={day.toISOString()}
                    className={`p-3 text-center border-r border-border last:border-r-0 ${isToday(day) ? "bg-primary/10" : ""}`}
                  >
                    <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                      {format(day, "EEE")}
                    </div>
                    <div className={`text-2xl font-bold mt-0.5 tabular-nums ${isToday(day) ? "text-primary" : ""}`}>
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Session + busy rows */}
              <div className="grid grid-cols-7 min-h-[220px]">
                {weekDays.map(day => {
                  const dayStr      = format(day, "yyyy-MM-dd");
                  const daySessions = sessionsByDay.get(dayStr) ?? [];
                  const dow         = day.getDay() === 0 ? 7 : day.getDay();
                  const dayBusy     = busySlots.filter(b => b.dayOfWeek === dow);
                  const totalMins   = daySessions.length * 25;

                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-2 border-r border-border last:border-r-0 space-y-1 ${isToday(day) ? "bg-primary/5" : ""}`}
                    >
                      {/* Study sessions */}
                      {daySessions.map(s => {
                        const c   = SUBJECT_COLOR[s.subject as SubjectCode] ?? "#6b7280";
                        const done = s.status === "complete" || s.status === "skipped";
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              if (s.node_type === "learn")
                                navigate(`/roadmap/topic/${s.id}/notes`);
                              else if (s.node_type === "review")
                                navigate(`/questions?subject=${s.subject}&unit=${s.unit_number}&topic=${encodeURIComponent(s.topic_name ?? "")}&node=${s.id}`);
                              else if (s.node_type === "mock")
                                navigate(`/mock-papers/new?subject=${s.subject}&unit=${s.unit_number}`);
                            }}
                            className={`w-full text-left rounded-lg p-1.5 text-[9px] leading-snug hover:opacity-80 transition-opacity ${done ? "opacity-50" : ""}`}
                            style={{
                              background: done ? `${c}12` : `${c}18`,
                              borderLeft: `2px solid ${done ? "#4ade80" : c}`,
                            }}
                          >
                            <div className="font-semibold truncate" style={{ color: done ? "#4ade80" : c }}>
                              {s.node_type === "mock" ? "Mock" : s.node_type === "review" ? "Review" : "Learn"}
                              {done ? " ✓" : ""}
                            </div>
                            <div className="text-muted-foreground truncate">
                              {s.topic_name?.split(" ").slice(0, 4).join(" ") ?? s.unit_code}
                            </div>
                          </button>
                        );
                      })}

                      {/* Busy slots */}
                      {dayBusy.map(b => (
                        <div
                          key={b.id}
                          className="rounded-lg p-1.5 text-[9px] bg-muted/40 border-l-2 border-muted-foreground/30 flex items-center justify-between gap-1"
                        >
                          <span className="text-muted-foreground truncate">{b.label}</span>
                          <button
                            onClick={() => saveBusySlots(busySlots.filter(x => x.id !== b.id))}
                            className="shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}

                      {/* Day total */}
                      {totalMins > 0 && (
                        <div className="text-[9px] text-muted-foreground/50 font-mono pt-1 text-right">
                          {totalMins} min
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            THIS WEEK VIEW
        ══════════════════════════════════════════════════════════════════ */}
        {mainView === "thisweek" && (
          <div className="px-4 md:px-8 py-6 space-y-5 max-w-4xl">

            {/* AI recommendation card */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-1.5">
                    AI Recommendation
                  </div>
                  <p className="text-sm leading-relaxed">{thisWeekAnalysis.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Exam countdown cards */}
            {exams.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-3">Upcoming Exams</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {exams.map((exam, i) => {
                    const days    = Math.max(0, differenceInDays(parseISO(exam.exam_date), new Date()));
                    const color   = exam.subject ? SUBJECT_COLOR[exam.subject] : "#6b7280";
                    const urgency = days <= 7 ? "text-red-400" : days <= 21 ? "text-amber-400" : "text-green-400";
                    return (
                      <div key={i} className="surface p-4 flex gap-3 rounded-xl" style={{ borderLeft: `3px solid ${color}` }}>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{exam.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {format(parseISO(exam.exam_date), "EEE d MMM yyyy")}
                          </div>
                        </div>
                        <div className={`text-right shrink-0 ${urgency}`}>
                          <div className="text-2xl font-bold tabular-nums leading-none">{days}</div>
                          <div className="text-[9px] uppercase tracking-wider font-mono">days</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subject breakdown this week */}
            {Object.keys(thisWeekAnalysis.subjectMap).length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-3">This Week's Focus</h3>
                <div className="space-y-2">
                  {Object.entries(thisWeekAnalysis.subjectMap).map(([subj, counts]) => {
                    const color = SUBJECT_COLOR[subj as SubjectCode] ?? "#6b7280";
                    const tot   = counts.learn + counts.review + counts.mock;
                    return (
                      <div key={subj} className="surface p-4 flex items-center gap-3 rounded-xl">
                        <span className="text-xl">{SUBJECTS[subj as SubjectCode]?.emoji ?? "📚"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{SUBJECTS[subj as SubjectCode]?.name ?? subj}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {tot} sessions · ~{tot * 25} min
                            </span>
                          </div>
                          <div className="flex gap-2 text-[10px] text-muted-foreground">
                            {counts.learn  > 0 && <span className="text-blue-400">{counts.learn} learn</span>}
                            {counts.review > 0 && <span className="text-amber-400">{counts.review} review</span>}
                            {counts.mock   > 0 && <span className="text-red-400">{counts.mock} mock</span>}
                          </div>
                        </div>
                        <div className="w-20 h-1.5 rounded-full bg-card overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, tot * 14)}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Daily plan */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-3">7-Day Plan</h3>
              <div className="space-y-2">
                {thisWeekAnalysis.dailyPlan.map(({ date, nodes: dayNodes }) => (
                  <div
                    key={date.toISOString()}
                    className={`surface p-4 rounded-xl ${isToday(date) ? "border border-primary/25" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isToday(date) ? "text-primary" : ""}`}>
                          {isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : format(date, "EEEE")}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{format(date, "d MMM")}</span>
                        {isToday(date) && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                      {dayNodes.length > 0 && (
                        <span className="text-xs text-muted-foreground">{dayNodes.length} sessions · ~{dayNodes.length * 25} min</span>
                      )}
                    </div>

                    {dayNodes.length === 0 ? (
                      <div className="text-xs text-muted-foreground/40 italic">Rest day or no sessions scheduled</div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {dayNodes.slice(0, 8).map(n => {
                          const c = SUBJECT_COLOR[n.subject as SubjectCode] ?? "#6b7280";
                          return (
                            <button
                              key={n.id}
                              onClick={() => {
                                if (n.node_type === "learn")
                                  navigate(`/roadmap/topic/${n.id}/notes`);
                                else if (n.node_type === "review")
                                  navigate(`/questions?subject=${n.subject}&unit=${n.unit_number}&topic=${encodeURIComponent(n.topic_name ?? "")}&node=${n.id}`);
                                else if (n.node_type === "mock")
                                  navigate(`/mock-papers/new?subject=${n.subject}&unit=${n.unit_number}`);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] hover:opacity-80 transition-opacity"
                              style={{ background: `${c}15`, border: `1px solid ${c}30`, color: c }}
                            >
                              {n.node_type === "mock" ? "📝" : n.node_type === "review" ? "🔄" : "📖"}
                              {n.topic_name
                                ? n.topic_name.split(" ").slice(0, 3).join(" ")
                                : n.unit_code}
                            </button>
                          );
                        })}
                        {dayNodes.length > 8 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{dayNodes.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Override / study own choice */}
            <div className="surface p-4 rounded-xl flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Want to study something specific?</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Override the plan and choose your own topic from the notes library.
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/notes")} className="shrink-0">
                Choose topic <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Challenge drawer ──────────────────────────────────────────── */}
        <Sheet open={!!challengeNode} onOpenChange={o => !o && setChallengeNode(null)}>
          <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" /> Challenge mode
              </SheetTitle>
              <SheetDescription>
                {challengeNode?.topic_name
                  ? <>Hard questions on <span className="text-foreground font-semibold">{challengeNode.topic_name}</span> — marked instantly.</>
                  : "Fresh challenge questions, marked instantly."}
              </SheetDescription>
            </SheetHeader>
            {challengeNode && (
              <ChallengeRunner
                key={challengeNode.id}
                subject={challengeNode.subject as any}
                topic={challengeNode.topic_name}
                unitNumber={challengeNode.unit_number ?? undefined}
                difficulty="Challenge"
                total={5}
              />
            )}
          </SheetContent>
        </Sheet>

        {/* ── Add Busy Slot modal ───────────────────────────────────────── */}
        <Dialog open={showAddBusy} onOpenChange={setShowAddBusy}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add a busy slot</DialogTitle>
              <DialogDescription>
                Block recurring time so the AI plans your study sessions around it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Day picker */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
                  Day of week
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS_SHORT.map((d, i) => (
                    <button
                      key={d}
                      onClick={() => setNewBusy(b => ({ ...b, dayOfWeek: i + 1 }))}
                      className={`h-8 rounded text-xs font-medium transition-colors ${
                        newBusy.dayOfWeek === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time range */}
              <div className="grid grid-cols-2 gap-3">
                {(["startHour", "endHour"] as const).map(field => (
                  <div key={field}>
                    <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-1.5 block">
                      {field === "startHour" ? "From" : "To"}
                    </label>
                    <select
                      value={newBusy[field]}
                      onChange={e => setNewBusy(b => ({ ...b, [field]: Number(e.target.value) }))}
                      className="w-full h-9 rounded-lg border border-border bg-card px-2 text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Label presets */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
                  Label
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BUSY_PRESETS.map(p => (
                    <button
                      key={p}
                      onClick={() => setNewBusy(b => ({ ...b, label: p }))}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        newBusy.label === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  className="flex-1 btn-primary"
                  onClick={() => {
                    const slot: BusySlot = { id: crypto.randomUUID(), ...newBusy };
                    saveBusySlots([...busySlots, slot]);
                    setShowAddBusy(false);
                    toast.success("Busy slot added");
                  }}
                >
                  Add slot
                </Button>
                <Button variant="outline" onClick={() => setShowAddBusy(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
};

// ===========================================================================
// NODE CARD — handles all 4 types and inline expansion for learn nodes
// ===========================================================================

interface NodeCardProps {
  node: RoadmapNodeRow;
  isActive: boolean;
  startStage?: "notes" | "elaboration";
  onActivate: () => void;
  onClose: () => void;
  onComplete: (scorePercent?: number) => Promise<void>;
}

const NodeCard = ({ node, isActive, startStage = "notes", onActivate, onClose, onComplete }: NodeCardProps) => {
  const subjectMeta = node.subject ? SUBJECTS[node.subject as SubjectCode] : null;
  const accent = NODE_ACCENT[node.node_type];
  const bg = NODE_BG[node.node_type];

  // Locked
  if (node.status === "locked") {
    return (
      <div className="surface p-4 opacity-50" style={{ borderLeft: `3px solid hsl(var(--border))` }}>
        <div className="flex items-center gap-2 text-sm">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{node.topic_name || `${subjectMeta?.name ?? ""} ${node.node_type}`}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 font-mono">Complete the previous topic to unlock</p>
      </div>
    );
  }

  // Completed
  if (node.status === "complete") {
    return (
      <div className="surface p-4 opacity-60" style={{ borderLeft: `3px solid hsl(var(--success))` }}>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span className="line-through decoration-1">{node.topic_name || `${subjectMeta?.name ?? ""} ${node.node_type}`}</span>
          {node.score_percent != null && (
            <span className="text-xs text-muted-foreground font-mono ml-auto">
              {node.score_percent}%
            </span>
          )}
        </div>
      </div>
    );
  }

  // Skipped
  if (node.status === "skipped") {
    return (
      <div className="surface p-4 opacity-50" style={{ borderLeft: `3px solid hsl(var(--accent))` }}>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Skipped — {node.topic_name || node.node_type}</span>
        </div>
      </div>
    );
  }

  // Active inline expansion (learn nodes only)
  if (isActive && node.node_type === "learn") {
    return <LearnNodeFlow node={node} initialStage={startStage} onClose={onClose} onComplete={onComplete} />;
  }

  // === Compact unlocked card by type ===
  return (
    <div className="surface overflow-hidden" style={{ borderLeft: `3px solid ${accent}`, background: bg }}>
      <div className="p-5">
        {/* Type header */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono mb-2" style={{ color: accent }}>
          {node.node_type === "learn" && <><BookOpen className="h-3 w-3" /> LEARN</>}
          {node.node_type === "review" && <><Repeat className="h-3 w-3" /> REVIEW</>}
          {node.node_type === "mock" && <><FileText className="h-3 w-3" /> MOCK PAPER</>}
          {node.node_type === "break" && <><Coffee className="h-3 w-3" /> BREAK</>}
          {subjectMeta && <span className="text-muted-foreground normal-case tracking-normal font-normal ml-2">{subjectMeta.name} · {node.unit_code}</span>}
        </div>

        {/* Title */}
        {node.node_type === "break" ? (
          <>
            <h3 className="text-base font-semibold leading-tight mb-1">You've done 4 sessions — take a break</h3>
            <p className="text-sm text-muted-foreground mb-2">Step away for 20 minutes. Walk if you can. No phone. Rest improves retention.</p>
          </>
        ) : (
          <h3 className="text-base font-semibold leading-tight mb-1">
            {node.topic_name || `${subjectMeta?.name ?? ""} ${node.unit_code}`}
          </h3>
        )}

        {node.why_now_text && node.node_type !== "break" && (
          <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">{node.why_now_text}</p>
        )}

        {/* Body by type */}
        {node.node_type === "learn" && (
          <div className="text-[13px] text-muted-foreground space-y-1 mb-3 border-l-2 border-border pl-3">
            <p><span className="text-foreground/80">1.</span> Read AI notes (~5 min)</p>
            <p><span className="text-foreground/80">2.</span> Write the key learnings in your own words (1 min)</p>
            <p><span className="text-foreground/80">3.</span> Answer 5 questions (~15 min)</p>
            <p className="text-[11px] mt-2 text-primary">Technique: Active Recall + Elaboration</p>
          </div>
        )}
        {node.node_type === "review" && (
          <div className="text-[13px] text-muted-foreground space-y-1 mb-3 border-l-2 border-border pl-3">
            <p>5 short questions to lock this in.</p>
            <p className="text-[11px] mt-2 text-primary">Technique: Spaced Repetition</p>
          </div>
        )}
        {node.node_type === "mock" && (
          <div className="text-[13px] text-muted-foreground space-y-1 mb-3 border-l-2 border-border pl-3">
            <p>Exam conditions. No notes. Time yourself.</p>
            <p className="text-[11px] mt-2 text-primary">Technique: Active Recall under stress</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          {node.node_type === "learn" && (
            <Button onClick={onActivate} className="btn-primary h-9 px-4 text-sm">
              Begin <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}
          {node.node_type === "review" && (
            <Link to={`/questions?subject=${node.subject}&unit=${node.unit_number}&topic=${encodeURIComponent(node.topic_name ?? "")}&node=${node.id}`}>
              <Button className="btn-primary h-9 px-4 text-sm">Review now <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
            </Link>
          )}
          {node.node_type === "mock" && (
            <Link to={`/mock-papers/new?subject=${node.subject}&unit=${node.unit_number}`}>
              <Button className="btn-primary h-9 px-4 text-sm">Start mock <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
            </Link>
          )}
          {node.node_type === "break" && (
            <Button onClick={async () => { startPomodoro({ mode: "break", minutes: 20 }); await onComplete(); toast.success("Break started — 20 min."); }} className="btn-primary h-9 px-4 text-sm">
              Start break timer
            </Button>
          )}
          {node.node_type !== "learn" && node.node_type !== "break" && (
            <Button variant="ghost" onClick={() => onComplete()} className="h-9 px-3 text-xs text-muted-foreground">
              Mark complete
            </Button>
          )}
          <span className="text-[11px] text-muted-foreground font-mono ml-auto">
            {node.node_type === "break" ? "20 min" : node.node_type === "review" ? "~10 min" : "~25 min"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// LEARN NODE FLOW — notes → elaboration → 5 questions, all inline
// ===========================================================================

type FlowStage = "notes" | "elaboration" | "questions" | "done";

interface NotesContent {
  key_definitions?: { term: string; definition: string }[];
  core_concepts?: { cluster: string; bullets: string[] }[];
  common_mistakes?: string[];
  worked_example?: { problem: string; steps: { step: string; reason: string }[]; answer: string };
  examiner_tips?: string[];
  flashcards?: { q: string; a: string }[];
}

const LearnNodeFlow = ({ node, onClose, onComplete, initialStage = "notes" }: { node: RoadmapNodeRow; onClose: () => void; onComplete: (s?: number) => Promise<void>; initialStage?: FlowStage }) => {
  const subjectMeta = node.subject ? SUBJECTS[node.subject as SubjectCode] : null;
  const [stage, setStage] = useState<FlowStage>(initialStage);
  const [notes, setNotes] = useState<NotesContent | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [readSeconds, setReadSeconds] = useState(0);
  const [elaboration, setElaboration] = useState("");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [recallOpen, setRecallOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  // Start pomodoro on mount — but only if one isn't already running.
  // (Previously, opening a topic re-started the timer and reset any in-progress focus session.)
  useEffect(() => {
    const existing = localStorage.getItem("apex_pomo_start");
    if (!existing) {
      startPomodoro({ mode: "focus", minutes: 25, topic: node.topic_name || undefined });
    }
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    supabase.from("roadmap_nodes").update({ status: "in_progress" }).eq("id", node.id);
  }, [node.id]);

  // Load notes (cached or generate)
  useEffect(() => {
    (async () => {
      if (!user || !node.subject || !node.unit_number || !node.topic_name) return;
      setLoadingNotes(true);
      try {
        const { data: cached } = await supabase
          .from("topic_notes")
          .select("content")
          .eq("user_id", user.id)
          .eq("subject", node.subject)
          .eq("unit_number", node.unit_number)
          .eq("topic", node.topic_name)
          .maybeSingle();

        if (cached?.content) {
          setNotes(cached.content as NotesContent);
          setLoadingNotes(false);
          return;
        }

        let syllabus_context: string | undefined;
        if (node.subject === "chemistry") {
          const t = findChemistryTopic(node.topic_name);
          if (t) {
            syllabus_context = `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements:\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
          }
        }

        // Pass the user's exam board so the edge function routes to the correct
        // syllabus prompt (omitting it previously 500'd on board.toUpperCase()).
        const { data: prof } = await supabase.from("profiles").select("exam_board").eq("id", user.id).single();
        const board: "edexcel-ial" | "cie" = prof?.exam_board === "cie" ? "cie" : "edexcel-ial";

        const { data, error } = await supabase.functions.invoke("ai-notes", {
          body: { subject: node.subject, unit_number: node.unit_number, unit_name: node.unit_name, unit_code: node.unit_code, topic: node.topic_name, syllabus_context, board },
        });
        if (error) throw error;
        if ((data as any)?.error) throw new Error((data as any).error);
        setNotes(data as NotesContent);

        // Cache it
        await supabase.from("topic_notes").insert({
          user_id: user.id, subject: node.subject, unit_number: node.unit_number, topic: node.topic_name,
          content: data,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Notes failed to load");
      } finally {
        setLoadingNotes(false);
      }
    })();
  }, [node.id]);

  // Read timer
  useEffect(() => {
    if (stage !== "notes") return;
    const id = setInterval(() => setReadSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  return (
    <div ref={containerRef} className="surface overflow-hidden" style={{ borderLeft: `3px solid ${NODE_ACCENT.learn}`, background: NODE_BG.learn }}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono" style={{ color: NODE_ACCENT.learn }}>
            <BookOpen className="h-3 w-3" /> LEARN
            {subjectMeta && <span className="text-muted-foreground normal-case tracking-normal font-normal ml-2">{subjectMeta.name} · {node.unit_code}</span>}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <h3 className="text-lg font-bold mb-4">{node.topic_name}</h3>

        {/* Stage progress */}
        <div className="flex items-center gap-2 mb-5 text-[11px] font-mono uppercase tracking-wider">
          <StageDot label="Notes" active={stage === "notes"} done={stage !== "notes"} />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <StageDot label="Key parts" active={stage === "elaboration"} done={stage === "questions" || stage === "done"} />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <StageDot label="Test" active={stage === "questions"} done={stage === "done"} />
        </div>

        {/* NOTES */}
        {stage === "notes" && (
          <div>
            {loadingNotes ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />Generating notes for {node.topic_name}…
              </div>
            ) : notes ? (
              <div className="space-y-5 text-sm">
                {notes.key_definitions && notes.key_definitions.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Key definitions</h4>
                    <ul className="space-y-1.5">
                      {notes.key_definitions.map((d, i) => (
                        <li key={i}><span className="font-semibold">{d.term}:</span> <span className="text-muted-foreground">{d.definition}</span></li>
                      ))}
                    </ul>
                  </section>
                )}
                {notes.core_concepts?.map((c, i) => (
                  <section key={i}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{c.cluster}</h4>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      {c.bullets.map((b, j) => <li key={j} {...formattedHtmlProps(b)} />)}
                    </ul>
                  </section>
                ))}
                {notes.worked_example && (
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Worked example</h4>
                    <div className="surface p-3 space-y-2">
                      <p className="font-medium" {...formattedHtmlProps(notes.worked_example.problem)} />
                      <ol className="space-y-1.5 text-muted-foreground">
                        {notes.worked_example.steps.map((s, i) => (
                          <li key={i} className="text-[13px]">
                            <span className="font-mono text-primary mr-2">{i + 1}.</span>
                            <span {...formattedHtmlProps(s.step)} />
                            <div className="text-xs italic ml-6 mt-0.5 opacity-80">{s.reason}</div>
                          </li>
                        ))}
                      </ol>
                      <p className="font-semibold text-success pt-2 border-t border-border" {...formattedHtmlProps(`Answer: ${notes.worked_example.answer}`)} />
                    </div>
                  </section>
                )}
                {notes.common_mistakes && notes.common_mistakes.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Common mistakes</h4>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      {notes.common_mistakes.map((m, i) => <li key={i} {...formattedHtmlProps(m)} />)}
                    </ul>
                  </section>
                )}
                {notes.examiner_tips && notes.examiner_tips.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-success mb-2">Examiner tips</h4>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      {notes.examiner_tips.map((t, i) => <li key={i} {...formattedHtmlProps(t)} />)}
                    </ul>
                  </section>
                )}
              </div>
            ) : null}

            {!loadingNotes && (
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground font-mono">
                  Minimum read time ensures better retention. {Math.max(0, 30 - readSeconds)}s remaining.
                </p>
                <Button
                  disabled={readSeconds < 30}
                  onClick={() => setStage("elaboration")}
                  className={`btn-primary h-9 px-4 text-sm ${readSeconds >= 30 ? "animate-slow-pulse" : ""}`}
                >
                  I've read this. Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ELABORATION */}
        {stage === "elaboration" && (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">Before we test you — write the key learnings.</span><br />
              <span className="text-muted-foreground">Science shows that writing the main points in your own words reinforces them in your brain. List the key parts of <strong className="text-foreground">{node.topic_name}</strong>.</span>
            </p>
            <Textarea
              autoFocus
              value={elaboration}
              onChange={e => setElaboration(e.target.value)}
              placeholder="Main point 1… Main point 2… Main point 3…"
              className="min-h-[100px] text-sm"
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              {elaboration.trim().split(/\s+/).filter(Boolean).length} / 5 words minimum
            </p>
            <Button
              disabled={elaboration.trim().split(/\s+/).filter(Boolean).length < 5}
              onClick={() => setStage("questions")}
              className="btn-primary h-9 px-4 text-sm"
            >
              Continue to questions <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* QUESTIONS */}
        {stage === "questions" && (
          <QuestionsRunner node={node} onFinished={async (scorePercent) => {
            setFinalScore(scorePercent);
            setStage("done");
            await onComplete(scorePercent);
          }} />
        )}

        {/* DONE */}
        {stage === "done" && (
          <div className="space-y-3 text-sm animate-fade-in">
            <div className="flex items-center gap-2 text-success font-semibold">
              <CheckCircle2 className="h-4 w-4" /> {node.topic_name} complete. Score: {finalScore}%.
            </div>
            <p className="text-muted-foreground text-[13px]">
              {finalScore != null && finalScore >= 80 ? "Strong. Moving to next topic." :
                finalScore != null && finalScore >= 60 ? "Good. A review is scheduled to reinforce this." :
                "This topic needs more work. Extra practice has been added to tomorrow."}
            </p>
            <div className="flex flex-wrap gap-2">
              {(notes?.flashcards?.length ?? 0) > 0 && (
                <Button onClick={() => setRecallOpen(true)} variant="outline" className="h-9 px-4 text-sm">
                  <Layers className="h-3.5 w-3.5 mr-1.5" /> Quick recall ({notes!.flashcards!.length})
                </Button>
              )}
              <Button onClick={onClose} className="btn-primary h-9 px-4 text-sm">
                Continue to next topic <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
            <Dialog open={recallOpen} onOpenChange={setRecallOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Recall · {node.topic_name}</DialogTitle>
                  <DialogDescription>Spaced-repetition flashcards from the notes you just studied.</DialogDescription>
                </DialogHeader>
                {notes?.flashcards && notes.flashcards.length > 0 && (
                  <FlashcardDeck
                    cards={notes.flashcards}
                    source="roadmap"
                    subject={node.subject ?? null}
                    unit_number={node.unit_number ?? null}
                    topic={node.topic_name ?? null}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

const StageDot = ({ label, active, done }: { label: string; active: boolean; done: boolean }) => (
  <span className={`flex items-center gap-1.5 ${active ? "text-primary" : done ? "text-success" : "text-muted-foreground"}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : done ? "bg-success" : "bg-muted-foreground/30"}`} />
    {label}
  </span>
);

// ===========================================================================
// QUESTIONS RUNNER — generates 5 questions one at a time with feedback
// ===========================================================================

const QuestionsRunner = ({ node, onFinished }: { node: RoadmapNodeRow; onFinished: (scorePercent: number) => Promise<void> }) => {
  const TOTAL = 5;
  const [idx, setIdx] = useState(0);
  const [question, setQuestion] = useState<{ question_text: string; marks: number; mark_scheme: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [marking, setMarking] = useState<{ awarded_marks: number; total_marks: number; feedback: string; model_answer: string } | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingMark, setLoadingMark] = useState(false);
  const [scores, setScores] = useState<{ awarded: number; total: number }[]>([]);
  const { user } = useAuth();

  const generate = async () => {
    setLoadingGen(true);
    setQuestion(null);
    setAnswer("");
    setMarking(null);
    try {
      let syllabus_context: string | undefined;
      if (node.subject === "chemistry" && node.topic_name) {
        const t = findChemistryTopic(node.topic_name);
        if (t) {
          syllabus_context = `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements (your scope is LIMITED to these):\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
        }
      }
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "generate",
          subject: node.subject,
          topic: node.topic_name,
          difficulty: "Standard",
          questionType: "Short Answer",
          syllabus_context,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const first = Array.isArray((data as any)?.questions) ? (data as any).questions[0] : (data as any);
      if (!first?.question_text) throw new Error("No question returned");
      setQuestion(first);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Question generation failed");
    } finally {
      setLoadingGen(false);
    }
  };

  useEffect(() => { generate(); /* eslint-disable-next-line */ }, [idx]);

  const submit = async () => {
    if (!question || !answer.trim()) return;
    setLoadingMark(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "mark",
          subject: node.subject,
          topic: node.topic_name,
          questionText: question.question_text,
          markScheme: question.mark_scheme,
          totalMarks: question.marks,
          studentAnswer: answer,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setMarking(data as any);
      setScores(s => [...s, { awarded: (data as any).awarded_marks, total: (data as any).total_marks }]);

      if (user) {
        await supabase.from("ai_questions").insert({
          user_id: user.id,
          subject: node.subject as any,
          topic: node.topic_name,
          difficulty: "Standard",
          question_type: "Short Answer",
          question_text: question.question_text,
          marks: question.marks,
          mark_scheme: question.mark_scheme,
          student_answer: answer,
          feedback: (data as any).feedback,
          awarded_marks: (data as any).awarded_marks,
          unit_number: node.unit_number,
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Marking failed");
    } finally {
      setLoadingMark(false);
    }
  };

  const next = async () => {
    if (idx + 1 >= TOTAL) {
      // finalize
      const totalAwarded = scores.reduce((a, s) => a + s.awarded, 0);
      const totalPossible = scores.reduce((a, s) => a + s.total, 0);
      const pct = totalPossible === 0 ? 0 : Math.round((totalAwarded / totalPossible) * 100);
      await onFinished(pct);
    } else {
      setIdx(i => i + 1);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>Question {idx + 1} of {TOTAL}</span>
        <span>Score so far: {scores.reduce((a, s) => a + s.awarded, 0)} / {scores.reduce((a, s) => a + s.total, 0) || "—"}</span>
      </div>

      {loadingGen && (
        <div className="py-12 flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />Generating question…
        </div>
      )}

      {question && !loadingGen && (
        <>
          <div className="surface p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] uppercase font-mono text-muted-foreground">{node.topic_name}</span>
              <span className="text-[11px] font-mono">[{question.marks} marks]</span>
            </div>
            <div className="leading-relaxed" {...formattedHtmlProps(question.question_text)} />
          </div>

          {!marking && (
            <>
              <Textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Write your answer. Show working."
                className="min-h-[120px] text-sm font-mono"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={submit} disabled={!answer.trim() || loadingMark} className="btn-primary h-9 px-4 text-sm">
                  {loadingMark ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Marking…</> : "Submit answer"}
                </Button>
                {(node.subject === "mathematics" || (node.subject as string) === "maths" || (node.subject as string) === "math") && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      // Maths working is hard to type. Let the student view the model answer
                      // without writing it out — submits a placeholder so the marker still
                      // returns the worked solution + mark scheme.
                      setAnswer((a) => a.trim() || "(Skipped typed working — please show the full worked solution and mark scheme.)");
                      setTimeout(submit, 0);
                    }}
                    disabled={loadingMark}
                    className="h-9 px-4 text-sm"
                    title="Maths working is hard to type. Reveal the model answer and mark scheme without typing it out."
                  >
                    Reveal model answer &amp; mark scheme
                  </Button>
                )}
              </div>
            </>
          )}

          {marking && (
            <div className="space-y-3 animate-fade-in">
              <div className={`surface p-3 border-l-4`} style={{
                borderLeftColor: marking.awarded_marks === marking.total_marks ? "hsl(var(--success))" :
                  marking.awarded_marks >= marking.total_marks * 0.5 ? "hsl(var(--accent))" : "hsl(var(--urgent))",
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-lg font-bold">{marking.awarded_marks}/{marking.total_marks}</span>
                  <span className="text-xs text-muted-foreground">marks</span>
                </div>
                <div className="text-[13px]" {...formattedHtmlProps(marking.feedback)} />
              </div>
              <div className="surface p-3">
                <div className="text-[11px] uppercase tracking-wider text-success font-mono mb-1.5">Model answer</div>
                <div className="text-[13px]" {...formattedHtmlProps(marking.model_answer)} />
              </div>
              <Button onClick={next} className="btn-primary h-9 px-4 text-sm">
                {idx + 1 >= TOTAL ? "Finish session" : "Next question"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoadmapPage;
