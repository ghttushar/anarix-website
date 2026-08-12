import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Channels the pod runs, placed around the ring. */
const channels = [
  { name: "Amazon", angle: -90 },
  { name: "Walmart", angle: 30 },
  { name: "Shopify", angle: 150 },
];

/** The work that arrives, and what the pod turns it into. */
const workItems = [
  { task: "Bid overspending", outcome: "Rebalanced", channel: "Amazon" },
  { task: "Stockout in 6 days", outcome: "Restock raised", channel: "Walmart" },
  { task: "Listing lost its A+", outcome: "Rebuilt", channel: "Amazon" },
  { task: "Buy Box slipped", outcome: "Recovered", channel: "Walmart" },
  { task: "Return rate up", outcome: "Root cause found", channel: "Shopify" },
];

const operators = ["Ads", "Catalog", "Supply"];

const RADIUS = 112;

const polar = (angle: number, radius: number) => ({
  x: Math.cos((angle * Math.PI) / 180) * radius,
  y: Math.sin((angle * Math.PI) / 180) * radius,
});

const HeroManagedOps = () => {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setStep((s) => s + 1), 3200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const current = workItems[step % workItems.length];
  const previous = workItems[(step + workItems.length - 1) % workItems.length];

  return (
    <div className="relative mx-auto w-full max-w-[420px] aspect-square select-none">
      {/* Soft field behind the pod, no section background change */}
      <div className="absolute inset-6 rounded-full bg-primary/5 blur-2xl" />

      {/* Orbit ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="rounded-full border border-dashed border-primary/20"
          style={{ width: RADIUS * 2, height: RADIUS * 2 }}
        />
      </motion.div>

      {/* Connection arcs from pod to each channel */}
      <svg className="absolute inset-0 h-full w-full" viewBox="-160 -160 320 320" aria-hidden>
        {channels.map((c, i) => {
          const p = polar(c.angle, RADIUS);
          return (
            <g key={c.name}>
              <line
                x1={0}
                y1={0}
                x2={p.x}
                y2={p.y}
                stroke="currentColor"
                className="text-primary/20"
                strokeWidth={1}
              />
              {!reduceMotion && (
                <motion.circle
                  cx={0}
                  cy={0}
                  r={3}
                  fill="currentColor"
                  className="text-primary"
                  initial={{ opacity: 0, x: p.x, y: p.y }}
                  animate={{
                    x: [p.x, 0, p.x],
                    y: [p.y, 0, p.y],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    delay: i * 1.1,
                    ease: "easeInOut",
                  }}
                />
              )}


            </g>
          );
        })}
      </svg>

      {/* Channel nodes */}
      {channels.map((c, i) => {
        const p = polar(c.angle, RADIUS);
        const isActive = current.channel === c.name;
        return (
          <div
            key={c.name}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))` }}
          >
            <motion.div
              className={`rounded-2xl border bg-card px-3.5 py-2 text-xs font-semibold shadow-soft transition-colors ${
                isActive ? "border-primary/50 text-primary" : "border-border text-muted-foreground"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: reduceMotion || !isActive ? 1 : [1, 1.06, 1],
              }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: EASE }}
            >
              {c.name}
            </motion.div>
          </div>
        );
      })}

      {/* The pod */}
      <div className="absolute left-1/2 top-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="rounded-3xl border border-primary/25 bg-card/95 p-4 shadow-strong backdrop-blur-sm"
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your Anarix pod
          </p>

          <div className="mt-3 flex items-center gap-2">
            {operators.map((role, i) => (
              <motion.div
                key={role}
                className="flex-1 rounded-xl border border-border bg-background px-2 py-2 text-center"
                animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                <span className="mx-auto mb-1.5 block h-5 w-5 rounded-full bg-primary/15" />
                <span className="text-[10px] font-medium text-muted-foreground">{role}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-primary/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Handling now
            </p>
            <motion.p
              key={current.task}
              className="mt-1 text-xs font-semibold leading-snug text-foreground"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {current.task}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Incoming task chip, drifts toward the pod */}
      <div className="absolute left-1/2 top-[6%] -translate-x-1/2">
        <motion.div
          key={`in-${current.task}`}
          className="whitespace-nowrap rounded-pill border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-soft"
          initial={{ opacity: 0, y: -14, scale: 0.9 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-14, 6, 22, 40], scale: [0.9, 1, 1, 0.92] }}
          transition={{ duration: 3, ease: EASE, times: [0, 0.2, 0.7, 1] }}
        >
          {current.channel} · {current.task}
        </motion.div>
      </div>

      {/* Outcome pill, leaves the pod */}
      <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2">
        <motion.div
          key={`out-${previous.outcome}`}
          className="whitespace-nowrap rounded-pill border border-primary/35 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold text-primary shadow-soft"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-18, 0, 4, 16] }}
          transition={{ duration: 3, ease: EASE, times: [0, 0.25, 0.75, 1] }}
        >
          {previous.outcome}
        </motion.div>
      </div>


      {/* Standing proof chips, anchored for symmetry */}
      <motion.div
        className="absolute left-[2%] top-[22%] rounded-2xl border border-border bg-card px-3 py-2 shadow-soft"
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
      >
        <p className="font-numeric text-sm font-bold text-foreground">24/7</p>
        <p className="text-[10px] text-muted-foreground">Account cover</p>
      </motion.div>

      <motion.div
        className="absolute right-[2%] bottom-[22%] rounded-2xl border border-border bg-card px-3 py-2 text-right shadow-soft"
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
      >
        <p className="font-numeric text-sm font-bold text-foreground">1 team</p>
        <p className="text-[10px] text-muted-foreground">Every channel</p>
      </motion.div>
    </div>
  );
};

export default HeroManagedOps;
