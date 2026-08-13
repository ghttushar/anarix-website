import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLeadCapture } from "./LeadCaptureContext";

export interface LeadCaptureBandProps {
  /** Small uppercase label. */
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Button label. */
  label?: string;
}

/**
 * Inline email capture placed near the end of long pages. Opens the shared
 * lead modal so there is a single place where the details are collected.
 */
export default function LeadCaptureBand({
  eyebrow = "Free teardown",
  title = "Get the marketplace profit teardown",
  description = "Send us your email and we will show you where your profit and loss is leaking, before you pay a thing.",
  label = "Email me the teardown",
}: LeadCaptureBandProps) {
  const { openLeadCapture } = useLeadCapture();

  return (
    <section className="pad-section-compact">
      <div className="container-page px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-primary/25 bg-primary/5 pad-card shadow-soft"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Mail className="h-3.5 w-3.5" />
                {eyebrow}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                {title}
              </h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            <Button
              onClick={() => openLeadCapture("teardown")}
              className="group h-11 shrink-0 rounded-pill bg-primary px-6 text-primary-foreground btn-shine hover:bg-primary/90"
            >
              {label}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
