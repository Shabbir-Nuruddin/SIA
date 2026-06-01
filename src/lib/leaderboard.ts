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
      rows = data.map((r: any) => ({
        user_id: r.user_id ?? null,
        player_name: String(r.player_name || "Player"),
        score: Number(r.score) || 0,
      }));
    }
  } catch { /* table missing — return empty */ }

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

  return merged.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function submitScore(_unusedName: string, score: number, game: GameId = "study_tycoon"): Promise<void> {
  setPersonalBest(game, score);
  try {
    const userId = await getCurrentUserId();
    if (!userId) return; // not signed in — local PB only
    const name = await getDisplayNameForUser(userId);
    await (supabase as any).from("game_scores").insert({
      user_id: userId,
      player_name: name,
      score: Math.max(0, Math.min(1_000_000_000, Math.round(score))),
      game,
    });
  } catch { /* table missing / offline */ }
}
