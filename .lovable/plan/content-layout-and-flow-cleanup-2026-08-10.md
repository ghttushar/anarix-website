# Content, layout and flow cleanup

## 1. Remove the collapsed opt-in cards everywhere
Expand all `Disclosure`-wrapped content back to always-visible copy in:
- Home services grid (9 marketplace service cards)
- Listing Optimization grading rules
- Case study chapter "challenge" cards

Then delete the now-unused `Disclosure` primitive.

## 2. Featured Case Studies section (home)
- Remove the industry pill line (`CASE STUDY · WALMART · MEDICAL SUPPLY`, `CASE STUDY · AMAZON · APPAREL`) — both the eyebrow and the metadata line.
- Remove the intro paragraph from both teaser cards (including the apparel Black Friday/TACoS paragraph).
- Make the two cards symmetric: equal-height cards, chart panel aligned to the same top offset in both (drop the hard-coded `lg:mt-[11rem]`), same internal spacing, stats and CTA aligned on a shared baseline.

## 3. Home page section order and removals
- Move "The Full Stack" (services grid) up to be the third section on the page.
- Remove the "Get your free margin audit" lead-capture card from the bottom of the home page (above the footer) and from every other page that renders it (Products, Pricing). The audit CTA component with the "pizza delivery" line goes too.

## 4. Navigation
- Remove the "Build. Measure. Scale." tagline from the Products mega menu.
- Move Documentation out of the "Developers" column and place it last in the Products list, after MCP.
- Remove the duplicate blue "View Product Overview" link at the bottom of the mega menu.

## 5. Closing CTA per page
The same "Ready? / Hand it over. We've got the night shift. / Start with a free audit…" block repeats on Home, Products and Case Studies. Give each page its own headline, sub-copy and eyebrow suited to that page's story, and change the primary button label from "Get your free audit" / audit wording to **Book a demo** (still linking to the Calendly booking link).

## 6. Story-style interconnection between pages
Add a consistent "next step" hand-off near the end of each page so the site reads as one narrative, e.g.:
- Home → Case Studies (proof)
- Case Studies → Products overview
- Products → Insight Engine Platform → Jiva AI → Signals → MCP → Documentation
- Listing Optimization → Platform

Each hand-off is a compact "up next" link block with a one-line reason to continue, using existing tokens and link styles.

## 7. Hero numbers
Highlight the three hero stats ($1.2B GMV driven, 500+ brands managed, 12.8% Avg TACoS) — give the values gradient/primary emphasis and stronger visual separation from the labels, keeping the count-up animation and the numeric font.

## 8. Duplicate scroll-to-top
Remove the standalone `ScrollToTop` button (used by Home and `PageLayout`); keep the arrow-up action inside the floating action island.

## 9. Alignment pass on the Products sub-menu pages
For `/products`, `/products/platform`, `/products/aan-ai`, `/products/signals`, `/products/mcp` and `/documentation`: normalise the page rhythm — one container width, consistent section padding, consistent eyebrow/heading/sub-copy block, grid cards with equal heights and aligned baselines, consistent CTA placement. Content stays the same; only structure and spacing are tidied.

## Technical notes
- Files touched: `src/website/components/home/CaseStudyTeasers.tsx`, `ServicesGrid.tsx`, `HeroSectionNew.tsx`, `Navbar.tsx`, `PageLayout.tsx`, `src/website/pages/Home.tsx`, `Products.tsx`, `Pricing.tsx`, `ListingOptimization.tsx`, `Product.tsx`, `AanPage.tsx`, `SignalsPage.tsx`, `McpPage.tsx`, `Documentation.tsx`, `case-studies/primitives.tsx`, `CaseStudyChapter.tsx`, `listing-optimization/GradingRulesSection.tsx`.
- Deleted: `ui/Disclosure.tsx`, `ScrollToTop.tsx`, `AuditCTASection.tsx`, `lead-capture/LeadCaptureSection.tsx` (the modal/context stay, since the action island still uses them).
- A small shared `NextStep` component will back the page-to-page hand-offs so the pattern stays consistent.
- No backend or data changes; verification via typecheck plus browser screenshots of home, case studies and each product page.
