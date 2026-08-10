import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Settings, FileText, TrendingUp, type LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  body: string;
}

const steps: Step[] = [
  {
    icon: Search,
    title: "Diagnose",
    subtitle: "We find the leaks. You decide what to fix.",
    body: "Every account has its own history — and its own blind spots. We don’t run a generic checklist; we dig into your numbers until we find exactly where the money’s leaking, whether that’s ad spend with no return, listings losing the buy box, or compliance risks nobody’s flagged. No obligation, no fluff — just the truth about where you stand.",
  },
  {
    icon: Settings,
    title: "Take Over",
    subtitle: "The work that eats your nights becomes someone else’s full-time job.",
    body: "Once we know what’s broken, we get to work fixing it. Your dedicated team steps into the day-to-day — reallocating ad budget, cleaning up listings, managing inventory, staying ahead of compliance. The work that’s been eating your nights and weekends becomes someone’s full-time job instead of your second one.",
  },
  {
    icon: FileText,
    title: "Report",
    subtitle: "Real P&L clarity, not vanity metrics.",
    body: "You shouldn’t have to dig through a 40-tab spreadsheet to find out if things are working. We break down exactly what changed, what it cost, and what it earned — real P&L clarity, not vanity metrics. Monthly or weekly, whichever you want. Ask us anything, anytime.",
  },
  {
    icon: TrendingUp,
    title: "Grow & Scale",
    subtitle: "Once fundamentals are solid, we push for the next level.",
    body: "Once the fundamentals are solid — costs under control, compliance clean, reporting you trust — we shift into growth mode. Based on what we’ve learned about your account and where you want to go, we scale up spend, expand into new channels, and push for the next level of growth.",
  },
];

/**
 * One step at a time: each card owns a tall scroll track and pins centred in the
 * viewport while it is the active step, then hands over to the next one.
 */
const StepPanel = ({
  step,
  index,
  onActive,
}: {
  step: Step;
  index: number;
  onActive: (i: number) => void;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const active = useInView(trackRef, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (active) onActive(index);
  }, [active, index, onActive]);

  return (
    <div ref={trackRef} className="h-[85vh] lg:h-screen flex items-center">
      <motion.div
        className="sticky w-full"
        style={{ top: "22vh" }}
        animate={{
          opacity: active ? 1 : 0.18,
          scale: active ? 1 : 0.94,
          y: active ? 0 : 16,
        }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`relative p-8 sm:p-12 lg:p-14 rounded-3xl border bg-card/70 backdrop-blur-xl transition-colors duration-500 ${
            active ? "border-primary/30 shadow-strong" : "border-border/40 shadow-soft"
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute right-8 top-6 text-5xl sm:text-6xl font-bold text-primary/10 font-numeric select-none"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.16em] font-numeric">
              Step {index + 1}
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-2">
            {step.title}
          </h3>
          <p className="text-sm sm:text-base text-primary/75 mb-5">{step.subtitle}</p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {step.body}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const ProcessSteps = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative pad-section overflow-hidden">
      <div className="container-wide px-4">
        <motion.div
          className="text-center gap-heading"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            How It Works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            From chaos to control.
            <br />
            <span className="text-gradient-primary">In four steps.</span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Step progress rail */}
          <div className="hidden lg:flex flex-col gap-3 items-center absolute -left-10 top-0 h-full pt-[24vh]">
            <div className="sticky top-[24vh] flex flex-col gap-3">
              {steps.map((step, i) => (
                <span
                  key={step.title}
                  aria-hidden="true"
                  className={`block w-1.5 rounded-pill transition-all duration-500 ${
                    i === activeIndex ? "h-10 bg-primary" : "h-4 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {steps.map((step, i) => (
            <StepPanel key={step.title} step={step} index={i} onActive={setActiveIndex} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
