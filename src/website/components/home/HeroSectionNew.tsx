import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import HeroDataViz from "./HeroDataViz";
import HeroOpsConsole from "./HeroOpsConsole";

const stats = [
  { label: "GMV driven", numeric: 1.2, prefix: "$", suffix: "B", decimals: 1 },
  { label: "Brands managed", numeric: 500, prefix: "", suffix: "+", decimals: 0 },
  { label: "Avg TACoS", numeric: 12.8, prefix: "", suffix: "%", decimals: 1 },
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

          </div>

          <div className="lg:col-span-5 mt-10 lg:mt-0 max-w-md lg:max-w-none mx-auto w-full">
            <HeroOpsConsole />
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-numeric text-primary">
                <CountUp target={stat.numeric} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 uppercase tracking-[0.12em] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSectionNew;
