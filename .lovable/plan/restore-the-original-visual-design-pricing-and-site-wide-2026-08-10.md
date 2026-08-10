# Restore the original visual design (Pricing and site-wide)

You're right: the Pricing page markup was not redesigned. `src/website/pages/Pricing.tsx` is byte-identical to the original repo except for the router import and the two removed billing contexts. The visual difference comes from the SCSS layer I built to replace Tailwind — it does not reproduce Tailwind's defaults and the original design tokens 1:1.

## What I verified is actually different

1. **Fonts are wrong.** The original loads Noto Sans (body), Satoshi (headings), Fraunces (display) and Allura, with base rules `body { font-family: var(--font-body) }` and `h1–h6 { font-family: var(--font-heading) }`. The port loads Inter + Sora and sets `.website-scope { font-family: 'Inter' }`, with no heading-font rule. Every heading and paragraph renders in the wrong typeface.
2. **Color tokens were rewritten.** Original light mode: `--background: 230 33% 97%`, `--foreground: 240 53% 9%`, `--primary: 229 65% 57%`, plus the "Periwinkle System 01" secondary/accent values. The port uses different values (`228 25% 97%`, `209 22% 14%`, `230 65% 57%`, …), so surfaces, text and brand blue are all slightly off.
3. **`text-*` utilities set no line-height.** In Tailwind, `text-sm` is 0.875rem/1.25rem, `text-lg` is 1.125rem/1.75rem, `text-3xl` is 1.875rem/2.25rem, and so on. My `.text-*` classes only set `font-size`, so everything inherits `line-height: 1.5` from body. Measured on /pricing: `text-sm` = 14px/21px (should be 20px), `text-lg` = 18px/27px (should be 28px). This is what makes cards, table rows and stacked text look taller and airier than the original.

Spacing utilities themselves check out (`mb-5` = 20px, `pad-card` = 24px, `gap-heading` = 48px, grid columns resolve correctly), so no layout markup or spacing token needs to change.

## Fix

**Fonts** — in `src/routes/__root.tsx`, load the original font set (Noto Sans, Fraunces, Allura, Inter) and the Satoshi `@font-face`. In `src/styles/website/website.scss`, define `--font-heading` / `--font-body` as the original did, set `.website-scope` body font from `--font-body`, and add the scoped `h1–h6 { font-family: var(--font-heading) }` base rule the original had.

**Tokens** — port the original `:root` and `.dark` token blocks from the repo's `src/index.css` verbatim into `.website-scope` / `.dark .website-scope`, replacing the values I substituted, including the brand aliases (periwinkle, lilac, ink, coral, surface) and the shadow definitions.

**Typography scale** — change `$text-sizes` in `src/styles/website/_tokens.scss` to size/line-height pairs matching Tailwind v3 defaults, and emit both properties in the `.text-*` loop in `_utils.scss`. Explicit `leading-*` classes stay after in the cascade so they still win where the markup sets one.

**Verify** — after the change, re-render /pricing plus the home, products, case-studies, documentation and listing-optimization pages and compare against the original design token/typography values (fonts applied, `text-sm` = 14/20, `text-lg` = 18/28, primary swatch = #4A62D9).

No page markup, component structure or copy changes — this is only the token/typography/font layer that the Tailwind removal replaced.
