/**
 * RoadmapCalendar — Smart study calendar for ApexRevise
 * Features:
 *  1. Availability grid (block times you CAN'T study)
 *  2. Hours-per-day slider
 *  3. Subject confidence tracker (Weak / OK / Strong per topic)
 *  4. AI-generated weekly study plan via Gemini/Groq
 *  5. Visual week-view calendar
 */

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Calendar, Clock, ChevronDown, ChevronUp, Loader2,
  BookOpen, Target, Zap, RefreshCw, Check, AlertTriangle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Slot = "morning" | "afternoon" | "evening";
type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type Confidence = "weak" | "ok" | "strong";

interface AvailabilityData {
  blocked: Record<Day, Record<Slot, boolean>>;  // true = blocked (can't study)
  hours_per_day: number;
}

interface TopicConfidence {
  subject: SubjectCode;
  topic: string;
  confidence: Confidence;
}

interface StudySession {
  day: Day;
  slot: Slot;
  subject: string;
  topic: string;
  sessionType: "New Material" | "Review" | "Practice" | "Mock";
  subjectCode: SubjectCode;
}

const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: Slot[] = ["morning", "afternoon", "evening"];
const SLOT_LABELS: Record<Slot, string> = {
  morning: "Morning\n8–12",
  afternoon: "Afternoon\n12–5",
  evening: "Evening\n5–10",
};

const SUBJECT_TOPICS: Partial<Record<SubjectCode, string[]>> = {
  chemistry: [
    "Atomic Structure & Bonding", "Energetics", "Kinetics (AS)", "Equilibria (AS)",
    "Electrochemistry", "Rate Equations & Kinetics (A2)", "Kc, Kp & Equilibria (A2)",
    "Entropy & Gibbs Free Energy", "Acid-Base Equilibria", "Transition Metals",
    "Organic: Alkanes & Alkenes", "Organic: Halogenoalkanes", "Organic: Carbonyls",
    "Organic: Arenes & Amines", "Organic: Polymers & Analysis",
  ],
  biology: [
    "Cell Structure", "Biological Molecules", "Enzymes", "Cell Transport",
    "DNA & Protein Synthesis", "Cell Division", "Exchange & Transport",
    "Ecology & Environment", "Immunity & Disease", "Hormonal Control",
    "Nervous System", "Respiration", "Photosynthesis", "Gene Technology",
    "Populations & Evolution",
  ],
  physics: [
    "Mechanics: Motion & Forces", "Mechanics: Energy & Power", "Waves",
    "Electricity: Circuits", "Electricity: Fields", "Nuclear Physics",
    "Thermal Physics", "Oscillations", "Gravitational Fields",
    "Electric & Magnetic Fields", "Capacitors", "Radioactivity", "Cosmology",
  ],
  mathematics: [
    "Algebra & Functions", "Coordinate Geometry", "Trigonometry",
    "Differentiation", "Integration", "Sequences & Series",
    "Exponentials & Logarithms", "Binomial Expansion",
    "Vectors", "Proof", "Statistics: Data", "Statistics: Probability",
    "Statistics: Distributions", "Mechanics: Kinematics", "Mechanics: Forces",
  ],
};

const CONFIDENCE_OPTIONS: { value: Confidence; label: string; emoji: string; color: string }[] = [
  { value: "weak",   label: "Weak",   emoji: "🔴", color: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300" },
  { value: "ok",     label: "OK",     emoji: "🟡", color: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300" },
  { value: "strong", label: "Strong", emoji: "🟢", color: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300" },
];

const SESSION_COLORS: Record<StudySession["sessionType"], string> = {
  "New Material": "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700",
  "Review":       "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700",
  "Practice":     "bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700",
  "Mock":         "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700",
};

const SESSION_ICONS: Record<StudySession["sessionType"], React.ReactNode> = {
  "New Material": <BookOpen className="h-3 w-3" />,
  "Review":       <RefreshCw className="h-3 w-3" />,
  "Practice":     <Target className="h-3 w-3" />,
  "Mock":         <Zap className="h-3 w-3" />,
};

const SUBJECT_ACCENT: Partial<Record<SubjectCode, string>> = {
  chemistry: "bg-purple-200 dark:bg-purple-800/60 text-purple-800 dark:text-purple-200",
  biology:   "bg-green-200 dark:bg-green-800/60 text-green-800 dark:text-green-200",
  physics:   "bg-orange-200 dark:bg-orange-800/60 text-orange-800 dark:text-orange-200",
  mathematics:"bg-blue-200 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200",
};

const DEFAULT_BLOCKED: Record<Day, Record<Slot, boolean>> = DAYS.reduce((acc, d) => ({
  ...acc, [d]: { morning: false, afternoon: false, evening: false }
}), {} as Record<Day, Record<Slot, boolean>>);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateFallbackPlan(
  subjects: SubjectCode[],
  topicConf: TopicConfidence[],
  avail: AvailabilityData
): StudySession[] {
  const sessions: StudySession[] = [];
  const weakTopics = topicConf.filter(t => t.confidence === "weak");
  const okTopics   = topicConf.filter(t => t.confidence === "ok");
  const allTopics  = [...weakTopics, ...weakTopics, ...okTopics]; // weak gets double weight

  let topicIdx = 0;
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      if (avail.blocked[day]?.[slot]) continue;
      if (allTopics.length === 0) break;
      const t = allTopics[topicIdx % allTopics.length];
      topicIdx++;
      const isWeek = !["Sat", "Sun"].includes(day);
      const sessionType: StudySession["sessionType"] =
        topicIdx % 7 === 0 ? "Mock"
        : topicIdx % 5 === 0 ? "Review"
        : topicIdx % 3 === 0 ? "Practice"
        : "New Material";
      sessions.push({
        day, slot,
        subject: SUBJECTS[t.subject]?.name ?? t.subject,
        subjectCode: t.subject,
        topic: t.topic,
        sessionType,
      });
    }
  }
  return sessions;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoadmapCalendar() {
  const { user } = useAuth();

  // Availability state
  const [avail, setAvail] = useState<AvailabilityData>({
    blocked: DEFAULT_BLOCKED,
    hours_per_day: 3,
  });
  const [availSaved, setAvailSaved] = useState(false);
  const [savingAvail, setSavingAvail] = useState(false);

  // Subjects the user has enrolled in
  const [enrolledSubjects, setEnrolledSubjects] = useState<SubjectCode[]>([]);

  // Topic confidence
  const [topicConf, setTopicConf] = useState<TopicConfidence[]>([]);
  const [confSaved, setConfSaved] = useState(false);
  const [savingConf, setSavingConf] = useState(false);
  const [openSubject, setOpenSubject] = useState<SubjectCode | null>(null);

  // Study plan
  const [plan, setPlan] = useState<StudySession[] | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Tab: "setup" | "confidence" | "calendar"
  const [tab, setTab] = useState<"setup" | "confidence" | "calendar">("setup");

  // ── Load saved data ──
  useEffect(() => {
    if (!user) return;
    (async () => {
      // Load availability
      const { data: a } = await supabase
        .from("user_availability")
        .select("blocked_slots, hours_per_day")
        .eq("user_id", user.id)
        .maybeSingle();
      if (a) {
        setAvail({
          blocked: (a.blocked_slots as any) ?? DEFAULT_BLOCKED,
          hours_per_day: a.hours_per_day ?? 3,
        });
        setAvailSaved(true);
      }

      // Load enrolled subjects from profiles
      const { data: p } = await supabase
        .from("user_subjects")
        .select("subject_code")
        .eq("user_id", user.id);
      if (p && p.length > 0) {
        setEnrolledSubjects(p.map((x: any) => x.subject_code as SubjectCode));
      } else {
        // Fall back to subjects from profiles table
        const { data: prof } = await supabase
          .from("profiles")
          .select("subjects")
          .eq("id", user.id)
          .maybeSingle();
        if (prof?.subjects) {
          const subs = Object.keys(prof.subjects).filter(k => (prof.subjects as any)[k]?.selected) as SubjectCode[];
          setEnrolledSubjects(subs.length > 0 ? subs : ["chemistry", "mathematics"]);
        }
      }

      // Load topic confidence
      const { data: tc } = await supabase
        .from("user_topic_confidence")
        .select("subject, topic, confidence_level")
        .eq("user_id", user.id);
      if (tc && tc.length > 0) {
        setTopicConf(tc.map((x: any) => ({
          subject: x.subject as SubjectCode,
          topic: x.topic,
          confidence: x.confidence_level as Confidence,
        })));
        setConfSaved(true);
      }

      // Load plan
      const { data: planData } = await supabase
        .from("user_study_plan")
        .select("plan_json")
        .eq("user_id", user.id)
        .maybeSingle();
      if (planData?.plan_json) {
        setPlan(planData.plan_json as StudySession[]);
      }
    })();
  }, [user]);

  // ── Toggle blocked slot ──
  const toggleSlot = (day: Day, slot: Slot) => {
    setAvail(prev => ({
      ...prev,
      blocked: {
        ...prev.blocked,
        [day]: { ...prev.blocked[day], [slot]: !prev.blocked[day][slot] },
      },
    }));
  };

  // ── Save availability ──
  const saveAvailability = async () => {
    if (!user) return;
    setSavingAvail(true);
    try {
      await supabase.from("user_availability").upsert({
        user_id: user.id,
        blocked_slots: avail.blocked,
        hours_per_day: avail.hours_per_day,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      setAvailSaved(true);
      toast.success("Availability saved!");
      setTab("confidence");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSavingAvail(false);
    }
  };

  // ── Set topic confidence ──
  const setConf = (subject: SubjectCode, topic: string, confidence: Confidence) => {
    setTopicConf(prev => {
      const existing = prev.findIndex(t => t.subject === subject && t.topic === topic);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { subject, topic, confidence };
        return next;
      }
      return [...prev, { subject, topic, confidence }];
    });
  };

  const getConf = (subject: SubjectCode, topic: string): Confidence | null => {
    return topicConf.find(t => t.subject === subject && t.topic === topic)?.confidence ?? null;
  };

  // ── Save confidence ──
  const saveConfidence = async () => {
    if (!user) return;
    setSavingConf(true);
    try {
      // Upsert each topic confidence row
      const rows = topicConf.map(t => ({
        user_id: user.id,
        subject: t.subject,
        topic: t.topic,
        confidence_level: t.confidence,
        updated_at: new Date().toISOString(),
      }));
      if (rows.length > 0) {
        await supabase.from("user_topic_confidence").upsert(rows, { onConflict: "user_id,subject,topic" });
      }
      setConfSaved(true);
      toast.success("Confidence levels saved!");
      await generatePlan();
    } catch {
      toast.error("Failed to save confidence. Please try again.");
    } finally {
      setSavingConf(false);
    }
  };

  // ── Generate study plan ──
  const generatePlan = useCallback(async () => {
    if (!user) return;
    setLoadingPlan(true);
    setTab("calendar");
    try {
      const weakTopics = topicConf.filter(t => t.confidence === "weak");
      const availableSlots = DAYS.flatMap(d =>
        SLOTS.filter(s => !avail.blocked[d]?.[s]).map(s => `${d} ${s}`)
      );

      const { data, error } = await supabase.functions.invoke("generate-study-plan", {
        body: {
          subjects: enrolledSubjects,
          weakTopics: weakTopics.map(t => ({ subject: t.subject, topic: t.topic })),
          availableSlots,
          hoursPerDay: avail.hours_per_day,
        },
      });

      if (error || !data?.plan) throw new Error("AI plan generation failed");

      const planData = data.plan as StudySession[];
      setPlan(planData);

      // Save to Supabase
      await supabase.from("user_study_plan").upsert({
        user_id: user.id,
        plan_json: planData,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      toast.success("Your study plan is ready!");
    } catch {
      // Fallback: generate client-side
      const fallback = generateFallbackPlan(enrolledSubjects, topicConf, avail);
      setPlan(fallback);
      toast.success("Study plan generated!");
    } finally {
      setLoadingPlan(false);
    }
  }, [user, topicConf, avail, enrolledSubjects]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const weakCount = topicConf.filter(t => t.confidence === "weak").length;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-secondary/40 rounded-xl p-1">
        {([
          { id: "setup",      label: "📅 Availability", done: availSaved },
          { id: "confidence", label: "🎯 My Confidence", done: confSaved },
          { id: "calendar",   label: "🗓️ Study Plan",    done: !!plan },
        ] as { id: typeof tab; label: string; done: boolean }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.done && <Check className="h-3 w-3 text-green-500" />}
          </button>
        ))}
      </div>

      {/* ── Tab: Availability ── */}
      {tab === "setup" && (
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-bold mb-1">When can't you study?</h3>
            <p className="text-sm text-muted-foreground">Click to block the times you're NOT available. We'll build your plan around the rest.</p>
          </div>

          {/* Availability grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-xs text-muted-foreground font-mono w-24"></th>
                  {DAYS.map(d => (
                    <th key={d} className="p-2 text-xs font-bold text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map(slot => (
                  <tr key={slot}>
                    <td className="p-2 text-xs text-muted-foreground font-mono whitespace-pre-line leading-tight">
                      {SLOT_LABELS[slot]}
                    </td>
                    {DAYS.map(day => {
                      const blocked = avail.blocked[day]?.[slot];
                      return (
                        <td key={day} className="p-1 text-center">
                          <button
                            onClick={() => toggleSlot(day, slot)}
                            className={`w-full h-10 rounded-lg border-2 transition-all text-xs font-medium ${
                              blocked
                                ? "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400"
                                : "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:border-green-400"
                            }`}
                            title={blocked ? "Blocked — click to unblock" : "Available — click to block"}
                          >
                            {blocked ? "✕" : "✓"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 dark:bg-green-800 border border-green-400" /> Available</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 dark:bg-red-800 border border-red-400" /> Blocked</span>
          </div>

          {/* Hours slider */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Study hours per available day</span>
              </div>
              <span className="text-2xl font-extrabold text-primary">{avail.hours_per_day}h</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={avail.hours_per_day}
              onChange={e => setAvail(prev => ({ ...prev, hours_per_day: parseFloat(e.target.value) }))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1h (light)</span>
              <span>5h (standard)</span>
              <span>10h (intensive)</span>
            </div>
          </div>

          <Button onClick={saveAvailability} disabled={savingAvail} className="w-full">
            {savingAvail ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            Save availability & continue
          </Button>
        </div>
      )}

      {/* ── Tab: Confidence ── */}
      {tab === "confidence" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold mb-1">How confident are you in each topic?</h3>
            <p className="text-sm text-muted-foreground">
              Be honest — weak topics get more practice sessions in your plan.
              {weakCount > 0 && <span className="text-red-500 font-medium ml-1">{weakCount} weak topic{weakCount !== 1 ? "s" : ""} flagged.</span>}
            </p>
          </div>

          {enrolledSubjects.length === 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-300 flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              No subjects found. Please complete onboarding first.
            </div>
          )}

          {enrolledSubjects.map(sub => {
            const topics = SUBJECT_TOPICS[sub] ?? [];
            const isOpen = openSubject === sub;
            const subConf = topicConf.filter(t => t.subject === sub);
            const weakInSub = subConf.filter(t => t.confidence === "weak").length;
            return (
              <div key={sub} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenSubject(isOpen ? null : sub)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${SUBJECT_ACCENT[sub] ?? "bg-secondary"}`}>
                      {SUBJECTS[sub]?.name ?? sub}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {subConf.length}/{topics.length} rated
                      {weakInSub > 0 && <span className="text-red-500 ml-1">· {weakInSub} weak</span>}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 space-y-3">
                    {topics.map(topic => {
                      const current = getConf(sub, topic);
                      return (
                        <div key={topic} className="flex items-center justify-between gap-3 flex-wrap">
                          <span className="text-sm flex-1 min-w-[120px]">{topic}</span>
                          <div className="flex gap-1.5">
                            {CONFIDENCE_OPTIONS.map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => setConf(sub, topic, opt.value)}
                                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                                  current === opt.value
                                    ? opt.color + " scale-105 shadow-sm"
                                    : "bg-secondary/50 border-border text-muted-foreground hover:border-border hover:bg-secondary"
                                }`}
                              >
                                {opt.emoji} {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <Button
            onClick={saveConfidence}
            disabled={savingConf || topicConf.length === 0}
            className="w-full"
          >
            {savingConf ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Save & generate my study plan
          </Button>
        </div>
      )}

      {/* ── Tab: Calendar ── */}
      {tab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold mb-1">Your Weekly Study Plan</h3>
              <p className="text-sm text-muted-foreground">
                Built around your availability
                {weakCount > 0 && `, prioritising your ${weakCount} weak topic${weakCount !== 1 ? "s" : ""}`}.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generatePlan}
              disabled={loadingPlan}
            >
              {loadingPlan ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span className="ml-1.5 hidden sm:inline">Regenerate</span>
            </Button>
          </div>

          {loadingPlan && (
            <div className="rounded-xl border border-border p-8 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Building your personalised plan...</p>
            </div>
          )}

          {!loadingPlan && !plan && (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
              <Calendar className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>No plan yet. Set your availability and confidence levels to generate one.</p>
              <Button className="mt-4" size="sm" onClick={() => setTab("setup")}>
                Get started →
              </Button>
            </div>
          )}

          {!loadingPlan && plan && plan.length > 0 && (
            <>
              {/* Legend */}
              <div className="flex flex-wrap gap-2 text-xs">
                {(Object.entries(SESSION_COLORS) as [StudySession["sessionType"], string][]).map(([type, cls]) => (
                  <span key={type} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${cls}`}>
                    {SESSION_ICONS[type]} {type}
                  </span>
                ))}
              </div>

              {/* Grid view */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-muted-foreground font-mono w-20"></th>
                      {DAYS.map(d => (
                        <th key={d} className="p-2 text-center font-bold text-xs">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SLOTS.map(slot => (
                      <tr key={slot}>
                        <td className="p-2 text-muted-foreground font-mono capitalize text-[11px] border-t border-border">
                          {slot}
                        </td>
                        {DAYS.map(day => {
                          const session = plan.find(s => s.day === day && s.slot === slot);
                          const isBlocked = avail.blocked[day]?.[slot];
                          return (
                            <td key={day} className="p-1 border-t border-border align-top min-w-[80px]">
                              {isBlocked ? (
                                <div className="h-16 rounded-lg bg-secondary/20 border border-dashed border-border flex items-center justify-center text-muted-foreground text-[10px]">
                                  blocked
                                </div>
                              ) : session ? (
                                <div className={`rounded-lg border p-1.5 h-16 flex flex-col justify-between overflow-hidden ${SESSION_COLORS[session.sessionType]}`}>
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {SESSION_ICONS[session.sessionType]}
                                    <span className="font-bold text-[10px] leading-tight truncate">{session.sessionType}</span>
                                  </div>
                                  <div>
                                    <span className={`inline-block text-[9px] font-bold px-1 rounded ${SUBJECT_ACCENT[session.subjectCode] ?? "bg-secondary"}`}>
                                      {SUBJECTS[session.subjectCode]?.name?.slice(0, 4) ?? session.subjectCode}
                                    </span>
                                    <p className="text-[10px] leading-tight mt-0.5 line-clamp-2 opacity-80">{session.topic}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-16 rounded-lg bg-secondary/10 border border-dashed border-border/30" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Weekly summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["New Material", "Review", "Practice", "Mock"] as StudySession["sessionType"][]).map(type => {
                  const count = plan.filter(s => s.sessionType === type).length;
                  return (
                    <div key={type} className={`rounded-xl border p-3 text-center ${SESSION_COLORS[type]}`}>
                      <div className="flex justify-center mb-1">{SESSION_ICONS[type]}</div>
                      <div className="text-xl font-extrabold">{count}</div>
                      <div className="text-[10px] font-medium opacity-70">{type}</div>
                    </div>
                  );
                })}
              </div>

              {/* Weak topics highlight */}
              {weakCount > 0 && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-bold text-red-700 dark:text-red-300">Weak topics getting extra attention</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {topicConf.filter(t => t.confidence === "weak").map(t => (
                      <span key={`${t.subject}-${t.topic}`}
                        className="text-[11px] bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                        {t.topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
