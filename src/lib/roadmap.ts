// Apex Roadmap engine
// Scientific basis:
//  - Spaced repetition: Ebbinghaus forgetting curve, Leitner-style intervals
//  - Interleaving: rotate topics across subjects within a day (Rohrer & Taylor 2007)
//  - Active recall via AI question practice (Karpicke & Roediger 2008)
//  - Pomodoro 25/5 with 15-min long break every 4th cycle
//  - Backwards planning from each unit's exam date
//  - Final 14 days = consolidation + full mock papers only (no new content)

import { SUBJECTS, SubjectCode, gradeGap, Grade } from "./subjects";

export interface UserUnitRow {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;       // ISO yyyy-mm-dd
  target_grade: Grade;
  current_grade: Grade;
}

export type BlockType = "learn" | "recall" | "interleave" | "mock" | "review" | "rest";

export interface StudyBlock {
  id: string;
  type: BlockType;
  subject?: SubjectCode;
  unit_number?: number;
  topic?: string;
  pomodoros: number;       // 25-min units
  rationale: string;       // human-readable why
}

export interface DayPlan {
  date: string;            // ISO date
  dayLabel: string;        // e.g. "Mon 5 May"
  totalMinutes: number;
  phase: "foundation" | "consolidation" | "exam-week";
  blocks: StudyBlock[];
  daysToNearestExam: number;
  nearestExamLabel: string;
}

export interface Roadmap {
  generatedAt: string;
  weeklyMinutes: number;
  daysCovered: number;
  days: DayPlan[];
  // Aggregate stats for the dashboard
  totalPomodoros: number;
  topicCoverage: { topic: string; subject: SubjectCode; unit: number; passes: number }[];
}

const ISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const dayLabel = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// Leitner-style review intervals (days after first learn)
const REVIEW_INTERVALS = [1, 3, 7, 16, 35];

// Pomodoro: 25 min focus, 5 min break, 15 min long break every 4 pomodoros
// 1 pomodoro = 25 minutes of FOCUSED work (we plan in pomodoros, breaks are scheduled by the timer)
export const POMODORO_MIN = 25;

interface PlannedTopic {
  subject: SubjectCode;
  unit: number;
  topic: string;
  examDate: Date;
  daysToExam: number;
  priority: number;            // higher = sooner
  passes: number;              // how many times scheduled
  lastScheduled?: Date;        // for spaced repetition
  nextDue?: Date;
}

function computePriority(t: { daysToExam: number; gap: number; topicsLeft: number }): number {
  // Closer exam → much higher. Bigger grade gap → higher. More topics in unit → higher per-topic urgency.
  const timeWeight = 10000 / Math.max(t.daysToExam, 1);
  const gapWeight = (t.gap + 1) * 25;
  const loadWeight = t.topicsLeft * 2;
  return timeWeight + gapWeight + loadWeight;
}

export function buildRoadmap(
  units: UserUnitRow[],
  opts: { weeklyMinutes?: number; today?: Date } = {}
): Roadmap {
  const today = opts.today ?? new Date();
  today.setHours(0, 0, 0, 0);
  const weeklyMinutes = opts.weeklyMinutes ?? 12 * 60; // default 12h/week ≈ 1h45/day
  const dailyMinutes = Math.round(weeklyMinutes / 7);
  const dailyPomodoros = Math.max(2, Math.round(dailyMinutes / POMODORO_MIN));

  // Build the topic pool
  const topics: PlannedTopic[] = [];
  for (const u of units) {
    const meta = SUBJECTS[u.subject].units.find(x => x.number === u.unit_number);
    if (!meta) continue;
    const examDate = new Date(u.exam_date);
    examDate.setHours(0, 0, 0, 0);
    const daysToExam = Math.max(0, Math.round((+examDate - +today) / 86400000));
    const gap = gradeGap(u.target_grade as Grade, u.current_grade as Grade);
    for (const topic of meta.topics) {
      topics.push({
        subject: u.subject,
        unit: u.unit_number,
        topic,
        examDate,
        daysToExam,
        passes: 0,
        priority: computePriority({ daysToExam, gap, topicsLeft: meta.topics.length }),
      });
    }
  }
  if (topics.length === 0) {
    return { generatedAt: today.toISOString(), weeklyMinutes, daysCovered: 0, days: [], totalPomodoros: 0, topicCoverage: [] };
  }

  // Plan up to 84 days (12 weeks) or until the latest exam, whichever is sooner — capped
  const latestExam = topics.reduce((max, t) => +t.examDate > +max ? t.examDate : max, topics[0].examDate);
  const horizonDays = Math.min(84, Math.max(7, Math.round((+latestExam - +today) / 86400000) + 1));

  const days: DayPlan[] = [];

  for (let i = 0; i < horizonDays; i++) {
    const date = addDays(today, i);
    const isoDate = ISO(date);

    // Find nearest upcoming exam from today
    const upcoming = topics
      .filter(t => +t.examDate >= +date)
      .sort((a, b) => +a.examDate - +b.examDate)[0];
    const daysToNearest = upcoming ? Math.round((+upcoming.examDate - +date) / 86400000) : 999;
    const nearestLabel = upcoming
      ? `${SUBJECTS[upcoming.subject].name} U${upcoming.unit} · ${dayLabel(upcoming.examDate)}`
      : "—";

    // Phase
    const phase: DayPlan["phase"] =
      daysToNearest <= 7 ? "exam-week" : daysToNearest <= 21 ? "consolidation" : "foundation";

    const blocks: StudyBlock[] = [];

    // Sunday → lighter, recall-focused. (getDay: 0 = Sunday)
    const isSunday = date.getDay() === 0;
    const todaysPomodoros = isSunday ? Math.max(2, dailyPomodoros - 2) : dailyPomodoros;

    // EXAM WEEK: only mocks + review for the imminent unit, no new content
    if (phase === "exam-week" && upcoming) {
      blocks.push({
        id: `${isoDate}-mock`,
        type: "mock",
        subject: upcoming.subject,
        unit_number: upcoming.unit,
        pomodoros: Math.max(4, todaysPomodoros - 1),
        rationale: `Final stretch — ${daysToNearest}d to ${SUBJECTS[upcoming.subject].name} U${upcoming.unit}. Sit a timed mock paper to lock in exam stamina.`,
      });
      blocks.push({
        id: `${isoDate}-review`,
        type: "review",
        subject: upcoming.subject,
        unit_number: upcoming.unit,
        pomodoros: 1,
        rationale: "Mark, identify the 1–2 weakest topics, redo only those questions tonight.",
      });
    } else {
      // Build today's slate using two principles:
      //  1) Spaced repetition: any topic whose nextDue ≤ today gets first claim
      //  2) Interleave by SUBJECT — never two consecutive blocks from the same subject if avoidable
      const dueForReview = topics
        .filter(t => t.nextDue && +t.nextDue <= +date && +t.examDate >= +date)
        .sort((a, b) => b.priority - a.priority);

      const fresh = topics
        .filter(t => t.passes === 0 && +t.examDate >= +date)
        .sort((a, b) => b.priority - a.priority);

      const remainingPool: PlannedTopic[] = [...dueForReview, ...fresh];

      let lastSubject: SubjectCode | undefined;
      let usedPomos = 0;
      // Reserve 1 pomodoro on weekdays for an interleaved active-recall mix
      const reserveForRecall = !isSunday && phase !== "exam-week" ? 1 : 0;

      while (usedPomos < todaysPomodoros - reserveForRecall && remainingPool.length > 0) {
        // Find next topic that's not the same subject as last (interleave)
        let idx = remainingPool.findIndex(t => t.subject !== lastSubject);
        if (idx === -1) idx = 0;
        const t = remainingPool.splice(idx, 1)[0];

        const isReview = t.passes > 0;
        // Block size: new content gets 2 pomodoros (50 min deep work), reviews get 1
        const size = isReview ? 1 : 2;
        const pomos = Math.min(size, todaysPomodoros - reserveForRecall - usedPomos);
        if (pomos <= 0) break;

        blocks.push({
          id: `${isoDate}-${t.subject}-${t.unit}-${t.topic}`,
          type: isReview ? "recall" : "learn",
          subject: t.subject,
          unit_number: t.unit,
          topic: t.topic,
          pomodoros: pomos,
          rationale: isReview
            ? `Spaced review (pass ${t.passes + 1}). ${t.daysToExam}d until exam — active recall beats re-reading 3×.`
            : `New ground. ${t.daysToExam}d to exam. Learn → 5 self-test questions → mark.`,
        });

        // Update topic state
        t.passes += 1;
        t.lastScheduled = date;
        const nextInterval = REVIEW_INTERVALS[Math.min(t.passes - 1, REVIEW_INTERVALS.length - 1)];
        t.nextDue = addDays(date, nextInterval);
        // Re-rank priority: practiced topics drop slightly, but exam pressure still drives them
        t.priority = computePriority({
          daysToExam: t.daysToExam,
          gap: 0,
          topicsLeft: 1,
        }) / (t.passes + 1);

        usedPomos += pomos;
        lastSubject = t.subject;
      }

      // Recall block — interleaved AI questions across subjects studied this week
      if (reserveForRecall && blocks.length > 0) {
        blocks.push({
          id: `${isoDate}-interleave`,
          type: "interleave",
          pomodoros: reserveForRecall,
          rationale: "Interleaved recall: 10 mixed AI questions across subjects you've covered this week. Forces retrieval, not recognition.",
        });
      }

      // If literally nothing was due (rare, early in plan) — rest
      if (blocks.length === 0) {
        blocks.push({
          id: `${isoDate}-rest`,
          type: "rest",
          pomodoros: 0,
          rationale: "Rest day. Sleep ≥ 8h — memory consolidation happens in REM sleep.",
        });
      }
    }

    const totalMinutes = blocks.reduce((s, b) => s + b.pomodoros * POMODORO_MIN, 0);

    days.push({
      date: isoDate,
      dayLabel: dayLabel(date),
      totalMinutes,
      phase,
      blocks,
      daysToNearestExam: daysToNearest,
      nearestExamLabel: nearestLabel,
    });
  }

  // Aggregate coverage
  const coverageMap = new Map<string, { topic: string; subject: SubjectCode; unit: number; passes: number }>();
  for (const t of topics) {
    coverageMap.set(`${t.subject}-${t.unit}-${t.topic}`, {
      topic: t.topic, subject: t.subject, unit: t.unit, passes: t.passes,
    });
  }

  const totalPomodoros = days.reduce((s, d) => s + d.blocks.reduce((x, b) => x + b.pomodoros, 0), 0);

  return {
    generatedAt: today.toISOString(),
    weeklyMinutes,
    daysCovered: days.length,
    days,
    totalPomodoros,
    topicCoverage: Array.from(coverageMap.values()).sort((a, b) => a.passes - b.passes),
  };
}
