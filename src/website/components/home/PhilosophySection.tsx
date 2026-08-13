import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { smoothPath } from "@/website/components/case-studies/charts";

const chartSeries = [
  {
    name: "Sponsored Products",
    color: "hsl(230 65% 57%)",
    values: [53, 58, 68, 103, 86, 75, 78, 82, 87, 93, 102, 116],
  },
  {
    name: "Sponsored Brands",
    color: "hsl(230 60% 72%)",
    values: [22, 24, 28, 45, 38, 33, 34, 36, 39, 41, 45, 51],
  },
  {
    name: "Sponsored Display",
    color: "hsl(231 74% 81%)",
    values: [13, 14, 16, 38, 28, 24, 26, 28, 29, 31, 34, 36],
  },
];

const CHART_W = 560;
const CHART_H = 300;
const PAD = { l: 12, r: 12, t: 12, b: 12 };
const CHART_MAX = 120;

const MorphPanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

  const n = chartSeries[0].values.length;
  const pts = chartSeries.map((s) =>
    s.values.map((v, i) => ({
      x: PAD.l + (i * (CHART_W - PAD.l - PAD.r)) / (n - 1),
      y: PAD.t + (1 - v / CHART_MAX) * (CHART_H - PAD.t - PAD.b),
    })),
  );

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <motion.div
        animate={{ opacity: phase >= 1 ? 0.25 : 1, scale: phase >= 1 ? 0.96 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="w-full h-auto rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm"
          role="img"
          aria-label="Illustrative ROAS chart collapsing into a single decision"
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD.l}
              x2={CHART_W - PAD.r}
              y1={PAD.t + f * (CHART_H - PAD.t - PAD.b)}
              y2={PAD.t + f * (CHART_H - PAD.t - PAD.b)}
              stroke="hsl(215 20% 60%)"
              strokeOpacity={0.15}
              strokeWidth={1}
            />
          ))}
          {chartSeries.map((s, si) => (
            <motion.path
              key={s.name}
              d={smoothPath(pts[si])}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
              transition={{ duration: 1.2, delay: si * 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="bg-card/90 backdrop-blur-md border border-primary/30 rounded-2xl shadow-strong p-5 sm:p-6 w-[280px] text-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.85 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="mx-auto mb-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            animate={phase >= 2 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Check className="w-5 h-5 text-primary" />
          </motion.span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
            Decision
          </p>
          <p className="text-sm font-semibold text-foreground leading-snug">
            Pause B07X9 retargeting, ROAS fell 40%.
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Rule drafted, pending your review.
          </p>
        </motion.div>
      </div>

      <motion.p
        className="mt-5 text-center text-xs text-muted-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        Not another dashboard. A decision.
      </motion.p>
    </div>
  );
};

const FLOW_PATHS = [
  "M 72 38 C 60 52, 54 68, 43 82",
  "M 78 46 C 68 58, 62 72, 51 84",
  "M 74 58 C 66 68, 60 76, 50 86",
];

const PhilosophySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textX = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 10]);
  const animScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.9]);
  const flowProgress = useTransform(scrollYProgress, [0.08, 0.5], [0, 1]);

  return (
    <section ref={ref} className="relative pad-section overflow-hidden border-t border-border/40">
      {/* Flowing connector lines: from behind the visual into the
          "Decisions, not to-do lists." card (desktop only). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ws-flow-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style={{ stopColor: "hsl(var(--periwinkle))", stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <g opacity={0.2}>
            {FLOW_PATHS.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="url(#ws-flow-grad)"
                strokeWidth={i === 0 ? 1.6 : 1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: flowProgress }}
              />
            ))}
            <motion.path
              d={FLOW_PATHS[0]}
              fill="none"
              stroke="url(#ws-flow-grad)"
              strokeWidth={0.9}
              strokeLinecap="round"
              strokeDasharray="3 7"
              vectorEffect="non-scaling-stroke"
              animate={{ strokeDashoffset: [0, -50] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
            />
          </g>
        </svg>
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: "43%",
            top: "82%",
            scale: flowProgress,
            boxShadow: "0 0 12px hsl(var(--primary) / 0.8)",
          }}
        />
      </div>

      <div className="container-wide px-4">
        <div className="grid lg:grid-cols-2 gap-grid-lg items-center">
          <motion.div style={{ x: textX }}>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                Our Approach
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
                Most platforms hand you a dashboard{" "}
                <span className="text-gradient-primary">and call it homework.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We built ours to do the opposite.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Relentless execution at machine speed.",
                  desc: "The days of manually adjusting bids and babysitting campaigns are over, our technology handles that grind continuously, at a scale and speed no human could match.",
                },
                {
                  title: "Testing, testing, and more testing.",
                  desc: "New creative, new keywords, new budget structures, new DSP audiences, a constant stream of experiments to find what works for your brand, not a playbook recycled from someone else’s.",
                },
                {
                  title: "Deep dives, not dashboards.",
                  desc: "Real analysis of where your account is headed, what’s holding it back, and what comes next, the kind of thinking that only happens when your team isn’t buried in manual optimization.",
                },
                {
                  title: "Decisions, not to-do lists.",
                  desc: "Not “consider optimizing your campaigns,” but a specific call: change this, here’s why, here’s what it’s worth.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="p-4 rounded-xl border border-border/30 bg-card/20 hover:bg-card/40 transition-colors duration-500"
                  initial={{ opacity: 0, x: -12, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 pad-card-sm rounded-2xl border border-primary/10 bg-primary/5"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-sm text-foreground leading-relaxed font-medium">
                Our Technology does what it does best, relentless, precise execution at machine
                speed. Our people do what they do best, test, think, and push your brand further
                than a script ever could. <span className="text-primary">You get both.</span>
              </p>
            </motion.div>
          </motion.div>

          <motion.div className="flex justify-center" style={{ scale: animScale }}>
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-150" />
              <MorphPanel />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
