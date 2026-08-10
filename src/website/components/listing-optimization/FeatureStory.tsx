import StoryScroller, { type StorySlide } from "@/website/components/marketing/StoryScroller";
import {
  CompareVisual,
  FixVisual,
  MarketplaceVisual,
  PenaltyVisual,
  ReportVisual,
  RulesVisual,
} from "./story/slides";

/**
 * Pinned, cinematic walkthrough of the analyzer.
 * Desktop pins the section and swaps one slide for the next as you scroll;
 * mobile and reduced-motion fall back to stacked fade-ups.
 */
const SLIDES: StorySlide[] = [
  {
    id: "report",
    eyebrow: "No signup, no spreadsheet",
    accent: "Easier than",
    rest: "copy and paste.",
    body: [
      "Drop in an Amazon ASIN, a Walmart item ID or the full product URL and we pull the live images straight off the listing.",
      "Seconds later you get a listing score, every image we found, and a plain-English report on what is holding the set back.",
    ],
    visual: <ReportVisual />,
  },
  {
    id: "rules",
    eyebrow: "40+ marketplace rules",
    accent: "Your images against",
    rest: "marketplace rules.",
    body: [
      "We score your set the way the marketplace does — position, framing, background purity, lifestyle coverage, variant count.",
      "Critical issues are separated from nice-to-haves, so you always know what to fix first.",
    ],
    visual: <RulesVisual />,
  },
  {
    id: "penalty",
    eyebrow: "Quality control",
    accent: "Automated checks that",
    rest: "keep listings out of trouble.",
    body: [
      "Promotional text, badges, watermarks and tinted backgrounds are the fastest way to get an asset suppressed.",
      "Every flag maps to a published Amazon or Walmart requirement, with the fix spelled out.",
    ],
    visual: <PenaltyVisual />,
  },
  {
    id: "compare",
    eyebrow: "Benchmarks",
    accent: "Compare your images",
    rest: "to the competition.",
    body: [
      "Scores only mean something in context. Paste a competitor ASIN and see, side by side, where the category leader is beating you.",
      "Share the comparison with your designer and the brief writes itself.",
    ],
    visual: <CompareVisual />,
  },
  {
    id: "fix",
    soon: true,
    accent: "Click to fix",
    rest: "instead of rebriefing a designer.",
    body: [
      "Anarix regenerates a corrected version of your main image — reframed, cleaned up and cropped to the rules it failed.",
      "Preview it in the tool, then have the full-resolution files sent straight to your inbox.",
    ],
    visual: <FixVisual />,
  },
  {
    id: "marketplaces",
    eyebrow: "Amazon and Walmart",
    accent: "Multiple marketplaces?",
    rest: "No problem.",
    body: [
      "Each marketplace scores images differently. Pick the channel and we grade against that rule set.",
      "One source image, per-channel guidance, one report you can act on today.",
    ],
    visual: <MarketplaceVisual />,
  },
];

const FeatureStory = () => (
  <section className="mt-16" aria-label="How the listing analyzer works">
    <StoryScroller slides={SLIDES} />
  </section>
);

export default FeatureStory;
