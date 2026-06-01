-- Reset game leaderboard: each user gets one row per game (their lifetime/highest).
TRUNCATE TABLE public.game_scores;

-- Drop any old rows without user_id won't survive; enforce one row per (user_id, game).
ALTER TABLE public.game_scores ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.game_scores ADD CONSTRAINT game_scores_user_game_unique UNIQUE (user_id, game);

-- Allow users to update their own row (needed for upsert keep-max behavior).
DROP POLICY IF EXISTS "update own game score" ON public.game_scores;
CREATE POLICY "update own game score"
ON public.game_scores
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

GRANT UPDATE ON public.game_scores TO authenticated;