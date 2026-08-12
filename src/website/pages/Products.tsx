import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { ArrowRight, Bot, FileSearch, Plug, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import EmbedKpiStrip from "@/website/components/embeds/EmbedKpiStrip";
import EmbedRuleCard from "@/website/components/embeds/EmbedRuleCard";
import EmbedInsightCard from "@/website/components/embeds/EmbedInsightCard";
import NextStep from "@/website/components/marketing/NextStep";

const EASE = [0.22, 1, 0.36, 1] as const;

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
      {children}
    </div>
  );
}

function ProductVisual({ type }: { type: "platform" | "aan" | "signals" | "mcp" }) {
  if (type === "platform") {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-primary" /> Live dashboard
          </p>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>
        <EmbedKpiStrip />
        <div className="grid sm:grid-cols-2 gap-px bg-border">
          <EmbedRuleCard />
          <EmbedInsightCard
            severity="high"
            title="Stockout risk on your #1 SKU"
            body="Projected to run out in 6 days at current velocity. 3 rule suggestions ready to review."
          />
        </div>
      </div>
    );
  }

  if (type === "aan") {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-soft p-6 space-y-3">
        <motion.div
          className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/50 border border-border px-4 py-3 text-sm text-foreground"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Which ad type is carrying Black Friday this year?
        </motion.div>
        <motion.div
          className="max-w-[85%] ml-auto rounded-2xl rounded-tr-sm bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        >
          Sponsored Display — it&apos;s running 55x ROAS on $5,891 of spend. Want the breakdown?
        </motion.div>
        <motion.div
          className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        >
          <Sparkles className="w-4 h-4 text-primary" /> Ask anything about your account…
        </motion.div>
      </div>
    );
  }

  if (type === "signals") {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-soft p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
          <FileSearch className="w-3.5 h-3.5 text-primary" /> Morning Letter · Mon
        </p>
        {[
          { sev: "bg-red-500", title: "Stockout risk on your #1 SKU", conf: "92%", reason: "Velocity up 31% for 5 days straight" },
          { sev: "bg-amber-500", title: "Meta ad-set is overspending its return threshold", conf: "78%", reason: "ACoS +6pts week-over-week" },
          { sev: "bg-green-500", title: "Retailer contract requires a decision this week", conf: "64%", reason: "Deadline in 6 days · 2 options" },
        ].map((s, i) => (
          <motion.div
            key={s.title}
            className="rounded-xl border border-border bg-background p-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${s.sev}`} />
                <p className="text-sm font-semibold text-foreground truncate">{s.title}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-primary">{s.conf}</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground pl-4">{s.reason}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft p-6 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
        <Plug className="w-3.5 h-3.5 text-primary" /> MCP Server · Tools
      </p>
      {[
        { tool: "get_account_summary", io: ["POST /mcp", "JSON"] },
        { tool: "list_applied_rules", io: ["GET /mcp", "JSON"] },
        { tool: "echo", io: ["Any model", "Any format"] },
      ].map((t, i) => (
        <motion.div
          key={t.tool}
          className="rounded-xl border border-border bg-background p-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground font-mono">{t.tool}</p>
            <div className="flex gap-1.5">
              {t.io.map((chip) => (
                <span key={chip} className="text-[11px] px-2 py-0.5 rounded-pill bg-primary/10 text-primary font-medium">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Live, read-only marketplace data in the model&apos;s native format.
          </p>
        </motion.div>
      ))}
    </div>
  );
}

interface ProductSection {
  eyebrow: string;
  name: string;
  solves: string;
  chips: string[];
  visual: "platform" | "aan" | "signals" | "mcp";
}

const products: ProductSection[] = [
  {
    eyebrow: "Insight Engine Platform",
    name: "Every signal, one platform.",
    solves:
      "The unified commerce intelligence platform — advertising, profitability, inventory, and competition across Amazon and Walmart in a single workspace.",
    chips: ["Campaign Management", "Bid Intelligence", "Keyword Harvesting", "Visual Rule Builder", "Guardrails & Safety", "Unified P&L"],
    visual: "platform",
  },
  {
    eyebrow: "Jiva AI",
    name: "An AI that reads the account like an operator.",
    solves:
      "Ask anything, get answers with evidence. Jiva monitors every account around the clock and surfaces what needs attention before it hits the P&L.",
    chips: ["Ask Anything", "Proactive Alerts", "Automated Reporting", "Anomaly Detection", "Keyword Intelligence"],
    visual: "aan",
  },
  {
    eyebrow: "Signals",
    name: "A day begins with a letter, not a dashboard.",
    solves:
      "Every morning, the three things that deserve your attention — with the evidence, reasoning, and confidence score behind each one.",
    chips: ["Daily morning letter", "Evidence & reasoning", "Confidence scoring", "One-click execution"],
    visual: "signals",
  },
  {
    eyebrow: "MCP",
    name: "Your marketplace data, AI-ready.",
    solves:
      "Plug any LLM into live, structured marketplace data through Model Context Protocol — universal, read-only by default, and built to answer.",
    chips: ["Universal AI Connection", "Live Marketplace Data", "Read-Only by Default", "Structured Responses"],
    visual: "mcp",
  },
];

function ProductRow({ product, index }: { product: ProductSection; index: number }) {
  const { ref, isVisible } = useScrollReveal();
  const flip = index % 2 === 1;
  return (
    <section className="relative pad-section-compact">
      <div
        ref={ref}
        className={`grid lg:grid-cols-2 gap-grid items-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className={flip ? "lg:order-2" : ""}>
          <EyebrowPill>
            <Bot className="w-3.5 h-3.5" /> {product.eyebrow}
          </EyebrowPill>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            {product.name}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">{product.solves}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.chips.map((chip) => (
              <span
                key={chip}
                className="px-3.5 py-1.5 rounded-pill bg-card border border-border text-xs font-medium text-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className={flip ? "lg:order-1" : ""}>
          <ProductVisual type={product.visual} />
        </div>
      </div>
    </section>
  );
}

const Products = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <PageLayout>
      <div className="container-page px-4">
        <div className="text-center pad-hero">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              Products
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
              Everything <span className="text-gradient-primary">Anarix offers.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              One platform, four ways in — build, measure, and scale marketplace growth
              without leaving your desk.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine"
              >
                <Link to="/demo">Book a demo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200"
              >
                <Link to="/case-studies">See the results</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {products.map((p, i) => (
          <ProductRow key={p.eyebrow} product={p} index={i} />
        ))}

        <section className="relative pad-cta">
          <div
            ref={ref}
            className={`text-center max-w-2xl mx-auto transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              One suite
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
              Four products,{" "}
              <span className="text-gradient-primary">one operating system.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Pick the piece you need first — the rest of the stack is already wired to it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine group"
              >
                <Link to="/demo">
                  Book a demo
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <NextStep
          title="See what it does to a real P&L"
          description="Six accounts, two marketplaces — what changed, month by month."
          to="/case-studies"
          label="Read the case studies"
        />
      </div>
    </PageLayout>
  );
};

export default Products;
