# Listing Optimization tool: make the fetch real, strip the page, add a homepage banner

## What's broken today

The tool's UI flow exists, but the backend it calls does not. `src/website/lib/listingOptimization.ts` POSTs to `/api/listing-optimization/product` and `/api/listing-optimization/send-image`, and there are no such routes in the app — that code only lives in `reference/api/`, which is never served. So clicking **Analyze** today always fails with a network/server error. The rest of the flow (mock audit, mock regeneration, email modal) is client-side and does work.

## 1. Homepage banner

A slim, full-width banner directly after the hero section on the homepage:

- One line of copy calling out the free listing image audit, plus an inline "Analyze my listing" link/button to `/listing-optimization`.
- Subtle entrance motion, brand tokens only, dismissible-free (always visible), full-width click target on mobile.

## 2. Make the product fetch real

New server route `src/routes/api/listing-optimization/product.ts`:

- Accepts a pasted ASIN, Walmart item ID, or full Amazon/Walmart URL; reuses the existing detection/validation logic (ported from `reference/api/_lib/validation.ts`).
- Fetches the public product page server-side with a browser-like user agent and extracts the hero image + title from OpenGraph/JSON-LD/embedded JSON.
- If a product-data API key is configured in secrets later, the route prefers it automatically; without a key it just scrapes. No key is required now.
- If the fetch fails, is blocked, or yields no image, the route returns a demo product (bundled placeholder image + generic title) so the visitor never dead-ends, flagged as `demo: true`.
- Basic per-IP rate limiting and input validation; no data is stored.

New server route `src/routes/api/listing-optimization/send-image.ts`: validates the email and product payload, logs the request server-side, returns success. This is the single seam where your real mail/server integration plugs in later — left intentionally empty of provider code.

Everything after the fetch stays mocked exactly as it is: score + issue list, "Regenerate image", blurred result, "Get image" → email capture.

## 3. Strip the page to just the tool

Remove from `/listing-optimization`: `ShowcaseSection`, `StatsBand`, `GradingRulesSection`, `TestimonialsSection`, `FinalCtaSection`, and the `NextStep` block. Delete those component files (they are used nowhere else).

Then rebuild the page as: compact heading + the tool, followed by the new scroll-reveal feature story below it.

## 4. Scroll-reveal feature story (crop.photo-style)

Below the tool, add a sequence of alternating full-width rows — text left / visual right, then mirrored — matching the pattern in the reference screenshots:

- Gradient-accented headline with the emphasised words in brand accent, body copy underneath, generous whitespace.
- Each row's copy and visual reveal on scroll: copy slides up and fades in, visual enters with a slight scale + offset and a soft floating shadow; small inner elements (score bars, chips, thumbnails) stagger in after the card.
- Visuals are built as in-app mock UI (SVG/DOM cards using our design tokens) — score panels with animated progress bars, a browser-chrome mock with a pasted URL, an issue checklist with pass/fail marks, a marketplace picker card. Rewritten for Anarix/Amazon+Walmart, not copied text.
- Rows: paste-anything simplicity, automatic grading against marketplace rules, multi-marketplace support, click-to-fix regeneration, competitor comparison.
- All motion respects `prefers-reduced-motion` via the existing scroll-reveal hook.

## Technical notes

- New: `src/routes/api/listing-optimization/product.ts`, `.../send-image.ts`, `src/website/lib/productScrape.server.ts` (extraction helpers), `src/website/components/listing-optimization/FeatureStory.tsx` + row visuals.
- Edited: `src/website/pages/ListingOptimization.tsx` (trim sections, add story), `src/website/pages/Home.tsx` (banner), new `src/website/components/home/ToolBanner.tsx`.
- Deleted: the five listing-optimization marketing section components.
- The client helper in `src/website/lib/listingOptimization.ts` keeps its existing contract; only the demo-fallback field is added.
- Verification: hit the route with a real ASIN and a real Walmart URL, confirm a hero image comes back, and walk the full flow in the browser to confirm the mock audit, blurred regeneration, and email modal.
