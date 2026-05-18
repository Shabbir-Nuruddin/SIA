# Roadmap + Smart Calendar Rebuild

Two large features. I'll phase them so you see something working quickly, not wait 3 days for one mega-drop.

## Phase 1 — Roadmap canvas (MVP, ~1 build)

**Tech:** `@xyflow/react` (React Flow). Inherits existing theme tokens (no new palette). Mounted inside the existing `/roadmap` page shell.

**Data source:** existing `user_subjects` + `roadmap_nodes` + `topic_progress` + `exams` tables. No schema changes yet.

**Build:**
- Subject tabs at top (+ "All Subjects") — pulled from `user_subjects`, colors from existing `SUBJECTS` map.
- Graph layout: central "Current Grade" node → subject cluster nodes → unit nodes → topic nodes. Curved bezier edges, subject-tinted.
- Node states: locked / available / in-progress / complete / weak / has-notes (badge icons).
- Pan + scroll-zoom + pinch-zoom + minimap (all free from React Flow).
- Click node → side drawer (not modal) with: topic summary (from `topic_notes` if exists, else AI via existing `ai-notes` function), 3 progressive questions (existing `ai-question` fn), exit check (3 Qs), "Mark weak" toggle.
- Unlock logic: a node becomes `available` only when all `prerequisites[]` are `complete`. Exit-check pass → mark complete + unlock next (trigger `unlock_next_node` already exists).
- Exam urgency banner: if any `exams.exam_date` within 60 days, re-rank that subject's available nodes by past-paper frequency (use existing topic priority from `roadmap.ts`).
- Right-click / long-press → "Mark as Weak Topic" (writes `topic_progress.weak_flag`).

**Skip in Phase 1:** remedial branches, AI-generated graph regeneration, advanced ZPD scoring. Stub these with TODOs.

## Phase 2 — Smart Calendar (next build)

**Tech:** `react-big-calendar` themed with existing tokens. Replaces current calendar tab entirely.

**Build:**
- Month / Week / Day views (Week default on mobile).
- Drag-select availability on Week view (replaces checkbox grid). Stored as new `user_availability` table (recurring + one-off).
- Event types: study_session, blocked_time, academic_event (read-only mirror of `exams`), personal_event. New `calendar_events` table.
- Auto-scheduler: on save, runs existing `buildRoadmap()` logic, slots sessions into free blocks, prioritizes weak topics + upcoming exams, respects manual overrides (flag `is_manual_override`).
- Drag-to-reschedule, "Start Now" button opens roadmap node drawer.
- Weak Topics side panel (collapsible) + lightweight to-do list (new `todos` table, rollover on incomplete).

## What I need from you before I start

1. **Phase 1 first, then Phase 2 in a separate message?** (Recommended — each is 1–2 hours of build.) Or attempt both in one mega-drop?
2. **React Flow OK?** It's the standard for this. Adds ~80kb. Alternative is hand-rolled SVG (slower to build, less polished).
3. **Existing roadmap page** — there's currently `Roadmap.tsx` with a calendar-style view and `RoadmapCalendar.tsx`. Confirm I should **delete** both and replace, not keep as a fallback.
4. **Pending fixes from the last thread** (Instagram story export polish, mobile overlap fixes, music player) — do those still need to ship, or are we parking them while we build this?

Once you answer, I'll start Phase 1 immediately.
