import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { CaseStudyData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

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
      className="group flex h-full w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
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
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-stretch">
        <StepZone dir={-1} study={prev} onClick={() => onStep(-1)} />

        <div className="flex flex-1 flex-col items-center justify-center py-2 text-center lg:px-4">
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
  return (
    <section className={position === "bottom" ? "pad-section-compact" : "pad-hero"}>
      <div className="container-page px-6 sm:px-8">
        <CaseStudyPager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
      </div>
    </section>
  );
}

export default CaseStudyHeroBand;
