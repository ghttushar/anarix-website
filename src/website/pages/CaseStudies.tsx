import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/website/components/PageLayout";
import ScrollProgress from "@/website/components/ScrollProgress";
import { caseStudies, apparelStudy } from "@/website/data/case-studies";
import { CaseStudyChapter } from "@/website/components/case-studies/CaseStudyChapter";
import {
  CtaSection,
  ChapterDivider,
} from "@/website/components/case-studies/primitives";

const CaseStudies = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = caseStudies.map((cs) => cs.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <PageLayout>
      <ScrollProgress
        sections={[
          { label: "Overview", shape: "◆" },
          { label: "Walmart", shape: "●" },
          { label: "Amazon", shape: "●" },
          { label: "CTA", shape: "◆" },
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
              Two partners, two marketplaces, one outcome — real numbers from real accounts.
            </p>
          </motion.div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            {caseStudies.map((cs, i) => {
              const isActive = activeId === cs.id;
              return (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                >
                  <Link
                    to={`/case-studies#${cs.id}`}
                    className={`group flex items-center justify-between gap-4 pad-card-sm rounded-2xl border bg-card shadow-soft hover:shadow-medium transition-all duration-300 ${
                      isActive
                        ? "border-primary/60 bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {cs.metadata[0].value} · {cs.metadata[3].value}
                      </p>
                      <p className="mt-1.5 font-display text-lg font-semibold text-foreground leading-snug">
                        {cs.title}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isActive ? "bg-primary" : "bg-muted-foreground/40"
                          }`}
                        />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {cs.index} / 02
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-all ${
                        isActive
                          ? "text-primary translate-x-0.5"
                          : "text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5"
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <CaseStudyChapter data={caseStudies[0]} />

        <ChapterDivider
          index={apparelStudy.index}
          eyebrow={apparelStudy.eyebrow}
          title={apparelStudy.title}
          meta={apparelStudy.metadata.map((m) => `${m.value} · ${m.label}`)}
        />

        <CaseStudyChapter data={caseStudies[1]} />

        <CtaSection />
      </div>
    </PageLayout>
  );
};

export default CaseStudies;
