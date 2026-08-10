import { motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

const PERKS = ["Free", "No account needed", "Amazon & Walmart", "Runs in seconds"];

const FinalCtaSection = () => {
  const scrollToAnalyzer = () => {
    document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative py-16 sm:py-20">
      <motion.div
        className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl bg-aan-gradient px-6 py-12 sm:p-14 text-center shadow-strong"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Start Now With Jiva
        </h2>
        <p className="mt-3 text-white/85 max-w-md mx-auto">
          All the features you need. None of the hassle you don&apos;t.
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PERKS.map((perk) => (
            <li
              key={perk}
              className="rounded-full border border-white/25 bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium text-white"
            >
              {perk}
            </li>
          ))}
        </ul>
        <Button
          onClick={scrollToAnalyzer}
          className="mt-8 h-12 px-8 rounded-pill bg-white text-foreground font-semibold hover:bg-white/90 shadow-soft"
        >
          <ScanSearch className="w-5 h-5" />
          Analyze a Listing Free
        </Button>
      </motion.div>
    </section>
  );
};

export default FinalCtaSection;