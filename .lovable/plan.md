# Home hero, case studies, product page rebuild and content polish

## 1. New home hero visual: managed services

Replace `HeroOpsConsole` with a new `HeroManagedOps` visual: less dashboard/technical, more a visual story of a team running your marketplaces.

- Center: a soft "operations desk" composition — an Anarix pod (three animated operator avatars/glyphs) connected by animated arcs to three marketplace channel nodes (Amazon, Walmart, Shopify).
- Around it, work flows in as small floating task cards (Bid raised, Stockout caught, Listing fixed, Case filed) that drift up into the pod and come out as calm outcome pills (Handled, Margin up).
- Motion: staggered entrance, slow orbit, pulsing connection arcs, one card handled every few seconds on a loop, subtle parallax on pointer move. Respects reduced motion.
- Background of the hero section is untouched; layout, copy, and stats bar stay as they are.

## 2. Case studies section (home teasers plus /case-studies)

- Home teasers: fix geometry — equal-height cards, identical internal spacing, aligned brand/marketplace/number baselines, symmetric carousel ring, controls centered under the ring.
- Add detail back per teaser card in a fixed structure: brand, marketplace, one loud number with its label, two supporting metrics, period, "Explore case study" link. Same fields on every card so all cards are identical in shape.
- `/case-studies` chapters: normalize to one strict template — consistent grid columns, same chart height, same KPI chip row, aligned headings and dividers, no orphan single-column blocks.

## 3. Home section order

Move "Sound familiar?" (PainPointsSection) above "The Full Stack" (ServicesGrid).

## 4. "The Full Stack" section restyle

Rebuild it using the same interactive expanding-tile pattern as the Insight Engine `CapabilityGrid` ("Every capability. One engine. Click any card to explore."): a grid of service tiles where the active tile expands to full height with its detail list, connection lines behind, and click-to-explore hint text. Content stays the managed-services stack; only the presentation adopts that pattern.

## 5. Product page rebuild (/products)

Currently four near-identical alternating rows. Rebuild with a distinct layout per product so the page reads as a designed sequence:

- Insight Engine Platform: full-width dashboard band with KPI strip and two panels.
- Jiva AI: split layout with the Jiva mascot present (`AanMascot`, sized large, animated) beside an animated conversation thread.
- Signals: centered narrow column, morning-letter cards stacking in with a vertical timeline rail.
- MCP: two-column tool cards on a tinted surface with code-style chips.

Each gets a consistent section header rhythm (eyebrow, headline, sub, chips) but its own composition, spacing, and reveal motion. Hero and closing CTA alignment tightened.

## 6. Floating action island

Keep the "Ask Jiva" button expanded (mascot plus label always visible) even when the island is collapsed; other action labels still collapse on hover-out.

## 7. Naming and typography cleanup

- Every user-visible "Aan" string becomes "Jiva" (file and component names stay as-is internally).
- Remove em dashes from all website copy, rewriting each sentence with a comma, colon, or period so it still reads naturally.
- Replace every "&" in visible copy with "and" (keeps ampersands inside code/JSX entities only where required).

## Technical notes

- New/edited files: `src/website/components/home/HeroManagedOps.tsx` (new), `HeroSectionNew.tsx`, `PainPointsSection.tsx`/`Home.tsx` ordering, `ServicesGrid.tsx` (rebuilt on the CapabilityGrid interaction model, shared into `src/website/components/marketing/ExpandingCapabilityGrid.tsx`), `CaseStudyTeasers.tsx`, `case-studies/CaseStudyChapter.tsx` and `primitives.tsx`, `pages/Products.tsx`, `FloatingActionIsland.tsx`.
- Copy sweep across `src/website/**` plus route `head()` metadata for em dash, "&", and "Aan".
- Framer Motion only, existing design tokens only, no new dependencies, no backend changes.
