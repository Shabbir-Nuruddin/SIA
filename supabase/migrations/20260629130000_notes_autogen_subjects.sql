-- Notes Auto-Generator — per-subject selection.
-- The admin panel now lets you choose WHICH subjects to sweep (in addition to the
-- existing per-board choice). Store the chosen subject codes on the control row so
-- both the panel and the headless script (scripts/bulk-generate-notes.ts) sweep
-- exactly the same selection. Defaults to all four subjects = previous behaviour.

ALTER TABLE public.notes_autogen_control
  ADD COLUMN IF NOT EXISTS subjects text[] NOT NULL
  DEFAULT ARRAY['mathematics', 'biology', 'chemistry', 'physics'];
