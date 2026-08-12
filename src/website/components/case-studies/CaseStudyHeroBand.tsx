import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CaseStudyVisual } from "./CaseStudyVisual";
import { caseMedia } from "./media";
import type { CaseStudyData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

const heroNumber = (cs: CaseStudyData): string => {
  const { prepend = "", prefix = "", value, decimals = 0, suffix = "" } = cs.hero;
  return `${prepend}${prefix}${value.toFixed(decimals)}${suffix}`;
};

const shortBrand = (brand: string): string =>
  brand.length > 24 ? `${brand.slice(0, 23).trimEnd()}...` : brand;

/** A single previous/next step target. The whole card is clickable. */
function StepZone({
  dir,
  study,
  onClick,
}: {
  dir: -1 | 1;
  study: CaseStudyData;
  onClick: () => void;
}) {
  const isNext = dir === 1;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? `Next case study: ${study.brand}` : `Previous case study: ${study.brand}`}
      className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <motion.span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-primary/10 text-primary ring-1 ring-primary/30"
        animate={isNext ? { x: [0, 4, 0] } : { x: [0, -4, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1.2,
        }}
      >
        {isNext ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
      </motion.span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {isNext ? "Next case study" : "Previous case study"}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {shortBrand(study.brand)}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {study.title}
        </p>
      </div>
    </button>
  );
}

/** Brand chips that jump to any case study. */
function JumpRail({
  studies,
  active,
  onSelect,
}: {
  studies: CaseStudyData[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Jump to
      </span>
      <div className="flex flex-wrap gap-2">
        {studies.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to ${s.brand}`}
            aria-current={i === active ? "true" : undefined}
            className={
              i === active
                ? "rounded-pill bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors"
                : "rounded-pill border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            }
          >
            {shortBrand(s.brand)}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The surfaced carousel control. It shows the current study, a clear pair of
 * previous/next step zones, and a jump rail so the carousel is never ambiguous.
 */
function CaseStudyPager({
  studies,
  active,
  onSelect,
  onStep,
}: {
  studies: CaseStudyData[];
  active: number;
  onSelect: (index: number) => void;
  onStep: (dir: number) => void;
}) {
  const prev = studies[(active - 1 + studies.length) % studies.length];
  const next = studies[(active + 1) % studies.length];
  const current = studies[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-center">
        <StepZone dir={-1} study={prev} onClick={() => onStep(-1)} />

        <div className="flex flex-col items-center justify-center text-center lg:px-4">
          <span className="font-numeric text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Case Study {String(active + 1).padStart(2, "0")} / {String(studies.length).padStart(2, "0")}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <p className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
                {current.brand}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {current.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <StepZone dir={1} study={next} onClick={() => onStep(1)} />
      </div>

      <div className="border-t border-border p-4 sm:p-5">
        <JumpRail studies={studies} active={active} onSelect={onSelect} />
      </div>
    </div>
  );
}

/**
 * A surfaced case-study carousel card. Used at the top as the hero and again at
 * the bottom of the page so readers can keep moving without scrolling back up.
 */
function CaseStudyCarouselCard({
  studies,
  active,
  onSelect,
  onStep,
  label,
}: {
  studies: CaseStudyData[];
  active: number;
  onSelect: (index: number) => void;
  onStep: (dir: number) => void;
  label?: string;
}) {
  const cs = studies[active];
  const media = caseMedia(cs.id);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="grid items-center gap-6 p-5 sm:p-7 lg:grid-cols-[7fr_5fr]">
        <div className="order-2 lg:order-1">
          {label && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {label}
            </p>
          )}
          <div className="mt-2 inline-flex items-center gap-2 rounded-pill bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-primary">
            {cs.marketplace}
          </div>

          <p className="font-numeric mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Case Study {String(active + 1).padStart(2, "0")} / {String(studies.length).padStart(2, "0")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {cs.brand}
          </h2>
          <p className="mt-2 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {cs.title}
          </p>

          <div className="mt-6">
            <p className="font-numeric text-5xl font-bold leading-none tracking-tight sm:text-6xl">
              <span className="text-gradient-primary">{heroNumber(cs)}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{cs.hero.statLine}</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <CaseStudyVisual data={cs} compact />
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <CaseStudyPager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
      </div>
    </div>
  );
}

/**
 * The case studies carousel control surface. Rendered at the top and again at
 * the bottom of the page so a reader can move on without scrolling back up.
 */
export function CaseStudyHeroBand({
  studies,
  active,
  onSelect,
  onStep,
  position = "top",
}: {
  studies: CaseStudyData[];
  active: number;
  onSelect: (index: number) => void;
  onStep: (dir: number) => void;
  position?: "top" | "bottom";
}) {
  if (position === "bottom") {
    return (
      <section className="pad-section-compact">
        <div className="container-page px-6 sm:px-8">
          <CaseStudyCarouselCard
            studies={studies}
            active={active}
            onSelect={onSelect}
            onStep={onStep}
            label="Continue exploring"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pad-hero">
      <div className="container-page px-6 sm:px-8">
        <CaseStudyCarouselCard
          studies={studies}
          active={active}
          onSelect={onSelect}
          onStep={onStep}
        />
      </div>
    </section>
  );
}

export default CaseStudyHeroBand;
