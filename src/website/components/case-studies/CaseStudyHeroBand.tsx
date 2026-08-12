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
  brand.length > 18 ? `${brand.slice(0, 17).trimEnd()}...` : brand;

/** One circular arrow button with a hover label for the brand it leads to. */
function ArrowButton({
  dir,
  brand,
  onClick,
}: {
  dir: -1 | 1;
  brand: string;
  onClick: () => void;
}) {
  const isNext = dir === 1;
  return (
    <div className="group relative shrink-0">
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100">
        {shortBrand(brand)}
      </span>
      <button
        type="button"
        onClick={onClick}
        aria-label={isNext ? "Next case study" : "Previous case study"}
        className={
          isNext
            ? "flex h-10 w-10 items-center justify-center rounded-pill bg-primary/10 text-primary ring-1 ring-primary/40 transition-colors hover:bg-primary/20"
            : "flex h-10 w-10 items-center justify-center rounded-pill text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground hover:ring-primary/40"
        }
      >
        <motion.span
          className="flex"
          animate={isNext ? { x: [0, 3, 0] } : undefined}
          transition={
            isNext ? { duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 } : undefined
          }
        >
          {isNext ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        </motion.span>
      </button>
    </div>
  );
}

/**
 * Slim pager: arrows on the outside, the current position and brand in the
 * middle, and a numbered rail for direct jumps.
 */
function Pager({
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
    <div className="flex items-center gap-3 rounded-pill border border-border bg-card/90 px-3 py-2 shadow-soft backdrop-blur">
      <ArrowButton dir={-1} brand={prev.brand} onClick={() => onStep(-1)} />

      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="flex min-w-0 items-baseline gap-2"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <span className="font-numeric text-xs font-semibold text-muted-foreground">
              {String(active + 1).padStart(2, "0")} / {String(studies.length).padStart(2, "0")}
            </span>
            <span className="truncate text-sm font-semibold text-foreground">
              {shortBrand(current.brand)}
            </span>
          </motion.div>
        </AnimatePresence>

        <div className="ml-auto hidden items-center gap-1.5 sm:flex">
          {studies.map((s, i) => (
            <button
              key={s.id}
              type="button"
              title={s.brand}
              aria-label={`Go to ${s.brand}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => onSelect(i)}
              className={
                i === active
                  ? "font-numeric rounded-pill bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground"
                  : "font-numeric rounded-pill px-2 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground hover:ring-primary/40"
              }
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

      <ArrowButton dir={1} brand={next.brand} onClick={() => onStep(1)} />
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
              <Pager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pad-hero">
      <div className="container-page px-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Case study{" "}
            <span className="font-numeric text-foreground">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="font-numeric"> / {String(studies.length).padStart(2, "0")}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Step through all {studies.length} accounts
          </p>
        </div>

        <div className="mt-4">
          <Pager studies={studies} active={active} onSelect={onSelect} onStep={onStep} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cs.id}
            className="mt-8 grid items-center gap-10 lg:grid-cols-[7fr_5fr]"
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
      </div>
    </section>
  );
}

export default CaseStudyHeroBand;
