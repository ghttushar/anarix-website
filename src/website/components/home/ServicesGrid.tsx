import { motion } from "framer-motion";
import {
  Megaphone, TrendingUp, LayoutPanelTop, Package,
  Shield, Crosshair, FileText, Radio, Building2, Layers,
} from "lucide-react";
import ExpandingCapabilityGrid, {
  type ExpandingCard,
} from "@/website/components/marketing/ExpandingCapabilityGrid";
import {
  SpendSparkline, MarginWaterfall, ListingSkeleton, CoverGauge, HealthMeter,
  ShareRing, ReportLines, DemandFunnel, BrandShield,
} from "./ServiceGraphics";

const services: ExpandingCard[] = [
  {
    icon: Megaphone,
    title: "Advertising management",
    desc: "We run your campaigns daily so every dollar chases what is actually converting.",
    features: [
      "Daily bid, budget and targeting work",
      "Sponsored Products, Brands and Display",
      "Search term harvesting and negatives",
      "Budget pacing with weekly checkpoints",
    ],
    graphic: SpendSparkline,
  },
  {
    icon: TrendingUp,
    title: "Profit and margin tracking",
    desc: "We track what you really keep after fees, ad spend and returns, not just top-line sales.",
    features: [
      "SKU-level contribution margin",
      "Fees, COGS, storage and returns folded in",
      "TACoS watched against margin, not vanity ROAS",
      "Monthly profit readout in plain English",
    ],
    graphic: MarginWaterfall,
  },
  {
    icon: LayoutPanelTop,
    title: "Listing and catalog management",
    desc: "We keep listings optimized, compliant and free of the quiet errors that bleed sales.",
    features: [
      "Title, bullet and A+ content rewrites",
      "Variation and parentage clean-up",
      "Image and video refreshes",
      "Suppressed and stranded listing recovery",
    ],
    graphic: ListingSkeleton,
  },
  {
    icon: Package,
    title: "Inventory and fulfillment oversight",
    desc: "We watch stock so you never lose the Buy Box to a stockout, or overpay to store what is not moving.",
    features: [
      "Weeks-of-cover forecasting per SKU",
      "Restock and shipment plan reviews",
      "Aged and excess inventory action lists",
      "FBA and WFS placement decisions",
    ],
    graphic: CoverGauge,
  },
  {
    icon: Shield,
    title: "Account health monitoring",
    desc: "We catch policy risks and performance issues before they become suspensions.",
    features: [
      "Policy and compliance sweeps",
      "Case filing and follow-through",
      "Performance metric watchlist",
      "Escalation path for hard blocks",
    ],
    graphic: HealthMeter,
  },
  {
    icon: Crosshair,
    title: "Competitive tracking",
    desc: "We watch what competitors do to your rankings and visibility, and move before it costs you sales.",
    features: [
      "Share of voice by category and keyword",
      "Competitor pricing and promo monitoring",
      "Rank movement alerts",
      "Counter-plays briefed before they ship",
    ],
    graphic: ShareRing,
  },
  {
    icon: FileText,
    title: "Reporting, done for you",
    desc: "You get a clear monthly readout in plain English. No dashboard required, though you can log in whenever you want one.",
    features: [
      "Monthly narrative report",
      "What changed, why, and what is next",
      "Live platform access on request",
      "Ad hoc pulls whenever you ask",
    ],
    graphic: ReportLines,
  },
  {
    icon: Radio,
    title: "Demand-Side Platform",
    desc: "We run programmatic ads off-platform to bring new shoppers in, not just fight for the ones already searching.",
    features: [
      "Audience build and retargeting",
      "Creative rotation and testing",
      "New-to-brand measurement",
      "Full-funnel spend allocation",
    ],
    graphic: DemandFunnel,
  },
  {
    icon: Building2,
    title: "Amazon brand support",
    desc: "We manage Brand Registry, your storefront and IP protection so hijackers do not get the upper hand.",
    features: [
      "Brand Registry and enrollment",
      "Storefront design and upkeep",
      "Counterfeit and hijacker takedowns",
      "Brand analytics reviews",
    ],
    graphic: BrandShield,
  },
];

const ServicesGrid = () => {
  return (
    <section className="relative pad-section overflow-hidden border-t border-border/40">
      <div className="container-wide px-4">
        <motion.div
          className="text-center gap-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Layers className="w-3.5 h-3.5" /> The Full Stack
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            Every function.{" "}
            <span className="text-gradient-primary">One team.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every function below is run by our team on your accounts, day and night.
          </p>
        </motion.div>

        <ExpandingCapabilityGrid cards={services} columns={5} />
      </div>
    </section>
  );
};

export default ServicesGrid;
