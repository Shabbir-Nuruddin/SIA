// Persist a generated roadmap into the roadmap_sessions table.
// Uses the existing buildRoadmap algorithm, then writes one row per session.

import { supabase } from "@/integrations/supabase/client";
import { buildRoadmap, UserUnitRow, StudyBlock } from "./roadmap";
import { SUBJECTS } from "./subjects";

function methodFor(block: StudyBlock): string {
  switch (block.type) {
    case "learn": return "active_recall";
    case "recall": return "spaced_repetition";
    case "interleave": return "interleaved_practice";
    case "mock": return "mock_conditions";
    case "review": return "review";
    default: return "rest";
  }
}

function timeAdd(start: string, minutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export async function generateAndPersistRoadmap(
  userId: string,
  units: UserUnitRow[],
  opts: { weeklyMinutes?: number; studyStartTime?: string } = {}
) {
  const startTime = opts.studyStartTime || "16:00";
  const roadmap = buildRoadmap(units, { weeklyMinutes: opts.weeklyMinutes });

  // Wipe existing future sessions (don't touch completed history)
  const { getLocalDateString } = await import("./dateLocal");
  const today = getLocalDateString();
  await supabase
    .from("roadmap_sessions")
    .delete()
    .eq("user_id", userId)
    .gte("session_date", today);

  const rows: any[] = [];
  for (const day of roadmap.days) {
    let cursor = startTime;
    let order = 0;
    for (const block of day.blocks) {
      if (block.type === "rest") continue;
      const minutes = block.pomodoros * 25;
      const subjectMeta = block.subject ? SUBJECTS[block.subject] : null;
      const unitName = subjectMeta?.units.find(u => u.number === block.unit_number)?.name;
      rows.push({
        user_id: userId,
        session_date: day.date,
        subject: block.subject || null,
        unit_number: block.unit_number || null,
        topic_name: block.topic || (block.type === "interleave" ? "Mixed recall" : block.type === "mock" ? `${unitName ?? "Unit"} mock` : null),
        method: methodFor(block),
        start_time: cursor + ":00",
        duration_minutes: minutes,
        status: "pending",
        why_now_text: block.rationale,
        order_index: order++,
      });
      // Advance cursor by minutes + 5 min break
      cursor = timeAdd(cursor, minutes + 5);
    }
  }

  if (rows.length === 0) return { inserted: 0 };

  // Insert in chunks of 200
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    const { error } = await supabase.from("roadmap_sessions").insert(chunk);
    if (error) throw error;
  }
  return { inserted: rows.length };
}
