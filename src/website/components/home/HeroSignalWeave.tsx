import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Marketplace inputs that feed the converging signal lanes. */
const LANES = [
  { label: "Amazon", y: 40, d: "M12 40 C 120 40, 140 130, 210 130", delay: 0 },
  { label: "Walmart", y: 130, d: "M12 130 C 110 130, 130 130, 210 130", delay: 0.5 },
  { label: "Shopify", y: 220, d: "M12 220 C 120 220, 140 130, 210 130", delay: 1 },
];

/** Work Anarix picks up while the founder sleeps — cycles one line at a time. */
const SHIFT_LOG = [
  "Rebalancing bids on 42 campaigns",
  "Flagging 3 listings before they go dark",
  "Reordering ahead of a stockout",
  "Clearing a policy warning",
  "Writing tomorrow's plain-English readout",
];

const OUTPUT = "M258 190 C 286 186, 300 150, 320 120 C 338 94, 356 74, 382 58";

/**
 * Hero graphic: noisy multi-marketplace signals converge through the Anarix
 * peaks mark and leave as one calm, rising profit line. Purely decorative —
 * the surrounding copy carries the message.
 */
export function HeroSignalWeave() {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setLogIndex((i) => (i + 1) % SHIFT_LOG.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      className="bg-card/60 backdrop-blur-md border border-border shadow-medium rounded-3xl p-6 sm:p-7"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">One operating layer</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          night shift: on
        </span>
      </div>

      <svg viewBox="0 0 400 260" role="presentation" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="hsw-out" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <radialGradient id="hsw-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Input lanes */}
        {LANES.map((lane) => (
          <g key={lane.label}>
            <path d={lane.d} fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <motion.path
              d={lane.d}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="14 190"
              initial={{ strokeDashoffset: 204, opacity: 0 }}
              animate={{ strokeDashoffset: [204, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.6, delay: lane.delay, repeat: Infinity, ease: "linear" }}
            />
            <circle cx="12" cy={lane.y} r="4" fill="hsl(var(--primary))" opacity="0.5" />
            <text
              x="22"
              y={lane.y + 4}
              className="fill-muted-foreground"
              style={{ fontSize: 11 }}
            >
              {lane.label}
            </text>
          </g>
        ))}

        {/* Convergence core — the Anarix peaks mark */}
        <motion.circle
          cx="232"
          cy="130"
          r="46"
          fill="url(#hsw-core)"
          animate={{ scale: [0.9, 1.06, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "232px 130px" }}
        />
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M210 146 L226 116 L238 136 L252 108 L266 146 Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Single calm output */}
        <path d={OUTPUT} fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <motion.path
          d={OUTPUT}
          fill="none"
          stroke="url(#hsw-out)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, delay: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx={258}
          cy={190}
          r="4.5"
          fill="hsl(var(--primary))"
          initial={{ cx: 258, cy: 190 }}
          animate={{ cx: [258, 320, 382], cy: [190, 120, 58] }}
          transition={{ duration: 2.4, delay: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <text x="300" y="228" className="fill-muted-foreground" style={{ fontSize: 11 }}>
          profit
        </text>
      </svg>

      <div className="mt-4 pt-4 border-t border-border/40 h-9 overflow-hidden">
        <motion.p
          key={logIndex}
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {SHIFT_LOG[logIndex]}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default HeroSignalWeave;
