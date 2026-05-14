# Plan

I'll group this into 4 phases. After each phase I'll list **exactly which files/lines changed** so you can replicate for other subjects manually (as you asked).

---

## Phase 1 — Quick fixes (auth, onboarding, diagnostic)

### 1a. Auth → dashboard for admin only
Current behaviour: `MaintenanceGate` already signs out non-admin users and shows the maintenance screen. The issue is that `Auth.tsx` redirects to `/dashboard` *before* the gate evaluates. Fix:
- In `src/pages/Auth.tsx`, after sign-in, check email === `nuruddinshabbir3@gmail.com`. If not, sign out and toast "site under maintenance" instead of routing to `/dashboard`.

### 1b. Remove diagnostic quiz
- Remove `<Route path="/diagnostic">` from `src/App.tsx`.
- Delete `src/pages/Diagnostic.tsx`.
- In `src/lib/postAuthRoute.ts`, drop the `diagnostic_completed` branch — new users go straight to `/onboarding`, onboarded users go to `/dashboard`.
- Anywhere else that links to `/diagnostic` (search and remove).

### 1c. Fix IGCSE Edexcel + CIE onboarding → dashboard
- Audit `src/pages/Onboarding.tsx` to confirm the qualification picker offers Edexcel IGCSE and CIE IGCSE, that selecting them loads the right syllabus from `src/lib/data/*`, and that submit sets `profiles.onboarded = true` then routes to `/dashboard`. Fix whichever step is broken.

---

## Phase 2 — Notes system prompt overhaul (Edexcel IAL Bio + Chem only, as a template)

You explicitly asked: *"can you tell exactly where and what code you are changing so if it works i can do the rest of the subjects code and change it manually"*. So I'll do **Bio + Chem (IAL) Units 1, 2, 4, 5 only**, as the reference implementation.

### Files
1. **NEW** `supabase/functions/_shared/syllabus-boundaries.ts`
   - Exports `SYLLABUS_BOUNDARIES`: a map keyed by `${qualification}|${subject}|${unit}` → `{ allowedTopics: string, forbiddenTopics: string }`. I'll paste your USE/DO NOT USE lists verbatim for IAL Bio U1/U2/U4/U5 and IAL Chem U1/U2/U4/U5.
   - Exports `buildSystemPrompt({ qualification, subject, unit, unitName })` which returns the full wrapper from your Part 1 (timestamp + seed generated fresh inside the function, never cached).

2. **EDIT** `supabase/functions/ai-notes/index.ts`
   - Replace the existing system prompt construction with a call to `buildSystemPrompt(...)`.
   - Before saving to `cached_topic_notes`, run `validateForbiddenKeywords(output, forbiddenList)`. On hit: regenerate once. On second hit: insert a row into `notes_generation_log` with `validation_passed = false` and return an error to the client (no cache write).
   - Always emit a row into `notes_generation_log` (schema below) with the trigger (`initial | cache_clear | validation_retry`), the seed, and the timestamp.

3. **EDIT** `supabase/functions/admin-cache-clear/index.ts`
   - Already deletes from `cached_topic_notes`. Add: also delete any in-memory or temp keys (none currently — confirm). Set a `?trigger=cache_clear` flag passed to ai-notes on the next call so the log records it correctly.

### Migration
```sql
create table public.notes_generation_log (
  id uuid primary key default gen_random_uuid(),
  qualification text not null,
  subject text not null,
  unit_topic text not null,
  unit_topic_name text,
  timestamp timestamptz not null default now(),
  seed text not null,
  trigger text not null check (trigger in ('initial','cache_clear','validation_retry')),
  validation_passed boolean not null,
  forbidden_keywords_found text[] not null default '{}'
);
alter table public.notes_generation_log enable row level security;
create policy "admin reads log" on public.notes_generation_log for select using (public.has_role(auth.uid(),'admin'));
```

---

## Phase 3 — Image generation replacement

### Files
- **EDIT** `supabase/functions/ai-notes/index.ts` (image step)
  - Remove existing image prompt code.
  - Add `buildImagePrompt({ qualification, subject, topic, mustShow[], mustNotShow[] })` that fills your Part 6 template literally. The `mustShow` / `mustNotShow` arrays come from a per-topic table I'll seed inline for the 8 IAL units above; everything else falls back to a generic-but-still-specific prompt and is logged so you can fill them in.
  - Switch the image call to **Nano Banana via Lovable AI Gateway** (`google/gemini-2.5-flash-image`), per the AI gateway docs — no extra API key needed since `LOVABLE_API_KEY` is already set.

---

## Phase 4 — Units 3 & 6 (practical papers) — research

You asked me to "research and get appropriate notes for the practical papers and what sort of questions are asked so a database for all of that". This needs me to:
- Fetch the Edexcel IAL spec PDFs for WBI13/WBI16 (Bio practical), WCH13/WCH16 (Chem practical), and CIE equivalents.
- Build a `practical_skills_database` table with: assessment objective, common question stems, required practicals, mark scheme phrases.

This is a substantial standalone job (~1–2 hours of fetching + structuring). I'd rather do it as a **separate follow-up message** after Phases 1–3 are working, otherwise this single response will be massive and any one bug blocks everything.

---

## What I will NOT touch
- Roadmap, FAQ, Mock Paper, Clarity Compass, Music, Pomodoro, auth providers, RLS on existing tables, `src/integrations/supabase/*`.
- Other subjects' system prompts (Physics, Maths, all CIE, all IGCSE) — you'll replicate from the IAL Bio/Chem template.

---

## Order of execution
1. Phase 1 (auth + diagnostic + onboarding) — ~15 min, low risk.
2. Phase 3 (image gen swap to Nano Banana) — ~10 min.
3. Phase 2 (notes prompt + validation + log table) — ~30 min, includes a migration.
4. Phase 4 in a **separate follow-up** once 1–3 are confirmed working.

**Confirm and I'll start with Phase 1.** If you want a different order, or want me to bundle Phase 4 into this run anyway (longer wait, bigger blast radius), say so.
