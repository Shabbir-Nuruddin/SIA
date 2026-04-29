-- Add study preferences and reminder fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pomodoro_work_minutes INTEGER NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS pomodoro_break_minutes INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS daily_reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS daily_reminder_time TIME NOT NULL DEFAULT '18:00',
  ADD COLUMN IF NOT EXISTS rest_days INTEGER[] NOT NULL DEFAULT ARRAY[0]::INTEGER[],
  ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'dark';