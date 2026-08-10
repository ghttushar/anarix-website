import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface DisclosureProps {
  /** Always-visible label. */
  title: ReactNode;
  /** Optional one-line teaser shown while collapsed and expanded. */
  summary?: ReactNode;
  /** Optional leading element (icon, index, badge). */
  leading?: ReactNode;
  /** Hidden until the visitor opts in. */
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Opt-in disclosure: the visitor sees a title plus a one-line summary and
 * chooses when to read the detail. Keyboard operable and reduced-motion safe
 * (MotionConfig sets `reducedMotion="user"` at the app root).
 */
export function Disclosure({ title, summary, leading, children, defaultOpen = false, className }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div
      className={cn(
        "rounded-xl border bg-card/20 transition-colors duration-300",
        open ? "border-primary/25 bg-card/50" : "border-border/40 hover:border-primary/20 hover:bg-card/40",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left pad-card-sm flex items-start gap-3"
      >
        {leading}
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          {summary && <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">{summary}</span>}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Disclosure;
