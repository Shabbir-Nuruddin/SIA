// Leitner-style spaced repetition.
// Box 1 → 10 min,  Box 2 → 1 day,  Box 3 → 3 days,
// Box 4 → 7 days, Box 5 → 21 days. Wrong answer drops to Box 1.

export const BOX_INTERVALS_MIN: Record<number, number> = {
  1: 10,
  2: 60 * 24,
  3: 60 * 24 * 3,
  4: 60 * 24 * 7,
  5: 60 * 24 * 21,
};

export const BOX_LABEL: Record<number, string> = {
  1: "New",
  2: "Tomorrow",
  3: "3 days",
  4: "1 week",
  5: "3 weeks",
};

export type ReviewOutcome = "correct" | "wrong";

export function nextSchedule(currentBox: number, outcome: ReviewOutcome): { box: number; dueAt: Date } {
  const nextBox = outcome === "correct" ? Math.min(5, Math.max(1, currentBox) + 1) : 1;
  const mins = BOX_INTERVALS_MIN[nextBox] ?? 10;
  return { box: nextBox, dueAt: new Date(Date.now() + mins * 60_000) };
}

// Stable card key so the same flashcard from cached notes maps to one row per user.
export function makeCardKey(parts: {
  source: string;
  subject?: string | null;
  unit_number?: number | null;
  topic?: string | null;
  question: string;
}): string {
  const norm = (s: string | null | undefined) =>
    (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  return [
    parts.source,
    norm(parts.subject),
    parts.unit_number ?? "",
    norm(parts.topic),
    norm(parts.question).slice(0, 160),
  ].join("|");
}

export function isDue(dueAt: string | Date | null | undefined): boolean {
  if (!dueAt) return true;
  const d = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  return d.getTime() <= Date.now();
}
