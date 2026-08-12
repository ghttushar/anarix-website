import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { caseMedia } from "./media";
import type { CaseStudyData } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

const format = (m: {
  prepend?: string;
  prefix?: string;
  value: number;
  decimals?: number;
  suffix?: string;
}): string =>
  `${m.prepend ?? ""}${m.prefix ?? ""}${m.value.toFixed(m.decimals ?? 0)}${m.suffix ?? ""}`;

/**
 * Animated, photographic stand-in for the brand's catalog: a mock marketplace
 * listing card with the account's real numbers floating around it.
 */
export function CaseStudyVisual({
  data,
  compact = false,
}: {
  data: CaseStudyData;
  compact?: boolean;
}) {
  const media = caseMedia(data.id);
  const reduce = useReducedMotion();
  const kpis = data.kpis.slice(0, 2);

  return (
    <div className="relative">
      {/* Soft field behind the card */}
      <div
        aria-hidden
        className="absolute opacity-70"
        style={{
          inset: "-1.5rem",
          zIndex: -1,
          borderRadius: "2.5rem",
          background:
            "radial-gradient(ellipse 70% 70% at 50% 40%, hsl(var(--primary) / 0.14), transparent 70%)",
        }}
      />

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-medium"
        initial={{ opacity: 0, y: 24, rotate: -0.6 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {data.marketplace}
          </p>
          <span className="font-numeric text-[11px] text-muted-foreground">{data.period}</span>
        </div>

        <div className="relative overflow-hidden bg-muted/40">
          <motion.img
            src={media.image}
            alt={media.alt}
            loading="lazy"
            width={1024}
            height={768}
            className="w-full object-cover"
            style={{ height: compact ? 208 : 300 }}
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          />

          {/* Sweep of light across the photo, once, as it settles */}
          {reduce ? null : (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 bg-gradient-to-r from-transparent via-background/40 to-transparent"
              style={{ width: "33%" }}
              initial={{ x: "-120%" }}
              whileInView={{ x: "320%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.35 }}
            />
          )}

          <div className="absolute left-4 top-4 rounded-pill bg-background/85 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
            {media.category}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="rounded-2xl bg-primary/5 px-4 py-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.12, ease: EASE }}
            >
              <p className="font-numeric text-xl font-bold leading-none text-foreground">
                {format(kpi)}
              </p>
              <p className="mt-1.5 text-[10px] uppercase leading-tight tracking-[0.1em] text-muted-foreground">
                {kpi.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Work-done chips, drifting gently */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {media.chips.map((chip, i) => {
          const spots = [
            { top: "8%", right: "4%" },
            { top: "46%", left: "-6%" },
            { bottom: "22%", right: "6%" },
          ][i];
          return (
            <motion.div
              key={chip}
              className="absolute flex items-center gap-2 rounded-pill border border-border bg-card/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-soft backdrop-blur"
              style={spots}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: EASE }}
            >
              <motion.span
                className="flex items-center"
                animate={reduce ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <Check className="h-3.5 w-3.5 text-primary" />
              </motion.span>
              {chip}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default CaseStudyVisual;
