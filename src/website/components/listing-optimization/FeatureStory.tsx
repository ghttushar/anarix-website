import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";

import {
  ReportVisual,
  RulesVisual,
  PenaltyVisual,
  CompareVisual,
  FixVisual,
  MarketplaceVisual,
} from "./storyVisuals";

/**
 * Scroll-revealed feature story below the analyzer.
 * Copy fades up first, the visual lifts in, then its inner elements stagger.
 */

const copyIn = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const cardIn = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
};

interface RowProps {
  eyebrow?: string;
  soon?: boolean;
  accent: string;
  rest: string;
  body: string[];
  visual: React.ReactNode;
  flip?: boolean;
}

const Row = ({ eyebrow, soon, accent, rest, body, visual, flip }: RowProps) => (
  <motion.div
    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 sm:py-28"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-15%" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div variants={copyIn} className={flip ? "lg:order-2" : ""}>
      {soon && (
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Clock className="w-3.5 h-3.5" />
          Coming soon
        </span>
      )}
      {eyebrow && !soon && (
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground">
        <span className="text-gradient-primary">{accent}</span> {rest}
      </h2>
      {body.map((line) => (
        <p key={line} className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl">
          {line}
        </p>
      ))}
    </motion.div>

    <motion.div
      variants={cardIn}
      className={flip ? "lg:order-1" : ""}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div variants={stagger} className="relative">
        {visual}
      </motion.div>
    </motion.div>
  </motion.div>
);

const FeatureStory = () => (
  <section className="mt-16" aria-label="How the listing analyzer works">
    <Row
      eyebrow="No signup, no spreadsheet"
      accent="Easier than"
      rest="copy and paste."
      body={[
        "If you can copy and paste, you can run an audit. Drop in an Amazon ASIN, a Walmart item ID, or the full product URL and we pull the live main image straight off the listing.",
        "Seconds later you get a listing score, the images we found, and a plain-English report on what is holding the set back.",
      ]}
      visual={<ReportVisual />}
    />

    <Row
      flip
      eyebrow="40+ marketplace rules"
      accent="Your images against"
      rest="marketplace rules."
      body={[
        "Images are the biggest lever on marketplace conversion, so we score yours the way the marketplace does — position, framing, background purity, lifestyle coverage, variant count.",
        "Critical issues are separated from nice-to-haves, so you always know what to fix first.",
      ]}
      visual={<RulesVisual />}
    />

    <Row
      eyebrow="Quality control"
      accent="Automated checks that"
      rest="keep listings out of trouble."
      body={[
        "Promotional text, badges, watermarks and tinted backgrounds are the fastest way to get an asset suppressed. We catch them before the listing goes live.",
        "Every flag maps to a published Amazon or Walmart requirement, with the fix spelled out.",
      ]}
      visual={<PenaltyVisual />}
    />

    <Row
      flip
      eyebrow="Benchmarks"
      accent="Compare your images"
      rest="to the competition."
      body={[
        "Scores only mean something in context. Paste a competitor ASIN or item ID and see, side by side, where the category leader is beating you.",
        "Share the comparison with your designer and the brief writes itself.",
      ]}
      visual={<CompareVisual />}
    />

    <Row
      soon
      accent="Click to fix"
      rest="instead of rebriefing a designer."
      body={[
        "Spend your time selling, not retouching. Anarix regenerates a corrected version of your main image — reframed, cleaned up and cropped to the rules it failed.",
        "Preview it in the tool, then have the full-resolution files sent straight to your inbox.",
      ]}
      visual={<FixVisual />}
    />

    <Row
      flip
      eyebrow="Amazon and Walmart"
      accent="Multiple marketplaces?"
      rest="No problem."
      body={[
        "Each marketplace scores images differently. Pick the channel and we grade against that rule set, then show what the same asset would score elsewhere.",
        "One source image, per-channel guidance, one report you can act on today.",
      ]}
      visual={<MarketplaceVisual />}
    />
  </section>
);

export default FeatureStory;
