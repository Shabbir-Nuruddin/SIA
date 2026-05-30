## What Google is showing

Google wraps every favicon in its own white circular chip. Our current `favicon.svg` is a rounded square that doesn't fill that chip, so the white shows through around the logo. Fix = ship a favicon that is itself a full-bleed dark circle, so it visually replaces Google's white chip instead of sitting inside it.

## Changes

**1. Circular favicon (no white halo)**

- Generate `public/favicon.png` (and a 32×32 variant) as a full-bleed circle: deep navy fill `#0F0F1A` covering the entire square canvas as a circle, MMR monogram + arrow + amber dot centered inside with comfortable padding (~12%). PNG, transparent corners outside the circle so Google's chip disappears behind it.
- Replace `public/favicon.svg` with a circular version (circle background, not rounded rect) so SVG-capable browsers match.
- In `index.html`, register both: `<link rel="icon" type="image/png" sizes="48x48" href="/favicon.png">` and keep the SVG as a secondary `rel="icon"`. Also add `<link rel="apple-touch-icon" href="/favicon.png">`.
- Update the JSON-LD `Organization.logo` to point at `/favicon.png` (already does, just confirm file exists).

**2. Better search-result description**

Replace the current generic description with one that leads with the outcome and names the differentiators Google can bold. New copy (≤155 chars):

> "Score higher in A-Levels with a personalised AI revision roadmap, instant-marked mock papers, and topic notes built for Edexcel IAL & Cambridge."

Apply to: `<meta name="description">`, `og:description`, `twitter:description`, and the `WebSite` JSON-LD `description`.

## Files touched

- `public/favicon.png` (new, generated)
- `public/favicon.svg` (rewritten as circle)
- `index.html` (icon links + description trio + JSON-LD description)

## Note on rollout

Google re-crawls favicons on its own cadence (days to weeks). The new icon will appear in search results once Google refetches — no action needed beyond publishing.
