# Rebuild the case study pager as a clear, medium-sized navigator

The current pager is a slim pill: it only shows a counter, a truncated brand name, and numbered dots. Too small, and it doesn't read as navigation. The fix is a middle-ground control that shows real previous/next teasers with full titles, plus an obvious jump rail.

## What it will look like

A single card-width navigator, roughly three columns, sitting above the hero and again in the bottom "read next" block:

```text
+---------------------------------------------------------------+
| (<)  PREVIOUS            CASE STUDY 03 / 06           NEXT (>)|
|      Karma Organics      Mount-It! ...                Apparel |
|      full title line     current full title           full    |
|                                                       title   |
+---------------------------------------------------------------+
|  Jump to:  Drive Medical  Mount-It!  Karma  Apparel  ...      |
+---------------------------------------------------------------+
```

- Left and right zones are whole clickable targets (arrow + "Previous"/"Next" label + brand + full case study title, clamped to two lines). Hovering lifts the zone slightly and slides the arrow, so it clearly reads as navigation rather than page content.
- Center shows the current position ("03 / 06") and the current case study's full title, no truncation.
- Bottom row is a "Jump to" rail of brand-name chips (not bare numbers), with the active one filled in the primary color. This is how a reader jumps directly to any study.
- Kept on a neutral card surface with a border, not a large primary-colored block, so it reads as a control strip. Only the active chip and the small labels carry primary color.
- Motion: subtle looping nudge on the next arrow, hover lift on both zones, and the center title cross-fades when the study changes. On mobile the three columns stack to prev/next arrows in one row with the current title beneath, and the jump rail becomes a horizontal scroll strip.

## Technical notes

- Edit only `src/website/components/case-studies/CaseStudyHeroBand.tsx`: replace `ArrowButton` and `Pager` with a single `CaseStudyPager` component; `CaseStudyHeroBand` keeps the same props and both top/bottom usages.
- Brand truncation helper (`shortBrand`) is dropped for the pager; titles use a two-line clamp instead of character slicing.
- Existing tokens and utility classes only (`rounded-pill`, `border-border`, `bg-card`, `shadow-soft`, `font-numeric`, `text-gradient-primary`); no new colors and no Tailwind config change.
- Framer Motion is already imported; no new dependencies.
