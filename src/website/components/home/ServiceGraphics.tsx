import { motion } from "framer-motion";

/**
 * Token-driven info graphics for the "Full Stack" service cards. Each one is
 * rendered only while its card is expanded, so the motion loops freely and
 * mounts from zero on every open.
 */

const P = "hsl(var(--primary))";
const P70 = "hsl(var(--primary) / 0.7)";
const P40 = "hsl(var(--primary) / 0.4)";
const P20 = "hsl(var(--primary) / 0.18)";
const LINE = "hsl(var(--border))";
const MUTED = "hsl(var(--muted-foreground) / 0.55)";
const EASE = [0.22, 1, 0.36, 1] as const;

const frame = "h-24 w-full";
const label = { fontSize: 5.5, fill: MUTED, fontWeight: 500 } as const;
const value = { fontSize: 7, fill: P, fontWeight: 700 } as const;

const loop = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: "reverse" as const,
  ease: "easeInOut" as const,
});

/** Daily spend bars with a pacing line and a sweeping "today" marker. */
export const SpendSparkline = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <text x="2" y="7" style={label}>
      Budget pacing
    </text>
    <text x="138" y="7" style={value} textAnchor="end">
      on track
    </text>
    <line x1="2" y1="56" x2="138" y2="56" stroke={LINE} strokeWidth="0.75" />
    {Array.from({ length: 12 }).map((_, i) => {
      const h = [14, 20, 17, 26, 22, 30, 25, 34, 29, 37, 32, 40][i];
      return (
        <motion.rect
          key={i}
          x={4 + i * 11.2}
          width="7"
          rx="1.5"
          fill={i > 8 ? P70 : P20}
          initial={{ height: 0, y: 56 }}
          animate={{ height: h, y: 56 - h }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
        />
      );
    })}
    <motion.path
      d="M7 44 L29 38 L51 33 L73 28 L95 22 L117 16 L135 12"
      fill="none"
      stroke={P}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="3 2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.1, ease: EASE }}
    />
    <motion.line
      y1="12"
      y2="56"
      stroke={P40}
      strokeWidth="1"
      initial={{ x1: 8, x2: 8, opacity: 0 }}
      animate={{ x1: 134, x2: 134, opacity: 1 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

/** Revenue down to net: waterfall with connectors and a running net figure. */
export const MarginWaterfall = () => {
  const bars = [
    { l: "Rev", y: 14, h: 42, fill: P70 },
    { l: "Fees", y: 14, h: 12, fill: P20 },
    { l: "Ads", y: 26, h: 11, fill: P20 },
    { l: "Ret", y: 37, h: 8, fill: P20 },
    { l: "Net", y: 34, h: 22, fill: P },
  ];
  return (
    <svg viewBox="0 0 140 64" className={frame} role="presentation">
      <text x="2" y="7" style={label}>
        Revenue to net
      </text>
      <motion.text
        x="138"
        y="7"
        style={value}
        textAnchor="end"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1] }}
        transition={loop(1.6)}
      >
        24.6% net
      </motion.text>
      <line x1="2" y1="56" x2="138" y2="56" stroke={LINE} strokeWidth="0.75" />
      {bars.map((b, i) => (
        <g key={b.l}>
          <motion.rect
            x={8 + i * 26}
            width="16"
            rx="2"
            fill={b.fill}
            initial={{ height: 0, y: b.y + b.h }}
            animate={{ height: b.h, y: b.y }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.12, ease: EASE }}
          />
          {i < bars.length - 1 && (
            <motion.line
              x1={24 + i * 26}
              x2={34 + i * 26}
              y1={b.y}
              y2={b.y}
              stroke={LINE}
              strokeWidth="0.75"
              strokeDasharray="2 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
            />
          )}
          <text x={16 + i * 26} y="62" style={label} textAnchor="middle">
            {b.l}
          </text>
        </g>
      ))}
    </svg>
  );
};

/** Listing fields filling in, with an issue badge flipping to resolved. */
export const ListingSkeleton = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <rect x="2" y="10" width="34" height="34" rx="3" fill={P20} />
    <motion.path
      d="M10 34 l7 -8 l6 7 l5 -5 l6 6"
      fill="none"
      stroke={P70}
      strokeWidth="1.4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
    />
    <text x="2" y="7" style={label}>
      Listing completeness
    </text>
    {[
      { y: 12, w: 74 },
      { y: 20, w: 60 },
      { y: 28, w: 88 },
      { y: 36, w: 48 },
    ].map((r, i) => (
      <motion.rect
        key={r.y}
        x="42"
        y={r.y}
        height="5"
        rx="2.5"
        fill={i === 3 ? P70 : P20}
        initial={{ width: 0 }}
        animate={{ width: r.w }}
        transition={{ duration: 0.5, delay: 0.15 + i * 0.16, ease: EASE }}
      />
    ))}
    <motion.g
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.4 }}
    >
      <rect x="42" y="48" width="52" height="11" rx="5.5" fill={P20} />
      <motion.path
        d="M48 53.5 l2.5 2.5 l4.5 -5"
        fill="none"
        stroke={P}
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      />
      <text x="59" y="56" style={{ ...label, fill: P }}>
        3 issues fixed
      </text>
    </motion.g>
  </svg>
);

/** Weeks-of-cover gauge with a drifting needle and a restock band. */
export const CoverGauge = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <text x="2" y="7" style={label}>
      Weeks of cover
    </text>
    <path d="M34 54 A36 36 0 0 1 106 54" fill="none" stroke={P20} strokeWidth="7" strokeLinecap="round" />
    <path d="M34 54 A36 36 0 0 1 47 26" fill="none" stroke="hsl(var(--destructive) / 0.45)" strokeWidth="7" strokeLinecap="round" />
    <motion.path
      d="M34 54 A36 36 0 0 1 106 54"
      fill="none"
      stroke={P}
      strokeWidth="7"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 0.62 }}
      transition={{ duration: 1, ease: EASE }}
    />
    <motion.line
      x1="70"
      y1="54"
      x2="70"
      y2="26"
      stroke={P}
      strokeWidth="1.6"
      strokeLinecap="round"
      style={{ originX: "70px", originY: "54px" }}
      initial={{ rotate: -80 }}
      animate={{ rotate: [18, 34] }}
      transition={loop(3)}
    />
    <circle cx="70" cy="54" r="3" fill={P} />
    <text x="70" y="20" style={value} textAnchor="middle">
      6.4 wks
    </text>
  </svg>
);

/** Account health meter with a pulsing score and clearing policy flags. */
export const HealthMeter = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <text x="2" y="7" style={label}>
      Account health
    </text>
    <rect x="2" y="14" width="136" height="7" rx="3.5" fill={P20} />
    <motion.rect
      x="2"
      y="14"
      height="7"
      rx="3.5"
      fill={P}
      initial={{ width: 0 }}
      animate={{ width: 118 }}
      transition={{ duration: 1, ease: EASE }}
    />
    <motion.circle
      cy="17.5"
      r="4"
      fill={P}
      initial={{ cx: 4, opacity: 0 }}
      animate={{ cx: 120, opacity: 1 }}
      transition={{ duration: 1, ease: EASE }}
    />
    <motion.circle
      cx="120"
      cy="17.5"
      r="4"
      fill="none"
      stroke={P40}
      animate={{ r: [4, 9], opacity: [0.7, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 1 }}
    />
    <text x="2" y="34" style={{ ...label, fill: P }}>
      892 / 1000
    </text>
    {[0, 1, 2].map((i) => (
      <motion.g
        key={i}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 + i * 0.22, duration: 0.4 }}
      >
        <rect x={2 + i * 46} y="42" width="42" height="14" rx="4" fill={P20} />
        <motion.path
          d={`M${8 + i * 46} 49.5 l2.4 2.4 l4.6 -5`}
          fill="none"
          stroke={P}
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9 + i * 0.22, duration: 0.35 }}
        />
        <text x={19 + i * 46} y="51.5" style={label}>
          {["policy", "perf", "IP"][i]}
        </text>
      </motion.g>
    ))}
  </svg>
);

/** Share ring: our arc grows while the competitor arc gives way. */
export const ShareRing = () => {
  const C = 2 * Math.PI * 22;
  return (
    <svg viewBox="0 0 140 64" className={frame} role="presentation">
      <text x="2" y="7" style={label}>
        Share of voice
      </text>
      <g transform="translate(34 34)">
        <circle r="22" fill="none" stroke={P20} strokeWidth="7" />
        <motion.circle
          r="22"
          fill="none"
          stroke={P}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          transform="rotate(-90)"
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: [C * 0.55, C * 0.38] }}
          transition={loop(2.8)}
        />
        <motion.text
          textAnchor="middle"
          y="3"
          style={value}
          animate={{ opacity: [0.6, 1] }}
          transition={loop(2.8)}
        >
          58%
        </motion.text>
      </g>
      {[
        { l: "Us", w: 74, fill: P },
        { l: "Comp A", w: 40, fill: P40 },
        { l: "Comp B", w: 24, fill: P20 },
      ].map((r, i) => (
        <g key={r.l}>
          <text x="66" y={22 + i * 14} style={label}>
            {r.l}
          </text>
          <motion.rect
            x="94"
            y={17 + i * 14}
            height="5"
            rx="2.5"
            fill={r.fill}
            initial={{ width: 0 }}
            animate={{ width: i === 0 ? [r.w * 0.8, r.w] : [r.w, r.w * 0.7] }}
            transition={loop(2.8, i * 0.1)}
          />
        </g>
      ))}
    </svg>
  );
};

/** Monthly readout typing in, with a trend chip. */
export const ReportLines = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <text x="2" y="7" style={label}>
      Monthly readout
    </text>
    <rect x="2" y="10" width="90" height="50" rx="4" fill="hsl(var(--muted) / 0.5)" stroke={LINE} strokeWidth="0.75" />
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.rect
        key={i}
        x="8"
        y={17 + i * 9}
        height="4"
        rx="2"
        fill={i === 0 ? P70 : P20}
        initial={{ width: 0 }}
        animate={{ width: [66, 52, 74, 44, 60][i] }}
        transition={{ duration: 0.45, delay: 0.1 + i * 0.14, ease: EASE }}
      />
    ))}
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
      <rect x="98" y="20" width="40" height="26" rx="4" fill={P20} />
      <motion.path
        d="M103 40 l8 -8 l6 5 l10 -12"
        fill="none"
        stroke={P}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
      />
      <text x="118" y="54" style={{ ...label, fill: P }} textAnchor="middle">
        +18% MoM
      </text>
    </motion.g>
  </svg>
);

/** Off-platform demand funnel with particles flowing into conversions. */
export const DemandFunnel = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <text x="2" y="7" style={label}>
      Off-platform demand
    </text>
    {[
      { y: 12, w: 108, x: 16, l: "Reach" },
      { y: 26, w: 78, x: 31, l: "Visits" },
      { y: 40, w: 48, x: 46, l: "Carts" },
    ].map((s, i) => (
      <g key={s.l}>
        <motion.rect
          x={s.x}
          y={s.y}
          height="10"
          rx="5"
          fill={i === 2 ? P70 : P20}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: s.w, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.15, ease: EASE }}
        />
        <text x={s.x + s.w / 2} y={s.y + 7.5} style={{ ...label, fill: MUTED }} textAnchor="middle">
          {s.l}
        </text>
      </g>
    ))}
    {[0, 1, 2, 3].map((i) => (
      <motion.circle
        key={i}
        cx={52 + i * 12}
        r="1.8"
        fill={P}
        initial={{ cy: 10, opacity: 0 }}
        animate={{ cy: [10, 52], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, delay: 0.4 + i * 0.35, repeat: Infinity, ease: "easeIn" }}
      />
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <rect x="46" y="54" width="48" height="9" rx="4.5" fill={P} />
      <text x="70" y="60.5" style={{ ...label, fill: "hsl(var(--primary-foreground))" }} textAnchor="middle">
        new buyers
      </text>
    </motion.g>
  </svg>
);

/** Brand shield with a scanning sweep clearing hijacker markers. */
export const BrandShield = () => (
  <svg viewBox="0 0 140 64" className={frame} role="presentation">
    <text x="2" y="7" style={label}>
      Brand protection
    </text>
    <defs>
      <clipPath id="shield-clip">
        <path d="M34 12 l20 6 v14 c0 12 -9 19 -20 23 c-11 -4 -20 -11 -20 -23 V18 Z" />
      </clipPath>
    </defs>
    <path
      d="M34 12 l20 6 v14 c0 12 -9 19 -20 23 c-11 -4 -20 -11 -20 -23 V18 Z"
      fill={P20}
      stroke={P40}
      strokeWidth="1"
    />
    <g clipPath="url(#shield-clip)">
      <motion.rect
        y="10"
        width="44"
        height="10"
        x="12"
        fill={P40}
        animate={{ y: [10, 46] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
    <motion.path
      d="M27 33 l5 5 l10 -11"
      fill="none"
      stroke={P}
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    />
    {[0, 1, 2].map((i) => (
      <motion.g key={i} animate={{ opacity: [1, 0.15] }} transition={loop(1.6, 0.3 + i * 0.3)}>
        <rect x="66" y={14 + i * 15} width="72" height="12" rx="4" fill="hsl(var(--muted) / 0.6)" />
        <circle cx="73" cy={20 + i * 15} r="2.4" fill="hsl(var(--destructive) / 0.7)" />
        <text x="80" y={22.5 + i * 15} style={label}>
          {["hijacker removed", "IP claim filed", "listing recovered"][i]}
        </text>
      </motion.g>
    ))}
  </svg>
);
