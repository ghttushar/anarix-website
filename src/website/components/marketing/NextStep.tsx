import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Link } from "@/lib/router";

export interface NextStepProps {
  /** Small uppercase label above the headline. */
  eyebrow?: string;
  /** The promise of the next page. */
  title: string;
  /** One line explaining why the visitor should continue. */
  description: string;
  /** Link target for the next chapter. */
  to: string;
  /** Link label. */
  label: string;
}

/**
 * Story hand-off between pages: each page ends by pointing at the next
 * chapter so the site reads as one narrative instead of isolated pages.
 */
export default function NextStep({
  eyebrow = "Up next",
  title,
  description,
  to,
  label,
}: NextStepProps) {
  return (
    <section className="pad-section-sm">
      <div className="container-page px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to={to}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 pad-card rounded-3xl border border-border bg-card shadow-soft hover:border-primary/40 hover:shadow-medium transition-all duration-300"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-snug">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <span className="inline-flex items-center gap-2 shrink-0 rounded-pill px-5 h-11 border border-border text-sm font-medium text-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
              {label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
