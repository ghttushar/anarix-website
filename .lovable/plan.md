# Revert two home sections, rebuild case studies uniformly with four studies

## 1. Testimonials — original mosaic back

Restore the original asymmetric mosaic from before the recent rework:

- 12-column grid: left column (7 cols) stacks the Mount-It! text quote and the
  Joey Dweck video card; right column (5 cols) holds the tall 9:16 Karma Organics
  video; the Drive Medical quote spans the bottom.
- Full quotes (no truncation/read-more), original card padding and radial glow.
- Dark gradient video cards stay as they are.
- The rotating trust strip stays where it is now.

## 2. How It Works — previous style back

Revert the home "How It Works" section to the earlier one-card-at-a-time behaviour:
each step owns a tall scroll track, pins centred in the viewport while active, then
hands over to the next, with the slim four-tick progress rail on the left. Copy stays
the same. The pinned cross-fade scroller remains in use on the listing-optimization
page only; the home-specific step visuals are dropped.

## 3. Case studies rebuilt in one uniform format

All studies get the same chapter template, driven by one data file, with loud, bold
headline numbers:

- **Hero band**: brand name, marketplace, period, then 3–4 oversized count-up numbers.
- **The Challenge**: four short cards.
- **The Approach / Reset**: numbered steps (01–04).
- **The Numbers**: chart plus a before/after table where the data supports it.
- **Quote** with name, title, brand.
- Same order, same spacing, same type scale for every study.

### Studies included

1. **Drive Medical — Walmart, Medical Supply** (content updated to the new one-pager)
   +234% Walmart 1P revenue YoY · +101% combined Walmart revenue · 1P share 25%→70% ·
   ~6x average ROAS while scaling spend.
2. **Mount-It! — Walmart, Electronics** (new)
   +221% online sales · +107% in-store sales · +250% new-to-brand customers ·
   May 13 – Jul 13, 2025.
3. **Karma Organics — Amazon, Beauty & Personal Care** (new)
   +85% best month vs. prior average · +43% avg monthly sales · 409 → 57 campaigns ·
   3.30x blended ROAS held · -6% cost per order.
4. **Popular apparel seller — Amazon, Apparel** (existing, stays unnamed)
   Kept as-is content-wise, reformatted into the uniform template.

### Hero nav cards

The case-studies page hero gets four nav cards, one per study, each showing:
brand name in bold, the single headline number large, and the marketplace. Clicking
scrolls to that chapter; the active chapter's card highlights as you scroll.

### Teasers on the home page

The Featured Case Studies section shows a teaser per study in the same uniform card
shape: brand name, big headline number with its stat line, marketplace, up to three
KPI chips, mini chart, and "Explore case study" link.

## 4. No dark sections in light mode

Any full-width section that renders on a dark surface in light mode is switched to the
light surface tokens (background / card / muted) with border and shadow for separation.
Testimonial video cards are the deliberate exception and keep their dark gradient.

## Technical notes

- `src/website/data/case-studies.ts` grows to four `CaseStudyData` entries; the type
  gains optional fields for the before/after table and the nav-card headline. Chart
  series come from the one-pager numbers (indexed where the source is indexed).
- `CaseStudyChapter.tsx` and `case-studies/primitives.tsx` are tightened so a single
  code path renders all four studies; per-study one-off markup is removed.
- `src/website/pages/CaseStudies.tsx` renders the four nav cards, four chapters with
  `ChapterDivider` between them, and updates `ScrollProgress` to five ticks.
- `ProcessSteps.tsx` returns to the sticky per-step panel implementation;
  `home/processVisuals.tsx` is deleted. `marketing/StoryScroller.tsx` stays for the
  listing page.
- `TestimonialsWrapper.tsx` returns to the original mosaic markup, keeping the
  `TrustMarquee` import.
- Any new utility class goes into `src/styles/website/_utils.scss` (hand-maintained SCSS).
- No backend or routing changes.
