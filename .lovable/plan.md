Case Studies page layout: separate navigation card from case-study hero

1. Refactor `src/website/components/case-studies/CaseStudyHeroBand.tsx` so it renders only the compact navigation pager.
   - Remove the `CaseStudyCarouselCard` wrapper and its hero title, visual, and metrics.
   - Keep `CaseStudyPager` with the three-column previous/current/next layout and the jump-to brand rail below.
   - Make the previous and next step cards fixed equal width and equal height so they stay symmetric.
   - Keep the center column centered and aligned with the left/right cards.

2. Create a new `src/website/components/case-studies/CaseStudyHero.tsx` component that displays the case-study hero content separately.
   - Marketplace badge, case-study counter, brand name, title, hero number, and stat line.
   - Large product/visual on the side.
   - Partner line and metadata chips below.
   - Reuse existing primitives and styles.

3. Update `src/website/pages/CaseStudies.tsx` to use the new layout order.
   - Top: `CaseStudyHeroBand` as a clean navigation-only band.
   - Then: `CaseStudyHero` for the active study.
   - Then: `CaseStudyChapter` body.
   - Then: `LeadCaptureBand`.
   - Then: `CaseStudyHeroBand` again at the bottom (also navigation-only) so readers can move on without scrolling back up.

4. Verify alignment, symmetry, and build output.
   - Ensure the previous/next cards have identical width and height across all breakpoints.
   - Confirm the center current-study content is horizontally and vertically centered.
   - Run the dev build to check for type or rendering errors.
