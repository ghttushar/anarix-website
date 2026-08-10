import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, TrendingUp, Zap } from "lucide-react";

/**
 * Hero visual: a live "account operations console".
 *
 * Reads as a real working surface rather than decoration — marketplace P&L rows
 * settle in, a margin band lifts from the "before" baseline, and open issues
 * resolve one by one into the health score. Static, settled state under
 * prefers-reduced-motion.
 */

interface Channel {
  name: string;
  revenue: number;
  tacos: number;
  margin: number;
}

const CHANNELS: Channel[] = [
  { name: "Amazon", revenue: 412_800, tacos: 11.4, margin: 24.1 },
  { name: "Walmart", revenue: 138_400, tacos: 13.9, margin: 19.6 },
  { name: "Shopify", revenue: 96_250, tacos: 8.2, margin: 31.4 },
];

const ISSUES = [
  { label: "Buy box lost · 4 ASINs", resolution: "Recovered", icon: ShieldCheck },
  { label: "Stockout risk · SKU-2291", resolution: "Reordered", icon: Zap },
  { label: "Bid waste · 3 campaigns", resolution: "Reallocated", icon: TrendingUp },
];

// Margin trajectory: the flat "before" baseline vs. the managed curve.
const BEFORE = [46, 45, 47, 44, 46, 45, 47, 46, 45, 46, 44, 46];
const AFTER = [46, 48, 51, 55, 54, 59, 63, 66, 70, 74, 79, 84];

const money = (n: number) =>
  `$${n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0)}`;

const toPath = (values: number[], w: number, h: number) => {
  const step = w / (values.length - 1);
  const pad = 6;
  const plot = h - pad * 2;
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(pad + plot - (v / 100) * plot).toFixed(1)}`)
    .join(" ");
};

const useTicker = (length: number, enabled: boolean, interval = 2600) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setIndex(length - 1);
      return;
    }
    const id = window.setInterval(() => setIndex((i) => (i + 1) % (length + 1)), interval);
    return () => window.clearInterval(id);
  }, [enabled, interval, length]);
  return index;
};

const HeroOpsConsole = () => {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const resolvedCount = useTicker(ISSUES.length, !reduced);

  const w = 320;
  const h = 96;
  const beforePath = useMemo(() => toPath(BEFORE, w, h), []);
  const afterPath = useMemo(() => toPath(AFTER, w, h), []);
  const afterArea = useMemo(() => `${afterPath} L${w},${h} L0,${h} Z`, [afterPath]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 8,
      y: ((e.clientY - r.top) / r.height - 0.5) * -6,
    });
  };

  const health = 72 + resolvedCount * 8;

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative w-full"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient brand glow behind the panel */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 20%, hsl(var(--primary) / 0.22), transparent 70%), radial-gradient(50% 50% at 20% 90%, hsl(var(--accent) / 0.18), transparent 70%)",
        }}
      />

      <motion.div
        className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-strong overflow-hidden"
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        style={{
          rotateY: tilt.x,
          rotateX: tilt.y,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top edge gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)" }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-pill bg-primary" />
              {!reduced && (
                <motion.span
                  className="absolute inset-0 rounded-pill bg-primary"
                  animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Account operations
            </span>
          </div>
          <span className="text-xs text-muted-foreground/70 font-numeric">Live · 24/7</span>
        </div>

        {/* Channel ledger */}
        <div className="px-5 pt-4">
          <div className="flex items-center text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60 pb-2">
            <span className="flex-1">Channel</span>
            <span className="w-16 text-right">Rev</span>
            <span className="w-16 text-right">TACoS</span>
            <span className="w-16 text-right">Margin</span>
          </div>
          <div className="space-y-1.5">
            {CHANNELS.map((c, i) => (
              <motion.div
                key={c.name}
                className="flex items-center py-1.5 px-2 -mx-2 rounded-lg hover:bg-primary/5 transition-colors"
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="flex-1 text-sm font-medium text-foreground">{c.name}</span>
                <span className="w-16 text-sm text-foreground font-numeric text-right">{money(c.revenue)}</span>
                <span className="w-16 text-sm text-muted-foreground font-numeric text-right">{c.tacos.toFixed(1)}%</span>
                <span className="w-16 text-sm text-primary font-numeric text-right">{c.margin.toFixed(1)}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Margin trajectory */}
        <div className="px-5 pt-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-muted-foreground">Contribution margin</span>
            <span className="text-xs text-muted-foreground/60 font-numeric">Last 12 weeks</span>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ width: "100%", height: 96, display: "block" }} preserveAspectRatio="none" role="img" aria-label="Contribution margin trending up under Anarix management">
            <defs>
              <linearGradient id="hero-margin-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="hsl(var(--border))" strokeOpacity="0.5" strokeWidth="0.5" />
            ))}

            <path d={beforePath} fill="none" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />

            <motion.path
              d={afterArea}
              fill="url(#hero-margin-fill)"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.9 }}
            />
            <motion.path
              d={afterPath}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>

        {/* Issue queue + health */}
        <div className="mt-4 px-5 py-4 border-t border-border/50 bg-primary/[0.03]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">Handled overnight</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/70">Health</span>
              <span className="text-sm font-semibold text-primary font-numeric">{health}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {ISSUES.map((issue, i) => {
              const done = i < resolvedCount;
              return (
                <div
                  key={issue.label}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-border/50 bg-card/70"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <issue.icon className={`w-3.5 h-3.5 shrink-0 ${done ? "text-primary" : "text-muted-foreground/60"}`} />
                    <span className="text-xs text-foreground truncate">{issue.label}</span>
                  </div>
                  <motion.span
                    className={`text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-pill shrink-0 ${
                      done ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground/70"
                    }`}
                    animate={{ opacity: 1 }}
                    initial={false}
                  >
                    {done ? issue.resolution : "In queue"}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroOpsConsole;
