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
  brand.length > 22 ? `${brand.slice(0, 21).trimEnd()}...` : brand;

/** Single previous/next teaser zone. The whole card is clickable. */
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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-primary/10 text-primary ring-1 ring-primary/30"
        animate={isNext ? { x: [0, 3, 0] } : { x: [0, -3, 0] }}
        transition={
          isNext
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }
            : { duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }
        }
      >
        {isNext ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
      </motion.span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {isNext ? "Next" : "Previous"}
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

/** Brand chip rail that lets a reader jump to any study. */
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
 * Card-style case study carousel navigator. The whole control is a surfaced card
 * with previous/next teaser zones and a jump rail, so it is immediately readable
 * as navigation without being as large as the old primary block.
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
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
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
  const cs = studies[active];
  const next = studies[(active + 1) % studies.length];
  const nextMedia = caseMedia(next.id);

  if (position === "bottom") {
    return (
      <section className="pad-section-compact">
        <div className="container-page px-6 sm:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="grid items-center gap-6 p-6 lg:grid-cols-[7fr_5fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Read the next case study
                </p>
                <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {next.brand}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {next.title}
                </p>
                <p className="font-numeric mt-4 text-4xl font-bold leading-none tracking-tight">
                  <span className="text-gradient-primary">{heroNumber(next)}</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{next.hero.statLine}</p>
              </div>
              <img
                src={nextMedia.image}
                alt={nextMedia.alt}
                width={1280}
                height={960}
                loading="lazy"
                className="h-40 w-full rounded-2xl border border-border object-cover sm:h-48"
              />
            </div>
            <div className="border-t border-border p-4">
              <CaseStudyPager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pad-hero">
      <div className="container-page px-6 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={cs.id}
            className="grid items-center gap-10 lg:grid-cols-[7fr_5fr]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-pill bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-primary">
                {cs.marketplace}
              </div>
              <p className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {cs.brand}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-3xl">
                {cs.title}
              </h2>

              <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-4">
                <div>
                  <p className="font-numeric text-6xl font-bold leading-none tracking-tight sm:text-7xl">
                    <span className="text-gradient-primary">{heroNumber(cs)}</span>
                  </p>
                  <p className="mt-3 max-w-xs text-sm text-muted-foreground">{cs.hero.statLine}</p>
                </div>
                <div className="space-y-2">
                  {cs.metadata.slice(0, 3).map((m) => (
                    <p key={m.label} className="text-sm text-muted-foreground">
                      <span className="font-numeric font-semibold text-foreground">{m.value}</span>{" "}
                      {m.label}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <CaseStudyVisual data={cs} compact />
          </motion.div>
        </AnimatePresence>

        <div className="mt-10">
          <CaseStudyPager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
        </div>
      </div>
    </section>
  );
}

export default CaseStudyHeroBand;
