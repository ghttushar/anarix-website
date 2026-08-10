# Rebuild the listing-analyzer story as a pinned, cinematic scroll

## 1. Homepage banner cleanup

Remove the animated score pill from the listing-analyzer banner. Keep only the eyebrow, headline, supporting line, the three proof items and the "Analyze my listing" button, and rebalance the right column so the button sits cleanly without the pill.

## 2. Replace stacked rows with a pinned scroll sequence

Today all six feature rows scroll past normally, at wildly different heights. Rebuild it the way the reference recording works:

- The section becomes a tall scroll track. Inside it, one full-height sticky viewport stays stationary while the page scrolls.
- Copy on the left, visual on the right. As the user scrolls, the current slide's copy and visual cross-fade out and the next one fades/lifts in — the frame itself never moves.
- A slim progress rail (six ticks) on the left edge shows position; clicking a tick jumps to that slide.
- The visual sits in one fixed-size frame (same width and height for all six slides), so nothing jumps between sections.
- Mobile: the pinned behaviour is dropped. Slides stack vertically with the same fixed visual frame and a simple fade-up on entry, so small screens stay usable.
- Reduced motion: no pinning, no cross-fades — plain stacked sections.

Six slides, same order and copy intent as now: Easier than copy & paste · Your images against marketplace rules · Automated quality control · Compare your listing to the competition · Click to fix (Coming soon pill) · Multiple marketplaces.

## 3. Realistic imagery instead of flat SVG placeholders

The current visuals use grey vector placeholders, which is why they read as unfinished. Generate a small set of realistic e-commerce product photos and use them across the slides:

- One hero product on pure white (main-image style), plus 3 variant angles.
- One lifestyle/on-model shot.
- One deliberately bad version of the hero (off-white tinted background, promo text and badge burned in) for the violation slide.
- One competitor product on white for the comparison slide.

These get imported as normal image assets and reused, so the mock UI panels (browser chrome, report card, score bars, violation chips, comment bubbles, before/after frame, marketplace picker) sit on top of photography that looks like a real listing.

## 4. Per-slide visual polish, matched in scale

Each slide's mock UI is rebuilt inside the shared frame with inner elements staggering in after the frame lands: score bars sweep, violation chips pop, thumbnails cascade, comment bubbles slide in one after another, before/after wipes across on the fix slide. Every panel is constrained to the frame so nothing overflows or clips at any width.

## Technical notes

- New: `src/website/components/listing-optimization/StoryScroller.tsx` (sticky track, scroll-driven slide index via `useScroll`/`useTransform`, progress rail, mobile fallback) and one file per slide visual under `listing-optimization/story/`.
- Rewritten: `FeatureStory.tsx` becomes slide data plus the scroller; `storyVisuals.tsx` is replaced by the `story/` folder and deleted.
- Edited: `src/website/components/home/ToolBanner.tsx` (drop `ScoreChip` and its `useCountUp` import).
- New generated images under `src/assets/optimization/`; unused placeholder SVGs that no longer have references get removed.
- Any new utility class needed by the layout gets added to `src/styles/website/_utils.scss` / `_responsive.scss`, since this project uses a hand-maintained SCSS utility system rather than a JIT compiler.
- No backend or analyzer-logic changes; the fetch/mock flow above the story stays exactly as it is.
