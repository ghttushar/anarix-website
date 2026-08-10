import { motion } from "framer-motion";
import { ChevronDown, Download, ExternalLink, Sparkles, Star } from "lucide-react";

import shoeMain from "@/assets/optimization/shoe-main.jpg";
import shoeSide from "@/assets/optimization/shoe-side.jpg";
import shoeTop from "@/assets/optimization/shoe-top.jpg";
import shoeBack from "@/assets/optimization/shoe-back.jpg";
import shoeBad from "@/assets/optimization/shoe-bad.jpg";
import shoeLifestyle from "@/assets/optimization/shoe-lifestyle.jpg";
import shoeCompetitor from "@/assets/optimization/shoe-competitor.jpg";

import {
  Bar,
  CheckRow,
  Chrome,
  Flag,
  IssueRow,
  Panel,
  PanelHead,
  Photo,
  Rail,
  ScoreRow,
  itemIn,
} from "./primitives";

const VARIANTS = [shoeSide, shoeTop, shoeBack];

/* ── 1. Easier than copy & paste ─────────────────────────────── */

export const ReportVisual = () => (
  <Panel className="h-full">
    <Chrome tabs={["Anarix analyzer", "amazon.com"]} url="anarix.ai/listing-optimization" />
    <div className="flex min-h-0 flex-1 flex-col bg-surface-elevated p-4">
      <motion.p variants={itemIn} className="font-display text-lg font-semibold text-foreground">
        Your report is <span className="text-gradient-primary">ready</span>
      </motion.p>
      <motion.div
        variants={itemIn}
        className="mt-3 flex min-h-0 flex-1 gap-3 rounded-2xl border border-border bg-card p-3"
      >
        <Photo src={shoeMain} className="flex-shrink-0" style={{ width: 96, height: 96 }} fit="contain" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-foreground">
            Pastel colorblock high-top sneaker
            <ExternalLink className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="w-3 h-3 text-primary" fill="currentColor" />
            ))}
            <span className="font-numeric ml-1 tabular-nums">124 ratings</span>
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            <span className="font-numeric tabular-nums">4</span> images found
          </p>
          <span className="mt-1.5 block">
            <Rail items={[shoeMain, ...VARIANTS]} size={32} />
          </span>
        </div>
      </motion.div>
    </div>
    <ScoreRow label="Listing final score" sub="Main image + 3 variants" value={41} />
  </Panel>
);

/* ── 2. Your images against marketplace rules ────────────────── */

const CRITICAL = [
  { title: "Wrong position of product", detail: "Subject sits off-centre, so the thumbnail crop clips it." },
  { title: "Missing lifestyle image", detail: "No in-use shot showing scale or context for the buyer." },
  { title: "Not enough informative images", detail: "Marketplaces expect at least four supporting variants." },
];

export const RulesVisual = () => (
  <div className="flex h-full flex-col gap-3">
    <motion.div variants={itemIn} className="relative flex min-h-0 flex-1 gap-2">
      <span className="relative min-w-0 flex-1">
        <Photo src={shoeLifestyle} className="w-full h-full" />
        <Flag className="left-2 top-2">Missing lifestyle image</Flag>
      </span>
      <span className="flex flex-shrink-0 flex-col gap-2">
        {VARIANTS.map((src) => (
          <Photo key={src} src={src} style={{ width: 52, height: 52 }} fit="contain" />
        ))}
      </span>
    </motion.div>

    <Panel>
      <motion.div variants={itemIn} className="flex items-center justify-between gap-3 px-4 pt-3">
        <p className="text-[13px] font-semibold text-foreground">Amazon overall score</p>
        <p className="font-numeric text-xl font-bold text-foreground tabular-nums">34%</p>
      </motion.div>
      <motion.div variants={itemIn} className="px-4 pb-3 pt-2">
        <Bar value={34} />
      </motion.div>
      <ul className="border-t border-border">
        {CRITICAL.map((issue) => (
          <IssueRow key={issue.title} {...issue} />
        ))}
      </ul>
    </Panel>
  </div>
);

/* ── 3. Automated quality control ────────────────────────────── */

const POLICIES: { label: string; ok: boolean }[] = [
  { label: "Pure white background", ok: false },
  { label: "No text, logo or watermark", ok: false },
  { label: "No promotional badges", ok: false },
  { label: "Zoom-ready at 1600px", ok: true },
  { label: "Product fills 85% of frame", ok: true },
];

export const PenaltyVisual = () => (
  <div className="flex h-full gap-3">
    <Panel className="min-w-0 flex-1">
      <PanelHead title="Policy check" />
      <ul className="flex min-h-0 flex-1 flex-col justify-center p-2.5">
        {POLICIES.map((policy) => (
          <CheckRow key={policy.label} {...policy} />
        ))}
      </ul>
      <motion.div variants={itemIn} className="border-t border-border px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground">Suppression risk</p>
        <p className="font-numeric text-lg font-bold text-destructive tabular-nums">High</p>
      </motion.div>
    </Panel>

    <motion.div
      className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-strong"
      style={{ width: "46%" }}
      variants={{
        hidden: { opacity: 0, y: 24, rotate: -2 },
        show: { opacity: 1, y: 0, rotate: 0, transition: { delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <img src={shoeBad} alt="" loading="lazy" className="w-full h-full" style={{ objectFit: "cover" }} />
      <Flag className="left-2 top-2" delay={0.6}>
        Promo badge
      </Flag>
      <Flag className="bottom-2 left-2" delay={0.8}>
        Watermark detected
      </Flag>
      <Flag className="bottom-10 left-2" delay={1}>
        Off-white background
      </Flag>
    </motion.div>
  </div>
);

/* ── 4. Compare to the competition ──────────────────────────── */

const COMPARE_CHECKS: { label: string; ok: boolean }[] = [
  { label: "Image size suitable for zoom", ok: true },
  { label: "No props or presentation clutter", ok: true },
  { label: "Product shown on-model with scale", ok: false },
  { label: "No watermark or warranty text", ok: false },
];

const COMMENTS = [
  { name: "Akira", role: "Seller agency", text: "We like the drop shadow on the best seller — can we mimic it?" },
  { name: "Joan", role: "Seller", text: "Go for it. Be inspired, just don't copy." },
  { name: "Ramos", role: "Designer", text: "Enough here to build a set that outperforms." },
];

export const CompareVisual = () => (
  <div className="flex h-full gap-3">
    <Panel className="min-w-0 flex-1">
      <PanelHead title="Compare images" />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 p-3">
        {[
          { tag: "My listing", src: shoeMain, rail: VARIANTS },
          { tag: "Best seller #1", src: shoeCompetitor, rail: [shoeCompetitor, shoeCompetitor, shoeCompetitor] },
        ].map((col) => (
          <motion.div key={col.tag} variants={itemIn} className="flex min-h-0 flex-col">
            <Rail items={col.rail} size={26} />
            <Photo src={col.src} className="mt-2 min-h-0 flex-1" fit="contain" />
            <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">{col.tag}</p>
          </motion.div>
        ))}
      </div>
      <ul className="border-t border-border p-2">
        {COMPARE_CHECKS.map((check) => (
          <CheckRow key={check.label} {...check} />
        ))}
      </ul>
    </Panel>

    <div className="flex flex-shrink-0 flex-col justify-center gap-2" style={{ width: "32%" }}>
      {COMMENTS.map((comment, i) => (
        <motion.div
          key={comment.name}
          className="rounded-2xl border border-border bg-card px-2.5 py-2 shadow-strong"
          variants={{
            hidden: { opacity: 0, x: 18 },
            show: { opacity: 1, x: 0, transition: { delay: 0.5 + i * 0.18, duration: 0.45 } },
          }}
        >
          <p className="text-[10px] font-semibold text-foreground">
            {comment.name} <span className="font-normal text-muted-foreground">· {comment.role}</span>
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{comment.text}</p>
        </motion.div>
      ))}
    </div>
  </div>
);


/* ── 5. Click to fix ────────────────────────────────────────── */

export const FixVisual = () => (
  <Panel className="h-full">
    <motion.div variants={itemIn} className="flex gap-2 p-3">
      {VARIANTS.map((src) => (
        <Photo key={src} src={src} style={{ width: 44, height: 44 }} fit="contain" />
      ))}
    </motion.div>
    <motion.div
      variants={itemIn}
      className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-2xl border border-border"
    >
      <img src={shoeBad} alt="" loading="lazy" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
      <motion.span
        className="absolute inset-0 block overflow-hidden"
        variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)" } }}
        transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={shoeMain} alt="" loading="lazy" className="w-full h-full" style={{ objectFit: "contain", background: "white" }} />
      </motion.span>
      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-pill bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
        <Sparkles className="w-3 h-3" />
        After · Fix it
      </span>
    </motion.div>
    <ScoreRow label="Amazon US, overall score" sub="Footwear · after fix" value={92} />
    <motion.div variants={itemIn} className="p-3 pt-0">
      <span className="flex items-center justify-center gap-2 rounded-pill bg-primary text-[13px] font-semibold text-primary-foreground" style={{ height: 40 }}>
        <Download className="w-4 h-4" />
        Download fixed images
      </span>
    </motion.div>
  </Panel>
);

/* ── 6. Multiple marketplaces ───────────────────────────────── */

export const MarketplaceVisual = () => (
  <div className="relative h-full">
    <Panel className="h-full">
      <PanelHead
        title="Your report is ready"
        right={
          <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground whitespace-nowrap">
            Walmart <span className="font-numeric tabular-nums">1000 × 1000</span>
          </span>
        }
      />
      <motion.div variants={itemIn} className="flex min-h-0 flex-1 items-center gap-3 p-3">
        <Photo src={shoeMain} className="min-h-0 flex-shrink-0" style={{ width: "42%", height: "100%" }} fit="contain" />
        <span className="flex flex-col gap-2">
          {VARIANTS.map((src) => (
            <Photo key={src} src={src} style={{ width: 40, height: 40 }} fit="contain" />
          ))}
        </span>
      </motion.div>
      <ScoreRow label="Walmart US, overall score" sub="Same asset, Walmart rule set" value={34} />
      <div className="grid grid-cols-2 border-t border-border">
        {[
          { label: "All policies", value: 18 },
          { label: "Best practices", value: 50 },
        ].map((cell) => (
          <motion.div key={cell.label} variants={itemIn} className="border-r border-border p-3 last:border-0">
            <p className="text-[11px] text-muted-foreground">{cell.label}</p>
            <p className="font-numeric text-lg font-bold text-foreground tabular-nums">{cell.value}%</p>
            <span className="mt-1.5 block">
              <Bar value={cell.value} />
            </span>
          </motion.div>
        ))}
      </div>
    </Panel>

    <motion.div
      className="absolute right-3 top-3 rounded-2xl border border-border bg-card p-3 shadow-strong"
      style={{ width: 176 }}
      variants={{
        hidden: { opacity: 0, y: -14 },
        show: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.5 } },
      }}
    >
      <p className="text-[11px] font-semibold text-foreground">Listing URL</p>
      <p className="mt-1 truncate rounded-xl border border-border bg-background px-2.5 py-1.5 text-[10px] text-muted-foreground">
        amazon.com/dp/B0…
      </p>
      <p className="mt-2 text-[11px] font-semibold text-foreground">Marketplace</p>
      <p className="mt-1 flex items-center justify-between rounded-xl border border-border bg-background px-2.5 py-1.5 text-[10px] text-foreground">
        Walmart US
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </p>
      <p className="mt-2 flex items-center justify-center rounded-pill bg-primary text-[10px] font-semibold text-primary-foreground" style={{ height: 30 }}>
        New listing report
      </p>
    </motion.div>
  </div>
);
