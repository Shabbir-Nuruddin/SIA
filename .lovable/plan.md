## Scope

You've asked for ~10 distinct changes. Grouping them into phases so you can approve/skip each.

---

### Phase 1 — Auth, gating, maintenance removal

1. **Remove maintenance mode.** Delete the `gateNonAdmin` block in `src/pages/Auth.tsx` so any user can log in. Remove `MaintenanceGate` usage from `App.tsx` if mounted there.
2. **Fix cross-tab login bouncing to landing.** Root cause is almost certainly the post-auth route guard running before `AuthContext` finishes hydrating the session from storage on a fresh tab. Fix in `src/contexts/AuthContext.tsx`:
   - Add an `initialized` boolean that flips true only after the first `getSession()` resolves.
   - In `src/App.tsx` route guards (or wherever `<Navigate to="/" />` is fired), block the redirect while `!initialized`.
3. **Admin-only feature gating.** Hide from non-admins in `src/components/AppSidebar.tsx` and add route guards that redirect to `/dashboard`:
   - FAQ (`/faq`)
   - Mock papers (`/mock-papers`, `/mock-papers/*`)
   - Roadmap (`/roadmap`, `/roadmap/*`)
   - Podcast (`/podcast`)
   - Clarity Compass (`/clarity/*`)
   - Use `useIsAdmin()` from `src/lib/admin.ts` (or equivalent — will check what exists).

---

### Phase 2 — Roadmap tables cleanup

`roadmap_nodes` (3561 rows) and `roadmap_sessions` (4321 rows) are **two different things**, not duplicates:

- `roadmap_nodes` — the per-user generated study tree (topic nodes, status: locked/unlocked/complete). Linked to `unlock_next_node` trigger.
- `roadmap_sessions` — per-user roadmap generation runs / scheduled study sessions on the calendar.

They're related but not redundant. Recommendation: **keep both, but TRUNCATE both** so that newly generated notes drive a fresh roadmap. I'll also truncate `study_sessions`, `cached_topic_notes`, and `notes_generation_log` so the next note generation is fully fresh against your new edexcelial.ts / edexceligcse.ts specs.

Migration will:
```sql
TRUNCATE TABLE roadmap_nodes, roadmap_sessions, study_sessions, cached_topic_notes, notes_generation_log;
```

---

### Phase 3 — Notes pipeline (cache + overview rewrite)

1. **Cache actually clears.** The current edge function only skips cache lookup when `trigger === "cache_clear"` but still upserts. Fix:
   - When `trigger === "cache_clear"`, first `DELETE FROM cached_topic_notes WHERE board=… AND subject=… AND unit_number=… AND topic=…`, then regenerate, then upsert fresh.
   - Verify the Notes page actually sends `trigger: "cache_clear"` when user clicks regenerate (check `src/pages/Notes.tsx`).
2. **Overview rewrite per subject type.** In `supabase/functions/_shared/edexcelial.ts` and `edexceligcse.ts`, change the `buildSystemPrompt` so:
   - **Sciences (Bio/Chem/Phys):** Overview = 5–7 paragraphs of student-friendly theory in the Save My Exams / PMT style — explain the *why*, not lecture-style. On-point, exam-relevant theory.
   - **Maths:** Overview = 1–2 lines describing the topic only. Bulk the `core_content` and `equations` arrays with more worked examples, more solution steps, more question variants.
3. **Verify board routing.** The Notes page sends `board` — confirm values map to `edexcel-ial` / `edexcel-igcse` correctly so your two new spec files actually drive generation.

---

### Phase 4 — Remove PDF export

Find and remove the "Export PDF" / "Download PDF" button and handler from `src/pages/Notes.tsx` and `src/components/NotesVisualRenderer.tsx`. Drop the `jspdf` / `html2canvas` import if unused elsewhere.

---

### Phase 5 — Music player fix

The current `MusicPlayer.tsx` uses Pixabay CDN URLs that frequently 403 from browsers. Replace the track list with reliable royalty-free sources (e.g. `cdn.pixabay.com` direct .mp3 hosted via their public CDN with confirmed-working IDs, or Internet Archive lo-fi tracks). I'll test 2-3 URLs with `curl -I` first to confirm they serve audio and not an HTML interstitial. Also add an `onError` toast so failures are visible.

---

### Phase 6 — AI Tutor + Notes loading errors

Need diagnostics first — I'll check the edge function logs for `ai-tutor` and `ai-notes` to see the actual error. Common causes:
- Tool-calling schema rejected by gateway.
- Token limits exceeded for big system prompts (your new spec files might be huge).
- Missing `image_url` field causing the validator to throw.

Will fix based on what the logs show.

---

### Phase 7 — Instagram story export (NEW FEATURE — biggest scope)

This is a real feature, not a tweak. Proposed minimum-viable version:

1. Track active engagement time client-side in `src/lib/activityHeartbeat.ts` (already exists). After ≥25 min of active focus in a session, show a non-intrusive toast: "Share your study session?"
2. Click → opens a modal that renders a 1080×1920 canvas with:
   - One of 5 pre-curated aesthetic backgrounds (use the vibes from your reference: cinematic desk, anime lock-in, library elite, etc. — I'll generate 5 with `imagegen`).
   - Auto-filled stats: minutes studied, subject, current time (e.g. "2:43 AM"), streak.
   - Big handwritten-style headline like "locked in." / "3h 42m deep." chosen randomly.
   - Subtle "makemerevise" watermark bottom-right.
3. "Download" button saves as PNG. User uploads to IG story manually and adds music there (we cannot inject IG music via web — IG only allows that inside the IG app).
4. Optional: "Share" button uses the Web Share API on mobile to hand the PNG straight to Instagram.

This adds ~1 new component + 1 modal + 5 background assets. I'd recommend doing this **last** as a separate change, after Phases 1–6 land, because if anything in 1–6 has issues we want a clean diff.

---

## Suggested execution order

1. Phase 1 (auth/gating) — unblocks users immediately
2. Phase 4 (remove PDF) — trivial
3. Phase 5 (music) — trivial after URL test
4. Phase 3 (notes cache + overview)
5. Phase 6 (loading errors) — needs log inspection
6. Phase 2 (truncate tables) — last among destructive ops, after notes pipeline confirmed working
7. Phase 7 (IG story) — separate follow-up

## What I need from you

- **Confirm Phase 2 truncate scope.** Truncating `roadmap_nodes` + `roadmap_sessions` + `study_sessions` + `cached_topic_notes` + `notes_generation_log` will wipe every user's progress, not just yours. OK? Or only wipe yours?
- **Confirm Phase 7.** Build it now in the same pass, or ship 1–6 first and add IG export after?
- Anything to drop from this list?
