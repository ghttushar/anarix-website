import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sub?: string;
  ariaLabel: string;
}

const STATS: Stat[] = [
  { value: 40, suffix: "+", label: "Marketplace rules", sub: "evaluated per image", ariaLabel: "40 plus marketplace rules evaluated per image" },
  { value: 10, prefix: "<", suffix: "s", label: "Analysis time", sub: "from ASIN to full score", ariaLabel: "under 10 seconds to a full analysis" },
  { value: 8.7, decimals: 1, suffix: "/10", label: "Avg. optimized score", sub: "after one-click regeneration", ariaLabel: "8.7 out of 10 average score after optimization" },
  { value: 1, suffix: "-click", label: "Fix and download", sub: "marketplace-ready hero image", ariaLabel: "one click to fix and download your image" },
];

const StatNumber = ({ stat }: { stat: Stat }) => {
  const count = useCountUp(stat.value, { duration: 1400 });
  const display = stat.decimals ? count.toFixed(stat.decimals) : String(Math.round(count));
  return (
    <span className="tabular-nums" aria-label={stat.ariaLabel}>
      {stat.prefix}
      {display}
      {stat.suffix}
    </span>
  );
};

const StatsBand = () => (
  <motion.div
    className="mt-10 grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25, duration: 0.5 }}
  >
    {STATS.map((stat, i) => (
      <div
        key={stat.label}
        className={`p-6 text-center ${
          i % 2 === 1 ? "border-l border-border/40" : "lg:border-l lg:border-border/40"
        } ${i >= 2 ? "border-t border-border/40 lg:border-t-0" : ""}`}
      >
        <p className="font-numeric text-3xl font-bold text-foreground">
          <StatNumber stat={stat} />
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{stat.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
      </div>
    ))}
  </motion.div>
);

export default StatsBand;