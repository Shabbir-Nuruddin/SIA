
CREATE TABLE public.active_device_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('phone','tablet','laptop')),
  device_id TEXT NOT NULL,
  user_agent TEXT,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_type)
);

ALTER TABLE public.active_device_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own device sessions select"
  ON public.active_device_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "own device sessions insert"
  ON public.active_device_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own device sessions update"
  ON public.active_device_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "own device sessions delete"
  ON public.active_device_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_active_device_sessions_user ON public.active_device_sessions(user_id);
