-- ============================================================================
-- One-time (idempotent) DEDUPLICATION to conserve storage.
-- Re-deploying / regenerating roadmaps and re-submitting game scores can leave
-- the same row in the database two or three times. We only ever need ONE, so
-- this migration keeps a single canonical copy of each and deletes the rest.
-- It is safe to run repeatedly: once de-duped, the DELETEs simply affect 0 rows.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. game_scores  (this IS the leaderboard)
--    Keep ONE row per player per game = their HIGHEST score. Signed-in players
--    are keyed by user_id; anonymous rows fall back to player_name.
-- ----------------------------------------------------------------------------
DELETE FROM public.game_scores g
USING (
  SELECT id,
         row_number() OVER (
           PARTITION BY COALESCE(user_id::text, 'name:' || lower(player_name)), game
           ORDER BY score DESC, created_at ASC, id ASC
         ) AS rn
  FROM public.game_scores
) d
WHERE g.id = d.id AND d.rn > 1;

-- Stop future duplicates: at most one row per signed-in user per game.
-- A plain (non-partial) unique index so it can serve as the upsert arbiter for
-- submitScore's ON CONFLICT (user_id, game). NULL user_ids stay DISTINCT in
-- Postgres, so the app's only inserts (always signed-in) are de-duped while any
-- legacy anonymous rows are left untouched.
CREATE UNIQUE INDEX IF NOT EXISTS game_scores_user_game_uniq
  ON public.game_scores (user_id, game);

-- ----------------------------------------------------------------------------
-- 2. roadmap_sessions  (dashboard "today's plan" sessions)
--    A user legitimately has many sessions, but regeneration can duplicate the
--    exact same session. Keep the earliest copy of each identical session.
-- ----------------------------------------------------------------------------
DELETE FROM public.roadmap_sessions r
USING (
  SELECT id,
         row_number() OVER (
           PARTITION BY user_id, session_date, COALESCE(subject,''),
                        COALESCE(unit_number,-1), COALESCE(topic_name,''),
                        method, COALESCE(order_index,0)
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM public.roadmap_sessions
) d
WHERE r.id = d.id AND d.rn > 1;

-- ----------------------------------------------------------------------------
-- 3. roadmap_nodes  (Roadmap page nodes / "roadmap notes")
--    Keep one node per logical position; delete exact duplicates from repeated
--    generation. Self-referencing FKs (unlocks_after_node_id) are ON DELETE SET
--    NULL / nullable, so removing duplicate rows will not error.
-- ----------------------------------------------------------------------------
DELETE FROM public.roadmap_nodes r
USING (
  SELECT id,
         row_number() OVER (
           PARTITION BY user_id, COALESCE(subject,''), COALESCE(unit_number,-1),
                        COALESCE(topic_name,''), node_type, node_order, scheduled_date
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM public.roadmap_nodes
) d
WHERE r.id = d.id AND d.rn > 1;
