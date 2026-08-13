# Site-wide polish: home, platform, case studies, mobile, and a working Jiva chat

A large pass grouped by area. Content data changes (case studies) are verified against the uploaded PDFs before any number is written.

## Home page

1. Partner badges in production: the three badges are referenced through CDN asset pointers. Two of them fail on the deployed site. Fix by shipping the badge images as real bundled assets (imported image files) so they are part of the build output instead of resolved at runtime, and confirm all three render.
2. Rewrite the brand-owners note in a warmer, two-line voice without the quoted-software framing.
3. Full Stack grid: replace the current displacement rule (the displaced tile jumps to a trailing spare column) with a stable reflow, so expanding a card only shifts neighbours into the next slot in reading order. No card ever teleports to the end.
4. Hero channel names: add TikTok, render Amazon / Walmart / Shopify / TikTok in primary blue, larger than body text, with a hand-drawn scribble underline (inline SVG, animated draw-on).
5. Default theme becomes dark (root class + theme context default), light still available via the toggle.
6. Rewrite the "the way we measure is the way we work" line without mentioning accounts or marketplaces.
7. Density pass: fix orphan rows and premature line breaks site-wide - allow headings to fill the line (wider max-width, balanced wrapping), and set grids so item counts divide evenly (four-up rows on case studies rather than 3 + 1). Reduce vertical padding where a section wastes height.
8. Testimonials: swap composition so the name and quote sit above and the video below, keeping the mosaic layout.
9. Listing section: add a realistic before/after product image pair to the comparison.
10. Our Approach: extend the flowing background lines so they visibly terminate at the "Decisions, not to-do lists" card, connecting graphic and copy.

## Platform page

Rework every graphic on the page to mirror the real product UI (dashboard screenshots plus the prototype at the provided link) in a more aesthetic, marketing-grade form: the profitability dashboard, KPI header, waterfall/margin views, and the Jiva panel. Keep them as lightweight motion components, not screenshots.

## Case studies page

1. New, more professional page headline.
2. New sub-headline with no mention of accounts or marketplaces.
3. Redesign the study navigation away from the boxy pager into a lighter, clearly interactive control.
4. Same density fix: all cards fit their row, no single-card overflow row.
5. Audit every study (hero metric, stats, chart anchors, before/after tables, narrative) against the uploaded one-pagers and correct anything that does not match. No invented figures; anything unsupported is removed rather than approximated. The apparel brand stays anonymous.

## Listing audit popup

Randomise on each open: the score (always under 65), plus the issue list and fix suggestions drawn from a larger pool, so repeat opens never look identical.

## Mobile redesign

Rebuild the mobile layout for every page while preserving flow, interactivity and section order: no horizontal overflow, no overlap, no clipped text. Multi-column grids collapse deliberately; the hero visual, capability grid, case-study carousel, testimonial mosaic, popups and nav all get mobile-specific arrangements that read as the desktop design, not a squeezed copy.

## Jiva chat bot

Make the website chat functional end to end against Google Gemini, with the API key as the only missing piece:
- a server-side chat endpoint that reads `GEMINI_API_KEY` from the environment, streams the reply, and returns a clear "not configured" message when the key is absent
- the panel calls that endpoint (replacing the current backend-specific call), with streaming, stop, error state, and a marketing-scoped system prompt
- no backend/database connection is introduced; adding the key later is the only step to go live

## Technical notes

- Badges: real asset imports instead of runtime pointers.
- Capability grid: rewrite `getCardPosition` to a slot-shift model instead of the spare-column swap.
- Theme: dark default in the root document class and `ThemeContext` fallback.
- Case study data stays a single source of truth in `src/website/data/case-studies.ts`; PDFs are parsed first and each figure cross-checked.
- Chat: TanStack server route/function; key read inside the handler; never exposed to the browser.
