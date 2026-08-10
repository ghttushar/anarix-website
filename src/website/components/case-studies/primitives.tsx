import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import type { MetricStatData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Section({
  id,
  dark = false,
  tint = false,
  className = "",
  children,
}: {
  id?: string;
  dark?: boolean;
  tint?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`relative pad-section-compact ${dark ? "section-dark" : ""} ${tint ? "section-tint" : ""} ${className}`}
    >
      <div
        className={`container-page px-6 sm:px-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow: string;
  heading: ReactNode;
  sub?: string;
}) {
  return (
    <div className="gap-heading-sm max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.12]">
        {heading}
      </h2>
      {sub ? <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{sub}</p> : null}
    </div>
  );
}

function CountUpValue({
  item,
  className,
  start,
}: {
  item: MetricStatData;
  className?: string;
  start: boolean;
}) {
  const value = useCountUp(item.value, { start });
  return (
    <span className={className}>
      {item.prepend ? <span className="text-primary">{item.prepend}</span> : null}
      {item.prefix}
      {value.toFixed(item.decimals ?? 0)}
      {item.suffix}
    </span>
  );
}

function KpiCard({ item, delay }: { item: MetricStatData; delay: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`relative p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-soft transition-all duration-700 hover:-translate-y-1 hover:shadow-medium ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
      }`}
      style={{ transitionDelay: isVisible ? undefined : `${delay}ms` }}
    >
      <div className="font-numeric text-3xl sm:text-4xl font-bold tracking-tight">
        <CountUpValue item={item} className="text-gradient-primary" start={isVisible} />
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{item.label}</p>
      {item.sub ? <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p> : null}
    </div>
  );
}

export function KpiGrid({ items, columns = 4 }: { items: MetricStatData[]; columns?: number }) {
  return (
    <div
      className={`grid gap-4 sm:gap-5 ${
        columns === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : columns === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {items.map((item, i) => (
        <KpiCard key={item.label} item={item} delay={i * 90} />
      ))}
    </div>
  );
}

export function MetricStat({ item }: { item: MetricStatData }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-soft transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
      }`}
    >
      <div className="font-numeric text-2xl sm:text-3xl font-bold tracking-tight">
        <CountUpValue item={item} className="text-gradient-primary" start={isVisible} />
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{item.label}</p>
      {item.sub ? <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p> : null}
    </div>
  );
}

export function InsightCard({ value, text }: { value: string; text: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`flex items-start gap-4 pad-card-sm rounded-2xl border border-border bg-card shadow-soft transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className="shrink-0 font-numeric text-xl sm:text-2xl font-bold text-primary">{value}</span>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

export function TimelineStep({
  index,
  title,
  text,
  last = false,
}: {
  index: number;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div className="relative pl-14">
      {!last ? (
        <div className="absolute left-[17px] top-11 bottom-[-2.25rem] w-px bg-border/60" aria-hidden />
      ) : null}
      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-display font-bold text-sm flex items-center justify-center">
        {String(index).padStart(2, "0")}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

export function BeforeStrategyResult({
  before,
  strategy,
  result,
}: {
  before: string;
  strategy: string;
  result: string;
}) {
  const cols = [
    { label: "Before", text: before, accent: "text-muted-foreground" },
    { label: "Strategy", text: strategy, accent: "text-primary" },
    { label: "Result", text: result, accent: "text-emerald-500" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4 items-stretch">
      {cols.map((col, i) => (
        <div key={col.label} className="relative">
          {i > 0 ? (
            <div className="hidden md:flex absolute -left-4 top-8 items-center justify-center w-8 h-8 text-muted-foreground">
              <ArrowRight className="w-4 h-4" />
            </div>
          ) : null}
          <div
            className={`h-full pad-card rounded-2xl border bg-card shadow-soft ${
              i === 2 ? "border-primary/40" : "border-border"
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${col.accent}`}>{col.label}</p>
            <p className="mt-3 text-sm text-foreground leading-relaxed font-medium">{col.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <figure
      ref={ref}
      className={`relative rounded-3xl border border-border bg-card shadow-soft px-8 py-8 sm:px-12 sm:py-10 text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl leading-none">
        &ldquo;
      </div>
      <blockquote className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-[1.25]">
        {text}
      </blockquote>
      <figcaption className="mt-6 text-sm text-muted-foreground">{attribution}</figcaption>
    </figure>
  );
}

export function CtaSection({ dark = true }: { dark?: boolean }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section ref={ref} className={`relative pad-cta ${dark ? "section-dark" : ""}`}>
      <div
        className={`container-page px-6 sm:px-8 text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          Ready?
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
          Your numbers could be the <span className="text-gradient-primary">next case study.</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Start with a free audit. We&apos;ll show you what your account is losing before you pay a thing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine group"
          >
            <Link to="/demo">
              Get your free audit
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200"
          >
            <Link to="/products/platform">Explore the Platform</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SoftDivider({ className = "" }: { className?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-border/80 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1, ease: EASE }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

export function ChapterDivider({
  index,
  eyebrow,
  title,
  meta = [],
}: {
  index: string;
  eyebrow: string;
  title: string;
  meta?: string[];
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className="container-page px-6 sm:px-8 py-10 sm:py-14">
      <div
        className={`text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <SoftDivider className="gap-block-sm" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Next case study
        </p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <span className="font-numeric text-5xl sm:text-6xl font-bold text-foreground/10 tracking-tight select-none">
            {index}
          </span>
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              {title}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {meta.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1 rounded-pill bg-card border border-border text-xs text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          className="mt-8 flex justify-center text-muted-foreground"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
        <SoftDivider className="gap-block-sm" />
      </div>
    </div>
  );
}
