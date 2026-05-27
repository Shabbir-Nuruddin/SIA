# Plan

Three scoped changes. No business logic deleted — code paths are reused, not destroyed.

## 1. Landing features section — remove two tiles

File: `src/pages/Landing.tsx` (the "High-Performance Ecosystem" grid, ~lines 289–343).

- Remove the **Topic Generators** tile (the 📝 one about "generate 10 fresh questions").
- Remove the **Podcast** tile if present. *(Note: I only see Topic Generators in this section — there's no Podcast tile in the current Landing features grid. If you meant the Podcast item in the sidebar, or a tile somewhere else, tell me and I'll target that instead. Otherwise I'll just remove Topic Generators.)*
- Leave routes, the `/questions` page, the `/podcast` page, and all other code untouched.

## 2. Roadmap "Challenge" — generate questions in place, no navigation

Currently `src/pages/Roadmap.tsx` (line ~464) does:
```
navigate(`/questions?...&challenge=1`)
```
which kicks the user off the roadmap into the Topical Questions page.

Change:
- Replace the navigation with an in-page **Challenge drawer** (shadcn `Sheet` from the right, no new component file — used inline in Roadmap.tsx).
- The drawer calls the **same** `ai-question` edge function and reuses the **same** question-rendering UI primitives the `/questions` page uses, so no logic is duplicated or deleted.
- Refactor the question-rendering bits used by `Questions.tsx` into a small shared piece (`src/components/ChallengeRunner.tsx`) that both `/questions` and the new roadmap drawer mount. `Questions.tsx` keeps working exactly as today.
- Same for `AnimatedJourney`'s `onChallenge` and the Dashboard "Start session" link — the Dashboard link stays (that's "start session", not "challenge"); only the **challenge** action becomes in-place.

Result: clicking Challenge on a roadmap node opens a drawer, fetches 5–10 fresh questions, lets you answer, marks them, returns to the roadmap. `/questions` page itself is untouched.

## 3. Roadmap page rebuild — full-bleed, interactive, user-controllable

Today the roadmap is a narrow `max-w-4xl` column with auto-generated nodes only. Rebuild `/roadmap` as a full-bleed workspace:

**Layout**
```text
┌───────────────────────────────────────────────────────────────┐
│  Subject tabs:  [ Chemistry ] [ Biology ] [ Physics ] [ Maths]│
├───────────────────┬───────────────────────────────────────────┤
│  Left rail        │  Main canvas (full width)                 │
│  ───────────────  │  ───────────────────────────────────────  │
│  Units (1..6)     │  Interactive node graph for selected      │
│  Topics per unit  │  unit/topic: drag to reorder, click to    │
│  [+ add custom]   │  expand, mark done, start, challenge,     │
│                   │  delete. Today highlighted.               │
│                   │                                           │
│                   │  View toggle: Journey · Path · Calendar   │
└───────────────────┴───────────────────────────────────────────┘
```

**Interactions**
- Subject tabs at top — switching filters everything below.
- Left rail lists units (from `SUBJECTS`) and their official topics (from `ROADMAP_TOPICS`). Each topic has: status dot, ✚ "schedule this", and a check for "already in my plan".
- "**Add custom topic**" button → user types their own topic + picks date/type — inserts straight into `roadmap_nodes` via the existing `RoadmapCalendar` insert path (reused, not rewritten).
- Main canvas: nodes are draggable (HTML5 drag-and-drop, no new lib) to reorder within a day and to move across days. On drop, update `node_order` / `scheduled_date` in `roadmap_nodes` — same table the calendar already mutates.
- Click a node → inline expansion with: Start session, Mark complete, Skip, **Challenge** (opens drawer from #2), Edit, Delete. All handlers already exist; just wire them.
- Existing `AnimatedJourney`, `RoadmapCalendar`, and view-toggle stay — they're rendered inside the new full-bleed shell instead of inside the cramped column.

**Scope guard**
- No schema changes. No new tables. No edits to `generateRoadmapForUser` or `buildRoadmap`.
- The auto-generated roadmap still works; the user can now add to it or override it.
- All work is in `src/pages/Roadmap.tsx`, with one new presentational file `src/components/RoadmapWorkspace.tsx` to keep Roadmap.tsx readable.

## Files touched

- `src/pages/Landing.tsx` — remove the Topic Generators tile (and Podcast if you confirm location).
- `src/pages/Roadmap.tsx` — swap challenge navigation for in-page drawer; mount new workspace shell.
- `src/components/RoadmapWorkspace.tsx` *(new)* — subject tabs, left rail, drag-and-drop canvas.
- `src/components/ChallengeRunner.tsx` *(new)* — shared question runner extracted from `/questions` so the roadmap drawer reuses it.
- `src/pages/Questions.tsx` — refactor to mount `ChallengeRunner` (behavior unchanged).

## One thing to confirm before I build

The "remove podcast" part — I don't see a Podcast tile in the Landing features grid. Did you mean:
(a) the Podcast item in the **sidebar nav**, or
(b) a Podcast tile somewhere else I should look at, or
(c) skip it — only Topic Generators needs to go?
