CREATE TABLE IF NOT EXISTS public.game_scores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  score       integer NOT NULL CHECK (score >= 0 AND score <= 1000000),
  game        text NOT NULL DEFAULT 'revision_runner',
  created_at  timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.game_scores TO anon;
GRANT SELECT, INSERT ON public.game_scores TO authenticated;
GRANT ALL ON public.game_scores TO service_role;

CREATE INDEX IF NOT EXISTS game_scores_game_score_idx
  ON public.game_scores (game, score DESC);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can read game scores" ON public.game_scores;
CREATE POLICY "anyone can read game scores"
  ON public.game_scores
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "submit own game score" ON public.game_scores;
CREATE POLICY "submit own game score"
  ON public.game_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());