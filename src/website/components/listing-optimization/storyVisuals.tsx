import { motion } from "framer-motion";
import { Check, X, Download, Sparkles, AlertTriangle, ExternalLink, Star, ChevronDown } from "lucide-react";

import heroOptimized from "@/assets/optimization/hero-optimized.svg";
import heroOriginal from "@/assets/optimization/hero-original.svg";
import bgBad from "@/assets/optimization/showcase-bg-bad.svg";
import bgGood from "@/assets/optimization/showcase-bg-good.svg";
import frameBad from "@/assets/optimization/showcase-frame-bad.svg";
import frameGood from "@/assets/optimization/showcase-frame-good.svg";
import lightBad from "@/assets/optimization/showcase-lighting-bad.svg";
import lightGood from "@/assets/optimization/showcase-lighting-good.svg";

/** Shared stagger child used by every visual. */
export const itemIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-3xl border border-border bg-card shadow-medium overflow-hidden ${className}`}>
    {children}
  </div>
);

const Bar = ({ value, delay = 0.3 }: { value: number; delay?: number }) => (
  <div className="h-2 rounded-pill bg-accent/60 overflow-hidden">
    <motion.div
      className="h-full rounded-pill bg-primary"
      initial={{ width: 0 }}
      whileInView={{ width: `${value}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

const ScoreRow = ({ label, sub, value }: { label: string; sub?: string; value: number }) => (
  <motion.div variants={itemIn} className="p-5 border-t border-border">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <p className="font-numeric text-3xl font-bold text-foreground tabular-nums">{value}%</p>
    </div>
    <div className="mt-3">
      <Bar value={value} />
    </div>
  </motion.div>
);

const Tile = ({ src, className = "", style }: { src: string; className?: string; style?: React.CSSProperties }) => (
  <span className={`block overflow-hidden rounded-xl border border-border bg-background ${className}`} style={style}>
    <img src={src} alt="" className="w-full h-full object-cover" />
  </span>
);

const Chrome = ({ tabs, url }: { tabs: string[]; url: string }) => (
  <motion.div variants={itemIn} className="bg-foreground/90 px-3 pt-3 pb-2">
    <div className="flex items-center gap-2">
      <span className="flex gap-1.5 pr-1">
        {["bg-destructive/70", "bg-primary/50", "bg-primary/80"].map((dot) => (
          <span key={dot} className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        ))}
      </span>
      {tabs.map((tab, i) => (
        <span
          key={tab}
          className={`truncate rounded-t-lg px-3 py-1.5 text-[11px] font-medium ${
            i === 0 ? "bg-card text-foreground" : "bg-background/20 text-background/70"
          }`}
        >
          {tab}
        </span>
      ))}
    </div>
    <div className="mt-2 rounded-pill bg-background/15 px-3 py-1 text-[11px] text-background/80 truncate">
      {url}
    </div>
  </motion.div>
);

/* ── 1. Easier than copy & paste ─────────────────────────────── */

export const ReportVisual = () => (
  <Panel>
    <Chrome tabs={["Anarix analyzer", "amazon.com"]} url="anarix.ai/listing-optimization" />
    <div className="p-5 bg-surface-elevated">
      <motion.h3 variants={itemIn} className="font-display text-2xl font-semibold text-foreground">
        Your report is <span className="text-gradient-primary">ready</span>
      </motion.h3>
      <motion.div variants={itemIn} className="mt-4 flex gap-4 rounded-2xl border border-border bg-card p-3">
        <Tile src={heroOriginal} className="w-24 h-24 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground truncate">
            Everyday Trail Runner, Womens
            <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="w-3 h-3 text-primary" fill="currentColor" />
            ))}
            <span className="font-numeric tabular-nums ml-1">24 ratings</span>
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">4 images found</p>
          <div className="mt-1.5 flex gap-1.5">
            {[bgGood, frameBad, lightGood, bgBad].map((src) => (
              <Tile key={src} src={src} className="w-9 h-9" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
    <ScoreRow label="Listing final score" sub="Main image + 3 variants" value={41} />
  </Panel>
);

/* ── 2. Marketplace rules ────────────────────────────────────── */

const CRITICAL = [
  { title: "Wrong position of product", detail: "The subject sits off-centre, so the thumbnail crop clips it." },
  { title: "Missing lifestyle image", detail: "No in-use shot showing scale or context for the buyer." },
  { title: "Not enough informative images", detail: "Marketplaces expect at least four supporting variants." },
];

export const RulesVisual = () => (
  <div className="relative">
    <motion.div variants={itemIn} className="grid grid-cols-[1fr_auto] gap-3">
      <div className="relative">
        <Tile src={frameGood} className="w-full" style={{ aspectRatio: "4 / 3" }} />
        <Tile src={lightBad} className="absolute left-3 top-8 w-24 h-32 shadow-medium" />
        <motion.span
          className="absolute left-3 top-3 rounded-pill bg-destructive px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-medium"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          Missing lifestyle image
        </motion.span>
      </div>
      <div className="flex flex-col gap-2">
        {[bgGood, lightGood, frameBad].map((src) => (
          <Tile key={src} src={src} className="w-14 h-14" />
        ))}
      </div>
    </motion.div>

    <Panel className="mt-4">
      <motion.div variants={itemIn} className="flex items-center justify-between gap-3 px-5 py-4">
        <p className="text-sm font-semibold text-foreground">Amazon overall score</p>
        <p className="font-numeric text-2xl font-bold text-foreground tabular-nums">34%</p>
      </motion.div>
      <div className="px-5 pb-4">
        <Bar value={34} />
      </div>
      <ul className="border-t border-border">
        {CRITICAL.map((issue) => (
          <motion.li key={issue.title} variants={itemIn} className="flex gap-3 px-5 py-3 border-b border-border/60 last:border-0">
            <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-destructive/15 text-destructive flex-shrink-0">
              <AlertTriangle className="w-3 h-3" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{issue.title}</span>
              <span className="block text-xs text-muted-foreground truncate">{issue.detail}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </Panel>
  </div>
);

/* ── 3. Automated quality control ────────────────────────────── */

const POLICIES: { label: string; ok: boolean }[] = [
  { label: "Pure white background", ok: true },
  { label: "No text, logo or watermark", ok: false },
  { label: "Zoom-ready at 1600px", ok: true },
  { label: "No promotional badges", ok: false },
];

export const PenaltyVisual = () => (
  <div className="flex items-start gap-4">
    <Panel className="flex-1">
      <motion.div variants={itemIn} className="px-5 py-3 bg-surface-elevated border-b border-border">
        <p className="text-sm font-semibold text-foreground">Policy check</p>
      </motion.div>
      <ul className="p-3">
        {POLICIES.map((policy) => (
          <motion.li key={policy.label} variants={itemIn} className="flex items-center gap-3 px-2 py-2">
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 ${
                policy.ok ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
              }`}
            >
              {policy.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </span>
            <span className="text-xs text-muted-foreground">{policy.label}</span>
          </motion.li>
        ))}
      </ul>
    </Panel>

    <motion.div
      className="w-1/2 flex-shrink-0 rounded-2xl border border-border bg-card shadow-strong overflow-hidden"
      initial={{ opacity: 0, y: 28, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <img src={bgBad} alt="" className="w-full aspect-square object-cover" />
        <span className="absolute top-2 right-2 rounded-pill bg-destructive px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
          SALE 20% OFF
        </span>
        <span className="absolute bottom-2 left-2 rounded-pill bg-foreground/80 px-2.5 py-1 text-[10px] font-semibold text-background">
          Text on main image
        </span>
      </div>
    </motion.div>
  </div>
);


/* ── 4. Compare to the competition ──────────────────────────── */

const COMPARE_CHECKS: { label: string; ok: boolean }[] = [
  { label: "Image size suitable for zoom", ok: true },
  { label: "No props or presentation clutter", ok: true },
  { label: "Product shown on-model with scale", ok: true },
  { label: "No watermark or warranty text", ok: false },
  { label: "Consistent lighting across variants", ok: true },
];

const COMMENTS = [
  { name: "Akira", role: "Manager, seller agency", text: "We like the drop shadow in the best seller's images — can we mimic that?" },
  { name: "Joan", role: "Seller", text: "Go for it. Feel free to be inspired, just not to plagiarise." },
  { name: "Ramos", role: "Graphics designer", text: "Thanks for the board — enough here to build images that outperform." },
];

export const CompareVisual = () => (
  <div>
    <Panel>
      <motion.div variants={itemIn} className="px-5 py-3 bg-surface-elevated border-b border-border">
        <p className="text-sm font-semibold text-foreground">Compare images</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {[
          { tag: "My listing", src: frameBad, rail: [bgBad, lightBad, frameBad] },
          { tag: "Best seller #1", src: frameGood, rail: [bgGood, lightGood, frameGood] },
        ].map((col) => (
          <motion.div key={col.tag} variants={itemIn}>
            <div className="flex gap-1.5">
              {col.rail.map((src) => (
                <Tile key={src} src={src} className="w-8 h-8" />
              ))}
            </div>
            <Tile src={col.src} className="mt-2 aspect-square w-full" />
            <p className="mt-2 text-xs font-semibold text-muted-foreground">{col.tag}</p>
          </motion.div>
        ))}
      </div>
      <ul className="border-t border-border p-3">
        {COMPARE_CHECKS.map((check) => (
          <motion.li key={check.label} variants={itemIn} className="flex items-center justify-between gap-3 px-2 py-1.5">
            <span className="text-xs text-muted-foreground truncate">{check.label}</span>
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0 ${
                check.ok ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
              }`}
            >
              {check.ok ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
            </span>
          </motion.li>
        ))}
      </ul>
    </Panel>

    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
      {COMMENTS.map((comment, i) => (
        <motion.div
          key={comment.name}
          className="rounded-2xl border border-border bg-card px-3 py-2 shadow-medium"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold text-foreground">
            {comment.name} <span className="font-normal text-muted-foreground">· {comment.role}</span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{comment.text}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ── 5. Click to fix ────────────────────────────────────────── */

export const FixVisual = () => (
  <Panel>
    <motion.div variants={itemIn} className="flex gap-2 p-4">
      {[bgGood, lightGood, frameGood].map((src) => (
        <Tile key={src} src={src} className="w-16 h-16" />
      ))}
    </motion.div>
    <motion.div variants={itemIn} className="relative mx-4 overflow-hidden rounded-2xl border border-border">
      <img src={heroOptimized} alt="" className="w-full aspect-square object-cover" />
      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-pill bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
        <Sparkles className="w-3 h-3" />
        After · Fix it
      </span>
    </motion.div>
    <ScoreRow label="Amazon US, overall score" sub="Women's fashion · footwear" value={62} />
    <motion.div variants={itemIn} className="p-4 pt-0">
      <span className="flex items-center justify-center gap-2 rounded-pill bg-primary h-11 text-sm font-semibold text-primary-foreground">
        <Download className="w-4 h-4" />
        Download fixed images
      </span>
    </motion.div>
  </Panel>
);

/* ── 6. Multiple marketplaces ───────────────────────────────── */

export const MarketplaceVisual = () => (
  <div>
    <motion.div
      className="mb-3 ml-auto w-52 rounded-2xl border border-border bg-card p-4 shadow-strong"
      initial={{ opacity: 0, y: -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <p className="text-xs font-semibold text-foreground">Listing URL</p>
      <p className="mt-1.5 truncate rounded-xl border border-border bg-background px-3 py-2 text-[11px] text-muted-foreground">
        https://www.amazon.com/dp/…
      </p>
      <p className="mt-3 text-xs font-semibold text-foreground">Marketplace</p>
      <p className="mt-1.5 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-[11px] text-foreground">
        Walmart US
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </p>
      <p className="mt-3 flex items-center justify-center rounded-pill bg-primary h-9 text-[11px] font-semibold text-primary-foreground">
        New listing report
      </p>
    </motion.div>

    <Panel>
      <motion.div variants={itemIn} className="px-5 py-4 bg-surface-elevated border-b border-border">
        <p className="text-sm font-semibold text-foreground">Your report is ready</p>
      </motion.div>
      <motion.div variants={itemIn} className="flex items-center gap-3 p-4">
        <Tile src={bgGood} className="w-20 h-20 flex-shrink-0" />
        <div className="flex gap-1.5">
          {[frameGood, lightGood].map((src) => (
            <Tile key={src} src={src} className="w-10 h-10" />
          ))}
        </div>
        <span className="ml-auto rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground whitespace-nowrap">
          Walmart <span className="font-numeric tabular-nums">1000 × 1000</span>
        </span>
      </motion.div>
      <ScoreRow label="Walmart US, overall score" sub="Same asset, Walmart rule set" value={34} />
      <div className="grid grid-cols-2 border-t border-border">
        {[
          { label: "All policies", value: 18 },
          { label: "Best practices", value: 50 },
        ].map((cell) => (
          <motion.div key={cell.label} variants={itemIn} className="p-4 border-r border-border last:border-0">
            <p className="text-xs text-muted-foreground">{cell.label}</p>
            <p className="font-numeric text-xl font-bold text-foreground tabular-nums">{cell.value}%</p>
            <div className="mt-2">
              <Bar value={cell.value} delay={0.5} />
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  </div>
);

