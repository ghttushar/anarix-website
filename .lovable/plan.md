# Before and after section: add listing audit CTA and polish

## Goal

Improve the homepage "Before and after" (ListingSpotlight) section so it is more informative and visually attractive, and add a clear CTA that opens the existing listing audit popup.

## Changes

### 1. Add a CTA for the listing audit popup

- In `src/website/components/home/ListingSpotlight.tsx`, import `useLeadCapture` and `Button`.
- Add a primary CTA below the section headline or below the comparison card: "Analyze my listing".
- Clicking it calls `openLeadCapture("audit")` to open the existing audit popup (same flow as the 15-second auto-trigger).

### 2. Add a short, informative free-analysis line

- Add one line of copy near the CTA: "Get a free listing analysis — see what Anarix would fix on your ASIN or product link."
- Keep it short and punchy; do not add paragraphs or heavy content.

### 3. Make the section more attractive

- Keep the existing drag-to-compare interaction and the self-run / Anarix-run labels.
- Polish the header block: ensure the eyebrow, headline, and new CTA are centered and vertically balanced.
- Add a subtle, site-consistent background treatment (e.g., a soft gradient ring or tinted surface) so the card stands out without clashing with the rest of the page.
- Slightly tighten spacing between the card and the headline/CTA so the section feels like one cohesive unit.

## Files to edit

- `src/website/components/home/ListingSpotlight.tsx`

## Out of scope

- No backend changes.
- No changes to the audit popup itself or the lead capture context.
- No new dependencies.
