# Rebuild the case study pager as a clear, medium-sized navigator

The user likes the bottom "Read the next case study" block on the page. The current top pager is too small and doesn't read as navigation. The fix is to turn that bottom-card style into a real carousel navigator that appears at the top and the bottom of the page.

## What it will look like

A wide card with a strong horizontal layout, similar in footprint to the bottom block but now functioning as both a title card and a navigation surface:

```text
+------------------------------------------------------------------+
|  PREVIOUS          CASE STUDY 03 / 06               NEXT          |
|  Drive Medical       Mount-It! ...                Apparel Seller  |
|  full title          full current title           full title      |
|                                                                   |
|  Jump to:  Drive Medical  Mount-It!  Karma  Apparel  Food  ...   |
+------------------------------------------------------------------+
```

- Left and right are whole clickable target zones with an arrow and a small teaser card: "Previous" / "Next" label, the neighboring brand, and the neighboring case study's full title (clamped to two lines). Hover lifts the zone and nudges the arrow, so the navigation is obvious.
- Center shows the current position ("03 / 06") and the current case study's full title, no truncation. The center can also be a non-clickable "you are here" area.
- Below that is a "Jump to" rail of brand-name chips (not just numbers). The active study is filled in the primary color; the rest are subtle ghost chips. This gives direct access to any study.
- The whole control sits on a neutral card surface with the same border and shadow as the bottom block, keeping it as part of the page design but clearly a control. Primary color is used sparingly for the active chip and small labels.
- Motion: subtle looping nudge on the next arrow, hover lift on the prev/next zones, and the center title cross-fades when the study changes. On mobile, the prev/next zones stack or collapse to a single compact row.

## What stays and what changes

- Keep the bottom block, but reframe it so it is the same component as the top navigator. The bottom will show "Read the next case study" plus the same pager row below it, so the bottom becomes a natural continuation of the top navigation.
- Replace the top `Pager` pill with this new card-style navigator. The hero number, brand, title, and hero image still live above it, so the top navigator is the bridge between the hero content and the body.
- Use the existing design tokens and utility classes only. No new dependencies. No Tailwind config changes.

