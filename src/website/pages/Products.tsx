import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import {
  ArrowRight,
  FileSearch,
  Plug,
  Sparkles,
  LayoutDashboard,
  Radar,
  Bell,
  BarChart3,
  Search,
  ShieldCheck,
  Cable,
  Braces,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AanMascot } from "@/components/aan/AanMascot";
import ProfitabilityDashboardMock from "@/website/components/platform/ProfitabilityDashboardMock";
import MarginWaterfallChart from "@/website/components/platform/MarginWaterfallChart";
import CampaignTableMock from "@/website/components/platform/CampaignTableMock";
import JivaAssistantPanel from "@/website/components/platform/JivaAssistantPanel";
import NextStep from "@/website/components/marketing/NextStep";
import LeadCaptureBand from "@/website/components/lead-capture/LeadCaptureBand";

const EASE = [0.22, 1, 0.36, 1] as const;

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
      {children}
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  accent,
  body,
  align = "left",
}: {
  eyebrow: React.ReactNode;
  title: string;
  accent: string;
  body: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-xl"}>
      <EyebrowPill>{eyebrow}</EyebrowPill>
      <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-foreground leading-[1.1]">
        {title} <span className="text-gradient-primary">{accent}</span>
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- 01 Platform */

const platformPillars = [
  {
    icon: BarChart3,
    title: "Unified profit and loss",
    text: "Ads, fees, COGS and returns in one contribution-margin view.",
  },
  {
    icon: Radar,
    title: "Bid intelligence",
    text: "Campaign, keyword and placement decisions scored daily.",
  },
  {
    icon: ShieldCheck,
    title: "Guardrails",
    text: "Rules that cannot spend past the limits you set.",
  },
];

function PlatformSection() {
  return (
    <section className="pad-section-compact border-t border-border/40">
      <Reveal>
        <SectionHead
          align="center"
          eyebrow={
            <>
              <LayoutDashboard className="w-3.5 h-3.5" /> Insight Engine Platform
            </>
          }
          title="Every signal,"
          accent="one platform."
          body="Advertising, profitability, inventory and competition across Amazon, Walmart and Shopify in a single workspace your team actually uses."
        />
      </Reveal>

      <Reveal className="mt-12">
        <div className="grid lg:grid-cols-5 gap-4 items-stretch">
          <div className="lg:col-span-3">
            <ProfitabilityDashboardMock />
          </div>
          <div className="lg:col-span-2">
            <MarginWaterfallChart />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-4">
        <CampaignTableMock />
      </Reveal>

      <Reveal className="mt-6">
        <div className="grid sm:grid-cols-3 gap-4">
          {platformPillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-5 h-full">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <p.icon className="h-4 w-4 text-primary" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------- 02 Jiva */

const jivaThread = [
  {
    icon: Search,
    title: "Ask anything",
    text: "Plain questions about spend, margin, rank or returns. Answers come with the evidence attached.",
  },
  {
    icon: Bell,
    title: "Proactive alerts",
    text: "Jiva watches the account overnight and flags what moved before it hits the profit and loss.",
  },
  {
    icon: BarChart3,
    title: "Reporting on tap",
    text: "Any slice of the account written up in plain English, ready to forward.",
  },
];

function JivaSection() {
  return (
    <section className="pad-section-compact border-t border-border/40">
      <div className="grid lg:grid-cols-12 gap-grid items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <AanMascot size={72} state="idle" interactive />
              </motion.div>
              <EyebrowPill>
                <Sparkles className="w-3.5 h-3.5" /> Jiva AI
              </EyebrowPill>
            </div>

            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-foreground leading-[1.1]">
              An AI that reads the account{" "}
              <span className="text-gradient-primary">like an operator.</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Jiva sits inside every view, knows the history of your account and answers in the
              language your team already speaks.
            </p>
          </Reveal>

          <div className="mt-8 space-y-3">
            {jivaThread.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-4">
          <Reveal>
            <JivaAssistantPanel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- 03 Signals */

const signalItems = [
  {
    sev: "bg-red-500",
    title: "Stockout risk on your #1 SKU",
    conf: "92%",
    reason: "Velocity up 31% for 5 days straight",
  },
  {
    sev: "bg-amber-500",
    title: "Ad set is overspending its return threshold",
    conf: "78%",
    reason: "ACoS up 6 points week over week",
  },
  {
    sev: "bg-green-500",
    title: "Retailer contract needs a decision this week",
    conf: "64%",
    reason: "Deadline in 6 days, 2 options",
  },
];

function SignalsSection() {
  return (
    <section className="pad-section-compact border-t border-border/40">
      <Reveal>
        <SectionHead
          align="center"
          eyebrow={
            <>
              <FileSearch className="w-3.5 h-3.5" /> Signals
            </>
          }
          title="A day begins with a letter,"
          accent="not a dashboard."
          body="Every morning, the things that deserve your attention, with the evidence, the reasoning and a confidence score behind each one."
        />
      </Reveal>

      <div className="mt-12 relative mx-auto max-w-3xl">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border sm:left-1/2" aria-hidden />
        <div className="space-y-4">
          {signalItems.map((s, i) => (
            <motion.div
              key={s.title}
              className="relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-8"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
            >
              <span
                className={`absolute left-[11px] top-6 h-2.5 w-2.5 rounded-full ring-4 ring-background sm:left-1/2 sm:-translate-x-1/2 ${s.sev}`}
                aria-hidden
              />
              <div className={i % 2 === 0 ? "sm:pr-4" : "sm:col-start-2 sm:pl-4"}>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-snug text-foreground">{s.title}</p>
                    <span className="shrink-0 font-numeric text-xs font-bold text-primary">
                      {s.conf}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{s.reason}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Reveal className="mt-8">
        <p className="text-center text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Delivered daily · one click to act · nothing else in the inbox
        </p>
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------------------- 04 MCP */

const mcpTools = [
  {
    tool: "get_account_summary",
    icon: Cable,
    chips: ["POST /mcp", "JSON"],
    text: "Live account state in the model's native format.",
  },
  {
    tool: "list_applied_rules",
    icon: Braces,
    chips: ["GET /mcp", "JSON"],
    text: "Every automation that touched the account.",
  },
  {
    tool: "read_only_scope",
    icon: Lock,
    chips: ["Any model", "Safe"],
    text: "Read-only by default, so nothing can be spent.",
  },
];

function McpSection() {
  return (
    <section className="pad-section-compact border-t border-border/40">
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-10">
        <Reveal>
          <SectionHead
            align="center"
            eyebrow={
              <>
                <Plug className="w-3.5 h-3.5" /> MCP
              </>
            }
            title="Your marketplace data,"
            accent="AI ready."
            body="Plug any model into live, structured marketplace data through Model Context Protocol. Universal, read-only by default and built to answer."
          />
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {mcpTools.map((t, i) => (
            <motion.div
              key={t.tool}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <t.icon className="h-4 w-4 text-primary" />
              </span>
              <p className="mt-3 font-mono text-sm font-semibold text-foreground">{t.tool}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                {t.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-pill bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- page */

const Products = () => {
  return (
    <PageLayout>
      <div className="container-page px-4 sm:px-6">
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
              One platform, four ways in. The workspace, the AI operator, the daily letter and the
              connection layer that ties them to your stack.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine"
              >
                <a
                  href="https://calendly.com/sunil-anarix/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a demo
                </a>
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

        <PlatformSection />
        <JivaSection />
        <SignalsSection />
        <McpSection />

        <LeadCaptureBand
          eyebrow="See it on your data"
          title="Get a walkthrough built on your own account"
          description="Leave your email and we will send a short teardown using your listings and ad spend."
          label="Email me the walkthrough"
        />

        <NextStep
          title="See what we do to a real profit and loss"
          description="What changed, month by month."
          to="/case-studies"
          label="Read the case studies"
        />
      </div>
    </PageLayout>
  );
};

export default Products;
