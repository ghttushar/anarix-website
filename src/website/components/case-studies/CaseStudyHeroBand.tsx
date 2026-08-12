import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CaseStudyVisual } from "./CaseStudyVisual";
import type { CaseStudyData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

const heroNumber = (cs: CaseStudyData): string => {
  const { prepend = "", prefix = "", value, decimals = 0, suffix = "" } = cs.hero;
  return `${prepend}${prefix}${value.toFixed(decimals)}${suffix}`;
};

function StepButton({
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
      className="flex h-11 w-11 items-center justify-center rounded-pill border border-border bg-card text-foreground shadow-soft transition-colors hover:border-primary/50 hover:text-primary"
    >
      {children}
    </button>
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

  return (
    <section className={position === "top" ? "pad-hero-compact" : "pad-section-compact"}>
      <div className="container-page px-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {position === "top" ? "Case study" : "Read the next one"}{" "}
            <span className="font-numeric text-foreground">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="font-numeric"> / {String(studies.length).padStart(2, "0")}</span>
          </p>

          <div className="flex items-center gap-3">
            <StepButton label="Previous case study" onClick={() => onStep(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </StepButton>
            <div className="flex items-center gap-2">
              {studies.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show ${s.brand}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => onSelect(i)}
                  className={`h-1.5 rounded-pill transition-all duration-300 ${
                    i === active ? "w-7 bg-primary" : "w-1.5 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>
            <StepButton label="Next case study" onClick={() => onStep(1)}>
              <ArrowRight className="h-4 w-4" />
            </StepButton>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cs.id}
            className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]"
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

              <button
                type="button"
                onClick={() => onStep(1)}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Next: {next.brand}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <CaseStudyVisual data={cs} compact />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default CaseStudyHeroBand;
