
CREATE TABLE public.user_activity (
  user_id UUID NOT NULL PRIMARY KEY,
  total_seconds BIGINT NOT NULL DEFAULT 0,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own activity select" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "own activity insert" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own activity update" ON public.user_activity
  FOR UPDATE USING (auth.uid() = user_id);

-- Atomic heartbeat: adds elapsed seconds since last heartbeat, capped at 90s
-- (so closed tabs / sleeps don't inflate totals).
CREATE OR REPLACE FUNCTION public.record_activity_heartbeat()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  prev TIMESTAMPTZ;
  delta INT;
BEGIN
  IF uid IS NULL THEN RETURN; END IF;

  SELECT last_heartbeat INTO prev FROM public.user_activity WHERE user_id = uid;

  IF prev IS NULL THEN
    INSERT INTO public.user_activity (user_id, total_seconds, last_heartbeat, updated_at)
    VALUES (uid, 0, now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    RETURN;
  END IF;

  delta := LEAST(90, GREATEST(0, EXTRACT(EPOCH FROM (now() - prev))::INT));

  UPDATE public.user_activity
  SET total_seconds = total_seconds + delta,
      last_heartbeat = now(),
      updated_at = now()
  WHERE user_id = uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_activity_heartbeat() TO authenticated;
