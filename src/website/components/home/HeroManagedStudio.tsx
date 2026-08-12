import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

import apparel from "@/assets/case-studies/apparel.jpg";
import medicalSupply from "@/assets/case-studies/medical-supply.jpg";
import mounts from "@/assets/case-studies/mounts.jpg";
import organicCare from "@/assets/case-studies/organic-care.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Account {
  image: string;
  alt: string;
  channel: string;
  category: string;
  /** The one number a brand owner would ask about first. */
  metric: { label: string; value: string };
  /** What the team did on this account tonight. */
  work: [string, string, string];
}

const accounts: Account[] = [
  {
    image: organicCare,
    alt: "Glass nail lacquer bottles with wooden caps on warm marble",
    channel: "Amazon",
    category: "Beauty and personal care",
    metric: { label: "ROAS", value: "7.91x" },
    work: ["Brand defense split out", "Bids day-parted", "TACoS down to 9.4%"],
  },
  {
    image: mounts,
    alt: "Matte black dual monitor arm on a walnut desk",
    channel: "Walmart",
    category: "Electronics",
    metric: { label: "Sales lift", value: "+221%" },
    work: ["Variants merged", "Search terms harvested", "Budget moved to winners"],
  },
  {
    image: medicalSupply,
    alt: "Aluminium rollator walker in a bright studio",
    channel: "Walmart",
    category: "Medical supply",
    metric: { label: "Search share", value: "+38%" },
    work: ["Item page rebuilt", "Suppression cleared", "Placement bids trimmed"],
  },
  {
    image: apparel,
    alt: "Folded premium knitwear in neutral tones",
    channel: "Amazon",
    category: "Apparel",
    metric: { label: "Peak revenue", value: "+131%" },
    work: ["Peak plan loaded", "Display burst live", "Stock cover protected"],
  },
];

const feed = [
  { time: "11:04pm", text: "Budget pulled off two losing keywords" },
  { time: "11:22pm", text: "Stockout risk flagged on 3 parent ASINs" },
  { time: "11:41pm", text: "Suppressed listing restored on Walmart" },
  { time: "12:06am", text: "Sponsored Display bid raised on the winner" },
  { time: "12:28am", text: "Return spike traced to one variant" },
];

const ROTATE_MS = 4200;

/**
 * Hero visual: the managed account desk. One featured account with its live
 * number, the rest of the book waiting in the rail, and the night shift log
 * building underneath, so the picture reads as a team running accounts.
 */
const HeroManagedStudio = () => {
  const reduce = useReducedMotion();
  const [featured, setFeatured] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setFeatured((i) => (i + 1) % accounts.length);
      setTick((t) => t + 1);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const account = accounts[featured];
  const rail = accounts.filter((_, i) => i !== featured);
  const log = [0, 1, 2].map((offset) => feed[(tick + offset) % feed.length]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute opacity-80"
        style={{
          inset: "-2.5rem",
          zIndex: -1,
          borderRadius: "3rem",
          background:
            "radial-gradient(ellipse 62% 58% at 58% 38%, hsl(var(--primary) / 0.18), transparent 72%)",
        }}
      />

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border bg-card/95 shadow-strong backdrop-blur"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: "inset 0 1px 0 hsl(var(--card-foreground) / 0.08)" }}
        />

        {/* Header: who is working and on what */}
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
            Anarix team on shift
          </span>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {/* Featured account */}
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/30 sm:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={account.alt}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <motion.img
                  src={account.image}
                  alt={account.alt}
                  width={1280}
                  height={960}
                  className="h-48 w-full object-cover sm:h-56"
                  animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, hsl(var(--card) / 0.94) 6%, hsl(var(--card) / 0.35) 42%, transparent 70%)",
              }}
            />

            <span className="absolute left-3 top-3 rounded-pill border border-border/70 bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground backdrop-blur">
              {account.channel}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={account.metric.value}
                className="absolute right-3 top-3 rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-right backdrop-blur"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="font-numeric text-xl font-bold leading-none text-foreground">
                  {account.metric.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {account.metric.label}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-3 bottom-3">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {account.category}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-foreground">
                Run end to end by the Anarix team
              </p>
            </div>
          </div>


          {/* The rest of the book, waiting in the rail */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
            {rail.map((item, i) => (
              <motion.button
                key={item.alt}
                type="button"
                onClick={() => setFeatured(accounts.indexOf(item))}
                aria-label={`Show ${item.channel} ${item.category} account`}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-muted/30 text-left transition-colors hover:border-primary/50"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-14 w-full object-cover opacity-85 transition-opacity group-hover:opacity-100 sm:h-16"
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-card/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground backdrop-blur">
                  {item.channel}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* What was actually done on the featured account */}
        <div className="border-t border-border/70 px-5 py-4">
          <div className="grid gap-2 sm:grid-cols-3">
            {account.work.map((step, i) => (
              <motion.div
                key={`${account.alt}-${step}`}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/25 px-3 py-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.14 }}
              >
                <motion.span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.3 + i * 0.14 }}
                >
                  <Check className="h-2.5 w-2.5" />
                </motion.span>
                <span className="text-xs leading-snug text-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The night shift log, newest on top */}
        <div className="border-t border-border/70 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Night shift log
            </p>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Loader2
                className={reduce ? "h-3 w-3" : "h-3 w-3 animate-spin"}
                style={{ animationDuration: "3s" }}
              />
              Live
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            <AnimatePresence initial={false} mode="popLayout">
              {log.map((entry, i) => (
                <motion.p
                  key={`${entry.time}-${tick}-${i}`}
                  layout
                  className="flex items-baseline gap-2 text-xs"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.32, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="font-numeric shrink-0 text-muted-foreground">{entry.time}</span>
                  <span className="text-foreground">{entry.text}</span>
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-pill bg-muted">
            <motion.div
              key={tick}
              className="h-full rounded-pill bg-gradient-to-r from-primary to-primary/40"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduce ? 0 : ROTATE_MS / 1000, ease: "linear" }}
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
