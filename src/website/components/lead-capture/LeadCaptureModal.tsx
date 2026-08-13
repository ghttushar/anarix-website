import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { useLeadCapture } from "./LeadCaptureContext";
import AuditVisuals from "./AuditVisuals";
import ListingAuditFlow from "./ListingAuditFlow";
import TeardownForm from "./TeardownForm";

/**
 * Shared capture shell. The audit flow gets a wide two column layout with the
 * rotating listing visuals; the teardown form gets a compact single column.
 */
const LeadCaptureModal = () => {
  const { isOpen, kind, closeLeadCapture } = useLeadCapture();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isAudit = kind === "audit";

  useEffect(() => {
    if (!isOpen) return undefined;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeLeadCapture();
      }
    },
    [closeLeadCapture]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
            onClick={closeLeadCapture}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isAudit ? "Free listing audit" : "Free teardown"}
            className={`relative w-full overflow-hidden rounded-3xl border border-border bg-card shadow-strong ${
              isAudit ? "max-w-5xl" : "max-w-lg"
            }`}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)" }}
            />

            <button
              ref={closeRef}
              onClick={closeLeadCapture}
              className="absolute right-4 top-4 z-20 rounded-pill p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {isAudit ? (
              <div
                className="relative grid gap-0 overflow-y-auto lg:grid-cols-4"
                style={{ maxHeight: "88vh", minHeight: 620 }}
              >
                <div className="p-7 sm:p-10 lg:col-span-3">
                  <ListingAuditFlow onComplete={closeLeadCapture} />
                </div>

                <div className="border-t border-border bg-muted/25 p-6 lg:border-l lg:border-t-0">
                  <AuditVisuals />
                </div>
              </div>
            ) : (
              <div className="relative max-h-[88vh] overflow-y-auto p-7 sm:p-9">
                <TeardownForm onComplete={closeLeadCapture} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
