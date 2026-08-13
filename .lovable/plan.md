# Home polish, case study teasers rebuild, contact fix, new interactive section, ASIN popup

## 1. Home hero

- Keep the current side-by-side layout (copy left, visual right) exactly as it is.
- Partner badges: move them up so they sit tight under the hero block (no large gap), and increase badge height from 56/64px to roughly 88/104px so they read as real credentials. Badges stay unaltered: original artwork, original aspect ratio, no recolouring.

## 2. Case study teasers rebuilt

Current problems: pills vary in size, arrows float over the cards and swallow clicks, motifs look crude, cards are short and cramped.

- Rebuild the card with a strict fixed-slot grid so every card is pixel-identical: fixed-height marketplace pill (one size, one padding, uppercase, truncated), fixed-height brand title block, fixed hero-number block, fixed two-up KPI row, fixed footer link row. Card height goes from 390px to about 470px with more internal padding and breathing room.
- Replace the hand-drawn outline motifs with a clean, tasteful visual band per card: a soft tinted header area with a simple, precisely drawn chart glyph (bar climb, share ring, cart, stock curve) rendered on a consistent baseline grid at consistent size and opacity, sitting in its own reserved slot rather than floating behind text.
- Arrows return to their previous position: outside the carousel, on the same row as the dots below the cards, in the flanking positions, with the vertical gap between cards and controls reduced (about 12px instead of 20). Nothing overlaps the cards, so front-card clicks work again.
- Keep the ring carousel motion, autoplay pause on hover, dots and mobile swipe.

## 3. Contact: Get in touch

Reworked as a proper contact panel instead of a button dropped under the info rows:

- Headline and sub-line at the top, then the three contact rows as a clean list.
- A separate, visually distinct scheduling block pinned at the bottom of the card: a bordered row with a small calendar icon, "Prefer to talk it through?" plus a right-aligned "Schedule a demo" button, so the action reads as a deliberate footer action with correct alignment and spacing.
- Balance the two columns: equal top alignment, matching card padding, and the form given the same vertical rhythm so left and right start on the same line.

## 4. New interactive homepage section

Two visual, near-zero-copy sections, placed between existing content bands (after "The Full Stack", before the proof/testimonials block):

**Marketplace network map**
A stylised map/orbit surface with Amazon, Walmart and Shopify nodes. Animated pulses travel along curved paths between nodes and a central Anarix hub: ad spend out, orders in, shipments moving. Hovering a node lights that channel, dims the others and shows one live-looking stat chip. Idle state loops on its own.

**Listing spotlight**
A single product card that upgrades itself on a loop: blurry hero image sharpens, title rewrites word by word, compliance badges snap in, star rating and Buy Box price count up, a small "fixed" checklist ticks through. A drag/hover handle lets the visitor scrub between the before and after state. One headline, one line of copy, no paragraphs.

Both are token-only, Framer Motion, and respect reduced motion.

## 5. Lead capture popup becomes the listing tool

Rebuilt as a wide two-column modal (max width about 4xl, up from md):

- **Left, three quarters:** a three-step flow. Step 1 asks for an ASIN or product URL with one input and a bold "Analyze my listing" action plus a fast trust hook (three short chips, not paragraphs). Step 2 shows an animated analysis pass over a mock product frame, then a blurred regenerated hero image with a mock score and two or three flagged issues. Step 3 asks for the email to receive the full-resolution image, then confirms and auto-closes.
- **Right, one quarter:** an auto-advancing showcase of the animated listing visuals (image grading, score bars, issue checklist, marketplace rules, competitor compare), one at a time on a timed loop with crossfade, plus a one-line caption per visual.
- Everything after the ASIN entry is mock, as before. The email step keeps the existing empty submit seam so a real backend can be attached later.
- Copy is short and punchy throughout: no long body text anywhere in the modal.

## Technical notes

- Edited: `HeroSectionNew.tsx` (badge size and placement), `CaseStudyTeasers.tsx` (card and control rebuild), `pages/company/Contact.tsx`, `Home.tsx` (new section slots), `lead-capture/LeadCaptureModal.tsx`.
- New: `home/MarketplaceNetwork.tsx`, `home/ListingSpotlight.tsx`, `lead-capture/ListingAuditFlow.tsx` and `lead-capture/AuditVisuals.tsx` (the rotating animated panels, in the style of the earlier listing-optimization graphics).
- Framer Motion and existing design tokens only, no new dependencies, no backend work.
