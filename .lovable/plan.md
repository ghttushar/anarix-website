# Richer imagery, clearer case-study navigation, contact card, more lead capture

## 1. Better brand-true imagery

Regenerate the six case-study photos as premium, editorial-quality product stills that actually match each brand's category, and reuse them in the home hero:

- Karma Organics (Amazon, beauty and personal care): luxe nail-care and beauty flat lay, glass bottles, soft studio light, warm marble surface.
- Drive Medical (Walmart, medical supply): clean clinical hero of a mobility aid, bright neutral studio.
- Mount-It! (Walmart, electronics): dark-desk ergonomic monitor arm setup, cinematic side light.
- Apparel seller (Amazon, apparel): elevated folded knitwear on stone, editorial styling.
- Specialty food (Walmart, grocery): artisan jars and spices, moody warm still life.
- Multi-category distributor (Amazon): tidy premium assortment grid, soft shadows.

All generated at higher fidelity and wider crops, written to `src/assets/case-studies/`, no watermarks, no text in images. `media.ts` alt text and category labels updated to match. Same files feed `CaseStudyVisual` and the home hero, so both get the upgrade.

## 2. Home hero visual: more polished and meaningful

Keep the current direction (a managed account desk with real product photography and a live work feed) but raise the craft and make it say something:

- Two-tier composition: a large "featured account" panel with the brand photo, channel badge and a small live metric (ROAS, TACoS) that counts, plus a strip of three smaller account tiles that rotate into the featured slot on a timer.
- The work feed becomes a stacked timeline (three visible lines, newest sliding in, older lines fading down) instead of one swapping line, so it reads as an ongoing shift.
- Add a subtle "handled by Anarix" status rail: item flagged, action taken, result, with checkmarks completing in sequence.
- Softer layered lighting (radial glow, hairline inner ring, gentle parallax on hover), reduced-motion respected throughout.
- Keeps the existing hero background untouched.

## 3. Case-study navigation that is obvious

Replace the quiet arrow buttons in `CaseStudyHeroBand` with a clear, creative pager:

- Labelled controls: "Previous case study" / "Next case study" with the next brand name and its headline number shown on the next button, so the affordance is self-explanatory.
- A numbered progress row (1 to 6) with brand initials/labels, active pill filled with the primary color and animated underline.
- Position counter ("03 / 06"), keyboard left/right support, and the bottom band styled as a full-width "Read next" card with the next study's photo thumbnail.

## 4. Contact page: card behind "Get in Touch"

Per the attached reference, the left panel gets a real surface: elevated card with border, layered background tint, blur and shadow so the heading and the three contact rows read clearly in both themes. Contact rows become defined inset chips. Right-hand form gets matching card treatment for symmetry.

## 5. More lead capture across the site

Use the existing `LeadCaptureProvider` / `LeadCaptureModal` (email only, no backend wiring, submit stays a stub):

- Inline email capture band ("Get the marketplace profit teardown") added to Home (above footer), Case Studies (after the CTA), Products and Company/About.
- Every `NextStep` block gains a secondary "Get the teardown" action that opens the modal.
- One exit-intent / 40%-scroll popup per session (sessionStorage flag, dismissible, never on the contact page) that opens the lead modal.
- Floating action island gains an "Email me the teardown" item.

## Technical notes

- Styling stays in the SCSS utility layer already in use; no Tailwind arbitrary values that the class extractor does not generate.
- New images written into `src/assets/case-studies/` and imported through `media.ts`; no new image paths hardcoded in components.
- Lead capture stays frontend-only: no server functions, no database, no email provider. Submit handler is a local success state so backend can be attached later.
