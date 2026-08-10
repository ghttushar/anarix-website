import { motion } from "framer-motion";
import { ArrowRight, ScanSearch, ShieldCheck, Timer, Store } from "lucide-react";

import { Link } from "@/lib/router";
import { useCountUp } from "@/hooks/useCountUp";

const PROOF = [
  { icon: ShieldCheck, label: "40+ marketplace rules", sub: "checked per image" },
  { icon: Timer, label: "Under 10 seconds", sub: "from link to report" },
  { icon: Store, label: "Amazon & Walmart", sub: "separate rule sets" },
];

const ScoreChip = () => {
  const score = useCountUp(87, { duration: 1600 });
  return (
    <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 shadow-soft">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Score
      </span>
      <span className="font-numeric text-base font-bold text-foreground tabular-nums">
        {Math.round(score)}%
      </span>
      <span className="relative w-16 h-1.5 rounded-pill bg-accent/60 overflow-hidden">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-pill bg-primary"
          initial={{ width: "12%" }}
          whileInView={{ width: "87%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
    </span>
  );
};

/** Full-bleed call-out band for the free listing image analyzer. */
const ToolBanner = () => (
  <section className="relative w-full overflow-hidden border-y border-border" aria-label="Free listing image analyzer">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/40 via-background to-primary/10" aria-hidden="true" />
    <div
      className="absolute inset-0 opacity-40 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 15% 20%, hsl(var(--primary) / 0.16), transparent 55%), radial-gradient(ellipse at 85% 80%, hsl(var(--periwinkle) / 0.18), transparent 60%)",
      }}
    />

    <motion.div
      className="relative container-wide px-6 py-8 sm:py-10"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/listing-optimization"
        className="group flex flex-col lg:flex-row lg:items-center gap-8"
      >
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-card/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
            <ScanSearch className="w-3.5 h-3.5" />
            Free tool · No signup
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.15] text-foreground">
            Your main image decides the click.{" "}
            <span className="text-gradient-primary">Find out what it is costing you.</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Paste an ASIN, a Walmart item ID or any product link. We pull the live hero image, grade
            it against marketplace rules and show you exactly what to fix.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:flex lg:flex-col lg:flex-shrink-0">

          {PROOF.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <item.icon className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                <span className="block text-xs text-muted-foreground">{item.sub}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-start lg:items-end gap-3">
          <ScoreChip />
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-6 h-11 text-sm font-semibold text-primary-foreground btn-shine">
            Analyze my listing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  </section>
);

export default ToolBanner;
