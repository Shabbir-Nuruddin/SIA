// Global game leaderboards (Study Tycoon "marks" + CPS Test clicks/5s).
// One shared board for everyone, sourced entirely from public.game_scores.
// Each player gets at most one row (highest score per user_id). The display
// name comes from the player's profile — they don't pick it.

import { supabase } from "@/integrations/supabase/client";

export type GameId = "study_tycoon" | "cps_test";

export interface ScoreRow {
  name: string;
  score: number;
  you?: boolean;
}

const PB_KEY = (g: GameId) => `mmr_game_pb_${g}`;

export function getPersonalBest(game: GameId = "study_tycoon"): number {
  try { return parseInt(localStorage.getItem(PB_KEY(game)) || "0", 10) || 0; } catch { return 0; }
}
function setPersonalBest(game: GameId, score: number) {
  try { if (score > getPersonalBest(game)) localStorage.setItem(PB_KEY(game), String(score)); } catch { /* ignore */ }
}

async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id ?? null;
  } catch { return null; }
}

// Pulls the player's display name from their profile — this is the name
// the AI/app uses for them, so it's also the name shown on the leaderboard.
async function getDisplayNameForUser(userId: string): Promise<string> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, first_name, last_name")
      .eq("id", userId)
      .maybeSingle();
    const name = (data?.display_name || data?.first_name ||
      [data?.first_name, data?.last_name].filter(Boolean).join(" ")).trim();
    if (name) return name.slice(0, 24);
  } catch { /* fall through */ }
  return "Player";
}

// Seeded "house" players so the board is never empty. Single-word Arab names.
const SEED_TYCOON: { name: string; score: number }[] = [
  { name: "Hamza", score: 2_480_000 },
  { name: "Mahmood", score: 1_650_000 },
  { name: "Hamdan", score: 940_000 },
  { name: "Yusuf", score: 612_000 },
  { name: "Khalid", score: 388_000 },
  { name: "Omar", score: 245_000 },
  { name: "Faisal", score: 168_000 },
  { name: "Zayd", score: 112_000 },
  { name: "Saif", score: 74_500 },
  { name: "Tariq", score: 48_200 },
  { name: "Bilal", score: 31_900 },
  { name: "Rayan", score: 19_400 },
  { name: "Ammar", score: 12_100 },
  { name: "Nasser", score: 7_350 },
  { name: "Idris", score: 3_900 },
];
const SEED_CPS: { name: string; score: number }[] = [
  { name: "Hamza", score: 67 },
  { name: "Mahmood", score: 61 },
  { name: "Hamdan", score: 58 },
  { name: "Kareem", score: 54 },
  { name: "Anas", score: 51 },
  { name: "Jamal", score: 48 },
  { name: "Sami", score: 45 },
  { name: "Hassan", score: 42 },
  { name: "Rashid", score: 39 },
  { name: "Adel", score: 36 },
  { name: "Marwan", score: 33 },
  { name: "Fahad", score: 30 },
  { name: "Munir", score: 27 },
  { name: "Salem", score: 24 },
  { name: "Iyad", score: 21 },
];
const seedsFor = (g: GameId) => g === "cps_test" ? SEED_CPS : SEED_TYCOON;

// Strip junk leaderboard names: "You"/"Player" placeholders or anything that
// isn't a single word (multi-word entries look like full names — hide them).
function isCleanName(raw: string): boolean {
  const n = (raw || "").trim();
  if (!n) return false;
  if (/^you$/i.test(n)) return false;
  if (/^player$/i.test(n)) return false;
  if (/\s/.test(n)) return false; // must be one word
  return true;
}

export async function getLeaderboard(limit = 15, game: GameId = "study_tycoon"): Promise<ScoreRow[]> {
  const meId = await getCurrentUserId();

  let rows: { user_id: string | null; player_name: string; score: number }[] = [];
  try {
    const { data, error } = await (supabase as any)
      .from("game_scores")
      .select("user_id, player_name, score")
      .eq("game", game)
      .order("score", { ascending: false })
      .limit(500);
    if (!error && Array.isArray(data)) {
      rows = data
        .filter((r: any) => isCleanName(String(r.player_name || "")))
        .map((r: any) => ({
          user_id: r.user_id ?? null,
          player_name: String(r.player_name).trim(),
          score: Number(r.score) || 0,
        }));
    }
  } catch { /* table missing — seeds only */ }

  // Deduplicate: one row per user_id (highest score wins). Anonymous rows
  // (no user_id) dedupe by name. Same name from two different users is kept
  // separate (they're distinct people).
  const best = new Map<string, { name: string; score: number; user_id: string | null }>();
  for (const r of rows) {
    const key = r.user_id ? `u:${r.user_id}` : `n:${r.player_name.toLowerCase()}`;
    const prev = best.get(key);
    if (!prev || r.score > prev.score) best.set(key, { name: r.player_name, score: r.score, user_id: r.user_id });
  }

  const merged: ScoreRow[] = Array.from(best.values()).map((r) => ({
    name: r.name,
    score: r.score,
    you: !!(meId && r.user_id === meId),
  }));

  // Merge in seeds — real scores still win on a tie because they were inserted first.
  const seenNames = new Set(merged.map((r) => r.name.toLowerCase()));
  for (const s of seedsFor(game)) {
    if (!seenNames.has(s.name.toLowerCase())) merged.push({ name: s.name, score: s.score });
  }

  return merged.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Owner grant (their request): reset their local game to a clean 3,000,000 lifetime
// (so they sit at #1 instead of the inflated, clamped 1B), and give a permanent
// +30% bonus (3 prestige degrees). v2 re-runs once to clear the old inflated value.
const OWNER_EMAIL = "nuruddinshabbir3@gmail.com";
const OWNER_GRANT_KEY = "mmr_owner_grant_v2";
export async function grantOwnerBonusIfNeeded(): Promise<void> {
  try {
    if (localStorage.getItem(OWNER_GRANT_KEY)) return;
    const { data } = await supabase.auth.getUser();
    if ((data?.user?.email || "").toLowerCase() !== OWNER_EMAIL) return;

    const TARGET = 3_000_000;
    const fresh = { marks: TARGET, totalEarned: TARGET, clicks: 0, upgrades: {}, degrees: 3, lastSeen: Date.now() };
    localStorage.setItem("mmr_tycoon_v3", JSON.stringify(fresh));
    localStorage.setItem(PB_KEY("study_tycoon"), String(TARGET));
    localStorage.setItem("mmr_owner", "1"); // owner perk: always restart a run with 3M
    localStorage.removeItem("mmr_owner_grant_v1");
    await submitScore("", TARGET, "study_tycoon"); // name comes from profile
    localStorage.setItem(OWNER_GRANT_KEY, "1");
    try { window.dispatchEvent(new Event("mmr-degrees-change")); } catch { /* ignore */ }
  } catch { /* ignore */ }
}

export async function submitScore(_unusedName: string, score: number, game: GameId = "study_tycoon"): Promise<void> {
  setPersonalBest(game, score);
  try {
    const userId = await getCurrentUserId();
    if (!userId) return; // not signed in — local PB only
    const full = await getDisplayNameForUser(userId);
    // Use the first word of the profile name so leaderboard stays single-word.
    const name = full.split(/\s+/)[0].slice(0, 24);
    if (!isCleanName(name)) return;
    const finalScore = Math.max(0, Math.min(1_000_000_000, Math.round(score)));
    // One row per (user_id, game). For CPS keep the highest score ever; for
    // Study Tycoon overwrite with current run lifetime (resets on graduate).
    const { data: existing } = await (supabase as any)
      .from("game_scores")
      .select("score")
      .eq("user_id", userId)
      .eq("game", game)
      .maybeSingle();
    if (existing) {
      const shouldUpdate = game === "cps_test"
        ? finalScore > (existing.score || 0)
        : finalScore !== (existing.score || 0);
      if (shouldUpdate) {
        await (supabase as any)
          .from("game_scores")
          .update({ player_name: name, score: finalScore })
          .eq("user_id", userId)
          .eq("game", game);
      }
    } else {
      // Upsert (not insert) so a concurrent submission can't create a second row
      // — there is now a unique index on (user_id, game).
      await (supabase as any).from("game_scores").upsert(
        { user_id: userId, player_name: name, score: finalScore, game },
        { onConflict: "user_id,game" },
      );
    }
  } catch { /* table missing / offline */ }
}
