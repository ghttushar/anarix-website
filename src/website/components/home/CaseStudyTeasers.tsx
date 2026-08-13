import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Link } from "@/lib/router";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { caseStudies, type CaseStudyData } from "@/website/data/case-studies";

const SPACING = 400;
const DEPTH = 150;
const CARD_WIDTH = 360;
const CARD_HEIGHT = 470;

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
          {/* Desktop / tablet: rotating ring, nothing layered over the cards */}
          <div
            className="relative hidden sm:block"
            style={{ perspective: "1600px", height: CARD_HEIGHT + 24 }}
            role="group"
            aria-label="Featured case studies carousel"
          >
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              {slots.map((slot) => (
                <motion.div
                  key={slot.cs.id}
                  className="absolute"
                  style={{
                    zIndex: slot.zIndex,
                    width: CARD_WIDTH,
                    left: "50%",
                    marginLeft: -CARD_WIDTH / 2,
                  }}
                  animate={{ x: slot.x, z: slot.z, scale: slot.scale, opacity: slot.opacity }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 90, damping: 18, mass: 0.9 }
                  }
                >
                  <TeaserCard cs={slot.cs} interactive={slot.front} index={slot.i} />
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
              <TeaserCard cs={studies[active]} interactive index={active} />
            </motion.div>
          </div>

          {/* Controls sit right under the cards, arrows flanking the dots */}
          <div className="flex items-center justify-center gap-5" style={{ marginTop: 12 }}>
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
      className={`text-center max-w-2xl mx-auto pb-10 transition-all duration-700 ${
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
        Six accounts, two marketplaces, the way we measure is the way we work.
      </p>
    </div>
  );
}

const statValue = (m: { prepend?: string; prefix?: string; value: number; decimals?: number; suffix?: string }): string =>
  `${m.prepend ?? ""}${m.prefix ?? ""}${m.value.toFixed(m.decimals ?? 0)}${m.suffix ?? ""}`;

/**
 * Precise chart glyphs on a shared 160x64 baseline grid, one per card, so the
 * visual band reads identically across the ring.
 */
const glyphs = [
  // Bar climb
  <g key="bars">
    <path d="M4 60h152" opacity={0.35} />
    <path d="M22 60V44M52 60V34M82 60V26M112 60V16M142 60V8" strokeWidth={5} strokeLinecap="round" />
  </g>,
  // Share ring
  <g key="ring">
    <circle cx="80" cy="34" r="24" opacity={0.35} />
    <path d="M80 10a24 24 0 0 1 20 37" strokeWidth={5} strokeLinecap="round" />
    <path d="M4 60h152" opacity={0.2} />
  </g>,
  // Order lift
  <g key="cart">
    <path d="M4 60h152" opacity={0.35} />
    <path d="M18 52l28-16 26 10 30-22 34-14" strokeWidth={4} strokeLinecap="round" />
    <circle cx="72" cy="46" r="4" />
    <circle cx="136" cy="10" r="5" strokeWidth={4} />
  </g>,
  // Stock curve
  <g key="stock">
    <path d="M4 60h152" opacity={0.35} />
    <path d="M8 48c20 0 22-32 44-32s22 26 44 26 24-30 56-30" strokeWidth={4} strokeLinecap="round" />
    <path d="M8 34h144" strokeDasharray="5 7" opacity={0.35} />
  </g>,
] as const;

/** Uniform teaser: strict slots so every card in the ring has identical geometry. */
function TeaserCard({
  cs,
  interactive,
  index,
}: {
  cs: CaseStudyData;
  interactive: boolean;
  index: number;
}) {
  const secondary = cs.kpis.slice(0, 2);

  return (
    <Link
      to={`/case-studies#${cs.id}`}
      tabIndex={interactive ? 0 : -1}
      aria-hidden={interactive ? undefined : true}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-medium transition-all duration-300 ${
        interactive
          ? "pointer-events-auto border-border hover:-translate-y-1 hover:border-primary/45 hover:shadow-strong"
          : "pointer-events-none border-border/60"
      }`}
      style={{ height: CARD_HEIGHT }}
    >
      {/* Visual band: fixed slot, tinted surface, one precise glyph */}
      <div
        className="relative flex items-end overflow-hidden border-b border-border/60"
        style={{
          height: 116,
          background:
            "linear-gradient(160deg, hsl(var(--primary) / 0.14), hsl(var(--primary) / 0.04) 60%, transparent)",
        }}
      >
        <svg
          aria-hidden
          viewBox="0 0 160 64"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 w-full text-primary/40 transition-transform duration-500 group-hover:scale-105"
          style={{ height: 72 }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
        >
          {glyphs[index % glyphs.length]}
        </svg>

        <div className="relative flex w-full items-center justify-between gap-3 px-6" style={{ paddingBottom: 14 }}>
          <span
            className="inline-flex min-w-0 items-center rounded-pill border border-border/70 bg-card/90 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground truncate"
            style={{ height: 26, maxWidth: 200 }}
          >
            {cs.marketplace}
          </span>
          <span className="shrink-0 font-numeric text-[11px] text-muted-foreground">{cs.period}</span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6" style={{ paddingTop: 20 }}>
        <h3
          className="font-display text-xl font-bold leading-tight tracking-tight text-foreground line-clamp-2"
          style={{ height: 56 }}
        >
          {cs.brand}
        </h3>

        <p className="font-numeric font-bold leading-none tracking-tight" style={{ height: 56, fontSize: 52 }}>
          <span className="text-gradient-primary">{heroNumber(cs)}</span>
        </p>
        <p
          className="mt-3 text-xs leading-snug text-muted-foreground line-clamp-2"
          style={{ height: 34 }}
        >
          {cs.hero.statLine}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60" style={{ paddingTop: 16 }}>
          {secondary.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-primary/10 bg-primary/5 px-3 transition-colors group-hover:border-primary/25"
              style={{ height: 74, paddingTop: 12 }}
            >
              <p className="font-numeric text-lg font-bold leading-none text-foreground">
                {statValue(kpi)}
              </p>
              <p className="mt-1.5 text-[10px] uppercase leading-tight tracking-[0.1em] text-muted-foreground line-clamp-2">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary" style={{ paddingTop: 18 }}>
          Explore case study
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default CaseStudyTeasers;
