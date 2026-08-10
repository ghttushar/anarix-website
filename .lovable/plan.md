# Listing analyzer story rebuild, rotating trust strip, tighter testimonials

## 1. Rebuild the listing-optimization feature sections (match the video)

The current rows below the analyzer use plain stacked panels. The reference walkthrough uses layered, product-real mock UI. Rebuild each row's visual as a composed, overlapping "report" mockup with brand tokens:

- **Easier Than Copy & Paste** — browser-chrome window with two tabs (analyzer + amazon.com), a "Your Report Is Ready" card inside: product thumbnail, star rating, "4 images found" thumbnail strip, then "Listing Final Score" with an animated bar.
- **Your Images Against Marketplace Rules** — overlapping image tiles (main image + variant rail on the right), a floating red "Missing Lifestyle Image" callout pinned over one tile, then an "Amazon Overall Score 34%" panel with three critical-issue rows (icon + title + truncated description).
- **Automated Quality Control To Eliminate Listing Penalties** — a rules checklist card partially hidden behind a foreground product card carrying violation chips ("No Text/Logo/Watermark", "White Background", "SALE 20% OFF" flagged), with a small vertical "Sales" gauge beside it.
- **Compare Your Listing Images to the Competition** — a "Compare Images" window: two thumbnail rails, "My Listing" vs "Best Seller #1" columns, a green/red pass-fail list, plus floating collaborator comment bubbles staggering in.
- **Click to Fix** — "Coming soon" pill above the headline; visual is a variant thumbnail rail, hero product frame with an "After · Fix It Tool" badge, marketplace score row ("Amazon US, Overall Score 62%"), and a full-width "Download Fixed Images" button.
- **Multiple Marketplaces? No Problem** — report card behind a floating marketplace panel (Listing URL field, Marketplace select showing Walmart US, "New Listing Report" button) and a selected Walmart image tile with a `1000 x 1000` label chip.

Motion: each row's copy fades up first, the visual lifts in with scale, then inner elements (chips, bars, comment bubbles, thumbnails) stagger. Score bars animate width on reveal. All respects reduced motion.

Headlines use the accent-first pattern (colored first phrase, dark remainder), copy rewritten for Anarix / Amazon + Walmart.

## 2. Remove "Analyze another product"

Delete that button from the analyzer result state; resetting happens by editing the input.

## 3. Full-width, richer homepage banner

Make the listing-analyzer banner a true full-bleed band (edge to edge, not container-boxed) with more substance:

- Left: eyebrow pill ("Free tool · No signup"), headline, one supporting line.
- Middle: three compact proof items (40+ marketplace rules, under 10s, Amazon + Walmart).
- Right: primary "Analyze my listing" button plus a small animated mini-score chip (score ticking up) for visual interest.
- Subtle gradient/mesh background using brand tokens, soft entrance motion, whole band remains clickable on mobile.

## 4. Rotating trust strip

Replace the static "Trusted by operators at" name list with a continuously scrolling marquee (two duplicated tracks, seamless loop, pauses on hover, static list under reduced motion) containing:

Biogrowth · Crazy Cups · Top Gold Designer Jewellery · Mothercould · American Cannel · Karma Organics · Bird Dog Depot · Onyx · Drive Medical · Setton Farms · Heatlogic · Napqueen · AP Coffee

Applied in both places that render this strip so home and any reuse stay in sync.

## 5. Shrink the testimonials section to ~two screens

Reduce vertical footprint without dropping any testimonial:

- Trim section padding and header block; shorter intro line.
- Cap the long Firat and Joey quotes with a "Read more" inline expander instead of full paragraphs.
- Reduce the vertical video card from 9:16 to a shorter ratio and put the two video cards side by side, with the two text quotes in a tighter row beneath.
- Smaller quote type scale and tighter card padding.

## Technical notes

- Edited: `src/website/components/listing-optimization/FeatureStory.tsx` (row visuals rebuilt; split into small visual components in a `story/` subfolder to keep files short), `src/website/pages/ListingOptimization.tsx` (remove reset button), `src/website/components/home/ToolBanner.tsx` (full-bleed rework), `src/website/components/TestimonialsSection.tsx` + `src/website/components/home/TestimonialsWrapper.tsx` (density + marquee).
- New: `src/website/components/TrustMarquee.tsx` (reusable rotating strip).
- No backend or business-logic changes; the analyzer flow and API stubs stay as they are.
