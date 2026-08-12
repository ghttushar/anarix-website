import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLeadCapture } from "./LeadCaptureContext";

const PROMISES = ["Where spend is leaking", "Which listings drag margin", "What we would fix first"];

/**
 * Warm, short lead capture. Two fields only, so it reads like an invitation
 * rather than a form.
 */
const LeadCaptureModal = () => {
  const { isOpen, closeLeadCapture } = useLeadCapture();
  const [submitted, setSubmitted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      const t = window.setTimeout(() => closeRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    return undefined;
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

  // Confirmation closes itself, so the visitor never has to dismiss a form.
  useEffect(() => {
    if (!submitted) return undefined;
    const t = window.setTimeout(() => closeLeadCapture(), 2200);
    return () => window.clearTimeout(t);
  }, [submitted, closeLeadCapture]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            aria-labelledby="lead-capture-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-strong"
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

            {!submitted ? (
              <div className="relative p-7 sm:p-8">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free audit
                </p>
                <h3
                  id="lead-capture-title"
                  className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground"
                >
                  We will read your account and tell you what we find.
                </h3>

                <ul className="mt-4 space-y-1.5">
                  {PROMISES.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-label="Work email"
                    className="h-11 w-full rounded-pill border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="you@brand.com"
                  />
                  <input
                    id="lead-brand"
                    name="brand"
                    type="text"
                    required
                    autoComplete="organization"
                    aria-label="Brand or store name"
                    className="h-11 w-full rounded-pill border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Brand or store name"
                  />
                  <Button
                    type="submit"
                    className="group h-11 w-full rounded-pill bg-primary text-primary-foreground btn-shine hover:bg-primary/90"
                  >
                    Send me my audit
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    No pitch deck, no cost. Just what your numbers say.
                  </p>
                </form>
              </div>
            ) : (
              <div className="relative p-10 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h4 className="font-display text-xl font-semibold text-foreground">Thank you.</h4>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  We will get in touch shortly with your audit.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
