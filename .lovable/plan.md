# Homepage polish, badges, case study teasers, testimonials and copy fixes

## 1. Home hero visual (HeroManagedStudio)

- Change the inner grid from three columns to two: featured account panel and a single side rail.
- The "Live" loader in the night shift log turns green (a dedicated success token, added to the SCSS tokens so light and dark both work) instead of muted.
- Replace the floating "37 min / Median time to act" card with plainer language: "Issues fixed within the hour" (number kept in the numeric font, label reads like a human sentence).
- Make "Amazon", "Walmart" and "Shopify" in the hero paragraph bold and highlighted (semibold foreground with a subtle primary tint), so they stand out at a glance.
- Soften the CTA: "Hand it over" becomes "Let's run it for you". The night-shift CTA section headline keeps its tone but drops the blunt "Hand it over." line in favour of "Let us take the night shift."

## 2. Partner badges replace the stats bar

Remove the `$1.2B GMV driven / 500+ Brands managed / 12.8% Avg TACoS` stat trio from the hero and put the official partner badges there instead: Amazon Ads Verified Partner, Walmart Connect Premium Partner, Walmart Marketplace Partner. The badges are cut from the uploaded badge sheet and used as-is, no recolouring, no distortion, original aspect ratio preserved, on a neutral surface so each badge keeps its own background. Note: the sheet you attached has three badges and does not include a 2025 Walmart Awards badge, so I will place the three provided; send that file and I will add it as a fourth.

## 3. Section order and founders note

- Swap "Featured case studies" and "Sound familiar?" so "Sound familiar?" comes first.
- The founders note card under the six pain point cards becomes full width of the grid rather than a narrower centred block.

## 4. Case study teasers

- Redesign the teaser cards so they read as interesting, not dull: outline vector infographics per card (a small line-art motif matched to the metric: rising bars, share ring, cart lift, stock line) behind the big number, cleaner type hierarchy, consistent internal spacing, and a hover lift.
- Fix alignment so every card is identical in geometry and the ring is optically centred.
- Move the previous/next arrows in tight against the carousel so they read as part of that section (arrows flanking the ring at card height, dots directly under the cards) instead of floating far below.

## 5. Full Stack section

- Remove the "Click any card to expand its details" hint line from the bottom of the section.
- Reduce vertical padding on section spacing site wide (tighten the shared section padding utilities) so there is less dead space between sections.

## 6. Testimonials

- Remove all company names from the attribution lines; keep only the person or brand names listed: Drive Medical, Karma Organics, Crazy Cups, Mount-It!, Aquasonic, Pure Daily Care, NapQueen, Pete's Pasta, Mothercould.
- Fix the Nas card alignment: because his video is portrait, that card spans two rows and its quote block sits on the same baseline as Joey's quote block, so the text in both cards lines up.

## 7. Copy and entity cleanup

Fix the literal `&apos;`, `&ldquo;`, `&rdquo;` text showing up in content (it appears where entities were written inside plain JavaScript strings rather than JSX). Replace with real typographic characters across Philosophy, Pain Points, Case Study primitives, hero and teaser copy.

## 8. Navigation and contact

- Rename "Products" to "Platform" in the navbar (route stays `/products`; active-state logic and any related labels updated).
- On the contact page, the "Get in touch" section gains a direct scheduling action using the same Calendly link used for Schedule a demo.

## Technical notes

- Files touched: `HeroManagedStudio.tsx`, `HeroSectionNew.tsx`, `Home.tsx` (order), `PainPointsSection.tsx`, `CaseStudyTeasers.tsx`, `ServicesGrid.tsx`, `ExpandingCapabilityGrid.tsx`, `TestimonialsWrapper.tsx`, `PhilosophySection.tsx`, `case-studies/primitives.tsx`, `Navbar.tsx`, `pages/company/Contact.tsx`, plus SCSS tokens/section-padding.
- Badges are uploaded through the asset CDN as three cropped images and rendered with fixed heights and `object-contain`.
- Framer Motion and existing design tokens only, no new dependencies, no backend changes.
