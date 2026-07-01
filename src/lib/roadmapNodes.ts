// Roadmap node generation engine — rebuilt to spec.
// - Sequential, science-backed guided path: learn → review (every 3 learns) → mock (last 14d) → break (every 4)
// - Interleaves subjects (no >2 consecutive same-subject learn nodes per day)
// - Spaced repetition reviews at +3, +7, +14 days
// - Weak topics (from topic_progress.weak_flag) bumped to front + extra review nodes
// - Completed nodes are preserved across regenerations
// - All dates use getLocalDateString() — never UTC

import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode, Grade, gradeGap, getSubjectsForBoard } from "./subjects";
import { ROADMAP_TOPICS, isFoundationalTopic } from "./roadmapTopics";
import { getLocalDateString, addDaysLocal, parseLocalDate, daysBetweenLocal } from "./dateLocal";

export type NodeType = "learn" | "review" | "mock" | "break";
export type ScienceMethod =
  | "active_recall"
  | "spaced_repetition"
  | "elaboration"
  | "interleaving"
  | "dual_coding"
  | "concrete_examples"
  | "pomodoro";
export type NodeStatus = "locked" | "unlocked" | "in_progress" | "complete" | "skipped";

export interface UnitInput {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;        // ISO yyyy-mm-dd (treated as local)
  target_grade: Grade;
  current_grade: Grade;
  paper_duration_minutes?: number;
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
  scheduled_date: string;
  status: NodeStatus;
  science_method: ScienceMethod | null;
  why_now_text: string | null;
  source_node_order?: number;
  unlocks_after_order?: number;
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

const WELLNESS_MESSAGES = [
  "Drink a full glass of water now. Dehydration reduces cognitive performance by up to 15%.",
  "Stand up. Walk for 3 minutes. Movement increases blood flow to the prefrontal cortex.",
  "Eat something light — nuts, fruit, or a banana. Glucose fuels working memory.",
  "Close your eyes for 60 seconds. Even micro-rest reduces mental fatigue.",
  "Take 3 slow deep breaths. Activates the parasympathetic nervous system and reduces cortisol.",
  "You've earned this break. Your brain is consolidating what you just learned.",
];

const LEARN_METHODS: ScienceMethod[] = [
  "active_recall",
  "spaced_repetition",
  "elaboration",
  "interleaving",
  "dual_coding",
  "concrete_examples",
];

interface WeakTopic {
  subject: string;
  unit_number: number | null;
  topic_name: string;
  last_score_percent: number | null;
}

function urgencyScore(daysToExam: number): number {
  if (daysToExam <= 0) return 100;
  return Math.max(10, Math.min(100, Math.round(100 - (daysToExam / 90) * 100)));
}

function whyNowLearn(topic: string, subject: string, daysToExam: number): string {
  return `${topic} appears regularly in ${subject} past papers for this unit. ${daysToExam} days to exam — covering it now leaves time for spaced reviews.`;
}

function whyNowReview(topics: string[]): string {
  return `Ebbinghaus forgetting curve: without review, you'd lose ~70% of these topics within a week. A 5-question recall now locks them in.`;
}

function whyNowMock(daysToExam: number): string {
  return `${daysToExam} days to go. Time to simulate exam conditions — this is how marks are won.`;
}

function whyNowBreak(): string {
  return `Your hippocampus consolidates memory during rest. This break is part of learning.`;
}

function topicListFor(subject: SubjectCode, unitNumber: number, weakTopics: WeakTopic[], board: "edexcel-ial" | "cie" = "edexcel-ial"): string[] {
  const SUBJ = getSubjectsForBoard(board);
  const fromSpec = board === "edexcel-ial" ? ROADMAP_TOPICS[subject]?.[unitNumber] : undefined;
  const subjMeta = SUBJ[subject];
  if (!subjMeta) {
    console.warn(`[roadmap] No subject metadata for "${subject}" on board "${board}". Using fallback topic.`);
    return fromSpec && fromSpec.length > 0 ? [...fromSpec] : [`Unit ${unitNumber} review`];
  }
  const unitMeta = subjMeta.units.find(u => u.number === unitNumber);
  const list = fromSpec && fromSpec.length > 0
    ? [...fromSpec]
    : (unitMeta?.topics ?? []).slice();

  // Last-resort fallback so the unit still produces at least one node.
  if (list.length === 0) list.push(unitMeta?.name || `Unit ${unitNumber} review`);

  // Sort: foundational first, then weak topics bumped to front, then by spec order.
  const weakSet = new Set(
    weakTopics
      .filter(w => w.subject === subject && (w.unit_number == null || w.unit_number === unitNumber))
      .map(w => w.topic_name.toLowerCase())
  );

  return list.sort((a, b) => {
    const wa = weakSet.has(a.toLowerCase()) ? 0 : 1;
    const wb = weakSet.has(b.toLowerCase()) ? 0 : 1;
    if (wa !== wb) return wa - wb;
    const fa = isFoundationalTopic(a) ? 0 : 1;
    const fb = isFoundationalTopic(b) ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return list.indexOf(a) - list.indexOf(b);
  });
}

export interface BuildOpts {
  hoursPerDay?: number;
  restDays?: number[]; // 0=Sun … 6=Sat
  weakTopics?: WeakTopic[];
  preserveBefore?: PlanNode[];
  board?: "edexcel-ial" | "cie";
  /** If set, replace every unit's exam_date with today + this many days.
   *  Used for the "just revising — no exam date" flow. */
  overrideHorizonDays?: number;
}

/**
 * Build the sequential node plan in memory (no DB writes).
 */
export function buildNodePlan(
  userId: string,
  units: UnitInput[],
  opts: BuildOpts = {},
): PlanNode[] {
  const todayIso = getLocalDateString();
  const today = parseLocalDate(todayIso);
  const hoursPerDay = Math.max(0.5, opts.hoursPerDay ?? 2);
  const sessionsPerDay = Math.max(1, Math.floor((hoursPerDay * 60) / 25));
  const restDays = new Set(opts.restDays ?? []);
  const weakTopics = opts.weakTopics ?? [];
  const board = opts.board ?? "edexcel-ial";
  const SUBJ = getSubjectsForBoard(board);

  // If caller asked for an override horizon, rewrite every unit's exam date
  // to today + N days so the planner schedules a generic revision plan
  // even when no real exam date is set / all dates have passed.
  const workingUnits: UnitInput[] = opts.overrideHorizonDays
    ? units.map(u => {
        const d = new Date(today);
        d.setDate(d.getDate() + opts.overrideHorizonDays!);
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return { ...u, exam_date: iso };
      })
    : units;

  // Filter out exams that have already passed.
  const liveUnits = workingUnits.filter(u => daysBetweenLocal(todayIso, u.exam_date) > 0);
  if (liveUnits.length === 0) return [];

  // Per-unit metadata
  interface UnitState {
    unit: UnitInput;
    daysToExam: number;
    urgency: number;
    topics: string[];        // remaining topic queue (in order)
    learned: string[];       // topics already turned into LEARN nodes
    learnNodeIndices: number[]; // indices into `nodes` for that unit's LEARN nodes
  }

  const states: UnitState[] = liveUnits.map(u => {
    const days = daysBetweenLocal(todayIso, u.exam_date);
    return {
      unit: u,
      daysToExam: days,
      urgency: urgencyScore(days),
      topics: topicListFor(u.subject, u.unit_number, weakTopics, board),
      learned: [],
      learnNodeIndices: [],
    };
  });

  // Build a flat learn sequence respecting:
  //   - urgency (highest first)
  //   - interleaving (no >2 consecutive same-subject globally)
  // Each iteration we round-robin by urgency until all topics are scheduled.
  const learnQueue: { unitIdx: number; topic: string }[] = [];
  let last1Subj: string | undefined;
  let last2Subj: string | undefined;
  while (states.some(s => s.topics.length > 0)) {
    const candidates = states
      .map((s, i) => ({ s, i }))
      .filter(x => x.s.topics.length > 0)
      .sort((a, b) => b.s.urgency - a.s.urgency);

    let chosen = candidates.find(c => !(c.s.unit.subject === last1Subj && c.s.unit.subject === last2Subj));
    if (!chosen) chosen = candidates[0];
    const topic = chosen.s.topics.shift()!;
    chosen.s.learned.push(topic);
    learnQueue.push({ unitIdx: chosen.i, topic });
    last2Subj = last1Subj;
    last1Subj = chosen.s.unit.subject;
  }

  // Walk the calendar day-by-day, placing nodes per sessionsPerDay budget.
  const nodes: PlanNode[] = [];
  let order = 1;
  const dayLoad = new Map<string, number>(); // total nodes placed per date (excluding break)

  // Helper to find the next non-rest date with capacity
  function nextSlot(fromOffset: number): { offset: number; iso: string } {
    let off = fromOffset;
    while (true) {
      const iso = getLocalDateString(addDaysLocal(today, off));
      const dow = addDaysLocal(today, off).getDay();
      if (!restDays.has(dow) && (dayLoad.get(iso) ?? 0) < sessionsPerDay) {
        return { offset: off, iso };
      }
      off++;
      if (off > 365 * 2) return { offset: off, iso }; // safety
    }
  }

  // Track per-topic learn placements for review scheduling
  interface ReviewSeed { unitIdx: number; topic: string; learnOffset: number; learnOrder: number }
  const reviewSeeds: ReviewSeed[] = [];

  // Track per-day same-subject consecutive count for sub-day interleaving
  let curOffset = 0;
  let lastSubjOnDay: string | undefined;
  let consecOnDay = 0;
  let placedSinceBreak = 0;

  for (let qi = 0; qi < learnQueue.length; qi++) {
    const item = learnQueue[qi];
    const u = states[item.unitIdx].unit;

    // Find a day that has room AND respects "no >2 consecutive same-subject"
    while (true) {
      const slot = nextSlot(curOffset);
      // If we just hit a new day, reset trackers
      if (slot.offset !== curOffset) {
        lastSubjOnDay = undefined;
        consecOnDay = 0;
        placedSinceBreak = 0;
      }
      curOffset = slot.offset;

      // Don't schedule a learn node after its exam date
      if (curOffset > states[item.unitIdx].daysToExam) {
        // Skip this topic — exam window already closed for this unit on this day
        states[item.unitIdx].topics = []; // stop the bleed
        break;
      }

      // Interleaving guard
      if (lastSubjOnDay === u.subject && consecOnDay >= 2) {
        // Look for another candidate for this slot from a different subject
        // Find next item in learnQueue with a different subject
        let swapIdx = -1;
        for (let j = qi + 1; j < learnQueue.length; j++) {
          if (states[learnQueue[j].unitIdx].unit.subject !== u.subject) { swapIdx = j; break; }
        }
        if (swapIdx > -1) {
          // Swap qi <-> swapIdx and retry
          const tmp = learnQueue[qi];
          learnQueue[qi] = learnQueue[swapIdx];
          learnQueue[swapIdx] = tmp;
          continue;
        }
        // No swap available — push to next day
        curOffset++;
        lastSubjOnDay = undefined;
        consecOnDay = 0;
        placedSinceBreak = 0;
        continue;
      }
      break;
    }

    if (states[item.unitIdx].topics.length === 0 && !learnQueue.slice(qi).some(x => x.unitIdx === item.unitIdx)) {
      // unit was nulled out
    }

    const slotIso = getLocalDateString(addDaysLocal(today, curOffset));
    const science = LEARN_METHODS[(qi) % LEARN_METHODS.length];

    const learnNode: PlanNode = {
      user_id: userId,
      subject: u.subject,
      unit_code: `U${u.unit_number}`,
      unit_number: u.unit_number,
      unit_name: u.unit_name,
      topic_name: item.topic,
      node_type: "learn",
      node_order: order++,
      scheduled_date: slotIso,
      status: "locked",
      science_method: science,
      why_now_text: whyNowLearn(item.topic, SUBJ[u.subject].name, states[item.unitIdx].daysToExam - curOffset),
      unlocks_after_order: order - 2,
    };
    nodes.push(learnNode);
    states[item.unitIdx].learnNodeIndices.push(nodes.length - 1);
    reviewSeeds.push({ unitIdx: item.unitIdx, topic: item.topic, learnOffset: curOffset, learnOrder: learnNode.node_order });
    dayLoad.set(slotIso, (dayLoad.get(slotIso) ?? 0) + 1);

    if (lastSubjOnDay === u.subject) consecOnDay++; else { lastSubjOnDay = u.subject; consecOnDay = 1; }
    placedSinceBreak++;

    // After every 3 learn nodes for this unit: insert REVIEW (last 3 topics together)
    const learnedForUnit = states[item.unitIdx].learned;
    if (learnedForUnit.length > 0 && learnedForUnit.length % 3 === 0) {
      const last3 = learnedForUnit.slice(-3);
      // Schedule review on the next available slot (could be same day if room)
      const revSlot = nextSlot(curOffset);
      const revIso = revSlot.iso;
      nodes.push({
        user_id: userId,
        subject: u.subject,
        unit_code: `U${u.unit_number}`,
        unit_number: u.unit_number,
        unit_name: u.unit_name,
        topic_name: `Review: ${last3.join(", ")}`,
        node_type: "review",
        node_order: order++,
        scheduled_date: revIso,
        status: "locked",
        science_method: "spaced_repetition",
        why_now_text: whyNowReview(last3),
        unlocks_after_order: order - 2,
      });
      dayLoad.set(revIso, (dayLoad.get(revIso) ?? 0) + 1);
      placedSinceBreak++;
    }

    // After every 4 placed nodes total today: BREAK
    if (placedSinceBreak >= 4) {
      const brSlot = nextSlot(curOffset);
      const wmsg = WELLNESS_MESSAGES[nodes.filter(n => n.node_type === "break").length % WELLNESS_MESSAGES.length];
      nodes.push({
        user_id: userId,
        subject: null,
        unit_code: null,
        unit_number: null,
        unit_name: null,
        topic_name: wmsg,
        node_type: "break",
        node_order: order++,
        scheduled_date: brSlot.iso,
        status: "locked",
        science_method: "pomodoro",
        why_now_text: whyNowBreak(),
        unlocks_after_order: order - 2,
      });
      dayLoad.set(brSlot.iso, (dayLoad.get(brSlot.iso) ?? 0) + 1);
      placedSinceBreak = 0;
    }
  }

  // Per-unit closing nodes: 1 mock → 1 review of 2 weakest topics → 1 final mock → "unit complete" break
  for (const s of states) {
    if (s.learned.length === 0) continue;
    // Schedule them on consecutive available days, but no later than 1 day before exam
    const maxOffset = Math.max(0, s.daysToExam - 1);

    const placeAt = (preferredOff: number, fallbackOff: number) => {
      // Find next slot starting from preferredOff, capped by maxOffset
      let off = Math.max(preferredOff, fallbackOff);
      while (off <= maxOffset) {
        const iso = getLocalDateString(addDaysLocal(today, off));
        const dow = addDaysLocal(today, off).getDay();
        if (!restDays.has(dow) && (dayLoad.get(iso) ?? 0) < sessionsPerDay + 1) {
          return { iso, off };
        }
        off++;
      }
      // Fallback: place on maxOffset day even if overloaded
      return { iso: getLocalDateString(addDaysLocal(today, maxOffset)), off: maxOffset };
    };

    const m1 = placeAt(curOffset + 1, Math.max(0, s.daysToExam - 5));
    nodes.push({
      user_id: userId,
      subject: s.unit.subject,
      unit_code: `U${s.unit.unit_number}`,
      unit_number: s.unit.unit_number,
      unit_name: s.unit.unit_name,
      topic_name: `${s.unit.unit_name} — practice mock`,
      node_type: "mock",
      node_order: order++,
      scheduled_date: m1.iso,
      status: "locked",
      science_method: "active_recall",
      why_now_text: whyNowMock(s.daysToExam - m1.off),
      unlocks_after_order: order - 2,
    });
    dayLoad.set(m1.iso, (dayLoad.get(m1.iso) ?? 0) + 1);

    const r1 = placeAt(m1.off + 1, m1.off + 1);
    nodes.push({
      user_id: userId,
      subject: s.unit.subject,
      unit_code: `U${s.unit.unit_number}`,
      unit_number: s.unit.unit_number,
      unit_name: s.unit.unit_name,
      topic_name: `Targeted review: weakest topics in ${s.unit.unit_name}`,
      node_type: "review",
      node_order: order++,
      scheduled_date: r1.iso,
      status: "locked",
      science_method: "spaced_repetition",
      why_now_text: `After your first mock, weak topics need a focused pass before the final exam mock.`,
      unlocks_after_order: order - 2,
    });
    dayLoad.set(r1.iso, (dayLoad.get(r1.iso) ?? 0) + 1);

    const m2 = placeAt(r1.off + 1, Math.max(r1.off + 1, s.daysToExam - 1));
    nodes.push({
      user_id: userId,
      subject: s.unit.subject,
      unit_code: `U${s.unit.unit_number}`,
      unit_number: s.unit.unit_number,
      unit_name: s.unit.unit_name,
      topic_name: `${s.unit.unit_name} — final mock under exam conditions`,
      node_type: "mock",
      node_order: order++,
      scheduled_date: m2.iso,
      status: "locked",
      science_method: "active_recall",
      why_now_text: whyNowMock(s.daysToExam - m2.off),
      unlocks_after_order: order - 2,
    });
    dayLoad.set(m2.iso, (dayLoad.get(m2.iso) ?? 0) + 1);

    const ucIso = getLocalDateString(addDaysLocal(today, Math.min(s.daysToExam, m2.off + 1)));
    nodes.push({
      user_id: userId,
      subject: null,
      unit_code: null,
      unit_number: null,
      unit_name: null,
      topic_name: `${s.unit.unit_name} — all done. Rest and consolidate.`,
      node_type: "break",
      node_order: order++,
      scheduled_date: ucIso,
      status: "locked",
      science_method: "pomodoro",
      why_now_text: `Sleep is when long-term consolidation happens. Trust the work you've done.`,
      unlocks_after_order: order - 2,
    });
  }

  // 4) Spaced repetition reviews at +3, +7, +14 days for each LEARN seed
  const reviewIntervals = [3, 7, 14];
  for (const seed of reviewSeeds) {
    const s = states[seed.unitIdx];
    for (const gap of reviewIntervals) {
      let revOff = seed.learnOffset + gap;
      if (revOff > s.daysToExam - 2) revOff = Math.max(seed.learnOffset + 1, s.daysToExam - 2);
      if (revOff <= seed.learnOffset) continue;
      const revIso = getLocalDateString(addDaysLocal(today, revOff));
      const dow = addDaysLocal(today, revOff).getDay();
      if (restDays.has(dow)) continue;
      if ((dayLoad.get(revIso) ?? 0) >= sessionsPerDay + 2) continue;
      nodes.push({
        user_id: userId,
        subject: s.unit.subject,
        unit_code: `U${s.unit.unit_number}`,
        unit_number: s.unit.unit_number,
        unit_name: s.unit.unit_name,
        topic_name: `Spaced review: ${seed.topic}`,
        node_type: "review",
        node_order: 0,
        scheduled_date: revIso,
        status: "locked",
        science_method: "spaced_repetition",
        why_now_text: `+${gap}-day review of ${seed.topic}. Spaced repetition reduces forgetting by up to 80%.`,
        source_node_order: seed.learnOrder,
      });
      dayLoad.set(revIso, (dayLoad.get(revIso) ?? 0) + 1);
    }
  }

  // 5) Final ordering pass — sort by date, then existing node_order, assign sequential order
  nodes.sort((a, b) => {
    if (a.scheduled_date !== b.scheduled_date) return a.scheduled_date < b.scheduled_date ? -1 : 1;
    if ((a.node_order || 0) && (b.node_order || 0)) return a.node_order - b.node_order;
    if (a.node_type === "break" && b.node_type !== "break") return 1;
    if (b.node_type === "break" && a.node_type !== "break") return -1;
    return 0;
  });

  // Account for any preserved (already-completed) nodes when assigning order numbers
  const baseOrder = (opts.preserveBefore?.length ?? 0) + 1;
  nodes.forEach((n, i) => { n.node_order = baseOrder + i; });

  // 6) Set unlocks chain. First new node unlocked if there are no preserved nodes,
  // otherwise it unlocks after the last preserved one.
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) {
      const hasPreserved = (opts.preserveBefore?.length ?? 0) > 0;
      // Always start the new chain unlocked — students need access to today's session
      nodes[i].status = "unlocked";
      nodes[i].unlocks_after_order = hasPreserved ? opts.preserveBefore![opts.preserveBefore!.length - 1].node_order : undefined;
    } else {
      nodes[i].unlocks_after_order = nodes[i - 1].node_order;
    }
  }

  // Weak topic shortcut: also unlock the FIRST learn node for each weak topic immediately
  if (weakTopics.length > 0) {
    const weakSet = new Set(weakTopics.map(w => w.topic_name.toLowerCase()));
    const seenWeak = new Set<string>();
    for (const n of nodes) {
      if (n.node_type === "learn" && n.topic_name && weakSet.has(n.topic_name.toLowerCase()) && !seenWeak.has(n.topic_name.toLowerCase())) {
        n.status = "unlocked";
        seenWeak.add(n.topic_name.toLowerCase());
      }
    }
  }

  return nodes;
}

/**
 * Persist a node plan. Preserves completed nodes; only wipes locked/unlocked/in_progress.
 */
export async function persistNodePlan(userId: string, plan: PlanNode[]): Promise<{ inserted: number }> {
  // Wipe only nodes that are not yet complete (preserve history)
  await supabase
    .from("roadmap_nodes")
    .delete()
    .eq("user_id", userId)
    .in("status", ["locked", "unlocked", "in_progress", "skipped"]);

  // Assign each node's id client-side so unlocks_after/source refs can be resolved
  // in memory before insert — a plan can easily run to hundreds of nodes, and
  // resolving these refs with one UPDATE per node after insert (the previous
  // approach) turned every regeneration into hundreds of sequential network
  // round-trips, which is what made the "Build roadmap" button hang for minutes.
  const orderToId = new Map<number, string>();
  for (const p of plan) orderToId.set(p.node_order, crypto.randomUUID());

  const insertRows = plan.map(p => ({
    id: orderToId.get(p.node_order),
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
    unlocks_after_node_id: p.unlocks_after_order != null ? (orderToId.get(p.unlocks_after_order) ?? null) : null,
    source_node_id: p.source_node_order != null ? (orderToId.get(p.source_node_order) ?? null) : null,
  }));

  let inserted = 0;
  for (let i = 0; i < insertRows.length; i += 200) {
    const chunk = insertRows.slice(i, i + 200);
    const { error } = await supabase.from("roadmap_nodes").insert(chunk);
    if (error) throw error;
    inserted += chunk.length;
  }

  return { inserted };
}

/**
 * Top-level: pull user's units + profile + weak topics, then build & persist the plan.
 */
/**
 * Overlay real exam dates from the `exams` table onto a unit list.
 *
 * Real dates live in `exams` (subject + unit_numbers[] + exam_date), NOT in
 * `user_subjects` (which only holds the onboarding sentinel ~1yr out). Without
 * this overlay every unit ties on the placeholder date and BOTH roadmap engines
 * default to the lowest unit number — which is exactly the "studies Unit 1/4 when
 * the next exam is Unit 6 tomorrow" bug. Used by both the node planner AND the
 * session planner so the dashboard and the roadmap page stay consistent.
 */
export async function overlayExamDates<T extends { subject: string; unit_number: number; exam_date: string }>(
  userId: string,
  units: T[],
): Promise<T[]> {
  const todayIso = getLocalDateString();
  const { data: examRows } = await supabase
    .from("exams")
    .select("subject, unit_numbers, exam_date, is_active")
    .eq("user_id", userId);
  const activeExams = ((examRows ?? []) as any[]).filter(
    (e) => e.is_active !== false && e.subject && Array.isArray(e.unit_numbers) && daysBetweenLocal(todayIso, e.exam_date) > 0,
  );
  if (activeExams.length === 0) return units;
  return units.map((u) => {
    const matches = activeExams.filter(
      (e) => e.subject === u.subject && e.unit_numbers.map(Number).includes(Number(u.unit_number)),
    );
    if (matches.length === 0) return u;
    const soonest = matches.reduce((a, b) => (a.exam_date <= b.exam_date ? a : b));
    return { ...u, exam_date: soonest.exam_date };
  });
}

export async function generateRoadmapForUser(userId: string, opts: BuildOpts = {}) {
  const [{ data: subjectsRows, error: e1 }, { data: profile }, { data: weak }, { data: completed }] = await Promise.all([
    supabase.from("user_subjects").select("subject, unit_number, unit_name, exam_date, target_grade, current_grade, paper_duration_minutes").eq("user_id", userId),
    supabase.from("profiles").select("hours_per_day, rest_days, exam_board").eq("id", userId).single(),
    supabase.from("topic_progress").select("subject, unit_number, topic_name, last_score_percent").eq("user_id", userId).eq("weak_flag", true),
    supabase.from("roadmap_nodes").select("*").eq("user_id", userId).eq("status", "complete").order("node_order"),
  ]);
  if (e1) throw e1;
  if (!subjectsRows || subjectsRows.length === 0) return { inserted: 0 };

  const units = await overlayExamDates(userId, subjectsRows as UnitInput[]);

  const hoursPerDay = (profile as any)?.hours_per_day ?? 2;
  const restDays = ((profile as any)?.rest_days ?? []) as number[];
  const board: "edexcel-ial" | "cie" = (profile as any)?.exam_board === "cie" ? "cie" : "edexcel-ial";
  const preserveBefore = (completed ?? []).map((c: any) => ({ ...c })) as PlanNode[];

  const plan = buildNodePlan(userId, units, {
    hoursPerDay,
    restDays,
    weakTopics: (weak ?? []) as WeakTopic[],
    preserveBefore,
    board,
    ...opts,
  });
  return persistNodePlan(userId, plan);
}
