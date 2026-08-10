import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { caseStudies, type CaseStudyData } from "@/website/data/case-studies";
import { smoothPath } from "@/website/components/case-studies/charts";

const CaseStudyTeasers = () => {
  return (
    <section className="relative pad-section overflow-hidden">
      <div className="container-page px-6 sm:px-8">
        <TeasersIntro />
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {caseStudies.map((cs) => (
            <TeaserCard key={cs.id} cs={cs} />
          ))}
        </div>
      </div>
    </section>
  );
};

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
        Real numbers from real accounts — the way we measure is the way we work.
      </p>
    </div>
  );
}

function TeaserCard({ cs }: { cs: CaseStudyData }) {
  return (
    <div className="h-full flex flex-col rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col flex-1 gap-6">
        <TeaserBody cs={cs} />
        <div className="mt-auto">
          <TeaserDashboard cs={cs} />
        </div>
      </div>
    </div>
  );
}

function TeaserBody({ cs }: { cs: CaseStudyData }) {
  const { ref, isVisible } = useScrollReveal();
  const value = useCountUp(cs.hero.value, { duration: 1800, start: isVisible });
  return (
    <div
      ref={ref}
      className={`flex flex-1 flex-col transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-[1.12]">
        {cs.title}
      </h3>

      <p className="mt-5 font-numeric text-3xl sm:text-4xl font-bold tracking-tight leading-none">
        <span className="text-gradient-primary">
          {cs.hero.prefix}
          {value.toFixed(cs.hero.decimals ?? 0)}
          {cs.hero.suffix}
        </span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {cs.hero.statLine}
      </p>

      <div
        className="mt-5 flex flex-wrap gap-2"
        style={{ alignContent: "flex-start", minHeight: "5.5rem" }}
      >
        {cs.kpis.slice(0, 3).map((k) => (
          <span
            key={k.label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-card border border-border text-xs text-muted-foreground"
          >
            <span className="font-display font-bold text-foreground">
              {k.prepend ?? ""}
              {k.prefix ?? ""}
              {k.value.toFixed(k.decimals ?? 0)}
              {k.suffix ?? ""}
            </span>
            {k.label}
          </span>
        ))}
      </div>

      <Link
        to={`/case-studies#${cs.id}`}
        className="group mt-auto pt-6 self-start inline-flex items-center gap-2 rounded-pill px-6 h-11 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine"
      >
        Explore Case Study
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

function TeaserDashboard({ cs }: { cs: CaseStudyData }) {
  const { ref, isVisible } = useScrollReveal();
  const chart = cs.charts[0];
  const legendSeries =
    chart.type === "tacos" ? [chart.series] : chart.series;
  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-border bg-card shadow-soft p-4 sm:p-5 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {chart.title}
        </p>
        <p className="text-[10px] text-muted-foreground/80">{chart.source}</p>
      </div>
      <div className="mt-3">
        {chart.type === "stacked" ? (
          <MiniStacked chart={chart} />
        ) : (
          <MiniLine chart={chart as Extract<CaseStudyData["charts"][number], { type: "line" }>} />
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/60 pt-3">
        {legendSeries.map((s) => (
          <span
            key={s.name}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniLine({ chart }: { chart: Extract<CaseStudyData["charts"][number], { type: "line" }> }) {
  const n = chart.labels.length;
  const w = 560;
  const h = 150;
  const pad = { l: 8, r: 8, t: 8, b: 8 };
  const pts = chart.series.map((s) =>
    s.values.map((v, i) => ({
      x: pad.l + (i * (w - pad.l - pad.r)) / (n - 1),
      y: pad.t + (1 - v / chart.max) * (h - pad.t - pad.b),
    }))
  );
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={chart.title}>
      {pts.map((seriesPts, si) => (
        <g key={si}>
          {si === 0 ? (
            <motion.path
              d={areaPath2(seriesPts, h - pad.t - pad.b, pad.t)}
              fill={chart.series[si].color}
              fillOpacity={0.08}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          ) : null}
          <motion.path
            d={smoothPath(seriesPts)}
            fill="none"
            stroke={chart.series[si].color}
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
        </g>
      ))}
    </svg>
  );
}

function areaPath2(pts: { x: number; y: number }[], plotH: number, top: number) {
  const line = smoothPath(pts);
  return `${line} L ${pts[pts.length - 1].x} ${top + plotH} L ${pts[0].x} ${top + plotH} Z`;
}

function MiniStacked({ chart }: { chart: Extract<CaseStudyData["charts"][number], { type: "stacked" }> }) {
  const n = chart.labels.length;
  const w = 560;
  const h = 150;
  const pad = { l: 8, r: 8, t: 8, b: 8 };
  const gw = (w - pad.l - pad.r) / n;
  const barW = gw * 0.55;
  const baseY = h - pad.b;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={chart.title}>
      {chart.series[0].values.map((_, i) => {
        let y0 = baseY;
        return (
          <g key={i}>
            {chart.series.map((s, si) => {
              const barH = (s.values[i] / chart.max) * (h - pad.t - pad.b);
              const rectY = y0 - barH;
              y0 = rectY;
              return (
                <motion.rect
                  key={si}
                  x={pad.l + i * gw + (gw - barW) / 2}
                  width={barW}
                  rx={2}
                  fill={s.color}
                  initial={{ y: baseY, height: 0, opacity: 0.6 }}
                  whileInView={{ y: rectY, height: barH, opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: i * 0.04 + si * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default CaseStudyTeasers;
