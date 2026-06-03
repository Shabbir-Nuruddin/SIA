// Shared question/mock reuse pool. Saves AI credits by reusing previously
// generated sets across users, while guaranteeing the SAME user never sees the
// same set twice. ~1 in 3 requests still generates fresh so the pool keeps
// growing and repeat users get variety.
//
// Every function here is DEFENSIVE: any error (e.g. the tables not existing yet
// because the migration hasn't been applied) is swallowed and treated as "no
// cache", so generation always still works.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

let admin: ReturnType<typeof createClient> | null = null;
function getAdmin() {
  if (admin) return admin;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  admin = createClient(url, key);
  return admin;
}

// Fraction of requests that bypass the cache and force a fresh generation, so a
// topic's pool keeps growing and a returning user (or different users) get new
// variants rather than always recycling the first set ever made.
const REGEN_PROB = 1 / 3;

export interface BankKey {
  kind: "topical" | "mock";
  board: string;
  subject: string;
  signature: string; // normalised description of the request (topic/difficulty/etc.)
  userId: string;
}

/**
 * Try to serve a cached set the user has NOT seen before. Returns the stored
 * payload, or null to mean "generate fresh". Never throws.
 */
export async function getCachedSet(key: BankKey): Promise<any | null> {
  try {
    if (Math.random() < REGEN_PROB) return null; // keep the pool fresh
    const c = getAdmin();
    if (!c) return null;
    const { data: rows } = await c
      .from("question_bank")
      .select("id,payload")
      .eq("kind", key.kind)
      .eq("board", key.board)
      .eq("subject", key.subject)
      .eq("signature", key.signature)
      .order("created_at", { ascending: false })
      .limit(40);
    if (!rows?.length) return null;
    const ids = rows.map((r: any) => r.id);
    const { data: seen } = await c
      .from("user_seen_bank")
      .select("bank_id")
      .eq("user_id", key.userId)
      .in("bank_id", ids);
    const seenSet = new Set((seen || []).map((s: any) => s.bank_id));
    const unseen = rows.filter((r: any) => !seenSet.has(r.id));
    if (!unseen.length) return null; // user has seen them all → generate fresh
    const pick = unseen[Math.floor(Math.random() * unseen.length)];
    await c.from("user_seen_bank").insert({ user_id: key.userId, bank_id: pick.id });
    return pick.payload;
  } catch {
    return null;
  }
}

/**
 * Save a freshly generated set into the shared pool and mark it seen for this
 * user, so they won't get it again. Never throws.
 */
export async function saveSet(key: BankKey, payload: any): Promise<void> {
  try {
    const c = getAdmin();
    if (!c) return;
    const { data: ins } = await c
      .from("question_bank")
      .insert({ kind: key.kind, board: key.board, subject: key.subject, signature: key.signature, payload })
      .select("id")
      .single();
    if (ins?.id) await c.from("user_seen_bank").insert({ user_id: key.userId, bank_id: ins.id });
  } catch {
    /* ignore — caching is best-effort */
  }
}
