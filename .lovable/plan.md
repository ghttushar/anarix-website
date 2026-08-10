# Anarix website — port, cleanup, and Tailwind removal

Bring the `anarix-website-final-state` repo into this project as a clean, professional TypeScript + SCSS codebase, with no Tailwind and no live backend wiring.

## What the repo contains today

- 21 pages, ~17,400 lines of TSX, 116 components
- Tailwind v3 classes in 92 files, plus a partial SCSS token system already in `src/website/styles/`
- React Router v6 routing (`App.tsx` route table)
- An `api/` folder of serverless functions (email, listing optimization, rate limiting, mock providers)
- 88 MB of testimonial video in `public/testimonials/`

## Target shape in this project

```text
src/routes/            one file per page (/, /products, /pricing, /company/about, ...)
src/components/        shared UI (nav, footer, cards, modals) with co-located .module.scss
src/styles/            tokens, mixins, responsive, global reset — SCSS only
src/lib/api/           typed API client + typed stubs, base URL empty
src/data/              static content (case studies, pricing plans)
reference/api/         the original serverless functions, kept for reference, not built
public/testimonials/   videos kept as-is
```

## Work plan

1. **Routing port.** Replace the React Router table with file-based routes, one file per page, preserving every current URL and the existing legacy redirects (`/website/*`, `/product`, `/aan-ai`, `/signals`, `/mcp`). Nav and footer links become type-safe router links. Shared chrome (navbar, footer, scroll progress, theme toggle) moves into the root layout.
2. **Styling conversion.** Remove Tailwind, PostCSS, and its plugins entirely. Promote the existing SCSS token/mixin layer to the single source of truth (colors, typography, spacing, radii, shadows, breakpoints, light/dark theme). Every component gets a co-located `*.module.scss`; all Tailwind utility strings are replaced by semantic class names. Done in one pass, page by page, so the visual result matches the current site.
3. **Backend left unconnected.** One typed API client with an empty base URL read from an env var, and typed request/response contracts for the existing endpoints (lead capture, demo scheduling, listing optimization, image send). With no base URL configured, forms validate and show a clear "not connected" state instead of failing silently. The original `api/` code is preserved under `reference/` so you can port it to your server.
4. **Cleanup.** Remove: the billing-flow pages and context (`cancel-plan`, `downgrade-plan`) and the trial context they depend on, since they have no backend and no nav entry; the hidden-route guard; unused shadcn primitives; duplicated stylesheets (`website.css` alongside `website.scss`); dead exports and unreferenced assets. Every deletion is verified by a reference search first, and anything ambiguous is listed for your call rather than removed silently.
5. **Code quality.** Split oversized page files into focused section components, lift repeated markup into shared primitives, replace copy-pasted animation and count-up logic with the existing hooks, type all props explicitly, and drop `any`. Target: no component file over ~200 lines.
6. **SEO and metadata.** Per-page title, description, and social tags for all pages (currently handled ad hoc), semantic headings, and image alt text.

## Technical notes

- This project runs TanStack Start with TanStack Router; `react-router-dom` cannot be used here, so the route table is rewritten while URLs stay identical.
- Sass is added as a dev dependency; `tailwindcss`, `tailwindcss-animate`, `@tailwindcss/typography`, `autoprefixer`, and `postcss` are removed, along with `tailwind.config.ts` and `tailwind-merge`.
- Framer Motion, Recharts, Lottie, Radix primitives, and Sonner are kept — they carry real behavior.
- Existing Vitest tests are ported and kept green; the API-layer tests move with the reference code.
- Because Tailwind is stripped from all 92 files in a single pass, expect visual review to be worthwhile page by page after delivery.
