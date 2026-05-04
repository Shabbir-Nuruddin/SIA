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
import {
  BookOpen, Repeat, FileText, Coffee, Lock, CheckCircle2, ArrowRight, Loader2,
  Brain, Shuffle, Clock, Lightbulb, Sparkles, Bell, ChevronRight, X, Eye, Crown
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format, parseISO, differenceInDays, isToday, isTomorrow } from "date-fns";
import { toast } from "sonner";

const SUBJECT_DOT: Record<SubjectCode, string> = {
  mathematics: "#3B82F6",
  biology: "#16A34A",
  chemistry: "#9333EA",
  physics: "#F97316",
};

const NODE_ACCENT: Record<NodeType, string> = {
  learn: "#3B82F6",
  review: "#D97706",
  mock: "#DC2626",
  break: "#16A34A",
};

const NODE_BG: Record<NodeType, string> = {
  learn: "rgba(59,130,246,0.06)",
  review: "rgba(217,119,6,0.06)",
  mock: "rgba(220,38,38,0.06)",
  break: "rgba(22,163,74,0.06)",
};

const SCIENCE_BADGES = [
  {
    key: "active_recall",
    label: "Active Recall",
    icon: Brain,
    body: "Testing yourself beats re-reading by 50% at one-week recall. Every topic in your path ends with questions for this reason.",
    cite: "Roediger & Karpicke, 2006",
  },
  {
    key: "spaced_repetition",
    label: "Spaced Repetition",
    icon: Repeat,
    body: "Without review, ~70% of new material is forgotten within 24 hours. Reviews are auto-scheduled at +1, +3, +7, +14 days.",
    cite: "Ebbinghaus, 1885",
  },
  {
    key: "interleaving",
    label: "Interleaving",
    icon: Shuffle,
    body: "Switching subjects feels harder but produces better long-term retention than blocked practice.",
    cite: "Kornell & Bjork, 2008",
  },
  {
    key: "pomodoro",
    label: "Pomodoro",
    icon: Clock,
    body: "Each node is one 25-minute focused block. After 4 sessions: a mandatory 20-minute break.",
    cite: "Cirillo, 1980s",
  },
  {
    key: "elaboration",
    label: "Elaboration",
    icon: Lightbulb,
    body: "Explaining a concept in your own words doubles retention vs reading alone. Takes 30 seconds before each test.",
    cite: "Dunlosky et al., 2013",
  },
  {
    key: "dual_coding",
    label: "Dual Coding",
    icon: Eye,
    body: "Combining text with diagrams, tables, or worked visuals doubles understanding vs text alone. Every notes page includes a Visual tab.",
    cite: "Paivio, 1971",
  },
];

function dayHeader(iso: string): string {
  const d = parseISO(iso);
  if (isToday(d)) return `TODAY — ${format(d, "EEEE d MMMM")}`;
  if (isTomorrow(d)) return `TOMORROW — ${format(d, "EEEE d MMMM")}`;
  return format(d, "EEEE d MMMM").toUpperCase();
}

const RoadmapPage = () => {
  const { user } = useAuth();
  const { isPro, loading: subLoading, refresh: refreshSub, upgrade } = useSubscription();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [nodes, setNodes] = useState<RoadmapNodeRow[]>([]);
  const [profile, setProfile] = useState<{ first_name: string | null; current_streak: number; notification_enabled: boolean; notification_prompted: boolean; notification_time: string } | null>(null);
  const [units, setUnits] = useState<{ subject: SubjectCode; unit_number: number; unit_name: string; exam_date: string }[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeStartStage, setActiveStartStage] = useState<"notes" | "elaboration">("notes");
  const [openBadge, setOpenBadge] = useState<string | null>(null);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [n, p, u] = await Promise.all([
      supabase.from("roadmap_nodes").select("*").eq("user_id", user.id).order("node_order"),
      supabase.from("profiles").select("first_name,current_streak,notification_enabled,notification_prompted,notification_time").eq("id", user.id).single(),
      supabase.from("user_subjects").select("subject,unit_number,unit_name,exam_date").eq("user_id", user.id).order("exam_date"),
    ]);
    if (n.data) setNodes(n.data as RoadmapNodeRow[]);
    if (p.data) setProfile(p.data as any);
    if (u.data) setUnits(u.data as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  // First-visit notification prompt (only after a roadmap exists)
  useEffect(() => {
    if (!profile || !nodes.length) return;
    if (!profile.notification_prompted && notificationsPermission() === "default") {
      setShowNotifPrompt(true);
    }
  }, [profile, nodes.length]);

  // Auto-scroll to first unlocked node on first load
  useEffect(() => {
    if (loading || nodes.length === 0) return;
    const firstActive = nodes.find(n => n.status === "unlocked" || n.status === "in_progress");
    if (firstActive) {
      setTimeout(() => {
        nodeRefs.current[firstActive.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  }, [loading]);

  // Handle ?continue=<nodeId> — when returning from full-screen notes,
  // open that node inline starting at the elaboration stage.
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
        // Two distinct cases:
        if (units.length === 0) {
          toast.error("No subjects found. Complete onboarding first.");
          navigate("/onboarding");
        } else {
          // Subjects exist but no live exam dates — keep user on this page so
          // they can pick "just revising" or update an exam date.
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
      showNotification("Make Me Revise Reminders enabled", "We'll ping you when your next study session is due.");
    }
  };

  const handleDismissNotifPrompt = async () => {
    if (user) await supabase.from("profiles").update({ notification_prompted: true }).eq("id", user.id);
    setShowNotifPrompt(false);
  };

  const updateNodeStatus = async (id: string, patch: Partial<RoadmapNodeRow>) => {
    const { error } = await supabase.from("roadmap_nodes").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    // Refetch — trigger may have unlocked next node
    await load();
    window.dispatchEvent(new CustomEvent("apex-roadmap-change"));
    return true;
  };

  // === Derived state ===
  const grouped = useMemo(() => {
    const byDate = new Map<string, RoadmapNodeRow[]>();
    for (const n of nodes) {
      const arr = byDate.get(n.scheduled_date) ?? [];
      arr.push(n);
      byDate.set(n.scheduled_date, arr);
    }
    return Array.from(byDate.entries()).sort(([a], [b]) => a < b ? -1 : 1);
  }, [nodes]);

  const completed = nodes.filter(n => n.status === "complete").length;
  const total = nodes.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const nearestExam = units[0];
  const daysToNearest = nearestExam ? Math.max(0, differenceInDays(parseISO(nearestExam.exam_date), new Date())) : 0;

  // === Render ===
  if (loading) {
    return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
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
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-6">Building your path</h2>
            <ul className="space-y-3 text-left">
              {steps.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 text-sm ${i <= genStep ? "text-foreground" : "text-muted-foreground/40"}`}>
                  {i < genStep ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> :
                    i === genStep ? <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" /> :
                    <div className="h-4 w-4 rounded-full border border-border shrink-0" />}
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Empty state — no roadmap nodes yet
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
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const hasFutureExam = units.some(u => parseISO(u.exam_date).getTime() > todayStart.getTime());
    const subjectNames = Array.from(new Set(units.map(u => SUBJECTS[u.subject].name))).join(", ");

    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <div className="surface p-8 md:p-10 max-w-lg w-full">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {hasFutureExam ? "Build your revision path" : "How should we plan your revision?"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {hasFutureExam ? (
                <>We'll sequence your topics by exam urgency, interleave subjects, and auto-schedule
                spaced reviews and mock papers — built on five evidence-based study techniques.</>
              ) : (
                <>You're set up for <span className="text-foreground font-medium">{subjectNames}</span>,
                but you don't have a future exam date. Pick how you'd like to plan.</>
              )}
            </p>

            {hasFutureExam ? (
              <Button onClick={() => handleGenerate()} className="btn-primary">Generate my roadmap</Button>
            ) : (
              <div className="space-y-3 text-left">
                <button
                  onClick={() => navigate("/onboarding")}
                  className="surface surface-hover p-4 w-full flex items-start gap-3 text-left"
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">📅</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Set my exam date</div>
                    <div className="text-xs text-muted-foreground">Recommended — schedules urgency, mocks and reviews against your real exam.</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>

                {[
                  { days: 28, label: "4-week sprint", sub: "Tight, intense — for quick brush-up." },
                  { days: 56, label: "8-week revision plan", sub: "Balanced pace across all your topics." },
                  { days: 84, label: "12-week deep plan", sub: "Slower, with more spaced reviews." },
                ].map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => handleGenerate(opt.days)}
                    className="surface surface-hover p-4 w-full flex items-start gap-3 text-left"
                  >
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

  const firstName = profile?.first_name || "Your";
  const nextExamLabel = nearestExam
    ? `${SUBJECTS[nearestExam.subject].name} — ${daysToNearest} days`
    : "exams";

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-5 md:p-8 animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{firstName}'s Revision Path</h1>
          <p className="text-sm text-muted-foreground">
            {total} sessions · {grouped.length} days · {daysToNearest} days to {nextExamLabel}
          </p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-mono">
              <span>{pct}% complete</span>
              <span>{completed} / {total}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full transition-all duration-500" style={{
                width: `${pct}%`,
                background: pct === 100 ? "hsl(var(--success))" : "linear-gradient(90deg, #2563EB, #3B82F6)",
              }} />
            </div>
          </div>

          {/* Science badges */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {SCIENCE_BADGES.map(b => {
              const Icon = b.icon;
              const active = openBadge === b.key;
              return (
                <button
                  key={b.key}
                  onClick={() => setOpenBadge(active ? null : b.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${active ? "bg-primary/15 border-primary text-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="h-3 w-3" />{b.label}
                </button>
              );
            })}
          </div>
          {openBadge && (() => {
            const b = SCIENCE_BADGES.find(x => x.key === openBadge)!;
            return (
              <div className="mt-3 surface p-4 text-sm animate-fade-in">
                <p className="leading-relaxed">{b.body}</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">— {b.cite}</p>
              </div>
            );
          })()}
        </header>

        {/* Notification prompt */}
        {showNotifPrompt && (
          <div className="surface p-4 mb-6 flex items-start gap-3 animate-in-up">
            <Bell className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">Get a reminder when your next study session starts?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Browser notification at your study start time. You can change this anytime in Settings.</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleEnableNotifications} className="btn-primary h-8 text-xs">Allow</Button>
                <Button size="sm" variant="ghost" onClick={handleDismissNotifPrompt} className="h-8 text-xs">Not now</Button>
              </div>
            </div>
            <button onClick={handleDismissNotifPrompt} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Path */}
        <div className="space-y-8">
          {(() => {
            const visibleDays = (!subLoading && !isPro) ? grouped.slice(0, 3) : grouped;
            const hiddenCount = grouped.length - visibleDays.length;
            return (
              <>
                {visibleDays.map(([date, dayNodes]) => {
                  const allDone = dayNodes.every(n => n.status === "complete" || n.status === "skipped");
                  return (
                    <section key={date}>
                      <div className="text-[11px] uppercase tracking-widest font-mono text-muted-foreground mb-3 flex items-center gap-2">
                        {dayHeader(date)}
                        {allDone && <CheckCircle2 className="h-3 w-3 text-success" />}
                      </div>
                      <div className="relative pl-6 space-y-3">
                        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                        {dayNodes.map(node => (
                          <div key={node.id} ref={el => nodeRefs.current[node.id] = el} className="relative">
                            <div className="absolute -left-[18px] top-5 h-2 w-2 rounded-full"
                              style={{
                                background: node.status === "complete" ? "hsl(var(--success))" :
                                  node.status === "locked" ? "hsl(var(--border))" :
                                  NODE_ACCENT[node.node_type],
                              }}
                            />
                            <NodeCard
                              node={node}
                              isActive={activeNodeId === node.id}
                              startStage={activeNodeId === node.id ? activeStartStage : "notes"}
                              onActivate={() => {
                                if (node.node_type === "learn") {
                                  window.dispatchEvent(new CustomEvent("apex-assistant-context", {
                                    detail: { topic: node.topic_name, subject: node.subject, unit_name: node.unit_name },
                                  }));
                                  navigate(`/roadmap/topic/${node.id}/notes`);
                                  return;
                                }
                                setActiveNodeId(node.id);
                                setActiveStartStage("notes");
                              }}
                              onClose={() => { setActiveNodeId(null); setActiveStartStage("notes"); }}
                              onComplete={async (scorePercent) => {
                                await updateNodeStatus(node.id, {
                                  status: "complete",
                                  completed_at: new Date().toISOString(),
                                  score_percent: scorePercent ?? null,
                                } as any);
                                setActiveNodeId(null);
                                setActiveStartStage("notes");
                                if (scorePercent != null && scorePercent < 60 && user && node.subject && node.topic_name) {
                                  const { localDateAtOffset } = await import("@/lib/dateLocal");
                                  const tomorrow = localDateAtOffset(1);
                                  const maxOrder = Math.max(...nodes.map(n => n.node_order));
                                  await supabase.from("roadmap_nodes").insert({
                                    user_id: user.id,
                                    subject: node.subject,
                                    unit_code: node.unit_code,
                                    unit_number: node.unit_number,
                                    unit_name: node.unit_name,
                                    topic_name: node.topic_name,
                                    node_type: "review",
                                    node_order: maxOrder + 1,
                                    scheduled_date: tomorrow,
                                    status: "unlocked",
                                    science_method: "spaced_repetition",
                                    why_now_text: `You scored ${scorePercent}% on ${node.topic_name}. Extra practice tomorrow will fix it.`,
                                    source_node_id: node.id,
                                  });
                                  toast.info(`Extra practice scheduled for tomorrow on ${node.topic_name}.`);
                                  await load();
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {allDone && isToday(parseISO(date)) && (
                        <div className="mt-4 ml-6 surface p-4 text-sm">
                          <p className="font-medium">Today's plan: complete.</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {daysToNearest} days to {nearestExam ? SUBJECTS[nearestExam.subject].name : "your exam"}.
                          </p>
                        </div>
                      )}
                    </section>
                  );
                })}
                {hiddenCount > 0 && (
                  <section className="relative">
                    <div className="surface p-8 text-center border-dashed">
                      <div className="mx-auto h-12 w-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-4">
                        <Crown className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{hiddenCount} more days locked</h3>
                      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                        Free plan shows your first 3 days. Upgrade to Pro to unlock your full personalised roadmap, unlimited mock papers, AI tutor and more.
                      </p>
                      <Button
                        size="lg"
                        className="btn-primary"
                        onClick={async () => {
                          try { await upgrade(); } catch (err) { toast.error(err instanceof Error ? err.message : "Checkout could not open right now. Please try again in a minute."); }
                        }}
                      >
                        <Crown className="h-4 w-4 mr-2" /> Upgrade to Pro
                      </Button>
                      <div className="mt-4">
                        <button
                          onClick={async () => {
                            await refreshSub();
                            toast.success("Subscription refreshed");
                          }}
                          className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                        >
                          Already subscribed? Restore access
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </>
            );
          })()}
        </div>

        {/* Regenerate */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <button
            onClick={() => handleGenerate()}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono uppercase tracking-wider"
          >
            Regenerate path
          </button>
        </div>
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
            <p><span className="text-foreground/80">2.</span> Write a one-sentence explanation (1 min)</p>
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
}

const LearnNodeFlow = ({ node, onClose, onComplete, initialStage = "notes" }: { node: RoadmapNodeRow; onClose: () => void; onComplete: (s?: number) => Promise<void>; initialStage?: FlowStage }) => {
  const subjectMeta = node.subject ? SUBJECTS[node.subject as SubjectCode] : null;
  const [stage, setStage] = useState<FlowStage>(initialStage);
  const [notes, setNotes] = useState<NotesContent | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [readSeconds, setReadSeconds] = useState(0);
  const [elaboration, setElaboration] = useState("");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  // Start pomodoro on mount
  useEffect(() => {
    startPomodoro({ mode: "focus", minutes: 25, topic: node.topic_name || undefined });
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

        const { data, error } = await supabase.functions.invoke("ai-notes", {
          body: { subject: node.subject, unit_number: node.unit_number, unit_name: node.unit_name, topic: node.topic_name, syllabus_context },
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
          <StageDot label="Explain" active={stage === "elaboration"} done={stage === "questions" || stage === "done"} />
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
              <span className="font-semibold">Before we test you — write one sentence.</span><br />
              <span className="text-muted-foreground">What is <strong className="text-foreground">{node.topic_name}</strong> in your own words?</span>
            </p>
            <Textarea
              autoFocus
              value={elaboration}
              onChange={e => setElaboration(e.target.value)}
              placeholder="Type anything. There's no wrong answer."
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
            <Button onClick={onClose} className="btn-primary h-9 px-4 text-sm">
              Continue to next topic <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const StageDot = ({ label, active, done }: { label: string; active: boolean; done: boolean }) => (
  <span className={`flex items-center gap-1.5 ${active ? "text-primary" : done ? "text-success" : "text-muted-foreground/50"}`}>
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
              <div className="flex gap-2">
                <Button onClick={submit} disabled={!answer.trim() || loadingMark} className="btn-primary h-9 px-4 text-sm">
                  {loadingMark ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Marking…</> : "Submit answer"}
                </Button>
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
