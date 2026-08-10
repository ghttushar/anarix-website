import { motion } from "framer-motion";
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
      className="block h-full rounded-pill bg-primary"
      variants={{ hidden: { width: 0 }, show: { width: `${value}%` } }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
      <span className="font-numeric text-xl font-bold text-foreground tabular-nums">{value}%</span>
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
  <motion.span variants={itemIn} className="flex gap-1.5">
    {items.map((src, i) => (
      <Photo
        key={`${src}-${i}`}
        src={src}
        className="flex-shrink-0"
        style={{ width: size, height: size }}
      />
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
      hidden: { opacity: 0, scale: 0.85 },
      show: { opacity: 1, scale: 1, transition: { delay, duration: 0.35 } },
    }}
  >
    {children}
  </motion.span>
);
