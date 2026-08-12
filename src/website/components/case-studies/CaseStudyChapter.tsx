import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { CaseStudyData } from "../../data/case-studies";
import {
  Section,
  Eyebrow,
  KpiGrid,
  MetricStat,
  InsightCard,
  TimelineStep,
  BeforeStrategyResult,
  BeforeAfterTable,
  QuoteBlock,
  SoftDivider,
} from "./primitives";
import { CaseChartBlock } from "./charts";

/**
 * One chapter template, used unchanged by every case study: hero band with the
 * loud numbers, the challenge, the approach, the numbers, the quote, the recap.
 */

function ChapterOpening({ data }: { data: CaseStudyData }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} id={data.id} className="scroll-mt-28">
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow>Overview</Eyebrow>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {data.partnerLine}
          </p>
        </div>

        <p className="mt-6 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          {data.intro}
        </p>

        <div className="flex flex-wrap gap-2 gap-block-sm">
          {data.metadata.map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-card border border-border text-xs text-muted-foreground"
            >
              <span className="font-numeric font-semibold text-foreground">{m.value}</span>
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


function ChallengeCard({ index, title, text }: { index: number; title: string; text: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="h-full pad-card-sm rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-start gap-3">
          <span className="font-numeric text-xs font-bold text-primary mt-0.5">
            {String(index).padStart(2, "0")}
          </span>
          <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
        </div>
        <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function ChallengeVisual({ visual }: { visual: CaseStudyData["challenge"]["visual"] }) {
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
              <p className="font-numeric text-base font-bold text-foreground">{row.value}</p>
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

function ChapterHeading({ eyebrow, heading, sub }: { eyebrow: string; heading: string; sub: string }) {
  return (
    <div className="max-w-3xl gap-heading-sm">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
        {heading}
      </h3>
      <p className="mt-2 text-muted-foreground">{sub}</p>
    </div>
  );
}

export function CaseStudyChapter({ data }: { data: CaseStudyData }) {
  return (
    <article>
      <div className="pt-4 pb-12 sm:pb-16">
        <div className="container-page px-6 sm:px-8">
          <ChapterOpening data={data} />
        </div>
      </div>

      <Section tint>
        <ChapterHeading eyebrow="Challenge" heading={data.challenge.heading} sub={data.challenge.sub} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {data.challenge.cards.map((c, i) => (
            <ChallengeCard key={c.title} index={i + 1} title={c.title} text={c.text} />
          ))}
        </div>
        <ChallengeVisual visual={data.challenge.visual} />
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <CaseStudyVisual data={data} />
          <div>
            <ChapterHeading
              eyebrow="On the ground"
              heading="What the catalog actually looked like"
              sub={data.transition.sub}
            />
            <p className="mt-4 text-muted-foreground leading-relaxed">{data.transition.before}</p>
            <p className="mt-4 text-foreground leading-relaxed font-medium">
              {data.transition.strategy}
            </p>
          </div>
        </div>
      </Section>

      <Section panel>
        <ChapterHeading eyebrow="Approach" heading={data.strategy.heading} sub={data.strategy.sub} />
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

      <Section>
        <ChapterHeading
          eyebrow="The numbers"
          heading="The data that told the story"
          sub="Every point below comes from the partner account."
        />
        <div className="space-y-10">
          {data.charts.map((chart, i) => (
            <CaseChartBlock key={i} chart={chart} />
          ))}
          {data.beforeAfter ? <BeforeAfterTable table={data.beforeAfter} /> : null}
        </div>
      </Section>

      <Section tint>
        <ChapterHeading eyebrow="Insights" heading={data.insights.heading} sub={data.insights.sub} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.insights.items.map((item) => (
            <InsightCard key={item.value} value={item.value} text={item.text} />
          ))}
        </div>
      </Section>

      <Section panel>
        <ChapterHeading eyebrow="Outcome" heading={data.transition.heading} sub={data.transition.sub} />
        <BeforeStrategyResult
          before={data.transition.before}
          strategy={data.transition.strategy}
          result={data.transition.result}
        />
      </Section>

      <Section>
        <QuoteBlock
          text={data.quote.text}
          name={data.quote.name}
          title={data.quote.title}
          brand={data.quote.brand}
        />
      </Section>

      <Section tint>
        <ChapterHeading
          eyebrow="By the numbers"
          heading={data.finalMetrics.heading}
          sub={data.finalMetrics.sub}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data.finalMetrics.items.map((item) => (
            <MetricStat key={item.label} item={item} />
          ))}
        </div>
      </Section>
    </article>
  );
}
