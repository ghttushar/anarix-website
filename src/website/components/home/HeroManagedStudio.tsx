import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Clock } from "lucide-react";

import apparel from "@/assets/case-studies/apparel.jpg";
import medicalSupply from "@/assets/case-studies/medical-supply.jpg";
import mounts from "@/assets/case-studies/mounts.jpg";
import organicCare from "@/assets/case-studies/organic-care.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

const shelf = [
  { image: medicalSupply, alt: "Medical rollator walker", channel: "Walmart", note: "Item page rebuilt" },
  { image: mounts, alt: "Monitor desk mount", channel: "Amazon", note: "Variants merged" },
  { image: organicCare, alt: "Organic care bottles", channel: "Amazon", note: "Bids day-parted" },
  { image: apparel, alt: "Folded apparel flat lay", channel: "Shopify", note: "Stock protected" },
];

const feed = [
  { time: "11:04pm", text: "Budget pulled off two losing keywords" },
  { time: "11:22pm", text: "Stockout risk flagged on 3 parent ASINs" },
  { time: "11:41pm", text: "Suppressed listing restored on Walmart" },
  { time: "12:06am", text: "Sponsored Display bid raised on the winner" },
];

/**
 * Hero visual: the managed account desk. Real catalog photography under a live
 * work feed, so the picture reads as people running accounts, not a dashboard.
 */
const HeroManagedStudio = () => {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setLine((i) => (i + 1) % feed.length), 2800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute opacity-80"
        style={{
          inset: "-2rem",
          zIndex: -1,
          borderRadius: "3rem",
          background:
            "radial-gradient(ellipse 65% 60% at 55% 40%, hsl(var(--primary) / 0.16), transparent 72%)",
        }}
      />

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border bg-card/95 shadow-strong backdrop-blur"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your accounts, tonight
          </p>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            Team on shift
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {shelf.map((item, i) => (
            <motion.div
              key={item.alt}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted/30"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 + i * 0.12 }}
            >
              <motion.img
                src={item.image}
                alt={item.alt}
                width={1024}
                height={768}
                className="h-24 w-full object-cover sm:h-28"
                animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
                transition={{ duration: 14 + i * 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {item.channel}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-foreground">
                  <Check className="h-3 w-3 text-primary" />
                  {item.note}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border/70 px-5 py-4">
          <div className="flex h-10 items-center gap-3 overflow-hidden">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <AnimatePresence mode="wait">
              <motion.p
                key={feed[line].text}
                className="text-sm text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="font-numeric text-muted-foreground">{feed[line].time}</span>{" "}
                {feed[line].text}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-pill bg-muted">
            <motion.div
              key={line}
              className="h-full rounded-pill bg-gradient-to-r from-primary to-primary/50"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduce ? 0 : 2.8, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-medium backdrop-blur sm:block"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 1 }}
      >
        <p className="font-numeric text-xl font-bold leading-none text-foreground">37 min</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Median time to act
        </p>
      </motion.div>
    </div>
  );
};

export default HeroManagedStudio;
