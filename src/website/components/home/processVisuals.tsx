import { motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Check, FileText, Search } from "lucide-react";

/** Small animated panels used as the right-hand visual for each home step. */

const EASE = [0.22, 1, 0.36, 1] as const;

const itemIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};


const Panel = ({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) => (
  <motion.div
    variants={itemIn}
    className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-strong"
  >
    <motion.div
      variants={itemIn}
      className="flex items-center justify-between gap-2 border-b border-border bg-surface-elevated px-4 py-2.5"
    >
      <p className="truncate text-[13px] font-semibold text-foreground">{title}</p>
      {right}
    </motion.div>
    <div className="flex min-h-0 flex-1 flex-col">{children}</div>
  </motion.div>
);

const Money = ({ value, tone = "text-foreground" }: { value: string; tone?: string }) => (
  <span className={`font-numeric text-sm font-bold tabular-nums ${tone}`}>{value}</span>
);

/* ── 1. Diagnose ─────────────────────────────────────────────── */

const LEAKS = [
  { label: "Ad spend, no return", value: "-$18,420" },
  { label: "Buy box lost, 6 SKUs", value: "-$7,110" },
  { label: "Stranded inventory", value: "-$4,260" },
  { label: "Listing suppressions", value: "-$2,980" },
];

export const DiagnoseVisual = () => (
  <Panel
    title="Account scan"
    right={
      <motion.span
        variants={itemIn}
        className="inline-flex items-center gap-1 rounded-pill bg-destructive/12 px-2 py-0.5 text-[10px] font-semibold text-destructive"
      >
        <AlertTriangle className="w-3 h-3" /> 4 leaks
      </motion.span>
    }
  >
    <motion.div variants={itemIn} className="relative overflow-hidden border-b border-border px-4 py-3">
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Search className="w-3 h-3 text-primary" /> Scanning 18 months of data
      </p>
      <motion.span
        aria-hidden="true"
        className="mt-2 block h-1 overflow-hidden rounded-pill bg-accent/60"
      >
        <motion.span
          className="block h-full rounded-pill bg-primary"
          variants={{ hidden: { width: "0%" }, show: { width: "100%" } }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </motion.span>
    </motion.div>
    <ul className="flex min-h-0 flex-1 flex-col justify-center">
      {LEAKS.map((leak, i) => (
        <motion.li
          key={leak.label}
          className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 last:border-0"
          variants={{
            hidden: { opacity: 0, x: -14 },
            show: { opacity: 1, x: 0, transition: { delay: 0.35 + i * 0.14, duration: 0.5 } },
          }}
        >
          <span className="truncate text-[12px] text-muted-foreground">{leak.label}</span>
          <Money value={leak.value} tone="text-destructive" />
        </motion.li>
      ))}
    </ul>
    <motion.div variants={itemIn} className="border-t border-border bg-surface-elevated px-4 py-2.5">
      <p className="text-[11px] text-muted-foreground">Recoverable in 90 days</p>
      <p className="font-numeric text-lg font-bold tabular-nums text-foreground">$32,770</p>
    </motion.div>
  </Panel>
);

/* ── 2. Take Over ────────────────────────────────────────────── */

const TASKS = [
  "Rebalance ad budget across 42 campaigns",
  "Fix 6 suppressed listings",
  "Reorder cover for Q4 demand",
  "Clear 3 compliance flags",
];

export const TakeOverVisual = () => (
  <Panel
    title="Today's queue"
    right={<motion.span variants={itemIn} className="font-numeric text-[10px] font-semibold tabular-nums text-primary">Anarix team</motion.span>}
  >
    <ul className="flex min-h-0 flex-1 flex-col justify-center gap-1 p-3">
      {TASKS.map((task, i) => (
        <motion.li
          key={task}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-elevated px-3 py-2"
          variants={{
            hidden: { opacity: 0, x: 18 },
            show: { opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.16, duration: 0.5 } },
          }}
        >
          <motion.span
            className="flex flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
            style={{ width: 18, height: 18 }}
            variants={{
              hidden: { scale: 0.5, opacity: 0 },
              show: { scale: 1, opacity: 1, transition: { delay: 0.6 + i * 0.18, duration: 0.35 } },
            }}
          >
            <Check className="w-3 h-3" />
          </motion.span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">{task}</span>
        </motion.li>
      ))}
    </ul>
    <motion.div variants={itemIn} className="border-t border-border px-4 py-2.5">
      <p className="text-[11px] text-muted-foreground">Hours back on your calendar, weekly</p>
      <p className="font-numeric text-lg font-bold tabular-nums text-foreground">14.5</p>
    </motion.div>
  </Panel>
);

/* ── 3. Report ───────────────────────────────────────────────── */

const LINES = [
  { label: "Revenue", value: "$412,900", tone: "text-foreground" },
  { label: "Ad spend", value: "$52,840", tone: "text-foreground" },
  { label: "TACoS", value: "12.8%", tone: "text-primary" },
  { label: "Contribution margin", value: "$118,300", tone: "text-primary" },
];

export const ReportVisual = () => (
  <Panel
    title="Monthly P&L"
    right={
      <motion.span variants={itemIn} className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
        <FileText className="w-3 h-3" /> March
      </motion.span>
    }
  >
    <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-px bg-border">
      {LINES.map((line, i) => (
        <motion.div
          key={line.label}
          className="bg-card px-4 py-4"
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.12, duration: 0.5 } },
          }}
        >
          <p className="text-[11px] text-muted-foreground">{line.label}</p>
          <p className={`font-numeric mt-1 text-lg font-bold tabular-nums ${line.tone}`}>{line.value}</p>
        </motion.div>
      ))}
    </div>
    <motion.div variants={itemIn} className="border-t border-border bg-surface-elevated px-4 py-2.5">
      <p className="text-[11px] text-muted-foreground">
        Every line traced back to the change that caused it.
      </p>
    </motion.div>
  </Panel>
);

/* ── 4. Grow & Scale ─────────────────────────────────────────── */

const BARS = [38, 46, 52, 61, 74, 88, 100];

export const GrowVisual = () => (
  <Panel
    title="Growth curve"
    right={
      <motion.span
        variants={itemIn}
        className="inline-flex items-center gap-1 rounded-pill bg-primary/12 px-2 py-0.5 text-[10px] font-semibold text-primary"
      >
        <ArrowUpRight className="w-3 h-3" /> +131%
      </motion.span>
    }
  >
    <div className="flex min-h-0 flex-1 items-end gap-2 px-4 pb-4 pt-6">
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className="min-w-0 flex-1 rounded-t-lg"
          style={{
            background:
              i >= BARS.length - 2
                ? "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--periwinkle)))"
                : "hsl(var(--accent))",
          }}
          variants={{
            hidden: { height: 0, opacity: 0 },
            show: {
              height: `${h}%`,
              opacity: 1,
              transition: { delay: 0.15 + i * 0.09, duration: 0.7, ease: EASE },
            },
          }}
        />
      ))}
    </div>
    <div className="grid grid-cols-3 border-t border-border">
      {[
        { label: "New channels", value: "3" },
        { label: "GMV added", value: "$4.1M" },
        { label: "TACoS", value: "-46%" },
      ].map((cell, i) => (
        <motion.div
          key={cell.label}
          className="border-r border-border px-3 py-2.5 last:border-0"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { delay: 0.7 + i * 0.12, duration: 0.45 } },
          }}
        >
          <p className="text-[10px] text-muted-foreground">{cell.label}</p>
          <p className="font-numeric text-base font-bold tabular-nums text-foreground">{cell.value}</p>
        </motion.div>
      ))}
    </div>
  </Panel>
);
