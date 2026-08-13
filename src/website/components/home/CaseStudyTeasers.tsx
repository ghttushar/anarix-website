import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Link } from "@/lib/router";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { caseStudies, type CaseStudyData } from "@/website/data/case-studies";

const SPACING = 400;
const DEPTH = 150;
const CARD_WIDTH = 360;

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
          {/* Desktop / tablet: rotating ring with arrows hugging the cards */}
          <div
            className="relative hidden sm:block"
            style={{ perspective: "1600px", height: 440 }}
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

            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-[200] flex items-center justify-between"
              style={{ width: CARD_WIDTH * 2 + 96, marginLeft: -(CARD_WIDTH * 2 + 96) / 2 }}
            >
              <span className="pointer-events-auto">
                <CarouselButton label="Previous case study" onClick={() => rotate(-1)}>
                  <ArrowLeft className="w-4 h-4" />
                </CarouselButton>
              </span>
              <span className="pointer-events-auto">
                <CarouselButton label="Next case study" onClick={() => rotate(1)}>
                  <ArrowRight className="w-4 h-4" />
                </CarouselButton>
              </span>
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

          <div className="mt-5 flex items-center justify-center gap-4">
            <span className="sm:hidden">
              <CarouselButton label="Previous case study" onClick={() => rotate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </CarouselButton>
            </span>

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

            <span className="sm:hidden">
              <CarouselButton label="Next case study" onClick={() => rotate(1)}>
                <ArrowRight className="w-4 h-4" />
              </CarouselButton>
            </span>
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
      className={`text-center max-w-2xl mx-auto pb-16 transition-all duration-700 ${
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

/** Outline motifs, one per card, drawn behind the hero number. */
const motifs = [
  // Rising bars
  <g key="bars">
    <path d="M8 92h104" />
    <path d="M20 92V64M44 92V50M68 92V36M92 92V16" />
    <path d="M14 30l26-8 24 10 30-16" strokeDasharray="4 4" />
  </g>,
  // Share ring
  <g key="ring">
    <circle cx="60" cy="54" r="34" />
    <path d="M60 20a34 34 0 0 1 30 50" strokeWidth={4} />
    <circle cx="60" cy="54" r="12" />
  </g>,
  // Cart lift
  <g key="cart">
    <path d="M14 26h16l12 44h48" />
    <path d="M40 44h56l-8 26" />
    <circle cx="52" cy="86" r="6" />
    <circle cx="84" cy="86" r="6" />
    <path d="M96 24l12-10M104 34h14" strokeDasharray="3 5" />
  </g>,
  // Stock line
  <g key="stock">
    <path d="M10 76c14 0 18-30 30-30s16 22 28 22 18-34 32-34" />
    <path d="M10 92h100" strokeDasharray="4 6" />
    <circle cx="70" cy="68" r="4" />
  </g>,
] as const;

/** Uniform teaser: fixed slots so every card in the ring has identical geometry. */
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
      className={`group relative flex h-[390px] flex-col overflow-hidden rounded-3xl border bg-card p-6 shadow-medium transition-all duration-300 sm:p-7 ${
        interactive
          ? "pointer-events-auto border-border hover:-translate-y-1 hover:border-primary/45 hover:shadow-strong"
          : "pointer-events-none border-border/60"
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 20% 0%, hsl(var(--primary) / 0.12), transparent 70%)",
        }}
      />

      <svg
        aria-hidden
        viewBox="0 0 120 100"
        className="pointer-events-none absolute -right-2 top-14 h-32 w-36 text-primary/25 transition-transform duration-500 group-hover:scale-105"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {motifs[index % motifs.length]}
      </svg>

      <div className="relative flex items-start justify-between gap-3">
        <p className="rounded-pill border border-border/70 bg-muted/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {cs.marketplace}
        </p>
        <span className="shrink-0 font-numeric text-[11px] text-muted-foreground">{cs.period}</span>
      </div>

      <h3 className="relative mt-3 font-display text-xl font-bold leading-tight tracking-tight text-foreground line-clamp-2 min-h-[3.5rem]">
        {cs.brand}
      </h3>

      <p className="relative mt-2 font-numeric text-[3.25rem] font-bold leading-none tracking-tight">
        <span className="text-gradient-primary">{heroNumber(cs)}</span>
      </p>
      <p className="relative mt-2 text-xs leading-snug text-muted-foreground line-clamp-2 min-h-[2.25rem]">
        {cs.hero.statLine}
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
        {secondary.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-2.5 transition-colors group-hover:border-primary/25"
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

      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
        Explore case study
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}


export default CaseStudyTeasers;
