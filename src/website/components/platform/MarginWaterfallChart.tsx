import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Step {
  label: string;
  value: string;
  height: number; // 0-100
  kind: "start" | "deduct" | "end";
}

const steps: Step[] = [
  { label: "GMV", value: "$102.3K", height: 100, kind: "start" },
  { label: "Returns", value: "−$6.2K", height: 86, kind: "deduct" },
  { label: "Fees", value: "−$18.9K", height: 62, kind: "deduct" },
  { label: "Ad cost", value: "−$6.8K", height: 49, kind: "deduct" },
  { label: "COGS", value: "−$21.4K", height: 27, kind: "deduct" },
  { label: "Net profit", value: "$28.9K", height: 27, kind: "end" },
];

/** Animated margin waterfall — GMV walked down to net profit through each deduction. */
const MarginWaterfallChart = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs sm:text-sm font-semibold text-foreground">Margin waterfall</p>
        <span className="text-[10px] sm:text-[11px] text-muted-foreground">July 2026</span>
      </div>

      <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-36 sm:h-44">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center justify-end flex-1 h-full">
            <span
              className={`mb-1.5 text-[9px] sm:text-[11px] font-numeric font-semibold whitespace-nowrap ${
                s.kind === "deduct" ? "text-rose-600 dark:text-rose-400" : "text-foreground"
              }`}
            >
              {s.value}
            </span>
            <motion.div
              className={`w-full rounded-t-md sm:rounded-t-lg ${
                s.kind === "start"
                  ? "bg-primary"
                  : s.kind === "end"
                  ? "bg-emerald-500"
                  : "bg-primary/25"
              }`}
              initial={{ height: 0 }}
              whileInView={{ height: `${s.height}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-border/60">
        {steps.map((s) => (
          <span
            key={s.label}
            className="flex-1 text-center text-[8.5px] sm:text-[10.5px] leading-tight text-muted-foreground"
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarginWaterfallChart;
