import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Wand2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LISTING_INPUT_ERROR, parseListingInput } from "@/website/lib/listingInput";

type Step = "input" | "analyzing" | "result" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;

const HOOKS = [
  { icon: Zap, text: "Graded in seconds" },
  { icon: ShieldCheck, text: "Marketplace rules, not opinions" },
  { icon: Sparkles, text: "Free, no account" },
];

interface Issue {
  text: string;
  severity: "high" | "medium";
}

/** Pool the mock audit draws from, so no two runs read the same. */
const ISSUE_POOL: Issue[] = [
  { text: "Product fills only 61 percent of the frame", severity: "high" },
  { text: "Text overlay breaks image policy", severity: "high" },
  { text: "Hero image is not on a pure white background", severity: "high" },
  { text: "Title runs past 200 characters", severity: "medium" },
  { text: "Only two of five bullets carry a benefit", severity: "medium" },
  { text: "No A plus content on the detail page", severity: "medium" },
  { text: "Backend search terms are half empty", severity: "medium" },
  { text: "Secondary images miss scale and lifestyle shots", severity: "high" },
  { text: "Brand store is not linked from the byline", severity: "medium" },
];

/** Random draw of `n` issues, high severity first so the list reads urgently. */
const drawIssues = (n: number): Issue[] =>
  [...ISSUE_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "high" ? -1 : 1));

/** Mock grade: always a failing-but-plausible score under 65. */
const drawScore = () => 38 + Math.floor(Math.random() * 27);

const PASSES = ["Pulling the hero image", "Checking image policy", "Reading title and bullets", "Scoring the listing"];


const INPUT_CLASS =
  "h-11 w-full rounded-pill border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

/** Animated score ring with a counting number in the middle. */
const ScoreDial = ({ value }: { value: number }) => {
  const [shown, setShown] = useState(0);
  const R = 34;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="relative h-[92px] w-[92px] shrink-0">
      <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90">
        <circle cx={46} cy={46} r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth={8} />
        <motion.circle
          cx={46}
          cy={46}
          r={R}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-numeric text-2xl font-bold text-foreground">
        {shown}
      </span>
    </div>
  );
};

/**
 * Three-step listing audit: ASIN in, mock grade out, email to receive the
 * regenerated image. `onComplete` is the seam a real backend plugs into later.
 */
const ListingAuditFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<Step>("input");
  const [asin, setAsin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pass, setPass] = useState(0);
  const [score, setScore] = useState(() => drawScore());
  const [issues, setIssues] = useState<Issue[]>(() => drawIssues(3));
  const parsed = useMemo(() => parseListingInput(asin), [asin]);

  useEffect(() => {
    if (step !== "analyzing") return undefined;
    // Fresh grade for every run.
    setScore(drawScore());
    setIssues(drawIssues(3));
    const passId = window.setInterval(() => setPass((p) => Math.min(p + 1, PASSES.length - 1)), 620);
    const t = window.setTimeout(() => setStep("result"), 2600);
    return () => {
      window.clearInterval(passId);
      window.clearTimeout(t);
    };
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
          <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
            <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Paste one ASIN.
              <span className="block text-primary">See what your hero image is costing you.</span>
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              We grade the image, title and bullets against the rules the marketplace enforces, then rebuild the hero
              shot for you.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {HOOKS.map((h, i) => (
                <motion.span
                  key={h.text}
                  className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: EASE }}
                >
                  <h.icon className="h-3.5 w-3.5 text-primary" />
                  {h.text}
                </motion.span>
              ))}
            </div>

            <form
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (!parsed) {
                  setError(LISTING_INPUT_ERROR);
                  return;
                }
                setError(null);
                setPass(0);
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
          <motion.div key="analyzing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
              Reading your listing.
            </h3>

            <div
              className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-muted/30"
              style={{ height: 210 }}
            >
              <motion.div
                className="absolute inset-x-0"
                style={{ height: 52, background: "linear-gradient(hsl(var(--primary) / 0.45), transparent)" }}
                animate={{ y: [-52, 210] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div className="absolute inset-x-5 bottom-5 space-y-2">
                {PASSES.map((p, i) => (
                  <motion.p
                    key={p}
                    className="flex items-center gap-2 text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= pass ? 1 : 0.3, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-pill border ${
                        i < pass ? "border-primary bg-primary/15 text-primary" : "border-border bg-card"
                      }`}
                    >
                      {i < pass && <CheckCircle2 className="h-3 w-3" />}
                    </span>
                    <span className="text-foreground">{p}</span>
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="mt-3 flex items-center gap-4">
              <ScoreDial value={SCORE} />
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Your listing scores {SCORE} out of 100.
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Three fixes stand between this page and the click.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card" style={{ height: 196 }}>
                <div
                  className="absolute inset-0 blur-md"
                  style={{
                    background:
                      "linear-gradient(150deg, hsl(var(--primary) / 0.40), hsl(var(--primary) / 0.08) 60%, hsl(var(--muted)))",
                  }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 w-1/3"
                  style={{
                    background: "linear-gradient(100deg, transparent, hsl(var(--primary) / 0.35), transparent)",
                  }}
                  animate={{ x: ["-40%", "340%"] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill border border-primary/40 bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
                  <Wand2 className="h-3 w-3" />
                  Rebuilt hero image
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-card/85 px-3 py-2 text-center text-[11px] font-medium text-muted-foreground backdrop-blur">
                  Unlocks in full resolution by email
                </span>
              </div>

              <ul className="space-y-2.5">
                {ISSUES.map((issue, i) => (
                  <motion.li
                    key={issue.text}
                    className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.1, ease: EASE }}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-pill ${
                        issue.severity === "high" ? "bg-destructive" : "bg-primary"
                      }`}
                    />
                    {issue.text}
                  </motion.li>
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
              <Button
                type="submit"
                className="h-11 shrink-0 rounded-pill bg-primary px-6 text-primary-foreground btn-shine hover:bg-primary/90"
              >
                Send me the image
              </Button>
            </form>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" className="py-10 text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h4 className="font-display text-2xl font-semibold text-foreground">On its way.</h4>
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
