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

// Boards the auto-generator sweeps. User asked for "Edexcel board for IGCSE and
// A levels": edexcel-igcse (IGCSE) + edexcel-ial (International A Level).
export const AUTOGEN_BOARDS = ["edexcel-igcse", "edexcel-ial"] as const;
export type AutogenBoard = (typeof AUTOGEN_BOARDS)[number];

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

/** Enumerate every (board, subject, unit, topic) on the Edexcel IGCSE + IAL specs. */
export function buildAllJobs(boards: readonly string[] = AUTOGEN_BOARDS): NotesJob[] {
  const jobs: NotesJob[] = [];
  for (const board of boards) {
    const subjects = getSubjectsForBoard(board);
    for (const [code, meta] of Object.entries(subjects)) {
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
  last_topic: string | null;
  updated_at: string | null;
}

export async function getControl(): Promise<AutogenControl> {
  // notes_autogen_control is a new table not yet in the generated types — cast.
  const { data } = await (supabase as any)
    .from("notes_autogen_control")
    .select("enabled,boards,last_topic,updated_at")
    .eq("id", 1)
    .maybeSingle();
  return {
    enabled: !!data?.enabled,
    boards: (data?.boards as string[]) ?? [...AUTOGEN_BOARDS],
    last_topic: (data?.last_topic as string) ?? null,
    updated_at: (data?.updated_at as string) ?? null,
  };
}

export async function setControl(patch: { enabled?: boolean; last_topic?: string | null }): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  await (supabase as any)
    .from("notes_autogen_control")
    .update({ ...patch, updated_by: userId, updated_at: new Date().toISOString() })
    .eq("id", 1);
}

/** Build the body `ai-notes` expects for one topic (mirrors Notes.tsx). */
export function buildNotesRequest(job: NotesJob) {
  let syllabus_context: string | undefined;
  if (job.subject === "chemistry") {
    const t = findChemistryTopic(job.topic);
    if (t) syllabus_context = t.statements.map((s: any) => `${s.ref} ${s.text}`).join("\n");
  }
  return {
    subject: job.subject,
    unit_number: job.unit_number,
    unit_name: job.unit_name,
    unit_code: job.unit_code,
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
