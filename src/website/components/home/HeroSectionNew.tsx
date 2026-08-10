import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Moon } from "lucide-react";
import { useEffect } from "react";
import HeroDataViz from "./HeroDataViz";

const stats = [
  { label: "GMV driven", numeric: 1.2, prefix: "$", suffix: "B", decimals: 1 },
  { label: "Brands managed", numeric: 500, prefix: "", suffix: "+", decimals: 0 },
  { label: "Avg TACoS", numeric: 12.8, prefix: "", suffix: "%", decimals: 1 },
];

const managedRows = [
  { label: "Advertising", detail: "bids, budgets, targeting" },
  { label: "Listings", detail: "catalog & compliance" },
  { label: "Inventory", detail: "stockouts & overstock" },
  { label: "Compliance", detail: "policy & account health" },
  { label: "Reporting", detail: "plain-English P&L" },
];

const CountUp = ({ target, prefix, suffix, decimals = 0 }: { target: number; prefix: string; suffix: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    }
  }, [isInView, count, target]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const ManagedForYouCard = () => {
  return (
    <motion.div
      className="bg-card/60 backdrop-blur-md border border-border shadow-medium rounded-3xl p-6 sm:p-7"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-foreground">Managed for you</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          night shift: on
        </span>
      </div>

      <div className="space-y-2.5">
        {managedRows.map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-background/40"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.35 + i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.35, type: "spring", stiffness: 300, damping: 18 }}
            >
              <Check className="w-3.5 h-3.5 text-primary" />
            </motion.span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{row.label}</p>
              <p className="text-xs text-muted-foreground truncate">{row.detail}</p>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border/60"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 1.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Moon className="w-3.5 h-3.5 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">You</p>
            <p className="text-xs text-muted-foreground truncate">check in anytime. Sleep well.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const HeroSectionNew = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-24 pb-10">
      <HeroDataViz />

      <div className="relative z-10 container-wide px-4 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7">
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-pill bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Expert-managed marketplace growth
            </motion.div>

            <motion.h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Two plus marketplaces. A dozen dashboards.
              <br />
              <span className="text-gradient-primary">And you, checking Seller Central at 11pm.</span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              You didn&apos;t build this brand to babysit ad campaigns and chase stockouts. Anarix runs your Amazon, Walmart and Shopify accounts end-to-end — ads, listings, inventory, compliance — as one team. You keep full visibility.{" "}
              <span className="text-foreground font-semibold">We take the 11pm shift.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine group">
                  Hand it over
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
            </motion.div>

            <motion.p
              className="text-xs text-muted-foreground/60 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Start with a free audit. We&apos;ll show you what your account is losing before you pay a thing.
            </motion.p>
          </div>

          <div className="lg:col-span-5 mt-10 lg:mt-0 max-w-md lg:max-w-none mx-auto w-full">
            <ManagedForYouCard />
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-10 grid grid-cols-3 gap-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                <CountUp target={stat.numeric} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 pt-6 border-t border-border/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.15em]">
            Trusted by 500+ brands on Amazon and Walmart
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
