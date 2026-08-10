import { motion } from "framer-motion";
import { FileText, Search, Settings, TrendingUp } from "lucide-react";

import StoryScroller, { type StorySlide } from "@/website/components/marketing/StoryScroller";
import {
  DiagnoseVisual,
  GrowVisual,
  ReportVisual,
  TakeOverVisual,
} from "@/website/components/home/processVisuals";

const STEPS: StorySlide[] = [
  {
    id: "diagnose",
    eyebrow: "Step 01",
    icon: Search,
    accent: "Diagnose.",
    rest: "We find the leaks.",
    lead: "You decide what to fix.",
    body: [
      "Every account has its own history — and its own blind spots. We don’t run a generic checklist; we dig into your numbers until we find exactly where the money’s leaking, whether that’s ad spend with no return, listings losing the buy box, or compliance risks nobody’s flagged.",
      "No obligation, no fluff — just the truth about where you stand.",
    ],
    visual: <DiagnoseVisual />,
  },
  {
    id: "take-over",
    eyebrow: "Step 02",
    icon: Settings,
    accent: "Take over.",
    rest: "The night shift becomes ours.",
    lead: "The work that eats your nights becomes someone else’s full-time job.",
    body: [
      "Once we know what’s broken, we get to work fixing it. Your dedicated team steps into the day-to-day — reallocating ad budget, cleaning up listings, managing inventory, staying ahead of compliance.",
      "The work that’s been eating your weekends becomes someone’s full-time job instead of your second one.",
    ],
    visual: <TakeOverVisual />,
  },
  {
    id: "report",
    eyebrow: "Step 03",
    icon: FileText,
    accent: "Report.",
    rest: "Real P&L clarity.",
    lead: "Not vanity metrics.",
    body: [
      "You shouldn’t have to dig through a 40-tab spreadsheet to find out if things are working. We break down exactly what changed, what it cost, and what it earned.",
      "Monthly or weekly, whichever you want. Ask us anything, anytime.",
    ],
    visual: <ReportVisual />,
  },
  {
    id: "grow",
    eyebrow: "Step 04",
    icon: TrendingUp,
    accent: "Grow & scale.",
    rest: "Push for the next level.",
    lead: "Once the fundamentals are solid, we shift into growth mode.",
    body: [
      "Costs under control, compliance clean, reporting you trust — that’s the platform growth is built on.",
      "From there we scale up spend, expand into new channels, and go after the next tier of the category.",
    ],
    visual: <GrowVisual />,
  },
];

const ProcessSteps = () => (
  <section className="relative pad-section overflow-hidden">
    <div className="container-wide px-4">
      <motion.div
        className="text-center gap-heading"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          How It Works
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
          From chaos to control.
          <br />
          <span className="text-gradient-primary">In four steps.</span>
        </h2>
      </motion.div>

      <StoryScroller slides={STEPS} />
    </div>
  </section>
);

export default ProcessSteps;
