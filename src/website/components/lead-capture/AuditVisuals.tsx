import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";

/** Animated grading panel: the hero image sharpens under a scanning pass. */
const ImageGrade = () => (
  <div className="w-full">
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card" style={{ height: 132 }}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(150deg, hsl(var(--primary) / 0.28), hsl(var(--primary) / 0.06))" }}
      />
      <motion.div
        className="absolute inset-x-0"
        style={{ height: 34, background: "linear-gradient(hsl(var(--primary) / 0.35), transparent)" }}
        animate={{ y: [-34, 132] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <p className="mt-3 text-xs text-muted-foreground">We grade the hero image first. It moves the click.</p>
  </div>
);

/** Score bars filling to their target values. */
const ScoreBars = () => {
  const rows = [
    { label: "Image", to: 92 },
    { label: "Title", to: 74 },
    { label: "Bullets", to: 61 },
  ];
  return (
    <div className="w-full">
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{r.label}</span>
              <span className="font-numeric">{r.to}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-muted">
              <motion.div
                className="h-full rounded-pill bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${r.to}%` }}
                transition={{ duration: 1, delay: 0.15 * i, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Scored against the rules the marketplace actually enforces.</p>
    </div>
  );
};

/** Issue checklist ticking through pass and fail marks. */
const IssueChecklist = () => {
  const rows = [
    { label: "White background", ok: true },
    { label: "Product fills 85 percent", ok: false },
    { label: "No text overlay", ok: false },
    { label: "1600px or larger", ok: true },
  ];
  return (
    <div className="w-full">
      <div className="space-y-2.5 rounded-2xl border border-border bg-card p-4">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            className="flex items-center gap-2.5 text-[12px]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 * i, duration: 0.35 }}
          >
            <span
              className={`flex w-5 h-5 shrink-0 items-center justify-center rounded-pill border ${
                r.ok ? "border-primary bg-primary/15 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              {r.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </span>
            <span className="text-foreground">{r.label}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Every flag is specific, so it is fixable today.</p>
    </div>
  );
};

/** Marketplace rule cards cycling forward. */
const MarketplaceRules = () => (
  <div className="w-full">
    <div className="relative" style={{ height: 132 }}>
      {["Amazon", "Walmart", "Shopify"].map((m, i) => (
        <motion.div
          key={m}
          className="absolute inset-x-0 rounded-2xl border border-border bg-card p-4 shadow-soft"
          style={{ top: i * 18, zIndex: 3 - i }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-sm font-semibold text-foreground">{m}</p>
          <p className="text-[11px] text-muted-foreground">Image and copy rules applied</p>
        </motion.div>
      ))}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">One listing, three rule books. We hold all of them.</p>
  </div>
);

/** Competitor comparison bars. */
const CompetitorCompare = () => (
  <div className="w-full">
    <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-4" style={{ height: 132 }}>
      {[38, 52, 46, 88, 41].map((h, i) => (
        <motion.div
          key={i}
          className={`flex-1 rounded-t-md ${i === 3 ? "bg-primary" : "bg-muted"}`}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">You see where you sit against the page you compete on.</p>
  </div>
);

const panels = [ImageGrade, ScoreBars, IssueChecklist, MarketplaceRules, CompetitorCompare];

/** Auto-advancing showcase of the listing audit visuals, one at a time. */
const AuditVisuals = () => {
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % panels.length), 3600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const Panel = panels[i];

  return (
    <div className="flex h-full flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <Panel />
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center gap-1.5">
        {panels.map((_, idx) => (
          <span
            key={idx}
            className={`h-1 rounded-pill transition-all duration-300 ${idx === i ? "w-5 bg-primary" : "w-1 bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuditVisuals;
