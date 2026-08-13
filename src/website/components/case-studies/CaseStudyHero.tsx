import { AnimatePresence, motion } from "framer-motion";

import { CaseStudyVisual } from "./CaseStudyVisual";
import type { CaseStudyData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

const heroNumber = (cs: CaseStudyData): string => {
  const { prepend = "", prefix = "", value, decimals = 0, suffix = "" } = cs.hero;
  return `${prepend}${prefix}${value.toFixed(decimals)}${suffix}`;
};

export function CaseStudyHero({
  data,
  index,
  total,
}: {
  data: CaseStudyData;
  index: number;
  total: number;
}) {
  const topKpis = data.finalMetrics?.items.slice(0, 2) ?? data.kpis.slice(0, 2);

  return (
    <section className="pad-hero">
      <div className="container-page px-6 sm:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-pill bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-primary">
              {data.marketplace}
            </div>

            <p className="font-numeric mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Case Study {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {data.brand}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                  {data.title}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <p className="font-numeric text-5xl font-bold leading-none tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-gradient-primary">{heroNumber(data)}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{data.hero.statLine}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {data.metadata.map((m) => (
                <span
                  key={m.label}
                  className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <span className="font-numeric font-semibold text-foreground">{m.value}</span>
                  {m.label}
                </span>
              ))}
            </div>

            {topKpis.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:max-w-md">
                {topKpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl border border-border bg-card p-4 text-left shadow-soft"
                  >
                    <p className="font-numeric text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      <span className="text-gradient-primary">
                        {`${kpi.prepend || ""}${kpi.prefix || ""}${kpi.value.toFixed(kpi.decimals ?? 0)}${kpi.suffix || ""}`}
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-medium text-foreground">{kpi.label}</p>
                    {kpi.sub && <p className="text-xs text-muted-foreground">{kpi.sub}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <CaseStudyVisual data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CaseStudyHero;
