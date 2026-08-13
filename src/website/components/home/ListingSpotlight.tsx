import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLeadCapture } from "../lead-capture/LeadCaptureContext";

const FIXES = ["Hero image on white", "Title within 200 characters", "A plus content live", "Buy Box price aligned"];

/**
 * Visual hook: one listing upgrading itself. The visitor can scrub the handle
 * to compare the self-run listing with the managed one.
 */
const ListingSpotlight = () => {
  const reduceMotion = useReducedMotion();
  const { openLeadCapture } = useLeadCapture();
  const [reveal, setReveal] = useState(35);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    let raf = 0;
    let start = performance.now();
    const tick = (t: number) => {
      const phase = ((t - start) / 4200) % 1;
      setReveal(20 + 70 * (0.5 - Math.cos(phase * Math.PI * 2) / 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, reduceMotion]);

  const fixesDone = Math.round((reveal / 100) * FIXES.length);
  const score = Math.round(41 + (reveal / 100) * 53);

  return (
    <section className="relative pad-section overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.10), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="container-page relative px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto pb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            Before and after
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.08]">
            Drag the handle. <span className="text-gradient-primary">Watch the listing lift.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Get a free listing analysis. See what Anarix would fix on your ASIN or product link.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              onClick={() => openLeadCapture("audit")}
              className="rounded-pill px-7 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine group"
            >
              Analyze my listing
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>

        <div
          className="relative mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-medium"
          style={{ maxWidth: 880 }}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className="grid gap-0 sm:grid-cols-2">
            {/* Product frame */}
            <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(160deg, hsl(var(--muted)), hsl(var(--muted) / 0.4))",
                  filter: `blur(${(1 - reveal / 100) * 6}px) saturate(${0.4 + reveal / 130})`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="rounded-2xl border border-border bg-card shadow-soft"
                  style={{ width: 168, height: 168 }}
                  animate={{ scale: 0.94 + (reveal / 100) * 0.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="m-4 rounded-xl"
                    style={{
                      height: 136,
                      background:
                        "linear-gradient(150deg, hsl(var(--primary) / 0.30), hsl(var(--primary) / 0.08))",
                      filter: `blur(${(1 - reveal / 100) * 4}px)`,
                    }}
                  />
                </motion.div>
              </div>

              {/* Reveal seam */}
              <div
                className="absolute inset-y-0 w-px bg-primary"
                style={{ left: `${reveal}%` }}
                aria-hidden
              >
                <span
                  className="absolute flex items-center justify-center rounded-pill border border-primary bg-card shadow-soft"
                  style={{ width: 34, height: 34, left: -17, top: "calc(50% - 17px)" }}
                >
                  <span className="text-[10px] font-semibold text-primary">↔</span>
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(reveal)}
                onChange={(e) => setReveal(Number(e.target.value))}
                aria-label="Compare the self-run listing with the managed listing"
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />

              <span className="absolute left-4 top-4 rounded-pill border border-border bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Self-run
              </span>
              <span className="absolute right-4 top-4 rounded-pill border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Anarix-run
              </span>
            </div>

            {/* Live readout */}
            <div className="border-t border-border p-6 sm:border-l sm:border-t-0">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Listing score
                  </p>
                  <p className="font-numeric text-5xl font-bold leading-none text-foreground">{score}</p>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{ opacity: i < 3 + Math.round((reveal / 100) * 2) ? 1 : 0.25 }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-muted">
                <motion.div
                  className="h-full rounded-pill bg-primary"
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <ul className="mt-6 space-y-2.5">
                {FIXES.map((fix, i) => {
                  const done = i < fixesDone;
                  return (
                    <li key={fix} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`flex w-5 h-5 shrink-0 items-center justify-center rounded-pill border transition-colors ${
                          done ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="w-3 h-3" /> : null}
                      </span>
                      <span className={done ? "text-foreground" : "text-muted-foreground"}>{fix}</span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 text-xs text-muted-foreground">
                Same catalogue. Different operators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingSpotlight;
