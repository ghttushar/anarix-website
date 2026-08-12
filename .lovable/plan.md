# Rebuild the case study navigation as a compact pager

The current pager is a tall block with a large primary-filled rectangle that reads as a page section, not a control, and the labels inside get truncated. Replace it with one slim, unmistakable navigation bar.

## New design

A single-row bar, roughly 56px tall, inside a rounded pill-shaped container with a hairline border and a soft card background:

```text
 (<)   03 / 06   Karma Organics                  [01][02][03][04][05][06]   (>)
```

- Circular icon buttons at the far left and far right, nothing else in them. Neither is filled in the primary color; the "next" button gets a subtle primary tint ring so it still leads the eye.
- Center: the position counter plus the current brand name, on one line, no truncation at desktop width. On mobile the brand name stays and the dot rail collapses to the counter only.
- Between center and the right arrow: a compact numbered dot rail for direct jumps, with the active dot filled. Brand names move into tooltips/`title` so nothing is clipped.
- Accessible labels on both arrows ("Previous case study" / "Next case study") and `aria-current` on the active dot.

## Motion that says "this changes the case study"

- The right arrow chevron plays a slow, looping 3px nudge to the right (repeating, gentle, pauses on hover) so the control reads as interactive at a glance.
- Hovering an arrow slides the chevron and reveals the neighbouring brand name in a small floating label above the button.
- On change, the counter and brand name crossfade with a short slide, and the active dot animates its fill across.
- All of this respects reduced motion (the layout already runs under a global `MotionConfig reducedMotion="user"`).

## Where it appears

- Top of the Case Studies page: just the slim pager, directly under the page heading.
- Bottom of the page: the existing "Read the next case study" preview card stays, with the same slim pager in its footer, so a reader can move on without scrolling up.

## Technical notes

- Rework `Pager` inside `src/website/components/case-studies/CaseStudyHeroBand.tsx`; no other files change. The `studies` / `active` / `onSelect` / `onStep` props stay as they are.
- Remove the two large full-width previous/next cards and the wrapping bordered panel introduced in the last pass.
- Keep the hero band's study intro, big number and visual exactly as they are today.
