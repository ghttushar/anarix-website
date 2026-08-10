import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Sparkles, type LucideIcon } from "lucide-react";

export interface StorySlide {
  id: string;
  eyebrow?: string;
  /** Swap the default eyebrow icon. */
  icon?: LucideIcon;
  /** Renders a "Coming soon" chip instead of the eyebrow. */
  soon?: boolean;
  accent: string;
  rest: string;
  /** Optional single line between the heading and the body copy. */
  lead?: string;
  body: string[];
  visual: React.ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fixed visual frame so every slide occupies the same footprint. */
const FRAME_HEIGHT = "clamp(320px, 40vw, 460px)";

const Eyebrow = ({ slide }: { slide: StorySlide }) => {
  const Icon = slide.icon ?? Sparkles;
  if (slide.soon) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Clock className="w-3.5 h-3.5" />
        Coming soon
      </span>
    );
  }
  if (!slide.eyebrow) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary">
      <Icon className="w-3.5 h-3.5" />
      {slide.eyebrow}
    </span>
  );
};

const Copy = ({ slide }: { slide: StorySlide }) => (
  <div>
    <Eyebrow slide={slide} />
    <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold leading-[1.1] tracking-tight text-foreground">
      <span className="text-gradient-primary">{slide.accent}</span> {slide.rest}
    </h2>
    {slide.lead && <p className="mt-3 max-w-xl text-[15px] text-primary/75">{slide.lead}</p>}
    {slide.body.map((line) => (
      <p key={line} className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {line}
      </p>
    ))}
  </div>
);

/** Vertical progress rail: one tick per slide plus a scroll-linked fill. */
const Rail = ({
  count,
  active,
  progress,
  onSelect,
}: {
  count: number;
  active: number;
  progress: number;
  onSelect: (i: number) => void;
}) => (
  <div className="relative flex flex-col items-center gap-2">
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-0 -translate-x-1/2 rounded-pill bg-primary/20"
      style={{ width: 1, height: "100%" }}
    >
      <motion.span
        className="block w-full rounded-pill bg-primary/70"
        style={{ height: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
        transition={{ duration: 0.2, ease: "linear" }}
      />
    </span>
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        type="button"
        aria-label={`Go to step ${i + 1}`}
        onClick={() => onSelect(i)}
        className="relative rounded-pill cursor-pointer"
        style={{
          width: 3,
          height: i === active ? 32 : 16,
          background: i === active ? "hsl(var(--primary))" : "hsl(var(--border))",
          transition: "height 0.45s cubic-bezier(0.22,1,0.36,1), background 0.45s ease",
        }}
      />
    ))}
  </div>
);

/** Soft ambient glow behind the frame; hue shifts per slide. */
const Glow = ({ index }: { index: number }) => (
  <motion.span
    aria-hidden="true"
    className="pointer-events-none absolute -inset-10 rounded-full blur-3xl"
    animate={{
      opacity: 0.5,
      background:
        index % 2 === 0
          ? "radial-gradient(60% 60% at 65% 40%, hsl(var(--primary) / 0.22), transparent 70%)"
          : "radial-gradient(60% 60% at 35% 60%, hsl(var(--periwinkle) / 0.26), transparent 70%)",
    }}
    transition={{ duration: 1.1, ease: EASE }}
  />
);

const StoryScroller = ({ slides }: { slides: StorySlide[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dir, setDir] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPinned(wide.matches && !reduce);
    apply();
    wide.addEventListener("change", apply);
    return () => wide.removeEventListener("change", apply);
  }, [reduce]);

  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = trackRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const raw = total > 0 ? -el.getBoundingClientRect().top / total : 0;
        const clamped = Math.min(Math.max(raw, 0), 0.9999);
        setProgress(clamped);
        const next = Math.floor(clamped * slides.length);
        setActive((prev) => {
          if (next !== prev) setDir(next > prev ? 1 : -1);
          return next;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, slides.length]);

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const top = el.offsetTop + ((i + 0.5) / slides.length) * total;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [slides.length],
  );

  const onPointer = (e: React.PointerEvent) => {
    if (reduce) return;
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  if (!pinned) {
    return (
      <div>
        {slides.map((slide) => (
          <motion.div
            key={slide.id}
            className="grid grid-cols-1 gap-8 py-14"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-12%" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
          >
            <Copy slide={slide} />
            <div className="w-full" style={{ height: FRAME_HEIGHT }}>
              {slide.visual}
            </div>
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
          <Rail count={slides.length} active={active} progress={progress} onSelect={goTo} />

          <div className="grid grid-cols-2 items-center gap-12">
            <div className="relative" style={{ minHeight: 340 }}>
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={current.id}
                  custom={dir}
                  className="absolute inset-0 flex flex-col justify-center"
                  initial={{ opacity: 0, y: 34 * dir, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -34 * dir, filter: "blur(6px)" }}
                  transition={{ duration: 0.75, ease: EASE }}
                >
                  <Copy slide={current} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              ref={frameRef}
              className="relative w-full"
              style={{ height: FRAME_HEIGHT, perspective: 1400 }}
              onPointerMove={onPointer}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <Glow index={active} />
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={current.id}
                  custom={dir}
                  className="absolute inset-0"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.08, delayChildren: 0.22 } },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    filter: "blur(8px)",
                    transition: { duration: 0.5, ease: EASE },
                  }}
                >
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0, y: 40 * dir, scale: 0.965, filter: "blur(10px)" }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                      rotateY: tilt.x * 3.5,
                      rotateX: -tilt.y * 2.5,
                    }}
                    transition={{
                      duration: 0.85,
                      ease: EASE,
                      rotateY: { duration: 0.5, ease: "easeOut" },
                      rotateX: { duration: 0.5, ease: "easeOut" },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
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
