import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";


const EASE = [0.22, 1, 0.36, 1] as const;

export interface ExpandingCard {
  icon: LucideIcon;
  title: string;
  desc: string;
  features: string[];
}

interface ExpandingCapabilityGridProps {
  cards: ExpandingCard[];
  /** Columns in the grid; cards fill row 1 then row 2. */
  columns?: number;
  hint?: string;
}

const buildPositions = (count: number, columns: number) => {
  const rows: number[] = [];
  const cols: number[] = [];
  for (let i = 0; i < count; i += 1) {
    rows.push(Math.floor(i / columns));
    cols.push(i % columns);
  }
  return { rows, cols };
};

/**
 * Interactive capability grid: the active tile grows to full height while the
 * tile it displaced moves into the trailing slot. Shared by the platform
 * capabilities section and the home "full stack" section.
 */
export function ExpandingCapabilityGrid({
  cards,
  columns = 5,
  hint = "Click any card to expand its details",
}: ExpandingCapabilityGridProps) {
  const [activeCard, setActiveCard] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  const { rows, cols } = buildPositions(cards.length, columns);
  const spareCol = columns;

  const getCardPosition = (i: number): React.CSSProperties => {
    if (isMobile) return {};
    const row = rows[i];
    const col = cols[i];

    if (i === activeCard) {
      return { gridRow: "1 / 3", gridColumn: `${col + 1} / ${col + 2}` };
    }
    if (col === cols[activeCard] && row !== rows[activeCard]) {
      return { gridRow: "2 / 3", gridColumn: `${spareCol} / ${spareCol + 1}` };
    }
    return {
      gridRow: `${row + 1} / ${row + 2}`,
      gridColumn: `${col + 1} / ${col + 2}`,
    };
  };


  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-surface-elevated/60 p-4 sm:p-6 lg:p-8">
      {/* Layered backdrop: grid mesh, guide rules, glow, vignette */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, black, transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 40%, hsl(var(--primary) / 0.10), transparent 70%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="2" y1="26" x2="98" y2="26" stroke="hsl(var(--primary) / 0.10)" strokeWidth="0.15" />
          <line x1="2" y1="74" x2="98" y2="74" stroke="hsl(var(--primary) / 0.10)" strokeWidth="0.15" />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, hsl(var(--background) / 0.75))",
          }}
        />
      </motion.div>

      <div
        ref={gridRef}
        className="relative z-10 grid gap-3"
        style={{
          gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: isMobile ? undefined : "repeat(2, auto)",
        }}

      >

        {cards.map((card, i) => {
          const pos = getCardPosition(i);
          const isActive = i === activeCard;
          return (
            <motion.button
              key={card.title}
              type="button"
              layout
              onClick={() => setActiveCard(i)}
              aria-expanded={isActive}
              className={`overflow-hidden rounded-xl border text-left transition-colors duration-300 ${
                isActive
                  ? "z-10 border-primary/40 bg-card shadow-medium"
                  : "border-border/40 bg-card/30 hover:border-border/70 hover:bg-card/60"
              }`}
              style={pos}
              initial={false}
              transition={{ layout: { duration: 0.5, ease: EASE } }}
            >
              <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive ? "bg-primary/20" : "bg-primary/10"
                    }`}
                  >
                    <card.icon className="h-4 w-4 text-primary" />
                  </span>
                  <h3
                    className={`flex-1 text-sm font-semibold leading-snug transition-colors ${
                      isActive ? "text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>

                <p
                  className={`text-xs leading-relaxed transition-colors duration-500 ${
                    isActive ? "text-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {card.desc}
                </p>

                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 space-y-1.5 border-t border-border/40 pt-4">
                        {card.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}

        {!isMobile && (
          <div
            className="rounded-xl border border-dashed border-border/20"
            style={{ gridRow: "2 / 3", gridColumn: `${spareCol} / ${spareCol + 1}` }}
          />
        )}

      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/50">{hint}</p>
    </div>
  );
}

export default ExpandingCapabilityGrid;
