
CREATE TABLE IF NOT EXISTS public.ai_key_state (
  provider TEXT PRIMARY KEY,
  current_index INT NOT NULL DEFAULT 0,
  total_keys INT NOT NULL DEFAULT 0,
  last_rotated_at TIMESTAMPTZ,
  last_error TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_key_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ai key state"
ON public.ai_key_state FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.ai_key_state (provider, current_index, total_keys)
VALUES ('gemini', 0, 0)
ON CONFLICT (provider) DO NOTHING;
