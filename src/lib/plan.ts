import { supabase } from "@/integrations/supabase/client";

export type Plan = "free" | "pro" | "advanced";

export type LimitKey =
  | "tutor_messages"      // lifetime
  | "questions_per_day"   // resets daily
  | "notes_per_week"      // resets weekly (rolling 7 days)
  | "mock_papers"         // pro-only
  | "subjects"            // free=1
  | "photo_upload";       // pro-only

// Real free-tier limits (used once Paddle is live).
export const LIMITS: Record<Plan, Record<LimitKey, number>> = {
  free: {
    tutor_messages: 5,        // 5 total messages on free plan
    questions_per_day: 10,
    notes_per_week: Infinity,
    mock_papers: 0,           // Pro-only (1/week tracked client-side too)
    subjects: 1,
    photo_upload: 0,          // Pro-only
  },
  pro: {
    tutor_messages: Infinity,
    questions_per_day: Infinity,
    notes_per_week: Infinity,
    mock_papers: Infinity,
    subjects: Infinity,
    photo_upload: Infinity,
  },
  advanced: {
    tutor_messages: Infinity,
    questions_per_day: Infinity,
    notes_per_week: Infinity,
    mock_papers: Infinity,
    subjects: Infinity,
    photo_upload: Infinity,
  },
};

export const LIMIT_LABELS: Record<LimitKey, string> = {
  tutor_messages: "AI tutor messages",
  questions_per_day: "practice questions today",
  notes_per_week: "topic notes this week",
  mock_papers: "mock papers",
  subjects: "subjects",
  photo_upload: "photo uploads",
};

export interface PlanState {
  plan: Plan;
  tutor_message_count: number;
  questions_today_count: number;
  questions_today_reset_at: string;
  notes_week_count: number;
  notes_week_reset_at: string;
}

/** Fetch current plan + usage, auto-rolling daily/weekly counters if stale. */
export async function getPlanState(): Promise<PlanState | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("plan,tutor_message_count,questions_today_count,questions_today_reset_at,notes_week_count,notes_week_reset_at")
    .eq("id", user.id)
    .single();
  if (error || !data) return null;

  const today = new Date().toISOString().slice(0, 10);
  const updates: Record<string, unknown> = {};

  if (data.questions_today_reset_at !== today) {
    updates.questions_today_count = 0;
    updates.questions_today_reset_at = today;
    data.questions_today_count = 0;
    data.questions_today_reset_at = today;
  }
  // Weekly rolling: reset if last reset was 7+ days ago
  const lastNotesReset = new Date(data.notes_week_reset_at);
  const daysSince = Math.floor((Date.now() - lastNotesReset.getTime()) / 86400000);
  if (daysSince >= 7) {
    updates.notes_week_count = 0;
    updates.notes_week_reset_at = today;
    data.notes_week_count = 0;
    data.notes_week_reset_at = today;
  }
  if (Object.keys(updates).length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from("profiles").update(updates as any).eq("id", user.id);
  }

  // Cross-reference is_pro / trial fields — paying or trialling users count as Pro.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: extra } = await supabase
      .from("profiles")
      .select("is_pro,trial_start_date,is_admin")
      .eq("id", user.id)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const x: any = extra;
    if (x?.is_pro || x?.is_admin) (data as PlanState).plan = "pro";
    else if (x?.trial_start_date) {
      const started = new Date(x.trial_start_date).getTime();
      const days = (Date.now() - started) / 86400000;
      if (days < 3) (data as PlanState).plan = "pro";
    }
  } catch { /* ignore */ }

  return data as PlanState;
}

export interface CheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  plan: Plan;
  warnSoft: boolean;   // at >=80%
}

function usedFor(state: PlanState, key: LimitKey, currentSubjectsCount?: number): number {
  switch (key) {
    case "tutor_messages": return state.tutor_message_count ?? 0;
    case "questions_per_day": return state.questions_today_count ?? 0;
    case "notes_per_week": return state.notes_week_count ?? 0;
    case "subjects": return currentSubjectsCount ?? 0;
    case "mock_papers":
    case "photo_upload":
      return 0; // gating only — block any attempt on free
    default: return 0;
  }
}

export function evaluateLimit(state: PlanState, key: LimitKey, currentSubjectsCount?: number): CheckResult {
  // Pricing is disabled — every feature is unlimited for everyone. Always allow,
  // never warn. (Logic kept below in comments-equivalent form for easy re-enable.)
  const used = usedFor(state, key, currentSubjectsCount);
  return { allowed: true, remaining: Infinity, limit: Infinity, used, plan: state.plan, warnSoft: false };
}

/** Atomic-ish increment of a counter on profiles after a successful action. */
export async function incrementUsage(key: Exclude<LimitKey, "mock_papers" | "subjects" | "photo_upload">) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const column =
    key === "tutor_messages" ? "tutor_message_count" :
    key === "questions_per_day" ? "questions_today_count" :
    "notes_week_count";
  const { data } = await supabase.from("profiles").select(column).eq("id", user.id).single();
  const current = (data as Record<string, number> | null)?.[column] ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await supabase.from("profiles").update({ [column]: current + 1 } as any).eq("id", user.id);
}
