# Brand, navigation, content and hero overhaul

Six workstreams. No backend work; all changes are frontend, copy and styling.

## 1. Official logo

- Add both uploaded SVGs as real project files: the dark-ink/colour variation for light mode, the all-white variation for dark mode.
- New `BrandLogo` component that picks the correct variation from the existing theme context (`resolvedTheme`), sized for its context, with `alt="Anarix"`.
- Replace the current text wordmark ("Anarix.ai") in the navbar and the footer with `BrandLogo`.
- Set the site favicon from the logo mark (the diamond/peaks glyph), replacing the current placeholder favicon.

## 2. Hide Home, Pricing, Company (About + Careers)

Routes and page files stay untouched and still resolve if typed directly — only entry points are removed.

- Navbar: remove the `Home` item, the `Pricing` item and the `Company` dropdown (About/Careers). `Contact Us` stays.
- Footer: remove `Pricing` from Resources and remove the whole `Company` column, except a `Contact` link which moves into Resources.
- Remove any in-page links/CTAs pointing at `/pricing`, `/company/about`, `/company/career`, and any "see pricing" buttons on other pages — audited across all pages, replaced with the demo/audit CTA where a button would otherwise disappear.
- Add `robots: noindex` to those routes' `head()` so they drop out of search results, and drop them from any sitemap/`robots.txt` references.
- The logo continues to link to `/`.

## 3. Aan → Jiva (user-facing text only)

- Every visible occurrence of "Aan", "AAN", "Aan AI", "AAN (AI)" becomes "Jiva" / "Jiva AI" across pages, nav, footer, chat panel greeting, page titles, meta descriptions and OG tags.
- File names, component names and CSS classes stay `Aan*` — internal only, no behavioural risk.
- URLs stay as they are (`/products/aan-ai`) so existing links and search results keep working.

## 4. Content audit — remove duplication

Confirmed duplicate: the "Because our AI glows… here are the other boring things Aan also does" block appears both on the Platform/Product page and on the Jiva AI page.

- Keep that section (headline, capability list, chat demo) only on the dedicated Jiva AI page.
- On the Platform page, replace it with a new, non-overlapping section: a short "Where Jiva plugs into your workflow" band — three concrete outcomes with a single link through to the Jiva AI page. New copy, no reuse of the glows line.
- Sweep the remaining pages for other repeated headline/stat/testimonial blocks (hero stat bar, "500+ brands" trust line, process steps) and keep each claim in one canonical place, linking rather than restating.

## 5. Reduce cognitive load — opt-in disclosure

Apply a consistent progressive-disclosure pattern instead of walls of text:

- New reusable `Disclosure` primitive (accessible button + animated height, keyboard operable, `aria-expanded`), and a `CollapsibleCard` variant that shows title + one-line summary collapsed and full body expanded.
- Applied to: long service/capability grids, FAQ-style and documentation content, case-study detail chapters, the pricing feature matrix, listing-optimization grading rules, and any section currently over ~4 paragraphs.
- Rules kept consistent: first item on a page may default open, everything else collapsed; headline, one summary line and the primary CTA always stay visible so a scroll-only visitor still gets the story.
- Motion respects reduced-motion (already configured globally).

## 6. New hero visual

- Background stays exactly as it is (the existing particle/data canvas and section styling are untouched).
- The right-hand "Managed for you" checklist card is replaced with a new animated centrepiece built on the brand logo geometry: the logo's peak/diamond motif rendered as a live "night shift" instrument — marketplace signals flowing in as light trails along the peaks, resolving into a small set of animated readouts (spend guarded, stockouts caught, listings fixed) that cycle on a loop.
- Built with the existing motion library, SVG + transforms only, no new dependencies; loops idle, pauses off-screen, and degrades to a static composed state under reduced motion.
- Sized to hold the same grid column so the hero layout and copy do not shift.

## Technical notes

- Logo SVGs live in `src/assets` and are imported as modules; favicon is a real square file in `public/`.
- Theme-aware logo selection reads `resolvedTheme` from `ThemeContext`; a CSS-only fallback prevents a flash before hydration.
- Nav/footer link data is already declarative arrays in `Navbar.tsx` and `Footer.tsx`, so hiding entries is a data change, not a structural one.
- Disclosure components go in `src/website/components/ui/` with SCSS modules, following the existing SCSS-only styling architecture (no Tailwind).
- Verification: build plus a browser pass over every route at desktop and mobile widths, checking no removed page is linked, no "Aan" string remains in rendered output, and the hero renders in both themes.
