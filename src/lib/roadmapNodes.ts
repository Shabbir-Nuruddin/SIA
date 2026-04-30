// Roadmap node generation engine.
// Builds a sequential, science-backed guided path of nodes:
//   learn → review (1d/3d/7d/14d) → mock (last 14 days) → break (every 4 sessions)
// Interleaves subjects (no 3 consecutive same-subject nodes).

import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode, Grade, gradeGap } from "./subjects";

export type NodeType = "learn" | "review" | "mock" | "break";
export type ScienceMethod = "active_recall" | "spaced_repetition" | "interleaving" | "elaboration" | "pomodoro";
export type NodeStatus = "locked" | "unlocked" | "in_progress" | "complete" | "skipped";

export interface UnitInput {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;        // ISO yyyy-mm-dd
  target_grade: Grade;
  current_grade: Grade;
}

export interface PlanNode {
  user_id: string;
  subject: SubjectCode | null;
  unit_code: string | null;
  unit_number: number | null;
  unit_name: string | null;
  topic_name: string | null;
  node_type: NodeType;
  node_order: number;
  scheduled_date: string;   // ISO date
  status: NodeStatus;
  science_method: ScienceMethod | null;
  why_now_text: string | null;
  source_node_order?: number;  // internal — resolved to source_node_id after insert
  unlocks_after_order?: number; // internal — resolved to unlocks_after_node_id after insert
}

export interface RoadmapNodeRow {
  id: string;
  user_id: string;
  subject: string | null;
  unit_code: string | null;
  unit_number: number | null;
  unit_name: string | null;
  topic_name: string | null;
  node_type: NodeType;
  node_order: number;
  scheduled_date: string;
  status: NodeStatus;
  unlocks_after_node_id: string | null;
  science_method: ScienceMethod | null;
  why_now_text: string | null;
  completed_at: string | null;
  score_percent: number | null;
  source_node_id: string | null;
  created_at: string;
}

const ISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// Topics that depend on others — schedule these later within a unit.
const FOUNDATION_FIRST = new Set([
  "algebraic expressions", "algebra and functions", "proof",
  "atomic structure and the periodic table", "formulae, equations and amount of substance",
  "cell structure and microscopy", "biological molecules",
  "working as a physicist", "mechanics",
]);

function isFoundational(topic: string): boolean {
  const t = topic.toLowerCase();
  for (const f of FOUNDATION_FIRST) if (t.includes(f)) return true;
  return false;
}

function urgencyScore(daysToExam: number, gap: number): number {
  return (gap * 15) + Math.max(0, 45 - daysToExam);
}

function whyNowFor(node: { type: NodeType; topic?: string | null; subject?: SubjectCode | null; daysToExam?: number }, ctx: { totalForUnit: number }): string {
  const subj = node.subject ? SUBJECTS[node.subject].name : "";
  switch (node.type) {
    case "learn":
      if ((node.daysToExam ?? 999) < 30)
        return `${subj} exam is in ${node.daysToExam} days. ${node.topic} is high-yield in past papers — cover it now.`;
      if (isFoundational(node.topic ?? ""))
        return `${node.topic} is foundational. Other ${subj} topics build on it, so we cover it early.`;
      return `Scheduled now to give you spaced reviews before your ${subj} exam.`;
    case "review":
      return `Your brain forgets ~70% within 24 hours without review. 5 quick questions lock ${node.topic} in.`;
    case "mock":
      return `${node.daysToExam} days to your ${subj} exam. Time to test under exam conditions.`;
    case "break":
      return `You've done 4 focused sessions. A short break improves retention more than pushing through.`;
  }
}

// Order topics within a unit: foundational first, then by index in the spec.
function orderUnitTopics(topics: string[]): string[] {
  return [...topics].sort((a, b) => {
    const af = isFoundational(a) ? 0 : 1;
    const bf = isFoundational(b) ? 0 : 1;
    if (af !== bf) return af - bf;
    return topics.indexOf(a) - topics.indexOf(b);
  });
}

export interface BuildOpts {
  hoursPerDay?: number;
  today?: Date;
}

/**
 * Build the sequential node plan in memory.
 * - Sequences topics per unit (foundational first)
 * - Interleaves subjects (no 3 in a row)
 * - Schedules learn nodes day-by-day, then injects breaks every 4 sessions
 * - Schedules spaced-repetition reviews at +3, +7, +14 days
 * - Schedules mock nodes in the final 14 days before each exam
 */
export function buildNodePlan(userId: string, units: UnitInput[], opts: BuildOpts = {}): PlanNode[] {
  const today = opts.today ?? new Date();
  today.setHours(0, 0, 0, 0);
  const hoursPerDay = Math.max(1, opts.hoursPerDay ?? 2);
  // 1 node ≈ 25 min Pomodoro. After 4 sessions: a break (≈20min) takes a slot.
  // Effective: in 1 hour we fit 2 learn/review nodes; after every 4 we add a break node.
  const sessionsPerDay = Math.max(2, Math.round(hoursPerDay * 2));

  // 1) Build a queue of LEARN nodes per subject, ordered by topic priority within unit.
  interface Pending {
    subject: SubjectCode;
    unit_number: number;
    unit_name: string;
    unit_code: string;
    topic: string;
    examDate: Date;
    daysToExam: number;
    urgency: number;
  }

  const subjectQueues = new Map<SubjectCode, Pending[]>();
  for (const u of units) {
    const meta = SUBJECTS[u.subject].units.find(x => x.number === u.unit_number);
    if (!meta) continue;
    const examDate = new Date(u.exam_date);
    examDate.setHours(0, 0, 0, 0);
    const daysToExam = Math.max(0, Math.round((+examDate - +today) / 86400000));
    const gap = gradeGap(u.target_grade as Grade, u.current_grade as Grade);
    const urgency = urgencyScore(daysToExam, gap);
    const orderedTopics = orderUnitTopics(meta.topics);
    const arr = subjectQueues.get(u.subject) ?? [];
    for (const t of orderedTopics) {
      arr.push({
        subject: u.subject,
        unit_number: u.unit_number,
        unit_name: u.unit_name,
        unit_code: `U${u.unit_number}`,
        topic: t,
        examDate,
        daysToExam,
        urgency,
      });
    }
    // Sort by exam urgency so units with closer exams appear first
    arr.sort((a, b) => b.urgency - a.urgency);
    subjectQueues.set(u.subject, arr);
  }

  // 2) Interleave subjects across the global learn sequence — never 3 in a row.
  const learnSequence: Pending[] = [];
  const subjects = Array.from(subjectQueues.keys());
  // Sort subjects by total urgency (most urgent subject's first item)
  subjects.sort((a, b) => (subjectQueues.get(b)![0]?.urgency ?? 0) - (subjectQueues.get(a)![0]?.urgency ?? 0));

  let last1: SubjectCode | undefined;
  let last2: SubjectCode | undefined;
  while (subjects.some(s => (subjectQueues.get(s)?.length ?? 0) > 0)) {
    // Choose the next subject: highest urgency item that doesn't violate "no 3 in a row"
    let chosen: SubjectCode | undefined;
    const candidates = subjects
      .filter(s => (subjectQueues.get(s)?.length ?? 0) > 0)
      .sort((a, b) => (subjectQueues.get(b)![0].urgency) - (subjectQueues.get(a)![0].urgency));

    for (const s of candidates) {
      if (!(last1 === s && last2 === s)) { chosen = s; break; }
    }
    if (!chosen) chosen = candidates[0];
    const item = subjectQueues.get(chosen)!.shift()!;
    learnSequence.push(item);
    last2 = last1;
    last1 = chosen;
  }

  // 3) Place learn nodes on calendar days (sessionsPerDay per day, skip nothing — fill linearly).
  const nodes: PlanNode[] = [];
  let order = 1;
  let dayOffset = 0;
  let countOnDay = 0;
  // Track per-topic last-learned day for spaced reviews
  const reviewQueue: { item: Pending; learnOrder: number; learnDayOffset: number }[] = [];

  const pushBreakIfDue = (currentDayOffset: number) => {
    // After every 4 learn/review on the same day, insert a break
    const todayLearnReviewCount = nodes.filter(n =>
      n.scheduled_date === ISO(addDays(today, currentDayOffset)) &&
      (n.node_type === "learn" || n.node_type === "review")
    ).length;
    if (todayLearnReviewCount > 0 && todayLearnReviewCount % 4 === 0) {
      const date = ISO(addDays(today, currentDayOffset));
      nodes.push({
        user_id: userId,
        subject: null,
        unit_code: null,
        unit_number: null,
        unit_name: null,
        topic_name: null,
        node_type: "break",
        node_order: order++,
        scheduled_date: date,
        status: "locked",
        science_method: "pomodoro",
        why_now_text: whyNowFor({ type: "break" }, { totalForUnit: 0 }),
        unlocks_after_order: order - 2,
      });
    }
  };

  for (const item of learnSequence) {
    if (countOnDay >= sessionsPerDay) {
      dayOffset++;
      countOnDay = 0;
    }
    const date = ISO(addDays(today, dayOffset));

    // Don't schedule a learn node after its exam date
    if (dayOffset > Math.round((+item.examDate - +today) / 86400000)) {
      // Skip — exam already passed by the time we'd cover it
      continue;
    }

    const learnNode: PlanNode = {
      user_id: userId,
      subject: item.subject,
      unit_code: item.unit_code,
      unit_number: item.unit_number,
      unit_name: item.unit_name,
      topic_name: item.topic,
      node_type: "learn",
      node_order: order++,
      scheduled_date: date,
      status: "locked",
      science_method: "active_recall",
      why_now_text: whyNowFor({ type: "learn", topic: item.topic, subject: item.subject, daysToExam: item.daysToExam }, { totalForUnit: 0 }),
      unlocks_after_order: order - 2,
    };
    nodes.push(learnNode);
    reviewQueue.push({ item, learnOrder: learnNode.node_order, learnDayOffset: dayOffset });
    countOnDay++;
    pushBreakIfDue(dayOffset);
  }

  // 4) Insert spaced-repetition review nodes at +3, +7, +14 days (or 2 days before exam if sooner)
  const reviewIntervals = [3, 7, 14];
  // Insert reviews in time order, finding gaps in the day's session count
  const dayLoad = new Map<string, number>(); // date → count of nodes (excluding break)
  for (const n of nodes) {
    if (n.node_type !== "break") {
      dayLoad.set(n.scheduled_date, (dayLoad.get(n.scheduled_date) ?? 0) + 1);
    }
  }

  for (const r of reviewQueue) {
    for (const gap of reviewIntervals) {
      let revDayOffset = r.learnDayOffset + gap;
      const examOffset = Math.round((+r.item.examDate - +today) / 86400000);
      // Don't schedule review past exam; pull forward to 2 days before exam
      if (revDayOffset > examOffset) revDayOffset = Math.max(r.learnDayOffset + 1, examOffset - 2);
      if (revDayOffset <= r.learnDayOffset) continue;
      const date = ISO(addDays(today, revDayOffset));
      // Don't overload a day past sessionsPerDay+2 with reviews
      const load = dayLoad.get(date) ?? 0;
      if (load >= sessionsPerDay + 2) continue;
      nodes.push({
        user_id: userId,
        subject: r.item.subject,
        unit_code: r.item.unit_code,
        unit_number: r.item.unit_number,
        unit_name: r.item.unit_name,
        topic_name: r.item.topic,
        node_type: "review",
        node_order: 0, // assigned after final ordering pass
        scheduled_date: date,
        status: "locked",
        science_method: "spaced_repetition",
        why_now_text: whyNowFor({ type: "review", topic: r.item.topic, subject: r.item.subject }, { totalForUnit: 0 }),
        source_node_order: r.learnOrder,
      });
      dayLoad.set(date, load + 1);
    }
  }

  // 5) Mock nodes — final 14 days before each unit exam: 1 mock per ~4 nodes; final 3 days mocks only.
  for (const u of units) {
    const examDate = new Date(u.exam_date);
    examDate.setHours(0, 0, 0, 0);
    const examOffset = Math.round((+examDate - +today) / 86400000);
    if (examOffset < 0) continue;
    const start = Math.max(0, examOffset - 14);
    for (let off = start; off < examOffset; off++) {
      const date = ISO(addDays(today, off));
      const daysToExam = examOffset - off;
      // In final 3 days: ensure at least one mock per day
      // Otherwise: every 4th day add a mock
      const shouldAdd = daysToExam <= 3 || ((examOffset - off) % 4 === 0);
      if (!shouldAdd) continue;
      // Avoid duplicate mock for same unit on same day
      const exists = nodes.some(n => n.node_type === "mock" && n.scheduled_date === date && n.subject === u.subject && n.unit_number === u.unit_number);
      if (exists) continue;
      nodes.push({
        user_id: userId,
        subject: u.subject,
        unit_code: `U${u.unit_number}`,
        unit_number: u.unit_number,
        unit_name: u.unit_name,
        topic_name: null,
        node_type: "mock",
        node_order: 0,
        scheduled_date: date,
        status: "locked",
        science_method: "active_recall",
        why_now_text: whyNowFor({ type: "mock", subject: u.subject, daysToExam }, { totalForUnit: 0 }),
      });
    }
  }

  // 6) Final ordering pass: sort by date, then by existing order, then assign sequential node_order.
  nodes.sort((a, b) => {
    if (a.scheduled_date !== b.scheduled_date) return a.scheduled_date < b.scheduled_date ? -1 : 1;
    if ((a.node_order || 0) && (b.node_order || 0)) return a.node_order - b.node_order;
    if (a.node_type === "break" && b.node_type !== "break") return 1;
    if (b.node_type === "break" && a.node_type !== "break") return -1;
    return 0;
  });
  nodes.forEach((n, i) => { n.node_order = i + 1; });

  // 7) Set unlocks_after_order = previous node's order. First node is unlocked.
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) {
      nodes[i].status = "unlocked";
      nodes[i].unlocks_after_order = undefined;
    } else {
      nodes[i].unlocks_after_order = nodes[i - 1].node_order;
    }
  }

  return nodes;
}

/**
 * Persist nodes to DB. Resolves source_node_order / unlocks_after_order to real UUIDs after insert.
 */
export async function persistNodePlan(userId: string, plan: PlanNode[]): Promise<{ inserted: number }> {
  // Wipe existing nodes for fresh build (only future or unstarted)
  await supabase.from("roadmap_nodes").delete().eq("user_id", userId);

  // Insert without dependency refs first; then update refs in a second pass.
  const insertRows = plan.map(p => ({
    user_id: p.user_id,
    subject: p.subject,
    unit_code: p.unit_code,
    unit_number: p.unit_number,
    unit_name: p.unit_name,
    topic_name: p.topic_name,
    node_type: p.node_type,
    node_order: p.node_order,
    scheduled_date: p.scheduled_date,
    status: p.status,
    science_method: p.science_method,
    why_now_text: p.why_now_text,
  }));

  // Insert in chunks of 200
  const inserted: { id: string; node_order: number }[] = [];
  for (let i = 0; i < insertRows.length; i += 200) {
    const chunk = insertRows.slice(i, i + 200);
    const { data, error } = await supabase.from("roadmap_nodes").insert(chunk).select("id, node_order");
    if (error) throw error;
    if (data) inserted.push(...data);
  }

  const orderToId = new Map<number, string>();
  inserted.forEach(r => orderToId.set(r.node_order, r.id));

  // Now update unlocks_after_node_id and source_node_id
  for (const p of plan) {
    const id = orderToId.get(p.node_order);
    if (!id) continue;
    const patch: any = {};
    if (p.unlocks_after_order != null) {
      const refId = orderToId.get(p.unlocks_after_order);
      if (refId) patch.unlocks_after_node_id = refId;
    }
    if (p.source_node_order != null) {
      const refId = orderToId.get(p.source_node_order);
      if (refId) patch.source_node_id = refId;
    }
    if (Object.keys(patch).length > 0) {
      await supabase.from("roadmap_nodes").update(patch).eq("id", id);
    }
  }

  return { inserted: inserted.length };
}

export async function generateRoadmapForUser(userId: string, opts: BuildOpts = {}) {
  const { data: subjectsRows, error } = await supabase
    .from("user_subjects")
    .select("subject, unit_number, unit_name, exam_date, target_grade, current_grade")
    .eq("user_id", userId);
  if (error) throw error;
  if (!subjectsRows || subjectsRows.length === 0) return { inserted: 0 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("hours_per_day")
    .eq("id", userId)
    .single();
  const hoursPerDay = (profile as any)?.hours_per_day ?? 2;

  const plan = buildNodePlan(userId, subjectsRows as UnitInput[], { hoursPerDay, ...opts });
  return persistNodePlan(userId, plan);
}
