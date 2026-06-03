import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";

/** Look up the unit number that contains a given topic name (Edexcel IAL catalogue). */
export function findUnitForTopic(subject: SubjectCode, topic: string): number | null {
  const meta = SUBJECTS[subject];
  if (!meta?.units) return null;
  const u = meta.units.find((u) => u.topics.includes(topic));
  return u?.number ?? null;
}

/**
 * Upsert a topic_progress row by incrementing attempted/correct counts and
 * refreshing last_score_percent + weak_flag. Uses a read-then-write pattern
 * because the table has no natural unique index.
 */
export async function recordTopicResult(opts: {
  user_id: string;
  subject: string;
  topic: string;
  unit_number?: number | null;
  awarded: number;
  total: number;
}) {
  const { user_id, subject, topic, unit_number, awarded, total } = opts;
  if (!topic || !subject || total <= 0) return;
  const pct = Math.round((Math.max(0, awarded) / total) * 100);
  // Treat a question as "correct" when it scored at least 50% — keeps the
  // attempted/correct ratio meaningful for multi-mark questions.
  const correctDelta = pct >= 50 ? 1 : 0;

  const { data: existing } = await supabase
    .from("topic_progress")
    .select("id,questions_attempted,questions_correct")
    .eq("user_id", user_id)
    .eq("subject", subject)
    .eq("topic_name", topic)
    .maybeSingle();

  if (existing) {
    const attempted = (existing.questions_attempted || 0) + 1;
    const correct = (existing.questions_correct || 0) + correctDelta;
    const mastery = attempted > 0 ? Math.round((correct / attempted) * 100) : pct;
    await supabase
      .from("topic_progress")
      .update({
        questions_attempted: attempted,
        questions_correct: correct,
        last_score_percent: pct,
        weak_flag: attempted >= 3 && mastery < 60,
        unit_number: unit_number ?? null,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("topic_progress").insert({
      user_id,
      subject,
      topic_name: topic,
      unit_number: unit_number ?? null,
      questions_attempted: 1,
      questions_correct: correctDelta,
      last_score_percent: pct,
      weak_flag: false,
    });
  }
}

/**
 * Bump the daily study streak: +1 if the last study day was yesterday, reset to 1
 * if there was a gap, no-op if already counted today. Drives `current_streak` on
 * the profile (shown in the sidebar/dashboard/parent view). Never throws.
 */
export async function bumpDailyStreak(user_id: string) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const { data: p } = await supabase
      .from("profiles")
      .select("current_streak,last_session_date")
      .eq("id", user_id)
      .maybeSingle();
    if (!p) return;
    if ((p as any).last_session_date === today) return; // already counted today
    const next = (p as any).last_session_date === yesterday ? ((p as any).current_streak || 0) + 1 : 1;
    await supabase.from("profiles").update({ current_streak: next, last_session_date: today }).eq("id", user_id);
  } catch { /* streak is best-effort */ }
}

/** Insert a study_sessions row. Silently ignores sub-minute sessions. */
export async function logStudySession(opts: {
  user_id: string;
  subject?: string | null;
  topic?: string | null;
  unit_number?: number | null;
  minutes: number;
}) {
  const minutes = Math.round(opts.minutes);
  if (minutes < 1) return;
  await supabase.from("study_sessions").insert({
    user_id: opts.user_id,
    subject: (opts.subject as any) || null,
    topic: opts.topic || null,
    unit_number: opts.unit_number ?? null,
    duration_minutes: minutes,
  });
  // Studying today counts toward the streak.
  await bumpDailyStreak(opts.user_id);
}

/**
 * Hook that tracks active time on a page and flushes a study_sessions row
 * when the user leaves (unmount, tab hidden, beforeunload) or every 10 minutes.
 * Time only accumulates while the tab is visible.
 */
export function usePageTimeTracker(opts: {
  user_id: string | undefined;
  enabled?: boolean;
  subject?: string | null;
  topic?: string | null;
  unit_number?: number | null;
}) {
  const { user_id, enabled = true } = opts;
  const accumulatedRef = useRef(0); // seconds
  const lastTickRef = useRef<number | null>(null);
  const metaRef = useRef(opts);
  metaRef.current = opts;

  useEffect(() => {
    if (!user_id || !enabled) return;

    const startTick = () => {
      if (document.hidden) return;
      lastTickRef.current = Date.now();
    };
    const stopTick = () => {
      if (lastTickRef.current != null) {
        accumulatedRef.current += (Date.now() - lastTickRef.current) / 1000;
        lastTickRef.current = null;
      }
    };
    const flush = (sync = false) => {
      stopTick();
      const minutes = accumulatedRef.current / 60;
      if (minutes < 1) {
        startTick();
        return;
      }
      const m = metaRef.current;
      accumulatedRef.current = 0;
      // Fire-and-forget; ok if it loses a row on hard close.
      logStudySession({
        user_id,
        subject: m.subject,
        topic: m.topic,
        unit_number: m.unit_number,
        minutes,
      }).catch(() => {});
      if (!sync) startTick();
    };

    startTick();
    const onVis = () => (document.hidden ? stopTick() : startTick());
    const onBeforeUnload = () => flush(true);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", onBeforeUnload);
    const interval = window.setInterval(() => flush(false), 10 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.clearInterval(interval);
      flush(true);
    };
  }, [user_id, enabled]);
}
