import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Link } from "@/lib/router";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { caseStudies, type CaseStudyData } from "@/website/data/case-studies";

const SPACING = 260;
const DEPTH = 130;

/** Shortest signed distance from `i` to `active` on a ring of `n` slots. */
const ringDelta = (i: number, active: number, n: number): number => {
  const raw = ((i - active) % n + n) % n;
  return raw > n / 2 ? raw - n : raw;
};

const heroNumber = (cs: CaseStudyData): string => {
  const { prepend = "", prefix = "", value, decimals = 0, suffix = "" } = cs.hero;
  return `${prepend}${prefix}${value.toFixed(decimals)}${suffix}`;
};

const CaseStudyTeasers = () => {
  const studies = caseStudies;
  const n = studies.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const rotate = useCallback(
    (dir: number) => setActive((prev) => ((prev + dir) % n + n) % n),
    [n]
  );

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => rotate(1), 5200);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, rotate]);

  const slots = useMemo(
    () =>
      studies.map((cs, i) => {
        // +0.5 offset keeps two cards side by side at the front of the ring.
        const pos = ringDelta(i, active, n) + 0.5;
        const depth = Math.abs(pos);
        return {
          cs,
          i,
          x: pos * SPACING,
          z: -(depth - 0.5) * DEPTH,
          scale: Math.max(0.7, 1 - (depth - 0.5) * 0.14),
          opacity: depth > 2.6 ? 0 : Math.max(0.25, 1 - (depth - 0.5) * 0.34),
          zIndex: 100 - Math.round(depth * 10),
          front: depth < 1,
        };
      }),
    [studies, active, n]
  );

  return (
    <section className="relative pad-section overflow-hidden">
      <div className="container-page px-6 sm:px-8">
        <TeasersIntro />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Desktop / tablet: rotating ring */}
          <div
            className="relative hidden sm:block h-[360px]"
            style={{ perspective: "1400px" }}
            role="group"
            aria-label="Featured case studies carousel"
          >
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              {slots.map((slot) => (
                <motion.div
                  key={slot.cs.id}
                  className="absolute w-[300px]"
                  style={{ zIndex: slot.zIndex }}
                  animate={{ x: slot.x, z: slot.z, scale: slot.scale, opacity: slot.opacity }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 90, damping: 18, mass: 0.9 }
                  }
                >
                  <TeaserCard cs={slot.cs} interactive={slot.front} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: single-card swipe track */}
          <div className="sm:hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) rotate(1);
                if (info.offset.x > 60) rotate(-1);
              }}
            >
              <TeaserCard cs={studies[active]} interactive />
            </motion.div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <CarouselButton label="Previous case study" onClick={() => rotate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </CarouselButton>

            <div className="flex items-center gap-2">
              {studies.map((cs, i) => (
                <button
                  key={cs.id}
                  type="button"
                  aria-label={`Show ${cs.brand}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-pill transition-all duration-300 ${
                    i === active ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <CarouselButton label="Next case study" onClick={() => rotate(1)}>
              <ArrowRight className="w-4 h-4" />
            </CarouselButton>
          </div>
        </div>
      </div>
    </section>
  );
};

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-pill border border-border bg-card text-foreground shadow-soft hover:border-primary/50 hover:text-primary transition-colors"
    >
      {children}
    </button>
  );
}

function TeasersIntro() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`text-center max-w-2xl mx-auto pb-12 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
        Featured Case Studies
      </div>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.08]">
        We&apos;ve <span className="text-gradient-primary">done this before.</span>
      </h2>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        Six accounts, two marketplaces — the way we measure is the way we work.
      </p>
    </div>
  );
}

/** Compact teaser: brand, marketplace, one loud number, one line. No charts. */
function TeaserCard({ cs, interactive }: { cs: CaseStudyData; interactive: boolean }) {
  return (
    <Link
      to={`/case-studies#${cs.id}`}
      tabIndex={interactive ? 0 : -1}
      aria-hidden={interactive ? undefined : true}
      className={`group block rounded-3xl border bg-card shadow-medium p-6 sm:p-7 transition-colors duration-300 ${
        interactive
          ? "border-border hover:border-primary/45 pointer-events-auto"
          : "border-border/60 pointer-events-none"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {cs.marketplace}
      </p>
      <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground leading-tight min-h-[3.5rem]">
        {cs.brand}
      </h3>

      <p className="mt-4 font-numeric text-4xl font-bold tracking-tight leading-none">
        <span className="text-gradient-primary">{heroNumber(cs)}</span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground leading-snug min-h-[2.5rem]">
        {cs.hero.statLine}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Explore case study
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

export default CaseStudyTeasers;
