import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Activity, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import PageLayout from "@/website/components/PageLayout";
import CapabilityGrid from "@/website/components/product/CapabilityGrid";
import DashboardPreview from "@/website/components/product/DashboardPreview";
import PlatformCharts from "@/website/components/product/PlatformCharts";

/** lottie-react touches the DOM on import, so it is only ever loaded in the browser. */
const LottiePlayer = lazy(() => import("lottie-react"));

import loaderBlue from "@/assets/lottie/loader-blue.json";

const realtimeActions = [
  "Adjust campaign budgets based on real-time ROAS signals",
  "Pause products with low inventory to prevent stockouts",
  "Increase bids where demand is strongest",
  "Flag products for replenishment before inventory becomes critical",
  "Alert teams to competitor activity affecting share of voice",
  "Automatically harvest high-intent keywords to drive incremental revenue",
];

const results = [
  { value: "18%", label: "Average margin increase" },
  { value: "40%", label: "TACoS improvement in 120 days" },
  { value: "$600M+", label: "Optimized marketplace GMV" },
];

const Product = () => {
  return (
    <PageLayout>
      <div className="container-wide px-4">
        {/* Hero with Lottie loader animation */}
        <div className="grid lg:grid-cols-12 gap-grid items-center gap-block pt-8">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                <Sparkles className="w-3.5 h-3.5" /> The Anarix Insight Engine
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
                Every signal,{" "}
                <span className="text-gradient-primary">one platform.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Anarix is a unified intelligence platform for marketplace sellers, bringing advertising, inventory, pricing, profitability, and competitive intelligence into a single AI-powered engine.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-150" />
              <Suspense fallback={<div className="w-80 h-80" />}>
                <ClientOnly>
                  <LottiePlayer animationData={loaderBlue} loop className="w-80 h-80" />
                </ClientOnly>
              </Suspense>
            </div>
          </motion.div>
        </div>

        {/* Overview + Results */}
        <div className="grid lg:grid-cols-3 gap-grid gap-block">
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-muted-foreground leading-relaxed">
              Rather than treating advertising, inventory, pricing, profitability, and competitive intelligence as separate functions, the Anarix Insight Engine connects them into one intelligent platform that helps brands make faster, more profitable decisions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Powered by the Anarix MCP connective AI layer, every signal across your marketplaces is unified to provide a holistic view of business performance. The result is a platform that takes action, not just reports metrics.
            </p>
          </motion.div>

          <motion.div
            className="pad-card rounded-2xl border border-border/40 bg-card/30 space-y-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {results.map((r, i) => (
              <div key={r.label} className="text-center p-2">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{r.value}</div>
                <div className="text-xs text-muted-foreground">{r.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 9-Card Capability Grid */}
        <CapabilityGrid />

        {/* Live Dashboard Preview */}
        <DashboardPreview />

        {/* Real-time execution */}
        <motion.div
          className="gap-block p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                <Activity className="w-3.5 h-3.5" /> Real-time execution
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                While you sleep, the engine runs.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Unlike traditional advertising tools that simply report campaign performance, the Anarix Insight Engine takes action. Its real-time execution engine continuously analyzes marketplace signals and makes autonomous decisions on behalf of sellers.
              </p>
            </div>
            <div className="space-y-2">
              {realtimeActions.map((a, i) => (
                <motion.div
                  key={a}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/80">{a}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Anarix */}
        <motion.div
          className="gap-block p-6 sm:p-10 rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                <TrendingUp className="w-3.5 h-3.5" /> Beyond Advertising
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Optimizing for profitability, not just ROAS.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Advertising platforms focus primarily on metrics like ROAS. Anarix combines advertising data with inventory, pricing, competition, and operational signals to optimize for real business outcomes. Every decision is evaluated against its overall impact on margins and long-term growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "SKU-level P&L", desc: "True unit economics per product" },
                { label: "TACoS optimization", desc: "Total ad cost efficiency" },
                { label: "Competitor SOV", desc: "Share of voice tracking" },
                { label: "Inventory health", desc: "Stockout and overstock alerts" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-border/30 bg-background/40 hover:bg-card/40 transition-colors">
                  <div className="text-sm font-semibold text-foreground mb-1">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interactive Charts */}
        <PlatformCharts />

        {/* Where Jiva plugs into the platform — full story lives on the Jiva AI page */}
        <motion.div
          className="gap-block"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-3xl border border-border/60 bg-card/40 pad-card-sm sm:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-end gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                  <Sparkles className="w-3.5 h-3.5" /> Jiva AI
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
                  Where Jiva plugs into your workflow
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  The intelligence layer sits on the same data you just saw — so every number in the platform can be questioned, diagnosed and acted on without leaving the screen.
                </p>
              </div>
              <Link to="/products/aan-ai" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                See how Jiva works <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Activity, title: "On every metric", desc: "Select a number anywhere in the platform and get the source, the trend and the likely cause in one step." },
                { icon: Shield, title: "In your guardrails", desc: "Drafts changes against the limits you set. Nothing destructive applies without an approval you can reverse." },
                { icon: TrendingUp, title: "In your inbox", desc: "A short written read on what moved and what to do next, before the working day starts." },
              ].map((item) => (
                <div key={item.title} className="pad-card-sm rounded-xl border border-border/40 bg-background/40">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center pb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to see it in action?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get a personalized walkthrough of the Anarix Insight Engine with your marketplace data.
          </p>
          <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine">
              Schedule a Demo
            </Button>
          </a>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Product;
