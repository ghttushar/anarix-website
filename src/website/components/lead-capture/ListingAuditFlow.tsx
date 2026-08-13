import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LISTING_INPUT_ERROR, parseListingInput } from "@/website/lib/listingInput";

type Step = "input" | "analyzing" | "result" | "done";

const HOOKS = [
  { icon: Zap, text: "Graded in seconds" },
  { icon: ShieldCheck, text: "Marketplace rules, not opinions" },
  { icon: Sparkles, text: "Free, no account" },
];

const ISSUES = ["Product fills only 61 percent of the frame", "Text overlay breaks image policy", "Title runs past 200 characters"];

const INPUT_CLASS =
  "h-11 w-full rounded-pill border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

/**
 * Three-step listing audit: ASIN in, mock grade out, email to receive the
 * regenerated image. `onComplete` is the seam a real backend plugs into later.
 */
const ListingAuditFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<Step>("input");
  const [asin, setAsin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const parsed = useMemo(() => parseListingInput(asin), [asin]);


  useEffect(() => {
    if (step !== "analyzing") return undefined;
    const t = window.setTimeout(() => setStep("result"), 2100);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "done") return undefined;
    const t = window.setTimeout(onComplete, 2000);
    return () => window.clearTimeout(t);
  }, [step, onComplete]);

  return (
    <div className="relative">
      <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Free listing audit
      </p>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              Paste one ASIN. See what your hero image is costing you.
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {HOOKS.map((h) => (
                <span
                  key={h.text}
                  className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  <h.icon className="h-3.5 w-3.5 text-primary" />
                  {h.text}
                </span>
              ))}
            </div>

            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (!parsed) {
                  setError(LISTING_INPUT_ERROR);
                  return;
                }
                setError(null);
                setStep("analyzing");
              }}
            >
              <div className="min-w-0 flex-1">
                <input
                  required
                  value={asin}
                  onChange={(e) => {
                    setAsin(e.target.value);
                    if (error) setError(null);
                  }}
                  onBlur={() => {
                    if (asin.trim() && !parsed) setError(LISTING_INPUT_ERROR);
                  }}
                  aria-label="ASIN, Walmart item ID or product URL"
                  aria-invalid={error ? true : undefined}
                  placeholder="B08XYZ1234, Walmart item ID or product URL"
                  className={`${INPUT_CLASS} ${error ? "border-destructive" : ""}`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="mt-2 px-4 text-xs text-destructive"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  {!error && parsed && (
                    <motion.p
                      className="mt-2 px-4 text-xs text-muted-foreground"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {parsed.marketplace === "amazon" ? "Amazon" : "Walmart"} listing {parsed.id} recognised.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Button
                type="submit"
                disabled={!parsed}
                className="group h-11 shrink-0 rounded-pill bg-primary px-6 text-primary-foreground btn-shine hover:bg-primary/90 disabled:opacity-50"
              >
                Analyze my listing
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">Reading your listing.</h3>
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-muted/30" style={{ height: 190 }}>
              <motion.div
                className="absolute inset-x-0"
                style={{ height: 44, background: "linear-gradient(hsl(var(--primary) / 0.35), transparent)" }}
                animate={{ y: [-44, 190] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
              Score 61. Here is the fixed image.
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card" style={{ height: 186 }}>
                <div
                  className="absolute inset-0 blur-md"
                  style={{ background: "linear-gradient(150deg, hsl(var(--primary) / 0.35), hsl(var(--primary) / 0.08))" }}
                />
                <span className="absolute inset-x-0 bottom-0 bg-card/85 px-3 py-2 text-center text-[11px] font-medium text-muted-foreground">
                  Regenerated image, blurred preview
                </span>
              </div>

              <ul className="space-y-2.5">
                {ISSUES.map((issue) => (
                  <li key={issue} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-destructive" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("done");
              }}
            >
              <input required type="email" aria-label="Work email" placeholder="you@brand.com" className={INPUT_CLASS} />
              <Button type="submit" className="h-11 shrink-0 rounded-pill bg-primary px-6 text-primary-foreground btn-shine hover:bg-primary/90">
                Send me the image
              </Button>
            </form>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" className="py-8 text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h4 className="font-display text-xl font-semibold text-foreground">On its way.</h4>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              Check your inbox for the full resolution image.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListingAuditFlow;
