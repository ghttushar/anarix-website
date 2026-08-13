# Remove the network graphic, simplify the teardown popup, refresh imagery

## 1. Delete the selected marketplace network section

- Remove the Amazon / Walmart / Shopify "hub" SVG section from the home page and delete its component file. Nothing else references it.

## 2. Teardown popup: drop the marketplace choice

- Remove the Amazon / Walmart / Both pill selector from the free teardown form. It becomes name, work email, and the submit button, so it is a two-field ask.

## 3. Listing optimization popup: more attractive and creative

- Larger, warmer layout: bolder headline, a compact three-point value strip, softer gradient framing and rounded photo plates.
- Analyzing step gets a richer sequence (scan line plus stepped status lines: reading images, checking title, scoring) instead of a bare spinner.
- Result step: score dial with an animated ring and count-up number, issue list with severity dots, and a blurred "regenerated image" plate with a shimmering reveal edge before the email ask.
- Visual column keeps auto-rotating panels but with smoother cross-fades and progress dots.

## 4. New imagery, distinct from the case studies

- Generate a fresh set of product photos used only by the popup visuals and the home hero (studio-lit categories not used in case studies, for example premium coffee/beverage, kitchen appliance, pet care, audio accessory, home fragrance).
- Point the popup visual panels and the home hero cards at these new images so nothing is shared with the case study pages.

## Technical notes

- Delete `src/website/components/home/MarketplaceNetwork.tsx` and its usage in `src/website/pages/Home.tsx`.
- Edit `TeardownForm.tsx` (remove `MARKETPLACES` state and pills).
- Rework `ListingAuditFlow.tsx` and `AuditVisuals.tsx`; modal shell sizing in `LeadCaptureModal.tsx` stays 3/4 + 1/4.
- New assets under `src/assets/marketing/`, imported by `AuditVisuals.tsx` and `HeroManagedStudio.tsx`; case study media map stays untouched.
