# Popup fix, section cleanup, nav home link, bigger Full Stack cards

## 1. Lead popup: close button and auto-close

Confirmed by a browser test: the close button is unclickable because the card's content block renders after it and covers it, swallowing every click.

- Give the close button a stacking layer above the content so clicks land on it.
- After submit, show a short confirmation ("Thanks, we will get in touch shortly.") and close the popup automatically after about 2 seconds, with no Close button to press.

## 2. Remove the closing "One suite" CTA outside home

The "One suite / Four products, one operating system" block on the Products page is removed. The home page keeps its own closing CTA. Case Studies keeps its existing closing CTA, unless you also want that one gone.

## 3. Home link in the nav bar

Add "Home" as the first item in the desktop and mobile nav (the logo keeps linking home too), with the same active-underline treatment as the other items.

## 4. The Full Stack section: bigger cards with info graphics

- Increase the section's card scale: taller tiles, larger titles and more internal padding, and drop from 5 columns to 4 so each card gets more room.
- Add a small relevant info graphic to each card, drawn with the existing design tokens (no new dependencies), matched to the service:
  - Advertising management: bid/spend bar sparkline
  - Profit and margin tracking: margin waterfall bars
  - Listing and catalog management: listing block skeleton with a fixed-field tick
  - Inventory and fulfillment oversight: weeks-of-cover gauge
  - Account health monitoring: health meter with a caught-risk pulse
  - Competitive tracking: share-of-voice ring
  - Reporting: stacked report lines
  - Demand-Side Platform: funnel shape
  - Amazon brand support: shield/badge lockup
- Graphics animate in subtly when a card becomes active and stay static otherwise; reduced motion is respected.

## Technical notes

- `LeadCaptureModal.tsx`: z-index fix on the close control, timed auto-close via `setTimeout` cleared on unmount/close.
- `Products.tsx`: delete the trailing CTA section only; `NextStep` and the lead band stay.
- `Navbar.tsx`: add `{ label: "Home", href: "/" }` to `navItems`.
- `ExpandingCapabilityGrid.tsx` gains an optional per-card `graphic` render slot plus size tuning; `ServicesGrid.tsx` supplies the nine graphics as small local SVG components.
