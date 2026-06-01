ALTER TABLE public.game_scores DROP CONSTRAINT IF EXISTS game_scores_score_check;
ALTER TABLE public.game_scores ADD CONSTRAINT game_scores_score_check CHECK (score >= 0 AND score <= 1000000000);