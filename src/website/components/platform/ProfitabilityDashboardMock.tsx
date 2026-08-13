import { motion } from "framer-motion";
import { Calendar, Play, TrendingDown, TrendingUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Kpi {
  label: string;
  value: string;
  sub: string;
  delta: string;
  positive: boolean;
  active?: boolean;
}

const kpis: Kpi[] = [
  { label: "Aug 14", value: "$1,246", sub: "Margin 27.5%", delta: "−20.6%", positive: false, active: true },
  { label: "Aug 15", value: "$1,568", sub: "Margin 30.0%", delta: "+25.9%", positive: true },
  { label: "August", value: "$23,457", sub: "Margin 26.3%", delta: "−18.0%", positive: false },
  { label: "Forecast", value: "$39,173", sub: "Est. net profit", delta: "78% conf.", positive: true },
];

const chipFilters = ["Overview", "Sales Mix", "Efficiency"];

/** A compact, animated recreation of the Insight Engine profitability dashboard. */
const ProfitabilityDashboardMock = () => {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <span>Profitability</span>
          <span className="text-border">/</span>
          <span className="font-semibold text-foreground">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3" /> May 19 – May 23
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
            <Play className="w-2.5 h-2.5 fill-current" /> Run
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 border-b border-border/70 overflow-x-auto">
        {chipFilters.map((chip, i) => (
          <span
            key={chip}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
              i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/70">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            className={`bg-card p-3.5 sm:p-4 ${k.active ? "ring-1 ring-inset ring-primary/50" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: EASE }}
          >
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {k.label}
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="font-numeric text-lg sm:text-xl font-bold text-foreground tabular-nums">
                {k.value}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">{k.sub}</span>
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-medium ${
                  k.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {k.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="px-4 sm:px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] sm:text-xs font-semibold text-foreground">Performance trend</p>
          <span className="text-[10px] text-muted-foreground">Daily · GMV vs Net profit</span>
        </div>
        <svg viewBox="0 0 400 110" className="w-full h-24 sm:h-28" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pdmFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,90 L40,78 L80,60 L120,38 L160,26 L200,22 L240,30 L280,48 L320,66 L360,80 L400,86 L400,110 L0,110 Z"
            fill="url(#pdmFill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <motion.path
            d="M0,90 L40,78 L80,60 L120,38 L160,26 L200,22 L240,30 L280,48 L320,66 L360,80 L400,86"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <motion.path
            d="M0,98 L40,96 L80,92 L120,84 L160,80 L200,78 L240,82 L280,88 L320,94 L360,98 L400,100"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          />
        </svg>
        <div className="flex items-center gap-4 mt-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" /> GMV
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> Net profit
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityDashboardMock;
