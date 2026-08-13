import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const INPUT_CLASS =
  "h-11 w-full rounded-pill border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

/**
 * Short teardown capture: name and work email. Confirms and closes itself.
 * The submit handler is the seam a real backend plugs into later.
 */
const TeardownForm = ({ onComplete }: { onComplete: () => void }) => {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return undefined;
    const t = window.setTimeout(onComplete, 2200);
    return () => window.clearTimeout(t);
  }, [sent, onComplete]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Mail className="h-3.5 w-3.5" />
              Free teardown
            </p>

            <h3 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              We will show you where the profit is leaking.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              A short read on your listings and ad spend, written by the team that would run the account.
            </p>

            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input required aria-label="Your name" placeholder="Your name" className={INPUT_CLASS} />
              <input required type="email" aria-label="Work email" placeholder="you@brand.com" className={INPUT_CLASS} />

              <div className="flex flex-wrap gap-2 pt-1">
                {MARKETPLACES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMarketplace(m)}
                    aria-pressed={marketplace === m}
                    className={`rounded-pill border px-4 py-1.5 text-xs font-medium transition-colors ${
                      marketplace === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                className="group mt-2 h-11 w-full rounded-pill bg-primary px-6 text-primary-foreground btn-shine hover:bg-primary/90 sm:w-auto"
              >
                Email me the teardown
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="done" className="py-10 text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h4 className="font-display text-xl font-semibold text-foreground">Got it. We will be in touch.</h4>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              Your teardown lands in your inbox shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeardownForm;
