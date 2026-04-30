-- roadmap_nodes: the sequential guided path (skill-tree style)
CREATE TABLE public.roadmap_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text,
  unit_code text,
  unit_number integer,
  unit_name text,
  topic_name text,
  node_type text NOT NULL CHECK (node_type IN ('learn','review','mock','break')),
  node_order integer NOT NULL,
  scheduled_date date NOT NULL,
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','unlocked','in_progress','complete','skipped')),
  unlocks_after_node_id uuid REFERENCES public.roadmap_nodes(id) ON DELETE SET NULL,
  science_method text CHECK (science_method IN ('active_recall','spaced_repetition','interleaving','elaboration','pomodoro')),
  why_now_text text,
  completed_at timestamptz,
  score_percent integer,
  source_node_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_roadmap_nodes_user_order ON public.roadmap_nodes(user_id, node_order);
CREATE INDEX idx_roadmap_nodes_user_date ON public.roadmap_nodes(user_id, scheduled_date);

ALTER TABLE public.roadmap_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own nodes select" ON public.roadmap_nodes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own nodes insert" ON public.roadmap_nodes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own nodes update" ON public.roadmap_nodes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own nodes delete" ON public.roadmap_nodes FOR DELETE USING (auth.uid() = user_id);

-- Notification preferences on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notification_time time NOT NULL DEFAULT '16:00:00',
  ADD COLUMN IF NOT EXISTS notification_prompted boolean NOT NULL DEFAULT false;

-- Trigger: when a node completes, unlock the node that depends on it
CREATE OR REPLACE FUNCTION public.unlock_next_node()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'complete' AND (OLD.status IS NULL OR OLD.status <> 'complete') THEN
    UPDATE public.roadmap_nodes
    SET status = 'unlocked'
    WHERE unlocks_after_node_id = NEW.id
      AND user_id = NEW.user_id
      AND status = 'locked';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_unlock_next_node ON public.roadmap_nodes;
CREATE TRIGGER trg_unlock_next_node
AFTER UPDATE OF status ON public.roadmap_nodes
FOR EACH ROW
EXECUTE FUNCTION public.unlock_next_node();