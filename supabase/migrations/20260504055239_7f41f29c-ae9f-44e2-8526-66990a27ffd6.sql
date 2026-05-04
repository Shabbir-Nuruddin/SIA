-- 1. Trial no longer auto-starts at signup. Only set when user begins checkout.
ALTER TABLE public.profiles ALTER COLUMN trial_start_date DROP DEFAULT;

-- 2. Wipe existing trials so all current users go back to Free (admins remain Pro).
UPDATE public.profiles
SET trial_start_date = NULL
WHERE is_admin = false AND is_pro = false;
