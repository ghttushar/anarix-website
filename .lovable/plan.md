# Add two new case studies, restyle the tool banner, rebuild home teasers as a circular carousel

## 1. New case studies (from the attached decks)

Only two decks were attached (Walmart specialty-food launch, Amazon multi-category growth phase). Both go in using the existing uniform template — hero band with loud numbers, challenge, approach steps, charts, insights, before/after, quote, final metrics. If there was a third study, re-upload it and it will be added the same way.

**Specialty Food Brand — Walmart · Grocery (from-scratch launch)**
- Headline: +394% total growth, launch month to month 9
- Supporting: 8 of 8 months grew month over month, +22.5% average MoM growth
- Chart: sales index by month (100 → 500) with launch / optimize / scale anchors
- Before/after table: sales, catalog, reviews, advertising, fulfillment, visibility, budget logic
- Approach: Foundation → Launch → Optimize → Scale and defend
- Quote: "We didn't just want to be listed on Walmart. We wanted a real shot at being found there." — Specialty food brand, Anarix partner

**Multi-Category Amazon Distributor — Amazon · Travel, beauty and food accessories**
- Headline: +380% monthly total sales, Jan → Jun 2026 ($36.3K → $174.3K)
- Supporting: +393% units, +261% ad sales, 6.25x peak ROAS (up from 4.28x)
- Chart: monthly total sales Aug 2025 – Jun 2026 with baseline / first $100K month / peak anchors
- Approach: scale Sponsored Products, expand Sponsored Display (~6x), layer Sponsored Brands, protect efficiency while spend nearly tripled
- Named as "Multi-Category Amazon Distributor" — the deck itself never names the brand publicly

That makes six studies total, all in the same format, all in the case-studies nav cards and progress rail.

## 2. Apparel study stays anonymous

Every "Brooklyn Apparel" reference becomes "A well-known apparel seller" (brand line, intro copy, quote attribution, teaser card, nav card). No invented name anywhere.

## 3. Home page: listing optimization banner stands out

Keep the same layout and copy, raise its presence a notch so it reads as an intentional feature strip, not background:
- Solid tinted surface with a soft periwinkle-to-primary wash instead of the current near-transparent fade, plus a 3px primary accent edge on the left (top edge on mobile)
- Slightly stronger border and an inner shadow so it lifts off the page
- A slow, low-contrast animated sheen across the band and a subtle pulse on the "Free tool" pill
- The three proof items get faint card surfaces so the band has structure

Still light-mode friendly, no dark block, no loud color outside the existing palette.

## 4. Home page: teasers become a rotating circular carousel

Replace the stacked two-column teaser grid. New behaviour:
- Compact cards — brand name, marketplace, one loud number, one short line, and an "Explore" affordance. No chart, no data visualisation, no KPI pill cluster.
- Cards sit on a 3D circular ring: two in front at full scale, two behind at the sides slightly smaller and dimmed, two further back pulled inward and dimmer still.
- Arrow controls and drag/swipe rotate the ring one slot at a time with an eased spring; dots show position. Clicking a front card opens that study.
- Auto-advance slowly, pausing on hover or focus, and stopping for reduced-motion users.
- On small screens the ring flattens into a single-card swipe track with the same controls.

## Technical notes

- `src/website/data/case-studies.ts` — add two `CaseStudyData` entries (specialty food, Amazon distributor) and rename the apparel entry's `brand`, quote `brand`, and intro copy; keep the exported array ordered so the case-studies page and rail pick them up automatically.
- `src/website/pages/CaseStudies.tsx` — no structural change; nav cards and `ScrollProgress` are already driven by the array length.
- `src/website/components/home/ToolBanner.tsx` — background, border, accent edge, sheen animation, proof-item surfaces; new keyframe utility added in `src/styles/website/_utils.scss` if needed.
- `src/website/components/home/CaseStudyTeasers.tsx` — rewritten as a ring carousel (framer-motion transforms, index state, keyboard and drag handlers); `TeaserDashboard`, `MiniLine`, and `MiniStacked` deleted along with the `smoothPath` and `useCountUp` chart imports.
