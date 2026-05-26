## Dashboard UI redesign — command-center layout

**Scope:** `src/pages/Dashboard.tsx` and a thin restyle of `AppLayout.tsx` / `AppSidebar.tsx` chrome on the dashboard route only. No routing, Supabase, auth, handler, or copy changes. No new components or pages.

### 5-bullet plan

1. **Chrome:** On `/dashboard`, force the sidebar into a 64px icon-rail that expands on hover (override current `mmr-sidebar-mode` just for this route via a local wrapper — global toggle behavior preserved). Add a minimal dark top bar with logo, urgency score chip, streak chip, and exam countdown chip. Remove the existing greeting/hero banner.

2. **Module tiles:** Replace the 4-card quick-access row with 5 stacked full-width immersive tiles (~120px tall) for Notes, Practice (Topical Questions), Mock Paper, Roadmap, Podcast — each edge-to-edge, subtle grain overlay, unique tinted background drawn from the palette, large Playfair section label + Inter meta. Reuses existing `<Link>` targets.

3. **Today's Plan → timeline strip:** Re-render the existing sessions list as a single horizontal scrollable timeline (time markers along a rail, session pills anchored to start times, current/next session highlighted). Same data, same Start/Skip/Complete actions, just restyled.

4. **Right panel → slide-in drawer:** Move Urgency arc, Today summary, and Upcoming exams into a right-side Sheet drawer triggered by a floating status button (bottom-right) that shows urgency level dot + streak count. No data changes.

5. **Palette + type:** Add a scoped `.dashboard-shell` style block applying charcoal `#0E0E11`, warm off-white `#F2EFE9`, violet `#7C3AED`, amber `#F59E0B`, Playfair Display headers + Inter UI — scoped to the dashboard only so the rest of the app (Emerald Prestige) is untouched.

### ⚠️ Conflicts with existing project memory — need your call before I build

Project memory locks the global theme to **Emerald Prestige** (emerald + gold, Space Grotesk + DM Sans, *never Inter as primary*). Your brief specifies violet + amber and Inter + Playfair. Two options:

- **A. Scoped override (recommended):** apply the new palette/fonts only inside the dashboard route; rest of app stays Emerald Prestige. Cleanest, no memory rewrite.
- **B. Global swap:** retheme the whole app to charcoal/violet and update memory. Bigger blast radius, affects every page we already built.

Also: brief says "do not add new components" — the slide-in drawer uses the existing shadcn `Sheet` primitive, no new component file. Confirm that's fine.

Reply **A** or **B** (and confirm Sheet usage) and I'll build it.
