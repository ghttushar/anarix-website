import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Clock, Sparkles } from "lucide-react";

import { slideStagger } from "./story/primitives";

export interface StorySlide {
  id: string;
  eyebrow?: string;
  soon?: boolean;
  accent: string;
  rest: string;
  body: string[];
  visual: React.ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fixed visual frame so every slide occupies the same footprint. */
const FRAME_HEIGHT = "clamp(320px, 40vw, 460px)";

const Eyebrow = ({ slide }: { slide: StorySlide }) =>
  slide.soon ? (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      <Clock className="w-3.5 h-3.5" />
      Coming soon
    </span>
  ) : slide.eyebrow ? (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary">
      <Sparkles className="w-3.5 h-3.5" />
      {slide.eyebrow}
    </span>
  ) : null;

const Copy = ({ slide }: { slide: StorySlide }) => (
  <div>
    <Eyebrow slide={slide} />
    <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold leading-[1.1] tracking-tight text-foreground">
      <span className="text-gradient-primary">{slide.accent}</span> {slide.rest}
    </h2>
    {slide.body.map((line) => (
      <p key={line} className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {line}
      </p>
    ))}
  </div>
);

const Visual = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full" style={{ height: FRAME_HEIGHT }}>
    {children}
  </div>
);

/** Vertical progress rail with one tick per slide. */
const Rail = ({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) => (
  <div className="flex flex-col items-center gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        type="button"
        aria-label={`Go to step ${i + 1}`}
        onClick={() => onSelect(i)}
        className="rounded-pill cursor-pointer"
        style={{
          width: 3,
          height: i === active ? 32 : 16,
          background: i === active ? "hsl(var(--primary))" : "hsl(var(--border))",
          transition: "height 0.35s ease, background 0.35s ease",
        }}
      />
    ))}
  </div>
);

const StoryScroller = ({ slides }: { slides: StorySlide[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPinned(wide.matches && !reduce.matches);
    apply();
    wide.addEventListener("change", apply);
    reduce.addEventListener("change", apply);
    return () => {
      wide.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const progress = total > 0 ? -el.getBoundingClientRect().top / total : 0;
      const clamped = Math.min(Math.max(progress, 0), 0.9999);
      setActive(Math.floor(clamped * slides.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, slides.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + ((i + 0.5) / slides.length) * total;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!pinned) {
    return (
      <div>
        {slides.map((slide) => (
          <motion.div
            key={slide.id}
            className="grid grid-cols-1 gap-8 py-14"
            variants={slideStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-12%" }}
          >
            <Copy slide={slide} />
            <Visual>{slide.visual}</Visual>
          </motion.div>
        ))}
      </div>
    );
  }

  const current = slides[active];

  return (
    <div ref={trackRef} className="relative" style={{ height: `${slides.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <Rail count={slides.length} active={active} onSelect={goTo} />

          <div className="grid grid-cols-2 items-center gap-12">
            <div className="relative" style={{ minHeight: 320 }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0 flex flex-col justify-center"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <Copy slide={current} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative w-full" style={{ height: FRAME_HEIGHT }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  variants={slideStagger}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.35, ease: EASE } }}
                >
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    {current.visual}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryScroller;
