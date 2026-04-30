// Centralised urgency calculation — used by Dashboard.
// Formula:
//   grade_gap     = target_grade_index - current_grade_index  (A*=4 .. D=0)
//   time_pressure = max(0, (90 - days_to_nearest_exam) / 90 * 60)
//   grade_pressure = grade_gap * 10
//   urgency_score = min(100, round(time_pressure + grade_pressure))

export type Grade = "A*" | "A" | "B" | "C" | "D" | "E" | string;

const GRADE_INDEX: Record<string, number> = {
  "A*": 4, "A": 3, "B": 2, "C": 1, "D": 0, "E": 0,
};

export interface UrgencyUnit {
  exam_date: string;          // ISO yyyy-mm-dd or full ISO
  target_grade?: Grade | null;
  current_grade?: Grade | null;
}

const daysUntil = (iso: string): number => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 365;
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(d); end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
};

export interface UrgencyResult {
  score: number;
  daysToNearest: number;
  gradeGap: number;
  level: "calm" | "building" | "approaching" | "high" | "critical";
  message: string;
  colorVar: string; // CSS var
}

const LEVEL_FROM_SCORE = (s: number): UrgencyResult["level"] => {
  if (s <= 20) return "calm";
  if (s <= 40) return "building";
  if (s <= 60) return "approaching";
  if (s <= 80) return "high";
  return "critical";
};

const MESSAGES: Record<UrgencyResult["level"], string> = {
  calm: "You have time. Stay consistent.",
  building: "Building pressure. Don't fall behind.",
  approaching: "Exams approaching. Follow the plan.",
  high: "High urgency. Every session counts.",
  critical: "Critical. No sessions to waste.",
};

// Map to existing semantic tokens so all themes work.
const colorForScore = (s: number): string => {
  if (s <= 40) return "hsl(var(--success))";
  if (s <= 70) return "hsl(var(--accent))";
  return "hsl(var(--urgent))";
};

export function computeUrgency(units: UrgencyUnit[]): UrgencyResult {
  if (!units || units.length === 0) {
    return {
      score: 0, daysToNearest: 365, gradeGap: 0,
      level: "calm", message: MESSAGES.calm, colorVar: colorForScore(0),
    };
  }

  const days = Math.min(...units.map(u => daysUntil(u.exam_date)));

  // Use the unit with the nearest exam to derive the gap (most relevant target).
  const nearest = units.reduce((a, b) =>
    daysUntil(a.exam_date) <= daysUntil(b.exam_date) ? a : b
  );
  const target = GRADE_INDEX[nearest.target_grade ?? ""] ?? 0;
  const current = GRADE_INDEX[nearest.current_grade ?? ""] ?? 0;
  const gradeGap = Math.max(0, target - current);

  const timePressure = Math.max(0, ((90 - days) / 90) * 60);
  const gradePressure = gradeGap * 10;
  const score = Math.min(100, Math.round(timePressure + gradePressure));
  const level = LEVEL_FROM_SCORE(score);

  return {
    score, daysToNearest: days, gradeGap,
    level, message: MESSAGES[level], colorVar: colorForScore(score),
  };
}
