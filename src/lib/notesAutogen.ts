// Notes Auto-Generator — enumeration + progress helpers.
//
// The admin panel sweeps every topic on the selected Edexcel boards and asks the
// existing `ai-notes` edge function to generate + cache each one. Because
// `ai-notes` writes to the SHARED `cached_topic_notes` table, a topic generated
// once here is instantly available to every student (no per-student regeneration).
//
// "Done" is read straight from `cached_topic_notes` (a row exists ⇒ generated),
// so the run is fully resumable: close the tab, reopen, it picks up where it left
// off. Nothing here touches the AI key rotation — that stays automatic in
// supabase/functions/_shared/ai.ts.

import { supabase } from "@/integrations/supabase/client";
import { getSubjectsForBoard, SubjectCode, BOARD_LABEL } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";

// Every board/subject the auto-generator CAN sweep. The admin picks a subset of
// these in the panel; the chosen set is saved to notes_autogen_control so both the
// panel and the headless script sweep exactly what was selected.
export const AUTOGEN_ALL_BOARDS = ["edexcel-igcse", "edexcel-ial", "cie-igcse", "cie"] as const;
export const AUTOGEN_SUBJECTS = ["mathematics", "biology", "chemistry", "physics"] as const;

// Default selection when nothing is saved yet — keeps the original behaviour
// (Edexcel IGCSE + IAL, all subjects).
export const AUTOGEN_BOARDS = ["edexcel-igcse", "edexcel-ial"] as const;
export type AutogenBoard = (typeof AUTOGEN_ALL_BOARDS)[number];

export const SUBJECT_LABEL: Record<string, string> = {
  mathematics: "Mathematics", biology: "Biology", chemistry: "Chemistry", physics: "Physics",
};
export const subjectLabel = (s: string) => SUBJECT_LABEL[s] ?? s;

export interface NotesJob {
  board: AutogenBoard;
  subject: SubjectCode;
  subjectName: string;
  unit_number: number;
  unit_name: string;
  unit_code: string;
  topic: string;
}

export const jobKey = (j: { board: string; subject: string; unit_number: number; topic: string }) =>
  `${j.board}::${j.subject}::${j.unit_number}::${j.topic}`;

/**
 * Enumerate every (board, subject, unit, topic) for the selected boards/subjects.
 * `subjects` (optional) restricts to those subject codes; omit it to sweep all.
 */
export function buildAllJobs(
  boards: readonly string[] = AUTOGEN_BOARDS,
  subjects?: readonly string[],
): NotesJob[] {
  const subjectFilter = subjects && subjects.length ? new Set(subjects) : null;
  const jobs: NotesJob[] = [];
  for (const board of boards) {
    const boardSubjects = getSubjectsForBoard(board);
    for (const [code, meta] of Object.entries(boardSubjects)) {
      if (subjectFilter && !subjectFilter.has(code)) continue;
      for (const unit of meta.units ?? []) {
        for (const topic of unit.topics ?? []) {
          jobs.push({
            board: board as AutogenBoard,
            subject: code as SubjectCode,
            subjectName: meta.name,
            unit_number: unit.number,
            unit_name: unit.name,
            unit_code: unit.unitCode ?? `U${unit.number}`,
            topic,
          });
        }
      }
    }
  }
  return jobs;
}

/** Pull the set of already-cached topic keys (board::subject::unit::topic). */
export async function fetchDoneKeys(boards: readonly string[] = AUTOGEN_BOARDS): Promise<Set<string>> {
  const done = new Set<string>();
  // Page through the shared cache so we don't hit the default 1000-row cap.
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("cached_topic_notes")
      .select("board,subject,unit_number,topic")
      .in("board", boards as string[])
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    for (const r of data as any[]) done.add(jobKey(r));
    if (data.length < pageSize) break;
  }
  return done;
}

export interface AutogenControl {
  enabled: boolean;
  boards: string[];
  subjects: string[];
  last_topic: string | null;
  updated_at: string | null;
}

export async function getControl(): Promise<AutogenControl> {
  // notes_autogen_control is a new table not yet in the generated types — cast.
  // The `subjects` column is added by a later migration; if the backend hasn't
  // applied it yet (frontend deploys before DB migrations), fall back gracefully.
  const sb = supabase as any;
  let res = await sb
    .from("notes_autogen_control")
    .select("enabled,boards,subjects,last_topic,updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (res.error) {
    res = await sb
      .from("notes_autogen_control")
      .select("enabled,boards,last_topic,updated_at")
      .eq("id", 1)
      .maybeSingle();
  }
  const data = res.data;
  return {
    enabled: !!data?.enabled,
    boards: (data?.boards as string[]) ?? [...AUTOGEN_BOARDS],
    subjects: (data?.subjects as string[]) ?? [...AUTOGEN_SUBJECTS],
    last_topic: (data?.last_topic as string) ?? null,
    updated_at: (data?.updated_at as string) ?? null,
  };
}

export async function setControl(
  patch: { enabled?: boolean; last_topic?: string | null; boards?: string[]; subjects?: string[] },
): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  const sb = supabase as any;
  const row = { ...patch, updated_by: userId, updated_at: new Date().toISOString() };
  const { error } = await sb.from("notes_autogen_control").update(row).eq("id", 1);
  // If the `subjects` column isn't there yet, retry without it so the switch and
  // board selection still save on a not-yet-migrated backend.
  if (error && "subjects" in row) {
    const { subjects, ...rest } = row;
    await sb.from("notes_autogen_control").update(rest).eq("id", 1);
  }
}

/** Build the body `ai-notes` expects for one topic (mirrors Notes.tsx). */
export function buildNotesRequest(job: NotesJob) {
  let syllabus_context: string | undefined;
  if (job.subject === "chemistry") {
    const t = findChemistryTopic(job.topic);
    if (t) syllabus_context = t.statements.map((s: any) => `${s.ref} ${s.text}`).join("\n");
  }
  // IGCSE Edexcel maths needs the named syllabus block sent as unit_code (see
  // igcseEdexcelMathsBlock). Every other board/subject uses its real unit code.
  const unit_code = (job.board === "edexcel-igcse" && job.subject === "mathematics")
    ? igcseEdexcelMathsBlock(job.unit_number)
    : job.unit_code;

  return {
    subject: job.subject,
    unit_number: job.unit_number,
    unit_name: job.unit_name,
    unit_code,
    topic: job.topic,
    syllabus_context,
    board: job.board,
    level: job.unit_number >= 4 ? "A2-Level (IA2)" : "AS-Level (IAS)",
    trigger: "initial" as const,
  };
}

/** Generate (and cache) notes for one topic. Returns ok / a classified error. */
export async function generateOne(
  job: NotesJob,
): Promise<{ ok: true } | { ok: false; quota: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("ai-notes", { body: buildNotesRequest(job) });
    let detail = "";
    if (error) {
      detail = error.message || "Notes service unavailable";
      const context = (error as any).context;
      if (context && typeof context.json === "function") {
        try {
          const b = await context.json();
          detail = b?.error || b?.message || detail;
        } catch { /* keep client error */ }
      }
    } else if (!data || (data as any).error) {
      detail = (data as any)?.error || "Notes service returned no data";
    }
    if (detail) {
      const quota = /exhaust|quota|rate.?limit|429|resource.?exhausted|all gemini keys/i.test(detail);
      return { ok: false, quota, message: detail };
    }
    return { ok: true };
  } catch (e: any) {
    const message = e?.message || "Unknown error";
    const quota = /exhaust|quota|rate.?limit|429|resource.?exhausted/i.test(message);
    return { ok: false, quota, message };
  }
}

export const boardLabel = (b: string) => BOARD_LABEL[b as keyof typeof BOARD_LABEL] ?? b;

/**
 * IGCSE Edexcel maths is stored in the edge syllabus as four named blocks
 * (number / algebra / geometry / statistics) rather than per-unit topic keys.
 * The app's 6 top-level maths topics map onto those blocks like this (Mensuration
 * and Trigonometry both live inside the geometry "Shape, Space & Measures" block).
 * Sending the block name as `unit_code` makes the deployed `ai-notes` function
 * resolve the right syllabus — without it, every maths topic 500s with
 * "No syllabus data found for maths > tN". The per-topic prompt still scopes
 * generation to the exact subtopic, so notes stay specific.
 */
export function igcseEdexcelMathsBlock(unit_number: number): string {
  const map: Record<string, string> = {
    "1": "number", "2": "algebra", "3": "geometry",
    "4": "geometry", "5": "geometry", "6": "statistics",
  };
  return map[String(unit_number)] || "number";
}
