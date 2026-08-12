import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp } from "lucide-react";
import showcaseBgBad from "@/assets/optimization/showcase-bg-bad.svg";
import showcaseBgGood from "@/assets/optimization/showcase-bg-good.svg";
import showcaseFrameBad from "@/assets/optimization/showcase-frame-bad.svg";
import showcaseFrameGood from "@/assets/optimization/showcase-frame-good.svg";
import showcaseLightingBad from "@/assets/optimization/showcase-lighting-bad.svg";
import showcaseLightingGood from "@/assets/optimization/showcase-lighting-good.svg";

interface ShowcaseSlide {
  key: string;
  label: string;
  bad: { image: string; caption: string; score: number; message: string };
  good: { image: string; caption: string; score: number; message: string };
}

const SLIDES: ShowcaseSlide[] = [
  {
    key: "background",
    label: "Pure white background",
    bad: {
      image: showcaseBgBad,
      caption: "Off-white background",
      score: 3.2,
      message: "Graduated or tinted backgrounds get flagged by marketplace review bots.",
    },
    good: {
      image: showcaseBgGood,
      caption: "Pure white, 100% coverage",
      score: 9.1,
      message: "Matches the marketplace spec, passes review, and pops in the search grid.",
    },
  },
  {
    key: "framing",
    label: "Zoom-ready framing",
    bad: {
      image: showcaseFrameBad,
      caption: "Product fills only 33% of the frame",
      score: 3.9,
      message: "Tiny subjects kill thumbnail clarity and limit hover zoom.",
    },
    good: {
      image: showcaseFrameGood,
      caption: "Product fills 85% of the frame",
      score: 9.4,
      message: "The zoom-friendly threshold every top-ranking listing hits.",
    },
  },
  {
    key: "lighting",
    label: "Consistent lighting",
    bad: {
      image: showcaseLightingBad,
      caption: "Harsh shadows, flat tones",
      score: 4.1,
      message: "Dull exposure reads as low quality next to bright competitors.",
    },
    good: {
      image: showcaseLightingGood,
      caption: "Soft studio lighting",
      score: 9.0,
      message: "Even highlights and clean drop shadows signal a premium product.",
    },
  },
];

const ROTATE_MS = 4000;

const ShowcaseSection = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [paused]);

  const slide = SLIDES[active];

  return (
    <section className="relative py-16 sm:py-20">
      <div className="pointer-events-none absolute -top-10 right-0 w-72 h-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 -left-10 w-72 h-72 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />

      <motion.div
        className="relative max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary">
          <TrendingUp className="w-3.5 h-3.5" />
          Why images win
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          A Great Listing Image{" "}
          <span className="text-gradient-primary">Sells Before Words Do</span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
          Buyers decide in a glance. Watch how the same product flips from
          forgettable to conversion-ready, and then get yours graded for free.
        </p>
      </motion.div>

      <motion.div
        className="relative max-w-3xl mx-auto mt-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-primary/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.key}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {/* Before */}
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background">
                <div className="relative aspect-square">
                  <img src={slide.bad.image} alt="" className="w-full h-full object-cover opacity-90" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                    <AlertTriangle className="w-3 h-3" />
                    {slide.bad.score.toFixed(1)}/10
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white">
                    Before
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">{slide.bad.caption}</p>
                  <p className="text-xs text-muted-foreground mt-1">{slide.bad.message}</p>
                </div>
              </div>

              {/* After */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-background">
                <div className="relative aspect-square">
                  <img src={slide.good.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-soft">
                    <Sparkles className="w-3 h-3" />
                    {slide.good.score.toFixed(1)}/10
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-primary/80 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    After
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">{slide.good.caption}</p>
                  <p className="text-xs text-muted-foreground mt-1">{slide.good.message}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Showcase slides">
          {SLIDES.map((item, index) => (
            <button
              key={item.key}
              role="tab"
              aria-selected={active === index}
              aria-label={item.label}
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active === index ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center" aria-live="polite">
          {slide.label}, scroll the analyzer above and see issues like these on your own listing.
        </p>
      </motion.div>
    </section>
  );
};

export default ShowcaseSection;