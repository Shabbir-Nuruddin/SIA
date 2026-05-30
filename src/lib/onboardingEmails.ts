import { supabase } from "@/integrations/supabase/client";

const DAY_MS = 24 * 60 * 60 * 1000;
const OFFSETS_MS = [0, 2 * DAY_MS, 4 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS];

/**
 * Schedules the 5-email onboarding sequence for a new user and triggers
 * email #1 immediately. Safe to call multiple times — unique(user_id,email_number)
 * prevents duplicates.
 */
export async function scheduleOnboardingEmails(args: {
  userId: string;
  email: string;
  firstName?: string | null;
}) {
  const now = Date.now();
  const rows = OFFSETS_MS.map((off, i) => ({
    user_id: args.userId,
    email: args.email,
    first_name: args.firstName ?? null,
    email_number: i + 1,
    scheduled_for: new Date(now + off).toISOString(),
    status: "pending" as const,
  }));

  const { data, error } = await supabase
    .from("onboarding_emails")
    .insert(rows)
    .select("id,email_number");

  if (error) {
    // likely a duplicate (re-signup) — silent
    if (!/duplicate|unique/i.test(error.message)) {
      console.error("scheduleOnboardingEmails:", error);
    }
    return;
  }

  const firstId = data?.find((r) => r.email_number === 1)?.id;
  if (firstId) {
    void supabase.functions.invoke("send-onboarding-email", {
      body: { id: firstId },
    });
  }
}
