import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";

import audio from "@/assets/marketing/audio.jpg";
import coffee from "@/assets/marketing/coffee.jpg";
import fragrance from "@/assets/marketing/fragrance.jpg";
import kitchen from "@/assets/marketing/kitchen.jpg";

const PANEL_HEIGHT = 210;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Photo plate every panel is built on, so the column reads as real product work. */
const Plate = ({
  src,
  alt,
  children,
  zoom = true,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
  zoom?: boolean;
}) => {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-medium"
      style={{ height: PANEL_HEIGHT }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        width={1280}
        height={960}
        className="absolute inset-0 h-full w-full object-cover"
        animate={reduce || !zoom ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--card) / 0.95) 8%, hsl(var(--card) / 0.45) 45%, hsl(var(--card) / 0.05) 80%)",
        }}
      />
      {/* Slow sheen pass so the plate always feels alive. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent, hsl(var(--primary) / 0.16), transparent)",
          }}
          animate={{ x: ["-40%", "340%"] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {children}
    </div>
  );
};

/** The hero image sharpens under a scanning pass. */
const ImageGrade = () => (
  <div className="w-full">
    <Plate src={fragrance} alt="Home fragrance hero image being graded">
      <motion.div
        className="absolute inset-x-0"
        style={{
          height: 46,
          background: "linear-gradient(hsl(var(--primary) / 0.55), transparent)",
        }}
        animate={{ y: [-46, PANEL_HEIGHT] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute left-3 top-3 rounded-pill border border-primary/40 bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Grading hero image
      </motion.span>
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
        <span className="text-[11px] text-muted-foreground">Frame fill 61 percent</span>
        <span className="font-numeric text-2xl font-bold leading-none text-foreground">61</span>
      </div>
    </Plate>
    <p className="mt-3 text-xs text-muted-foreground">
      We grade the hero image first. It moves the click.
    </p>
  </div>
);

/** Score bars filling over the product plate. */
const ScoreBars = () => {
  const rows = [
    { label: "Image", to: 92 },
    { label: "Title", to: 74 },
    { label: "Bullets", to: 61 },
  ];
  return (
    <div className="w-full">
      <Plate src={audio} alt="Headphone listing scored against marketplace rules">
        <div className="absolute inset-x-3 bottom-3 space-y-2.5 rounded-xl border border-border/70 bg-card/85 p-3 backdrop-blur">
          {rows.map((r, i) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{r.label}</span>
                <span className="font-numeric text-foreground">{r.to}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-pill bg-muted">
                <motion.div
                  className="h-full rounded-pill bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.to}%` }}
                  transition={{ duration: 1.1, delay: 0.15 * i, ease: EASE }}
                />
              </div>
            </div>
          ))}
        </div>
      </Plate>
      <p className="mt-3 text-xs text-muted-foreground">
        Scored against the rules the marketplace actually enforces.
      </p>
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
      <Plate src={kitchen} alt="Kitchen appliance listing checked against image policy">
        <div className="absolute inset-x-3 bottom-3 space-y-2 rounded-xl border border-border/70 bg-card/85 p-3 backdrop-blur">
          {rows.map((r, i) => (
            <motion.div
              key={r.label}
              className="flex items-center gap-2.5 text-[12px]"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i, duration: 0.4, ease: EASE }}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border ${
                  r.ok
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}
              >
                {r.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              </span>
              <span className="text-foreground">{r.label}</span>
            </motion.div>
          ))}
        </div>
      </Plate>
      <p className="mt-3 text-xs text-muted-foreground">
        Every flag is specific, so it is fixable today.
      </p>
    </div>
  );
};

/** Both rule books held on one listing. */
const MarketplaceRules = () => (
  <div className="w-full">
    <Plate src={coffee} alt="Coffee listing held to both marketplace rule books">
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
        {["Amazon", "Walmart"].map((m, i) => (
          <motion.div
            key={m}
            className="rounded-xl border border-border/70 bg-card/85 p-2.5 backdrop-blur"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.8, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-sm font-semibold text-foreground">{m}</p>
            <p className="text-[11px] text-muted-foreground">Image and copy rules applied</p>
          </motion.div>
        ))}
      </div>
    </Plate>
    <p className="mt-3 text-xs text-muted-foreground">One listing, two rule books. We hold both.</p>
  </div>
);

/** Competitor comparison bars over the plate. */
const CompetitorCompare = () => (
  <div className="w-full">
    <Plate src={audio} alt="Listing compared against the competing page">
      <div
        className="absolute inset-x-3 bottom-3 flex items-end gap-2 rounded-xl border border-border/70 bg-card/85 p-3 backdrop-blur"
        style={{ height: 108 }}
      >
        {[38, 52, 46, 88, 41].map((h, i) => (
          <motion.div
            key={i}
            className={`flex-1 rounded-t-md ${i === 3 ? "bg-primary" : "bg-muted"}`}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
          />
        ))}
      </div>
    </Plate>
    <p className="mt-3 text-xs text-muted-foreground">
      You see where you sit against the page you compete on.
    </p>
  </div>
);

const panels = [ImageGrade, ScoreBars, IssueChecklist, MarketplaceRules, CompetitorCompare];

/** Auto-advancing showcase of the listing audit visuals, one at a time. */
const AuditVisuals = () => {
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % panels.length), 4200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const Panel = panels[i];

  return (
    <div className="flex h-full flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE }}
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
