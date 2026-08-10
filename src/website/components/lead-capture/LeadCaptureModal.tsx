import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadCapture } from "./LeadCaptureContext";

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
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={closeLeadCapture}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-capture-title"
            className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-strong overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 id="lead-capture-title" className="text-xl font-bold text-foreground">
                Get your free margin audit
              </h3>
              <button
                ref={closeRef}
                onClick={closeLeadCapture}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="lead-name" className="block text-sm font-medium text-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="lead-email" className="block text-sm font-medium text-foreground mb-1">
                    Work Email
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="jane@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="lead-company" className="block text-sm font-medium text-foreground mb-1">
                    Company Name
                  </label>
                  <input
                    id="lead-company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label htmlFor="lead-phone" className="block text-sm font-medium text-foreground mb-1">
                    Contact Number <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll show you what your account is losing before you pay a thing.
                </p>
                <Button
                  type="submit"
                  className="w-full rounded-pill h-11 bg-primary text-primary-foreground hover:bg-primary/90 btn-shine"
                >
                  Get My Free Audit
                </Button>
              </form>
            ) : (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">You&apos;re all set!</h4>
                <p className="text-muted-foreground text-sm mb-6">
                  We&apos;ll reach out within 24 hours to schedule your free margin audit.
                </p>
                <Button onClick={closeLeadCapture} variant="outline" className="rounded-pill">
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;