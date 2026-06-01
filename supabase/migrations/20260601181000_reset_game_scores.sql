-- One-time reset of the Break Arcade leaderboard. Clears all submitted scores
-- (including the old inflated / clamped 1B entry). Seed "house" players live in
-- the frontend, so the board is never empty; real players' scores repopulate as
-- they next open the game.
DELETE FROM public.game_scores;
