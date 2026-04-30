ALTER TABLE public.roadmap_nodes DROP CONSTRAINT IF EXISTS roadmap_nodes_science_method_check;
ALTER TABLE public.roadmap_nodes ADD CONSTRAINT roadmap_nodes_science_method_check
  CHECK (science_method IS NULL OR science_method = ANY (ARRAY[
    'active_recall'::text,
    'spaced_repetition'::text,
    'interleaving'::text,
    'elaboration'::text,
    'dual_coding'::text,
    'concrete_examples'::text,
    'pomodoro'::text
  ]));