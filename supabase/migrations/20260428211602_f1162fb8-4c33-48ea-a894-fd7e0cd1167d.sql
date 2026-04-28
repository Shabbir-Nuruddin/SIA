
-- Add first/last name columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Update the new-user trigger to capture first/last names from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'display_name',
      split_part(COALESCE(NEW.email,''),'@',1)
    ),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Topic notes
CREATE TABLE IF NOT EXISTS public.topic_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  unit_number INT NOT NULL,
  topic TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject, unit_number, topic)
);

ALTER TABLE public.topic_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notes select" ON public.topic_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own notes insert" ON public.topic_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own notes update" ON public.topic_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own notes delete" ON public.topic_notes FOR DELETE USING (auth.uid() = user_id);

-- Note annotations (sticky notes attached to a topic_notes row)
CREATE TABLE IF NOT EXISTS public.note_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_notes_id UUID NOT NULL REFERENCES public.topic_notes(id) ON DELETE CASCADE,
  highlighted_text TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.note_annotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own annotations select" ON public.note_annotations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own annotations insert" ON public.note_annotations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own annotations update" ON public.note_annotations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own annotations delete" ON public.note_annotations FOR DELETE USING (auth.uid() = user_id);
