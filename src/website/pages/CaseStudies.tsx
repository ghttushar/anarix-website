import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import NextStep from "@/website/components/marketing/NextStep";
import PageLayout from "@/website/components/PageLayout";
import ScrollProgress from "@/website/components/ScrollProgress";
import { caseStudies, type CaseStudyData } from "@/website/data/case-studies";
import { CaseStudyChapter } from "@/website/components/case-studies/CaseStudyChapter";
import { CtaSection, ChapterDivider } from "@/website/components/case-studies/primitives";

/** "+234%", "409 → 57", "~6x" — the single loud number for a nav card. */
const headlineNumber = (cs: CaseStudyData): string => {
  const { prepend = "", prefix = "", value, decimals = 0, suffix = "" } = cs.hero;
  return `${prepend}${prefix}${value.toFixed(decimals)}${suffix}`;
};

const scrollToChapter = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const NavCard = ({ cs, active, delay }: { cs: CaseStudyData; active: boolean; delay: number }) => (
  <motion.button
    type="button"
    onClick={() => scrollToChapter(cs.id)}
    aria-current={active ? "true" : undefined}
    className={`group flex flex-col h-full text-left pad-card-sm rounded-2xl border bg-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5 ${
      active ? "border-primary/60" : "border-border hover:border-primary/40"
    }`}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <p className="font-display text-lg font-bold text-foreground leading-tight min-h-[1.75rem]">
      {cs.brand}
    </p>
    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground min-h-[2rem]">
      {cs.marketplace}
    </p>
    <p className="mt-2 font-numeric text-4xl sm:text-5xl font-bold tracking-tight leading-none">
      <span className="text-gradient-primary">{headlineNumber(cs)}</span>
    </p>
    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
      Read the story
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </span>
  </motion.button>
);

const CaseStudies = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    caseStudies.forEach((cs) => {
      const el = document.getElementById(cs.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <PageLayout>
      <ScrollProgress
        sections={[
          { label: "Overview", shape: "◆" },
          ...caseStudies.map((cs) => ({ label: cs.brand, shape: "●" })),
        ]}
      />
      <div className="container-page px-6">
        <div className="text-center pad-hero">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              Case Studies
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
              Proof, <span className="text-gradient-primary">not promises.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Four partners, two marketplaces, one way of working — real numbers from real accounts.
            </p>
          </motion.div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {caseStudies.map((cs, i) => (
              <NavCard key={cs.id} cs={cs} active={activeId === cs.id} delay={0.15 + i * 0.08} />
            ))}
          </div>
        </div>

        {caseStudies.map((cs, i) => (
          <div key={cs.id}>
            {i > 0 ? (
              <ChapterDivider
                index={cs.index}
                eyebrow={cs.marketplace}
                title={cs.brand}
                meta={[headlineNumber(cs), cs.period]}
              />
            ) : null}
            <CaseStudyChapter data={cs} />
          </div>
        ))}

        <CtaSection />
      </div>
      <NextStep
        title="See the platform behind these results"
        description="The same profitability views our team used on every one of these accounts."
        to="/products"
        label="Explore the platform"
      />
    </PageLayout>
  );
};

export default CaseStudies;
