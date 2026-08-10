import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { AlertTriangle, Check, X } from "lucide-react";

/** Shared building blocks for the analyzer story slides. */

export const itemIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/** Parent orchestration: children stagger in once the frame has landed. */
export const slideStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Number that counts up to `value` once the slide lands. */
export const CountUp = ({
  value,
  suffix = "%",
  delay = 0.15,
  className = "",
}: {
  value: number;
  suffix?: string;
  delay?: number;
  className?: string;
}) => {
  const raw = useMotionValue(0);
  const text = useTransform(raw, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    const controls = animate(raw, value, { duration: 1.1, delay, ease: EASE });
    return () => controls.stop();
  }, [raw, value, delay]);

  return <motion.span className={className}>{text}</motion.span>;
};

export const Panel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={itemIn}
    className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-strong ${className}`}
  >
    {children}
  </motion.div>
);

export const PanelHead = ({ title, right }: { title: string; right?: React.ReactNode }) => (
  <motion.div
    variants={itemIn}
    className="flex items-center justify-between gap-2 border-b border-border bg-surface-elevated px-4 py-2.5"
  >
    <p className="text-[13px] font-semibold text-foreground truncate">{title}</p>
    {right}
  </motion.div>
);

export const Bar = ({ value }: { value: number }) => (
  <span className="block h-1.5 overflow-hidden rounded-pill bg-accent/60">
    <motion.span
      className="block h-full rounded-pill"
      style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--periwinkle)))" }}
      variants={{ hidden: { width: 0 }, show: { width: `${value}%` } }}
      transition={{ duration: 1.2, ease: EASE }}
    />
  </span>
);

export const ScoreRow = ({
  label,
  sub,
  value,
}: {
  label: string;
  sub?: string;
  value: number;
}) => (
  <motion.div variants={itemIn} className="border-t border-border px-4 py-3">
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-foreground truncate">{label}</span>
        {sub && <span className="block text-[11px] text-muted-foreground truncate">{sub}</span>}
      </span>
      <CountUp value={value} className="font-numeric text-xl font-bold text-foreground tabular-nums" />
    </div>
    <span className="mt-2 block">
      <Bar value={value} />
    </span>
  </motion.div>
);

export const Photo = ({
  src,
  alt = "",
  className = "",
  style,
  fit = "cover",
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fit?: "cover" | "contain";
}) => (
  <span
    className={`block overflow-hidden rounded-xl border border-border bg-background ${className}`}
    style={style}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full"
      style={{ objectFit: fit }}
    />
  </span>
);

export const Rail = ({ items, size = 34 }: { items: string[]; size?: number }) => (
  <motion.span variants={itemIn} className="flex gap-1.5" style={{ perspective: 600 }}>
    {items.map((src, i) => (
      <motion.span
        key={`${src}-${i}`}
        className="block flex-shrink-0"
        variants={{
          hidden: { opacity: 0, y: 10, rotateY: -25 },
          show: {
            opacity: 1,
            y: 0,
            rotateY: 0,
            transition: { delay: 0.35 + i * 0.09, duration: 0.55, ease: EASE },
          },
        }}
      >
        <Photo src={src} style={{ width: size, height: size }} />
      </motion.span>
    ))}
  </motion.span>
);

export const CheckRow = ({ label, ok }: { label: string; ok: boolean }) => (
  <motion.li variants={itemIn} className="flex items-center gap-2.5 px-1.5 py-1">
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full ${
        ok ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
      }`}
      style={{ width: 18, height: 18 }}
    >
      {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    </span>
    <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">{label}</span>
  </motion.li>
);

export const IssueRow = ({ title, detail }: { title: string; detail: string }) => (
  <motion.li variants={itemIn} className="flex gap-2.5 border-b border-border/60 px-4 py-2 last:border-0">
    <span
      className="mt-0.5 flex flex-shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive"
      style={{ width: 18, height: 18 }}
    >
      <AlertTriangle className="w-3 h-3" />
    </span>
    <span className="min-w-0">
      <span className="block text-[12px] font-semibold text-foreground truncate">{title}</span>
      <span className="block text-[11px] text-muted-foreground truncate">{detail}</span>
    </span>
  </motion.li>
);

export const Chrome = ({ tabs, url }: { tabs: string[]; url: string }) => (
  <motion.div variants={itemIn} className="bg-foreground/90 px-3 pt-2.5 pb-2">
    <div className="flex items-center gap-2">
      <span className="flex gap-1.5 pr-1">
        {["bg-destructive/70", "bg-primary/50", "bg-primary/80"].map((dot) => (
          <span key={dot} className="rounded-full" style={{ width: 8, height: 8 }}>
            <span className={`block w-full h-full rounded-full ${dot}`} />
          </span>
        ))}
      </span>
      {tabs.map((tab, i) => (
        <span
          key={tab}
          className={`truncate rounded-t-lg px-2.5 py-1 text-[10px] font-medium ${
            i === 0 ? "bg-card text-foreground" : "bg-background/20 text-background/70"
          }`}
        >
          {tab}
        </span>
      ))}
    </div>
    <div className="mt-1.5 truncate rounded-pill bg-background/15 px-2.5 py-0.5 text-[10px] text-background/80">
      {url}
    </div>
  </motion.div>
);

export const Flag = ({
  children,
  className = "",
  delay = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.span
    className={`absolute rounded-pill bg-destructive px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-strong ${className}`}
    variants={{
      hidden: { opacity: 0, scale: 0.8, y: 6 },
      show: {
        opacity: 1,
        scale: [0.8, 1.08, 1],
        y: 0,
        transition: { delay, duration: 0.55, ease: EASE, times: [0, 0.6, 1] },
      },
    }}
  >
    {children}
  </motion.span>
);
