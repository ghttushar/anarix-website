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
  /** Animated info graphic revealed when the card is expanded. */
  graphic?: () => React.ReactNode;

}

interface ExpandingCapabilityGridProps {
  cards: ExpandingCard[];
  /** Columns in the grid; cards fill row 1 then row 2. */
  columns?: number;
  hint?: string;
}

interface Slot {
  row: number;
  col: number;
}

/**
 * Reading-order slots for a two-row grid where the active column is occupied
 * by one full-height tile: row 1 left to right, then row 2 left to right
 * skipping the active column. Cards keep their order, so an expanded card only
 * nudges its neighbours into the next slot instead of sending one to the end.
 */
const buildSlots = (columns: number, activeCol: number): Slot[] => {
  const slots: Slot[] = [];
  for (let row = 0; row < 2; row += 1) {
    for (let c = 0; c < columns; c += 1) {
      if (c !== activeCol) slots.push({ row, col: c });
    }
  }
  return slots;
};


/**
 * Interactive capability grid: the active tile grows to full height and the
 * remaining tiles reflow in reading order. Shared by the platform capabilities
 * section and the home "full stack" section.
 */
export function ExpandingCapabilityGrid({
  cards,
  columns = 5,
  hint,
}: ExpandingCapabilityGridProps) {
  const [activeCard, setActiveCard] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  // The active card keeps the column it naturally sits in.
  const activeCol = activeCard % columns;
  const slots = buildSlots(columns, activeCol);

  /** Map each card index to a slot, skipping the active card's own column. */
  const placement = new Map<number, Slot>();
  let cursor = 0;
  cards.forEach((_, i) => {
    if (i === activeCard) return;
    while (cursor < slots.length && slots[cursor].col === activeCol && slots[cursor].row === 0) {
      cursor += 1;
    }
    if (cursor < slots.length) {
      placement.set(i, slots[cursor]);
      cursor += 1;
    }
  });

  const getCardPosition = (i: number): React.CSSProperties => {
    if (isMobile) return {};
    if (i === activeCard) {
      return { gridRow: "1 / 3", gridColumn: `${activeCol + 1} / ${activeCol + 2}` };
    }
    const slot = placement.get(i);
    if (!slot) return {};
    return {
      gridRow: `${slot.row + 1} / ${slot.row + 2}`,
      gridColumn: `${slot.col + 1} / ${slot.col + 2}`,
    };
  };



  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-4 sm:p-6 lg:p-8">
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
        className="relative z-10 grid gap-4"
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
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive ? "bg-primary/20" : "bg-primary/10"
                    }`}
                  >
                    <card.icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3
                    className={`flex-1 text-[0.95rem] font-semibold leading-snug transition-colors ${
                      isActive ? "text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>

                <p
                  className={`text-[0.8rem] leading-relaxed transition-colors duration-500 ${
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
                      {card.graphic && (
                        <motion.div
                          className="mt-4 rounded-lg border border-border/40 bg-background/50 p-3"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
                        >
                          {card.graphic()}
                        </motion.div>
                      )}

                      <motion.ul
                        className="mt-4 space-y-1.5 border-t border-border/40 pt-4"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.22, ease: EASE }}
                      >
                        {card.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                            {f}
                          </li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.button>
          );
        })}



      </div>

      {hint ? <p className="mt-6 text-center text-xs text-muted-foreground/50">{hint}</p> : null}
    </div>
  );
}

export default ExpandingCapabilityGrid;
