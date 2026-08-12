import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import NextStep from "@/website/components/marketing/NextStep";
import PageLayout from "@/website/components/PageLayout";
import { caseStudies } from "@/website/data/case-studies";
import { CaseStudyChapter } from "@/website/components/case-studies/CaseStudyChapter";
import { CaseStudyHeroBand } from "@/website/components/case-studies/CaseStudyHeroBand";
import { CtaSection } from "@/website/components/case-studies/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

const indexFromHash = (): number => {
  const id = typeof window === "undefined" ? "" : window.location.hash.replace("#", "");
  const found = caseStudies.findIndex((cs) => cs.id === id);
  return found === -1 ? 0 : found;
};

/**
 * The whole page is one carousel: a hero band at the top and bottom steps
 * between studies, and the chapter body swaps with it.
 */
const CaseStudies = () => {
  const total = caseStudies.length;
  const [active, setActive] = useState(0);

  useEffect(() => setActive(indexFromHash()), []);

  const select = useCallback(
    (index: number, scrollTop = false) => {
      const next = ((index % total) + total) % total;
      setActive(next);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${caseStudies[next].id}`);
        if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [total]
  );

  const study = caseStudies[active];

  return (
    <PageLayout>
      <div className="container-page px-6 pt-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Proof, <span className="text-gradient-primary">not promises.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Six partner accounts, two marketplaces, one way of working. Step through them one at a
            time.
          </p>
        </motion.div>
      </div>

      <CaseStudyHeroBand
        studies={caseStudies}
        active={active}
        onSelect={(i) => select(i)}
        onStep={(dir) => select(active + dir)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={study.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <CaseStudyChapter data={study} />
        </motion.div>
      </AnimatePresence>

      <CaseStudyHeroBand
        studies={caseStudies}
        active={active}
        position="bottom"
        onSelect={(i) => select(i, true)}
        onStep={(dir) => select(active + dir, true)}
      />

      <CtaSection />

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

