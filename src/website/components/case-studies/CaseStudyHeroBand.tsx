import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { CaseStudyData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

const shortBrand = (brand: string): string =>
  brand.length > 24 ? `${brand.slice(0, 23).trimEnd()}...` : brand;

/** Compact circular prev/next control with a short brand hint on wider screens. */
function NavArrow({
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
      aria-label={
        isNext ? `Next case study: ${study.brand}` : `Previous case study: ${study.brand}`
      }
      className="group flex shrink-0 items-center gap-2 rounded-pill px-2 py-2 text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-all duration-200 group-hover:border-primary/40 group-hover:text-primary">
        {isNext ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
      </span>
      <span className="hidden max-w-[130px] truncate text-xs font-medium lg:block">
        {shortBrand(study.brand)}
      </span>
    </button>
  );
}

/** Brand tabs with an underline marker; nothing boxy around them. */
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
    <nav
      aria-label="Jump to case study"
      className="-mb-px mt-4 flex items-center gap-1 overflow-x-auto border-b border-border/40 sm:justify-center"
    >
      {studies.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to ${s.brand}`}
          aria-current={i === active ? "true" : undefined}
          className={`whitespace-nowrap border-b-2 px-2.5 pb-2 pt-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            i === active
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {shortBrand(s.brand)}
        </button>
      ))}
    </nav>
  );
}

/**
 * Slim toolbar: circular prev/next arrows, the current study centered between
 * them, and an underline tab rail below for direct jumps.
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
    <div className="border-b border-border/40">
      <div className="flex items-center justify-between gap-3 pb-3">
        <NavArrow dir={-1} study={prev} onClick={() => onStep(-1)} />

        <div className="min-w-0 text-center">
          <span className="font-numeric text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Case Study {String(active + 1).padStart(2, "0")} /{" "}
            {String(studies.length).padStart(2, "0")}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <p className="mt-1 truncate font-display text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
                {current.brand}
              </p>
              <p className="mt-0.5 hidden truncate text-sm text-muted-foreground sm:block">
                {current.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <NavArrow dir={1} study={next} onClick={() => onStep(1)} />
      </div>

      <JumpRail studies={studies} active={active} onSelect={onSelect} />
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
    <section className={position === "bottom" ? "pad-section-compact" : "pt-10 pb-4"}>
      <div className="container-page px-6 sm:px-8">
        <CaseStudyPager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
      </div>
    </section>
  );
}

export default CaseStudyHeroBand;
