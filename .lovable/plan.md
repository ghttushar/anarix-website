# Pinned "How It Works", testimonial collage restored, richer story visuals

## 1. Home "How It Works" uses the same pinned transition

Replace the current per-card sticky/dim behaviour in the home steps section with the
exact mechanic from the listing-optimization story:

- One tall scroll track with a single full-height sticky viewport that never moves.
- Copy on the left (step number, icon, title, subtitle, body), a matching visual
  panel on the right — every step gets the same fixed-size frame.
- As you scroll, the current step cross-fades out and the next fades/lifts in.
- Slim four-tick progress rail on the left; clicking a tick jumps to that step.
- Mobile and reduced motion: no pinning, plain stacked cards with a fade-up.

The four steps (Diagnose · Take Over · Report · Grow & Scale) keep their copy. Each
gets a small purpose-built animated visual (leak scan, hand-off queue, P&L report
card, growth curve) so the right frame isn't empty.

## 2. Testimonials — collage layout back, just smaller

Restore the earlier asymmetric collage (12-column: stacked text quotes on the left,
tall video card on the right, wide feature quote across the bottom) instead of the
current 2x2 grid. Keep it compact so it still fits roughly two screens:

- tighter section and card padding, smaller heading block,
- quotes truncated with the existing read-more expander,
- video cards at a shorter aspect ratio,
- rotating trust strip stays where it is.

## 3. Listing-optimization visuals — watermark out, motion up

- Regenerate the "bad listing" photo without any watermark text (keep the off-white
  crumpled background and the SALE badge, since those are the violations the slide
  calls out). Verify the other product photos are clean too.
- Smoother slide choreography: longer, softer easing on enter/exit, a slight
  cross-blur, and directional motion tied to scroll direction so going back up
  reverses rather than replaying forward.
- Richer inner motion per slide: score bars sweep and settle with a counting number,
  violation chips pop in sequence with a pulse on the flagged region, thumbnails
  cascade with a subtle 3D tilt, comment bubbles type in one after another,
  before/after gets a draggable wipe handle that also animates on entry, marketplace
  picker cards flip between marketplace rule sets.
- Ambient depth: soft gradient glow behind the frame that shifts hue per slide,
  gentle pointer parallax on the panel, and a scroll-linked progress ring on the rail.
- All of it reduced-motion safe: static settled states, no parallax, no auto-motion.

## Technical notes

- The scroller becomes shared: `StoryScroller.tsx` is generalised (slide data +
  optional per-slide accent, direction-aware `AnimatePresence`, `useReducedMotion`)
  and moved to `src/website/components/marketing/`, then consumed by both
  `listing-optimization/FeatureStory.tsx` and a rewritten
  `home/ProcessSteps.tsx` (plus a new `home/processVisuals.tsx`).
- `home/TestimonialsWrapper.tsx` reverts to the 12-column collage markup with reduced
  spacing tokens; card components and `QuoteText` are reused as-is.
- `story/slides.tsx` and `story/primitives.tsx` gain the new inner animations; new
  watermark-free image replaces `src/assets/optimization/shoe-bad.jpg`.
- Any new layout/utility class needed goes into `src/styles/website/_utils.scss`
  (hand-maintained SCSS, no JIT).
- No backend, routing, or copy changes beyond the step visuals.
