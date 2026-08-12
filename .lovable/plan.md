# Full Stack card graphics on expand, richer animation, light mode default

## 1. Graphics only inside the expanded card

Today every tile in "The Full Stack" shows its info graphic at all times (dimmed when closed), which makes the grid busy and gives away nothing on click.

- Remove the always-visible graphic block from the collapsed state.
- Move the graphic inside the expand panel, alongside the feature list: on click the card reveals graphic first, then the bullet list, with a short stagger.
- Collapsed cards show icon, title and one-line description only, so the grid reads calm.
- Graphics mount and animate from zero each time a card opens, so the reveal always feels live.

## 2. More realistic, more relevant animated graphics

Rework the nine graphics in `ServiceGraphics.tsx` so each one visually says what its card does, with continuous (looping) motion rather than a single entrance:

- Advertising management: bid/spend bars with a moving budget-pacing line and a sweeping "today" marker.
- Profit and margin tracking: revenue-to-net waterfall with a running net figure and connector steps.
- Listing and catalog: listing card skeleton where fields fill in one by one and a small issue badge flips to resolved.
- Inventory and fulfillment: weeks-of-cover gauge whose needle drifts, plus a restock threshold band.
- Account health: health meter with a pulsing score dot and small policy-flag ticks clearing.
- Share of voice / competitive: rotating share ring with a competitor arc that shrinks as ours grows.
- Reporting: report lines typing in with a small trend chip.
- Demand-side platform: funnel with particles flowing top to bottom into a conversion pill.
- Amazon brand support: shield with a scanning sweep and hijacker markers being removed.

All motion uses existing design tokens (primary, border, muted) and Framer Motion, loops slowly, and respects reduced motion. Height is slightly increased so the graphics read as real visuals rather than icons.

## 3. Light mode by default

Make light the guaranteed first paint:

- Theme resolution defaults to light when no explicit choice is stored, and stops falling back to the OS preference for first-time visitors.
- The `light` class is present on the document from the initial render, so there is no dark flash before hydration.
- The theme toggle keeps working and a visitor's explicit dark choice is still remembered.

## Technical notes

- Files: `src/website/components/home/ServiceGraphics.tsx` (rewritten graphics), `src/website/components/marketing/ExpandingCapabilityGrid.tsx` (graphic moved into the expand panel), `src/contexts/ThemeContext.tsx` and `src/routes/__root.tsx` (light default plus initial html class).
- No new dependencies, no backend changes.
