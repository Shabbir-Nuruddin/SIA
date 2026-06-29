# Notes Auto-Generator

Bulk pre-generates revision notes for **every topic on the Edexcel IGCSE + Edexcel
International A-Level specs** into the shared cache (`cached_topic_notes`), so
students open notes instantly instead of waiting for a live generation.

It rides on the existing `ai-notes` edge function, which already rotates through
all your `GEMINI_API_KEY` / `GEMINI_API_KEY_1…N` secrets automatically. Topics that
are already cached are skipped, so every run is safe to repeat and fully resumable.

## Two ways to run it

### 1. Admin panel (point-and-click)
Sign in as the admin (`nuruddinshabbir3@gmail.com`) → go to **/admin** → the
**Notes Auto-Generator** card at the top → flip the switch **ON**.

It generates one topic at a time and shows live progress, the Gemini key in use,
and any skipped topics. Keep the tab open while it runs; it resumes where it left
off if you close and reopen it. Good for watching it / running for an hour or two.

### 2. Headless script (unattended, hours/days)
A browser tab can't realistically stay open for weeks, so for a long unattended
sweep run the same loop from a terminal:

```powershell
# from the project root (npx fetches `tsx` automatically the first time)
$env:SIA_ADMIN_EMAIL="nuruddinshabbir3@gmail.com"
$env:SIA_ADMIN_PASSWORD="admin123"
npm run notes:autogen
```

It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env`
automatically. Leave it running (e.g. overnight, or on any always-on machine).
Flipping the panel switch **OFF** also stops the script (it polls the same flag).

## One-time setup
1. **Run the migration** `supabase/migrations/20260629120000_notes_autogen.sql`
   on the live project (Supabase → SQL Editor) — it creates the switch table.
2. **Make sure the admin account exists**: sign up once with
   `nuruddinshabbir3@gmail.com` / `admin123`. The database trigger
   `grant_owner_admin` auto-grants it the admin role.
3. **Gemini keys** live in Supabase → Edge Functions → Secrets
   (`GEMINI_API_KEY`, `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, …). The more keys,
   the more notes per day before the free quotas reset.

## Notes
- Free Gemini quotas reset daily. When every key is rate-limited the run pauses,
  then retries automatically — so over a few days it works through everything.
- Generated notes are cached centrally; you can review and hand-fix any topic
  later via the normal **Regenerate** button on the student Notes page.
