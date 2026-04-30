ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tutor_message_count integer NOT NULL DEFAULT 0;