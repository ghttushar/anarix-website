import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Severity } from "@/website/lib/listingOptimization";

interface Rule {
  title: string;
  detail: string;
  severity: Severity;
}

const RULES: Rule[] = [
  {
    title: "Resolution at or above 1600px",
    detail: "Low-resolution images fail the zoom-friendly threshold most marketplaces enforce.",
    severity: "high",
  },
  {
    title: "Pure white background",
    detail: "Off-white or gradient backgrounds reduce approval odds and hurt thumbnail contrast.",
    severity: "high",
  },
  {
    title: "No text, watermarks, or badges",
    detail: "Promotional overlays are flagged by marketplace review systems.",
    severity: "high",
  },
  {
    title: "Product fills 85%+ of the frame",
    detail: "Tight crops keep the product dominant in search grids and hover zoom.",
    severity: "medium",
  },
  {
    title: "Zoom-ready crop with clean edges",
    detail: "Uncluttered compositions preserve detail when buyers zoom in.",
    severity: "medium",
  },
  {
    title: "Consistent, balanced lighting",
    detail: "Even exposure signals quality and matches top-ranked listings.",
    severity: "low",
  },
];

const dotStyles: Record<Severity, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-green-500",
};

const GradingRulesSection = () => (
  <motion.section
    className="mt-16 grid lg:grid-cols-2 gap-8 items-start"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Automatically Graded Against Marketplace Rules
      </h2>
      <p className="mt-3 text-muted-foreground">
        Images and videos are the most important drivers of marketplace sales. The analyzer
        evaluates your main image against 40+ rules and recommendations culled from Amazon and
        Walmart, scoring it to predict how well it converts.
      </p>
      <div className="mt-6 space-y-2.5">
        {RULES.map((rule, i) => (
          <Disclosure
            key={rule.title}
            title={rule.title}
            defaultOpen={i === 0}
            leading={<span className={`mt-1.5 w-2 h-2 rounded-full ${dotStyles[rule.severity]} flex-shrink-0`} />}
          >
            <p className="text-xs leading-relaxed">{rule.detail}</p>
          </Disclosure>
        ))}
      </div>
    </div>

    <div className="pad-card rounded-2xl border border-border bg-card shadow-soft">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Sample analysis result
      </p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-5xl font-bold text-foreground tabular-nums">5.2</span>
        <span className="text-2xl font-semibold text-muted-foreground">/10</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-600">
          2 critical issues
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-600">
          2 improvements
        </span>
        <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-600">
          1 best practice
        </span>
      </div>
      <div className="mt-5 pt-4 border-t border-border/60 flex items-start gap-2.5 text-sm text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <span>
          The same engine scores your own ASIN — paste it above and see exactly what holds your
          image back before you publish.
        </span>
      </div>
    </div>
  </motion.section>
);

export default GradingRulesSection;