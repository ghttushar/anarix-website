import { motion } from "framer-motion";
import { ArrowRight, ScanSearch, ShieldCheck, Timer, Store } from "lucide-react";

import { Link } from "@/lib/router";

const PROOF = [
  { icon: ShieldCheck, label: "40+ marketplace rules", sub: "checked per image" },
  { icon: Timer, label: "Under 10 seconds", sub: "from link to report" },
  { icon: Store, label: "Amazon and Walmart", sub: "separate rule sets" },
];

/** Full-bleed call-out band for the free listing image analyzer. */
const ToolBanner = () => (
  <section
    className="relative w-full overflow-hidden border-y border-primary/25 shadow-soft"
    aria-label="Free listing image analyzer"
  >
    {/* Tinted surface, reads as an intentional feature strip, not background. */}
    <div className="absolute inset-0 bg-accent/70" aria-hidden="true" />
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 12% 15%, hsl(var(--primary) / 0.20), transparent 55%), radial-gradient(ellipse at 88% 85%, hsl(var(--periwinkle) / 0.26), transparent 60%)",
      }}
    />
    {/* Accent edge: top on mobile, left on desktop. */}
    <div
      className="absolute left-0 top-0 w-full h-[3px] lg:w-[3px] lg:h-full bg-gradient-to-r lg:bg-gradient-to-b from-primary via-primary/70 to-primary/30"
      aria-hidden="true"
    />
    {/* Slow, low-contrast travelling sheen. */}
    <motion.div
      className="absolute inset-y-0 w-1/3 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(100deg, transparent, hsl(var(--card) / 0.55), transparent)",
      }}
      initial={{ x: "-40%" }}
      animate={{ x: "340%" }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
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
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-pill border border-primary/30 bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-soft"
            animate={{ boxShadow: [
              "0 0 0 0 hsl(var(--primary) / 0.28)",
              "0 0 0 8px hsl(var(--primary) / 0)",
            ] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          >
            <ScanSearch className="w-3.5 h-3.5" />
            Free tool · No signup
          </motion.span>
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
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2 backdrop-blur-sm"
            >
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
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-6 h-11 text-sm font-semibold text-primary-foreground shadow-medium btn-shine">
            Analyze my listing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  </section>
);

export default ToolBanner;
