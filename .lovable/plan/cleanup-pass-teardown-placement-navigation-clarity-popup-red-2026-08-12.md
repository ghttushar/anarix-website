# Cleanup pass: teardown placement, navigation clarity, popup redesign, route removal

## 1. Move the "Free teardown" band to mid-page everywhere

Today the band sits near the bottom, right above the footer CTA, so it competes with it.

- Home: place it between "The Full Stack" (ServicesGrid) and the "Proof" testimonials section.
- Case Studies and Products: move the band to a mid-page slot (after the main proof/capability block, before the closing narrative), never directly above the footer.
- Copy: replace "margin audit" with "audit" wherever it appears (popup title and confirmation copy).

## 2. Founders note trimmed to two lines

Shorten the note in "Sound familiar?" so it renders as two lines at desktop width, keeping the quoted line intact:

"Brand owners kept telling us the same thing, not 'I need better software,' but 'I need someone to just handle this.'"

## 3. Case-study navigation made obviously clickable

Rework the pager so it reads as navigation at a glance:

- A single prominent "Next case study" control card with the next brand's name, its headline number and a large circular arrow, plus a persistent helper line ("Click to move through all 6 accounts").
- Left/right controls get visible button chrome, hover lift and focus rings; the arrow nudges on hover.
- The numbered rail becomes a labelled step rail (01-06 with brand names), the active step filled, others outlined and clearly interactive.
- Same treatment for the bottom band so readers advance without scrolling up.
- Keyboard: left/right arrow keys step the carousel.

## 4. Lead popup redesign

Replace the long four-field form with a short, warmer card:

- Visual: soft gradient header panel, brand mark, one headline, one short supporting line, three small trust chips (no wall of text).
- Fields: work email plus name only; company and phone removed.
- Single primary button ("Send me the audit") and a small reassurance line.
- Success state: compact confirmation with a single close action.

## 5. Ampersand sweep

Full pass across pages, components and data files replacing the `&` symbol (including `&amp;`) with "and" in visible copy: "P&L" becomes "P and L" in prose or is reworded to "profit and loss", "ROAS & ACoS" becomes "ROAS and ACoS", legal headings updated. Code operators, JSX class syntax and URL query strings are left untouched.

## 6. Remove hidden pages, their routes and their code

Keep only what the navigation and footer link to: home, `/products`, `/case-studies`, `/company/contact`, `/privacy-policy`, `/terms-and-conditions`.

Delete these route files and the page components, sections, data and assets used only by them:

```text
routes: aan-ai, mcp, platform, product, signals,
        products.aan-ai, products.mcp, products.platform, products.signals,
        listing-optimization, documentation, pricing,
        company.about, company.career, company.index, demo
pages:  AanPage, McpPage, SignalsPage, Product, ListingOptimization,
        Documentation, Pricing, Demo, company/About, company/Career
```

Also remove now-orphaned components (listing-optimization folder, story scroller slides, pricing data, product-page-only charts and hero animations) and unused assets, after confirming nothing kept still imports them.

Note: the "Sign In" link points to `/login`, which has no route in this project. It will be left pointing outward as-is unless you want it removed too.

## 7. Smaller testimonial video windows

Reduce the video tiles in the proof collage: tighter aspect ratios and a lower max height so the players read as supporting media rather than dominating the section, keeping the mosaic composition intact.

## Technical notes

- Route deletions regenerate `src/routeTree.gen.ts` automatically; no manual edit.
- Redirect stubs for legacy paths are removed with the destinations, so those URLs will 404 by design.
- Verification: typecheck plus a Playwright pass over the remaining routes to confirm no broken imports or dead links.
