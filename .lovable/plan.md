# Polish pass: hero visual, nav bar, numbers, scroll-reveal steps

## Answer first: what is currently opt-in (collapsed) content

A shared `Disclosure` component was built and applied in three places:

- Home — "What we run for you" services grid (each service collapses to a title, expands on click; first one open as a hint)
- Listing Optimization — grading rules section (each rule is a collapsible row)
- Case Studies — each case-study chapter body is collapsed behind its heading

Everything else is still fully expanded. Documentation and the product pages were
not converted yet — say the word and I'll extend the same pattern there.

## 1. Favicon and browser tab name

- Save the uploaded logo mark (coral peak + purple wave) as `public/favicon.svg`, point the root route icon at it, and remove the leftover `favicon-legacy.svg` / `favicon-new.svg`.
- Tab title becomes `Anarix.ai` branded across the site: root site name set to `Anarix.ai`, and every route title suffixed `… | Anarix.ai` (home stays a descriptive title plus that suffix).

## 2. Hero visual — replace with a production-grade graphic

Remove `HeroSignalWeave` (the flowing lines) entirely. Replace with a single
composed "operations console" visual: a live account-health panel built from the
brand mark, containing
- a compact marketplace ledger (Amazon / Walmart / Shopify rows) with live-updating spend, TACoS and margin figures that tick and settle,
- a layered margin chart where a "before Anarix" band recedes and a "with Anarix" band rises on load,
- alert chips that resolve one by one (buy-box lost → recovered, stockout risk → reordered), driving a visible health score,
- brand-coloured depth: soft glass panel, gradient edge, subtle parallax on pointer move, staggered entrance, reduced-motion safe (renders a settled static state).

The hero section background (particle field) is untouched.

Optionally I can generate 3 rendered design directions for this panel first so you
pick the look before I build it — tell me if you'd like that.

## 3. Hero copy removals

Delete both lines:
- "Start with a free audit. We'll show you what your account is losing before you pay a thing."
- "Trusted by 500+ brands on Amazon and Walmart" (and the divider it sat on)

## 4. Nav bar

- Remove the "Get a free audit" button.
- Order on the right becomes: Schedule Demo, then Sign In on the far right.
- Alignment fix: single flex row, consistent 12px gaps, all items on one baseline, equal button heights, logo / links / actions in a balanced three-column grid so the centre links stay optically centred.

## 5. Nav bar legibility over colourful content (keep the glass)

Keep `backdrop-blur`, but make the glass opaque enough to always win:
- raise the resting fill to ~85% surface with `backdrop-saturate` + a slight brightness knock-down, so whatever passes underneath is desaturated rather than read-through,
- add an inner hairline ring plus a soft outer shadow to separate the bar from content,
- keep the existing scrolled state as the denser variant (~95%).

Result: still frosted and translucent, but text and buttons keep AA contrast over
bright buttons, gradients and images.

## 6. Numbers use the simpler (body) font everywhere

Add one utility (`.font-numeric`, mapping to the body font stack with tabular
figures) and apply it to numeric displays only — hero stats, count-ups, stat
bands, case-study metrics, pricing figures, chart labels, step numbers. Size,
weight, colour, spacing all unchanged; only the family switches off the display
serif.

## 7. Home "How it works" steps — one card at a time

Rework the home steps section (Diagnose / Take Over / Report / Grow & Scale):
- widen the cards (wider container, more generous padding),
- only one card visible at a time: each card pins centred in the viewport as you
  scroll, fades/scales in on entry and out on exit, so the next one takes its place,
- progress indicator down the side showing which step you're on,
- on mobile and with reduced motion, it degrades to a simple stacked list.

Also deleting the unused duplicate `HowItWorksSection.tsx` (dead file, not rendered
anywhere).

## Technical notes

- Files touched: `src/routes/__root.tsx`, all route `head()` titles, `public/favicon.svg`, `src/website/components/home/HeroSectionNew.tsx`, new hero visual component (replaces `HeroSignalWeave.tsx`), `src/website/components/Navbar.tsx`, `src/website/components/home/ProcessSteps.tsx`, `src/styles/website/_utils.scss` (numeric utility + nav glass tokens), plus targeted `className` additions where numbers render.
- No backend, routing or business-logic changes; hidden routes stay hidden.
