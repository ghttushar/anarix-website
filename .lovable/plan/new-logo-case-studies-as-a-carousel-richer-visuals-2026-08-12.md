# New logo, case studies as a carousel, richer visuals

## 1. Light-theme logo
Replace the current light-mode wordmark with the uploaded SVG (new blue `#4A62D9` mark). The dark-theme logo and the favicon stay as they are. `BrandLogo` keeps working unchanged since only the file contents swap.

## 2. Case Studies page becomes a carousel
- Remove the grid of hero nav cards.
- One case study is shown at a time. The page keeps a small "Proof, not promises" header, then a **study hero band** styled like the current chapter dividers used for studies 2 to 6: index, marketplace, brand name, bold headline number, period, plus previous/next arrows and a compact dot row.
- Clicking next or previous swaps the hero **and** the entire chapter body below it, with a smooth cross-fade and directional slide. The URL hash stays in sync so `/case-studies#drive-medical` and the home teasers still deep-link into a specific study.
- The same hero band is repeated at the bottom of the page, so after finishing a study the reader can jump straight to the next one; moving to a new study scrolls back to the top of the new content.
- Scroll progress rail reflects the sections of the current study rather than all six.

## 3. Brand-relevant animated visuals inside each study
Add a small set of animated "mock UI + product context" visuals in the style of the Listing Optimization story section (framed panels, floating chips, count-up numbers, subtle tilt and parallax):
- A hero visual per study: a stylised product card for the category (medical supply, apparel, organics, and so on) with live-looking metric chips animating in.
- One or two supporting visuals per chapter: mock ad console rows, share-of-voice bars, inventory or margin panels, each themed to the study.
- Visuals are generated illustrative imagery plus SVG/motion overlays, no real brand photography, and all reuse the existing design tokens so light and dark modes both hold.

## 4. Home hero visual
Replace the current abstract operations pod with an animated, more realistic composition in the Listing Optimization visual language: a framed managed-operations panel with product cards, live task rows resolving, and metric chips counting up. The hero background and copy stay unchanged.

## 5. Home case-study teasers
Make the carousel visually larger and truly centered: correct the ring offset that pushes the front cards left, widen the cards, keep both front cards symmetric around the page center, and keep uniform card heights.

## 6. Full Stack section background
Add the layered backdrop from the reference: a deep tinted panel behind the grid, faint grid lines and horizontal rules, soft radial glow behind the active card, and a vignette, so the cards sit on a designed surface instead of the bare page.

## 7. Sound familiar? section
- Grow the list from five to six pain cards (adding one on wasted time spent reconciling reports and marketplace fees).
- Move the founder note out of the grid and place it under the six cards as a full-width founder's note card: "We built Anarix because brand owners kept telling us the same thing, not 'I need better software,' but 'I need someone to just handle this.'"

## Technical notes
- `src/assets/brand/anarix-logo-light.svg` overwritten with the uploaded file.
- `src/website/pages/CaseStudies.tsx` rewritten around an active-index state; new `CaseStudyHeroBand` component reused top and bottom; `CaseStudyChapter` keeps its section structure but loses its own hero block.
- New `src/website/components/case-studies/visuals.tsx` for the animated per-study visuals, with a `visuals` field added to entries in `src/website/data/case-studies.ts`.
- New `src/website/components/home/HeroManagedStudio.tsx` replaces `HeroManagedOps` in `HeroSectionNew`.
- `CaseStudyTeasers.tsx` geometry fix; `ExpandingCapabilityGrid.tsx` gains the layered background; `PainPointsSection.tsx` restructured.
