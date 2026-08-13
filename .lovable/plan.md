# Home polish, teaser rework, and two separate lead popups

## 1. Remove the "One operating layer" heading

In the marketplace network section, drop the eyebrow pill ("One operating layer") and the headline ("Every channel, one nervous system."). The interactive graphic stays and moves up into the freed space.

## 2. Rework the case study teasers on the home page

Rebuild the teaser card visual so all six cards read as one clean family:

- Replace the flat glyph band with a real brand-category photo (the existing case study images) as a soft, cropped top band with a gentle parallax/zoom on the active card.
- One bold metric, brand name, marketplace pill, all on a fixed baseline so every card is pixel-identical in height and alignment.
- Motion: the active card lifts and sharpens, side cards recede and desaturate slightly; the metric counts up when a card becomes active; arrows sit just outside the card cluster and stay clickable.

## 3. Move the before/after section

"Before and after / Drag the handle. Watch the listing lift." moves to sit directly after the How It Works section instead of its current position higher on the page.

## 4. Two separate lead popups, wired differently

Today one modal does both jobs. Split it:

- **Teardown capture** (opened by every "Email me the teardown" band and button): a short, focused modal, name plus work email plus marketplace, confirmation message, auto-close. No ASIN flow.
- **Listing audit popup** (the ASIN flow): no longer tied to the teardown buttons. It opens automatically 15 seconds after the visitor lands, once per session, and never on the contact page.

## 5. Bigger, richer listing audit popup

- Increase the modal height so the flow and the visual column both breathe (taller panel, roughly 640px of content area, still scroll-safe on small screens).
- The 1/4 visual column plays the richer, photo-based listing visuals (real product photography with the scanning/grading overlays), same look as the earlier listing optimization section, instead of the current flat card mocks.

## 6. Validate the ASIN or product URL

Before the audit starts, validate the input client-side and show an inline error when it does not match:

- 10-character Amazon ASIN (B0 style or ISBN-like).
- Amazon product URL containing `/dp/`, `/gp/product/`, or an ASIN.
- Walmart item ID (numeric, 6 to 12 digits) or a `walmart.com/ip/...` URL.

Anything else gets "Paste an Amazon ASIN, Walmart item ID, or a product link from either." The submit button stays disabled until the input parses.

## 7. Home hero visual as two columns

Match the attached reference exactly, minus the dead space marked in the screenshot: the studio card becomes a true two-column card — the account summary panel on the left, the marketplace thumbnail stack on the right filling its full column width. The status chips row below spans the full card width, and the night shift log stays full width underneath. No empty third column at any breakpoint.

## Technical notes

- Edited: `MarketplaceNetwork.tsx` (header removal), `CaseStudyTeasers.tsx` (card visual and motion), `Home.tsx` (section order, popup timing), `HeroManagedStudio.tsx` (two-column grid), `LeadCaptureContext.tsx` (two modal kinds), `LeadCaptureBand.tsx` (opens teardown), `LeadCaptureModal.tsx` (sizing, routes to the right flow), `ListingAuditFlow.tsx` (validation), `AuditVisuals.tsx` (photo-based visuals).
- New: `TeardownModal.tsx` (or a teardown variant inside the existing modal shell), a small `parseListingInput.ts` validator, and one or two generated product photos if the existing case study images do not suit the audit visuals.
- Backend stays unwired: both forms keep their current no-op submit seam.
