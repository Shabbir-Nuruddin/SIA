// Game leaderboards (two boards: Study Tycoon "marks", and CPS Test "clicks/5s").
//
// Backed by public.game_scores, but designed to work BEFORE that table exists: a
// set of seeded "house" scores is always merged in and the personal best is mirrored
// to localStorage, so the board never looks empty and never hard-fails.

import { supabase } from "@/integrations/supabase/client";

export type GameId = "study_tycoon" | "cps_test";

export interface ScoreRow {
  name: string;
  score: number;
  seeded?: boolean;
  you?: boolean;
}

const PB_KEY = (g: GameId) => `mmr_game_pb_${g}`;

// Lifetime marks (Study Tycoon). Big + spaced so keen players climb over a few breaks.
const SEED_TYCOON: ScoreRow[] = [
  { name: "Aarav S.", score: 2_480_000, seeded: true },
  { name: "Priya M.", score: 1_650_000, seeded: true },
  { name: "Zainab K.", score: 940_000, seeded: true },
  { name: "Daniel O.", score: 612_000, seeded: true },
  { name: "Mei L.", score: 388_000, seeded: true },
  { name: "Tomás R.", score: 245_000, seeded: true },
  { name: "Fatima A.", score: 168_000, seeded: true },
  { name: "Liam B.", score: 112_000, seeded: true },
  { name: "Sofia G.", score: 74_500, seeded: true },
  { name: "Arjun P.", score: 48_200, seeded: true },
  { name: "Chloe W.", score: 31_900, seeded: true },
  { name: "Yusuf H.", score: 19_400, seeded: true },
  { name: "Ananya D.", score: 12_100, seeded: true },
  { name: "Noah T.", score: 7_350, seeded: true },
  { name: "Emma C.", score: 3_900, seeded: true },
];

// CPS Test score = clicks in a 5-second sprint (so 60 = 12.0 CPS). Fast but human.
const SEED_CPS: ScoreRow[] = [
  { name: "Reflex_Ravi", score: 67, seeded: true },
  { name: "Zoe.K", score: 61, seeded: true },
  { name: "Kenji", score: 58, seeded: true },
  { name: "mxhmood", score: 54, seeded: true },
  { name: "Aditi", score: 51, seeded: true },
  { name: "TomTom", score: 48, seeded: true },
  { name: "Bea", score: 45, seeded: true },
  { name: "Hassan_R", score: 42, seeded: true },
  { name: "Lucia", score: 39, seeded: true },
  { name: "Dev", score: 36, seeded: true },
  { name: "Niamh", score: 33, seeded: true },
  { name: "Oskar", score: 30, seeded: true },
  { name: " Amara", score: 27, seeded: true },
  { name: "Jin", score: 24, seeded: true },
  { name: "Sam", score: 21, seeded: true },
];

const seedsFor = (g: GameId) => (g === "cps_test" ? SEED_CPS : SEED_TYCOON);

export function getPersonalBest(game: GameId = "study_tycoon"): number {
  try { return parseInt(localStorage.getItem(PB_KEY(game)) || "0", 10) || 0; } catch { return 0; }
}
function setPersonalBest(game: GameId, score: number) {
  try { if (score > getPersonalBest(game)) localStorage.setItem(PB_KEY(game), String(score)); } catch { /* ignore */ }
}

export async function getLeaderboard(limit = 15, game: GameId = "study_tycoon"): Promise<ScoreRow[]> {
  let real: ScoreRow[] = [];
  try {
    // game_scores isn't in the generated Supabase types until the migration is
    // applied + types regenerated, so cast to bypass them.
    const { data, error } = await (supabase as any)
      .from("game_scores")
      .select("player_name, score")
      .eq("game", game)
      .order("score", { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data)) {
      real = data.map((r: any) => ({ name: String(r.player_name || "Anonymous"), score: Number(r.score) || 0 }));
    }
  } catch { /* table missing — seeds only */ }

  const pb = getPersonalBest(game);
  const merged = [...real, ...seedsFor(game)];
  if (pb > 0) merged.push({ name: "You", score: pb, you: true });

  return merged.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function submitScore(name: string, score: number, game: GameId = "study_tycoon"): Promise<void> {
  setPersonalBest(game, score);
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return;
    await (supabase as any).from("game_scores").insert({
      user_id: userId,
      player_name: String(name || "Anonymous").slice(0, 24),
      score: Math.max(0, Math.min(1_000_000_000, Math.round(score))),
      game,
    });
  } catch { /* offline / table missing — PB saved locally */ }
}
