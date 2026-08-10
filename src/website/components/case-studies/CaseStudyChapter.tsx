import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import type { CaseStudyData } from "../../data/case-studies";
import {
  Section,
  Eyebrow,
  KpiGrid,
  MetricStat,
  InsightCard,
  TimelineStep,
  BeforeStrategyResult,
  QuoteBlock,
  SoftDivider,
} from "./primitives";
import { CaseChartBlock } from "./charts";
import Disclosure from "@/website/components/ui/Disclosure";

function ChapterHero({ data }: { data: CaseStudyData }) {
  const { ref, isVisible } = useScrollReveal();
  const value = useCountUp(data.hero.value, { duration: 1800, start: isVisible });
  return (
    <div ref={ref} id={data.id} className="scroll-mt-28">
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between gap-6 flex-wrap gap-block-sm">
          <span className="font-display text-5xl sm:text-6xl font-bold text-foreground/10 tracking-tight select-none">
            {data.index}
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {data.partnerLine}
          </p>
        </div>

        <Eyebrow className="mb-4">{data.eyebrow}</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.08] max-w-3xl gap-heading-sm">
          {data.title}
        </h2>

        <div className="grid lg:grid-cols-[auto_1fr] gap-grid items-start mb-8">
          <div className="min-w-0">
            <p className="font-display text-6xl sm:text-7xl font-bold tracking-tight leading-none">
              <span className="text-gradient-primary">
                {data.hero.prefix}
                {value.toFixed(data.hero.decimals ?? 0)}
                {data.hero.suffix}
              </span>
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {data.hero.label}
            </p>
          </div>
          <div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{data.intro}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 gap-block-sm">
          {data.metadata.map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-card border border-border text-xs text-muted-foreground"
            >
              <span className="font-semibold text-foreground">{m.value}</span>
              {m.label}
            </span>
          ))}
        </div>

        <KpiGrid items={data.kpis} />

        <div className="mt-14 sm:mt-16">
          <SoftDivider />
        </div>
      </div>
    </div>
  );
}

function ChallengeSection({ data }: { data: CaseStudyData }) {
  return (
    <Section tint>
      <div className="max-w-3xl gap-heading-sm">
        <Eyebrow>Challenge</Eyebrow>
        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.challenge.heading}
        </h3>
        <p className="mt-2 text-muted-foreground">{data.challenge.sub}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
        {data.challenge.cards.map((c, i) => (
          <ChallengeCard key={c.title} index={i + 1} title={c.title} text={c.text} />
        ))}
      </div>
      <ChallengeVisual visual={data.challenge.visual} />
    </Section>
  );
}

function ChallengeCard({
  index,
  title,
  text,
}: {
  index: number;
  title: string;
  text: string;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <Disclosure
        title={title}
        defaultOpen={index === 1}
        leading={<span className="font-display text-xs font-bold text-primary mt-0.5">{String(index).padStart(2, "0")}</span>}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </Disclosure>
    </div>
  );
}

function ChallengeVisual({
  visual,
}: {
  visual: CaseStudyData["challenge"]["visual"];
}) {
  const { ref, isVisible } = useScrollReveal();
  const maxRowPct = Math.max(...visual.rows.map((r) => r.pct));
  return (
    <div
      ref={ref}
      className={`rounded-3xl border border-border bg-card shadow-soft p-6 sm:p-7 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <h4 className="font-display text-lg font-semibold text-foreground">{visual.title}</h4>
      <div className="mt-6 grid sm:grid-cols-3 gap-8">
        {visual.rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm text-muted-foreground">{row.label}</p>
              <p className="font-display text-base font-bold text-foreground">{row.value}</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                whileInView={{ width: `${(row.pct / maxRowPct) * 100}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
      {visual.footnote ? (
        <p className="mt-6 text-xs text-muted-foreground italic">{visual.footnote}</p>
      ) : null}
    </div>
  );
}

function StrategySection({ data }: { data: CaseStudyData }) {
  return (
    <Section dark>
      <div className="max-w-3xl gap-heading-sm">
        <Eyebrow>Strategy</Eyebrow>
        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.strategy.heading}
        </h3>
        <p className="mt-2 text-muted-foreground">{data.strategy.sub}</p>
      </div>
      <div className="space-y-8">
        {data.strategy.steps.map((s, i) => (
          <TimelineStep
            key={s.title}
            index={i + 1}
            title={s.title}
            text={s.text}
            last={i === data.strategy.steps.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}

function InsightsSection({ data }: { data: CaseStudyData }) {
  return (
    <Section tint>
      <div className="max-w-3xl gap-heading-sm">
        <Eyebrow>Insights</Eyebrow>
        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.insights.heading}
        </h3>
        <p className="mt-2 text-muted-foreground">{data.insights.sub}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.insights.items.map((item, i) => (
          <div key={item.value} style={{ transitionDelay: `${i * 80}ms` }}>
            <InsightCard value={item.value} text={item.text} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function TransitionSection({ data }: { data: CaseStudyData }) {
  return (
    <Section dark>
      <div className="max-w-3xl gap-heading-sm">
        <Eyebrow>Outcome</Eyebrow>
        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.transition.heading}
        </h3>
        <p className="mt-2 text-muted-foreground">{data.transition.sub}</p>
      </div>
      <BeforeStrategyResult
        before={data.transition.before}
        strategy={data.transition.strategy}
        result={data.transition.result}
      />
    </Section>
  );
}

export function CaseStudyChapter({ data }: { data: CaseStudyData }) {
  return (
    <article>
      <div className="pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="container-page px-6 sm:px-8">
          <ChapterHero data={data} />
        </div>
      </div>
      <ChallengeSection data={data} />
      <StrategySection data={data} />
      <Section>
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Dashboard</Eyebrow>
          <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            The data that told the story
          </h3>
          <p className="mt-2 text-muted-foreground">Every point below is real reporting from the partner account.</p>
        </div>
        <div className="space-y-10">
          {data.charts.map((chart, i) => (
            <CaseChartBlock key={i} chart={chart} />
          ))}
        </div>
      </Section>
      <InsightsSection data={data} />
      <TransitionSection data={data} />
      <Section>
        <QuoteBlock text={data.quote.text} attribution={data.quote.attribution} />
      </Section>
      <Section tint>
        <div className="max-w-3xl gap-heading-sm">
          <Eyebrow>By the numbers</Eyebrow>
          <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {data.finalMetrics.heading}
          </h3>
          <p className="mt-2 text-muted-foreground">{data.finalMetrics.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data.finalMetrics.items.map((item) => (
            <MetricStat key={item.label} item={item} />
          ))}
        </div>
      </Section>
    </article>
  );
}
