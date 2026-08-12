import { motion } from "framer-motion";

/**
 * Small token-driven info graphics for the "Full Stack" service cards.
 * Each accepts `active` so the tile that is open animates and the rest stay calm.
 */

const STROKE = "hsl(var(--primary))";
const SOFT = "hsl(var(--primary) / 0.25)";
const LINE = "hsl(var(--border))";
const EASE = [0.22, 1, 0.36, 1] as const;

const frame = "h-16 w-full";

/** Rising spend bars with a bid line on top. */
export const SpendSparkline = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    {[8, 20, 32, 44, 56, 68, 80, 92, 104].map((x, i) => {
      const h = [10, 16, 12, 22, 18, 28, 24, 34, 30][i];
      return (
        <motion.rect
          key={x}
          x={x}
          width="7"
          rx="2"
          fill={i % 2 === 0 ? SOFT : "hsl(var(--primary) / 0.45)"}
          initial={{ height: 0, y: 40 }}
          animate={{ height: active ? h : h * 0.7, y: 40 - (active ? h : h * 0.7) }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
        />
      );
    })}
    <motion.path
      d="M8 30 L32 24 L56 18 L80 12 L108 6"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 1 : 0.55 }}
      transition={{ duration: 0.8, ease: EASE }}
    />
  </svg>
);

/** Margin waterfall: revenue down to what you keep. */
export const MarginWaterfall = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    {[
      { x: 6, y: 6, h: 32, fill: "hsl(var(--primary) / 0.5)" },
      { x: 30, y: 12, h: 12, fill: SOFT },
      { x: 54, y: 20, h: 10, fill: SOFT },
      { x: 78, y: 26, h: 8, fill: SOFT },
      { x: 102, y: 20, h: 18, fill: STROKE },
    ].map((b, i) => (
      <motion.rect
        key={b.x}
        x={b.x}
        width="12"
        rx="2"
        fill={b.fill}
        initial={{ opacity: 0, y: b.y + 6, height: b.h }}
        animate={{ opacity: 1, y: b.y, height: active ? b.h : b.h * 0.85 }}
        transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
      />
    ))}
    <line x1="4" y1="40" x2="116" y2="40" stroke={LINE} strokeWidth="1" />
  </svg>
);

/** Listing skeleton with a corrected field. */
export const ListingSkeleton = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    <rect x="4" y="6" width="30" height="30" rx="4" fill={SOFT} />
    {[0, 1, 2].map((i) => (
      <motion.rect
        key={i}
        x="42"
        y={8 + i * 10}
        height="5"
        rx="2.5"
        fill={i === 1 ? STROKE : LINE}
        initial={{ width: 0 }}
        animate={{ width: active ? [60, 48, 34][i] : [40, 30, 22][i] }}
        transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
      />
    ))}
    <motion.path
      d="M104 30 l4 4 l8 -9"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
    />
  </svg>
);

/** Weeks-of-cover gauge. */
export const CoverGauge = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    <path d="M22 38 A38 38 0 0 1 98 38" fill="none" stroke={LINE} strokeWidth="6" strokeLinecap="round" />
    <motion.path
      d="M22 38 A38 38 0 0 1 98 38"
      fill="none"
      stroke={STROKE}
      strokeWidth="6"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 0.72 : 0.45 }}
      transition={{ duration: 0.8, ease: EASE }}
    />
    <motion.circle
      cx="60"
      cy="38"
      r="3"
      fill={STROKE}
      animate={{ scale: active ? [1, 1.35, 1] : 1 }}
      transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: "easeInOut" }}
    />
  </svg>
);

/** Account health meter with a caught risk. */
export const HealthMeter = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    <rect x="6" y="18" width="108" height="8" rx="4" fill={LINE} />
    <motion.rect
      x="6"
      y="18"
      height="8"
      rx="4"
      fill={STROKE}
      initial={{ width: 0 }}
      animate={{ width: active ? 88 : 60 }}
      transition={{ duration: 0.7, ease: EASE }}
    />
    <motion.circle
      cx="96"
      cy="22"
      r="6"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.5"
      animate={{ r: active ? [6, 11, 6] : 6, opacity: active ? [0.9, 0, 0.9] : 0.5 }}
      transition={{ duration: 2, repeat: active ? Infinity : 0, ease: "easeOut" }}
    />
    {[20, 44, 68].map((x) => (
      <rect key={x} x={x} y="34" width="16" height="4" rx="2" fill={SOFT} />
    ))}
  </svg>
);

/** Share-of-voice ring. */
export const ShareRing = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    <circle cx="26" cy="22" r="15" fill="none" stroke={LINE} strokeWidth="5" />
    <motion.circle
      cx="26"
      cy="22"
      r="15"
      fill="none"
      stroke={STROKE}
      strokeWidth="5"
      strokeLinecap="round"
      transform="rotate(-90 26 22)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 0.64 : 0.4 }}
      transition={{ duration: 0.8, ease: EASE }}
    />
    {[0, 1, 2].map((i) => (
      <motion.rect
        key={i}
        x="52"
        y={10 + i * 10}
        height="5"
        rx="2.5"
        fill={i === 0 ? "hsl(var(--primary) / 0.5)" : SOFT}
        initial={{ width: 0 }}
        animate={{ width: active ? [58, 40, 26][i] : [36, 26, 16][i] }}
        transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
      />
    ))}
  </svg>
);

/** Monthly report lines. */
export const ReportLines = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    <rect x="6" y="4" width="108" height="36" rx="5" fill="none" stroke={LINE} strokeWidth="1" />
    <motion.rect
      x="14"
      y="11"
      height="5"
      rx="2.5"
      fill={STROKE}
      initial={{ width: 0 }}
      animate={{ width: active ? 44 : 30 }}
      transition={{ duration: 0.5, ease: EASE }}
    />
    {[20, 27].map((y, i) => (
      <motion.rect
        key={y}
        x="14"
        y={y}
        height="4"
        rx="2"
        fill={SOFT}
        initial={{ width: 0 }}
        animate={{ width: active ? [92, 70][i] : [60, 44][i] }}
        transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
      />
    ))}
  </svg>
);

/** Full-funnel demand shape. */
export const DemandFunnel = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    {[
      { y: 6, w: 100 },
      { y: 17, w: 74 },
      { y: 28, w: 46 },
    ].map((b, i) => (
      <motion.rect
        key={b.y}
        y={b.y}
        height="8"
        rx="4"
        fill={i === 2 ? STROKE : SOFT}
        initial={{ width: 0, x: 60 }}
        animate={{ width: active ? b.w : b.w * 0.7, x: 60 - (active ? b.w : b.w * 0.7) / 2 }}
        transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
      />
    ))}
  </svg>
);

/** Brand shield with protection pulse. */
export const BrandShield = (active: boolean) => (
  <svg viewBox="0 0 120 44" className={frame} role="presentation">
    <motion.path
      d="M60 5 L76 11 V24 C76 32 68 37 60 40 C52 37 44 32 44 24 V11 Z"
      fill="hsl(var(--primary) / 0.12)"
      stroke={STROKE}
      strokeWidth="1.5"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    />
    <motion.path
      d="M54 22 l5 5 l10 -11"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 1 : 0.4 }}
      transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
    />
    {[26, 94].map((x) => (
      <motion.circle
        key={x}
        cx={x}
        cy="22"
        r="4"
        fill={SOFT}
        animate={{ opacity: active ? [0.4, 1, 0.4] : 0.4 }}
        transition={{ duration: 2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      />
    ))}
  </svg>
);
