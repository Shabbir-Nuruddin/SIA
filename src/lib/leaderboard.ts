// Break-game leaderboard.
//
// The global board is backed by the public.game_scores table, but the feature is
// designed to work even before that table/migration exists: a set of seeded
// "house" scores is always merged in, and the player's personal best is mirrored
// to localStorage. So the leaderboard never looks empty and never hard-fails.

import { supabase } from "@/integrations/supabase/client";

export interface ScoreRow {
  name: string;
  score: number;
  seeded?: boolean; // house score (not a real submission)
  you?: boolean;    // the current player's row
}

const GAME = "revision_runner";
const PB_KEY = "mmr_game_pb_revision_runner";

// Seeded "house" scores — beatable but high enough to grind toward, and they make
// the board look alive from day one. Tuned to the runner's scoring (~10 pts/sec).
const SEED_SCORES: ScoreRow[] = [
  { name: "Aarav S.",  score: 924, seeded: true },
  { name: "Priya M.",  score: 871, seeded: true },
  { name: "Zainab K.", score: 818, seeded: true },
  { name: "Daniel O.", score: 779, seeded: true },
  { name: "Mei L.",    score: 742, seeded: true },
  { name: "Tomás R.",  score: 706, seeded: true },
  { name: "Fatima A.", score: 663, seeded: true },
  { name: "Liam B.",   score: 624, seeded: true },
  { name: "Sofia G.",  score: 587, seeded: true },
  { name: "Arjun P.",  score: 541, seeded: true },
  { name: "Chloe W.",  score: 503, seeded: true },
  { name: "Yusuf H.",  score: 458, seeded: true },
  { name: "Ananya D.", score: 414, seeded: true },
  { name: "Noah T.",   score: 369, seeded: true },
  { name: "Emma C.",   score: 322, seeded: true },
];

export function getPersonalBest(): number {
  try { return parseInt(localStorage.getItem(PB_KEY) || "0", 10) || 0; } catch { return 0; }
}

function setPersonalBest(score: number) {
  try {
    if (score > getPersonalBest()) localStorage.setItem(PB_KEY, String(score));
  } catch { /* ignore quota */ }
}

/** Fetch the top scores: real submissions (if the table exists) + seeds, merged. */
export async function getLeaderboard(limit = 15): Promise<ScoreRow[]> {
  let real: ScoreRow[] = [];
  try {
    // `game_scores` is a new table; the generated Supabase types won't include it
    // until the migration is applied + types regenerated, so cast to bypass them.
    const { data, error } = await (supabase as any)
      .from("game_scores")
      .select("player_name, score")
      .eq("game", GAME)
      .order("score", { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) {
      real = data.map((r: any) => ({ name: String(r.player_name || "Anonymous"), score: Number(r.score) || 0 }));
    }
  } catch {
    // table may not exist yet — fall back to seeds only
  }

  const pb = getPersonalBest();
  const merged = [...real, ...SEED_SCORES];
  if (pb > 0) merged.push({ name: "You", score: pb, you: true });

  return merged
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Persist a score (best-effort to DB) and update the local personal best. */
export async function submitScore(name: string, score: number): Promise<void> {
  setPersonalBest(score);
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return; // only signed-in users write to the global board
    await (supabase as any).from("game_scores").insert({
      user_id: userId,
      player_name: String(name || "Anonymous").slice(0, 24),
      score: Math.max(0, Math.min(1_000_000, Math.round(score))),
      game: GAME,
    });
  } catch {
    // table missing / offline — personal best already saved locally
  }
}
