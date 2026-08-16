# Testimonials: true mosaic layout (2 portrait, 1 landscape, 2 quote blocks)

## Layout

Rebuild the testimonial grid as a 12-column mosaic with two rows that interlock, so the
portrait videos span both rows and the text blocks fill the remaining pockets. Target
desktop arrangement:

```text
+----------------+---------+----------------+---------+
|  QUOTE (text)  | PORTRAIT|  QUOTE (text)  | PORTRAIT|
+----------------+  video  +----------------+  video  +
|   LANDSCAPE video (wide, spans both quote columns)   |
+-----------------------------------------+------------+
```

- Portrait video cards: `col-span-3`, `row-span-2`, 9:16 media, text and byline above the video.
- Quote cards: `col-span-3` each in row 1.
- Landscape video: `col-span-6` in row 2, 16:9 media, text and byline above the video.
- Both quote cards and the landscape card sit at equal heights so nothing is orphaned.

## Consistency rules kept from the current section

- Quote text, byline and avatar above every video (no read-more expander).
- Video cards keep the brand gradient surface; text cards keep the card surface.
- Same staggered fade-up entrance, same section padding, trust marquee position unchanged.

## Responsive

- Mobile: single column, order = quote, portrait, quote, landscape, portrait.
- Tablet (`md`): two columns, portrait cards keep their 9:16 ratio, landscape spans full width.

## Notes

- Three video slots but only two real video files exist today (Nas portrait, Joey landscape).
  The second portrait slot keeps the existing placeholder person reusing the Nas video until
  you upload the real clip and headshot; swapping it later is a one-line change.
- Preview will be refreshed as part of this change. Repository sync is handled by Lovable's
  GitHub integration rather than from inside the project, so nothing in the code needs to
  change for that.

## Technical

- Only `src/website/components/home/TestimonialsWrapper.tsx` changes.
- Any grid span utility not already present goes into `src/styles/website/_variants.scss`
  (hand-maintained SCSS, no Tailwind JIT).
