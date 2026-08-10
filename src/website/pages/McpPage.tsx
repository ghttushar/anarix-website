import { motion } from "framer-motion";
import { Database, Plug, Shield, Zap, Code, Globe, ArrowRight, Server, Cpu, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import NextStep from "@/website/components/marketing/NextStep";
import PageLayout from "@/website/components/PageLayout";

const features = [
  {
    icon: Plug,
    title: "Universal AI Connection",
    desc: "Connect any MCP-compatible AI assistant — Claude, ChatGPT, Copilot, Cursor — directly to your marketplace data. One protocol, every AI tool.",
  },
  {
    icon: Database,
    title: "Live Marketplace Data",
    desc: "Access real-time advertising performance, account summaries, and automation rules across Amazon and Walmart without writing SQL or building custom integrations.",
  },
  {
    icon: Shield,
    title: "Read-Only by Default",
    desc: "Your data stays safe. All Anarix MCP tools are read-only with built-in guardrails — AI can read and analyze, but never modify your campaigns without explicit approval.",
  },
  {
    icon: Zap,
    title: "Structured Responses",
    desc: "Get JSON-structured data back from every query. AI assistants can parse, reason over, and act on the data without hallucinating or guessing at formats.",
  },
];

const tools = [
  {
    name: "get_account_summary",
    desc: "Headline KPIs for any marketplace — spend, sales, ACoS, TACoS, and orders — over any lookback window.",
    input: "marketplace (amazon-us, amazon-uk, walmart-us), lookbackDays (1-90)",
    output: "Spend, Sales, ACoS, TACoS, Orders",
  },
  {
    name: "list_applied_rules",
    desc: "Browse all advertising automation rules with optional status filtering — running, paused, draft, or ended.",
    input: "status? (running | paused | draft | ended)",
    output: "Rule ID, name, status, campaign count, last run",
  },
  {
    name: "echo",
    desc: "Verify MCP server connectivity. Useful for health checks and integration testing.",
    input: "message (string)",
    output: "Echoed message",
  },
];

const marketplaces = [
  { name: "Amazon US", code: "amazon-us", flag: "🇺🇸" },
  { name: "Amazon UK", code: "amazon-uk", flag: "🇬🇧" },
  { name: "Walmart US", code: "walmart-us", flag: "🇺🇸" },
];

const McpPage = () => {
  return (
    <PageLayout>
      <div className="container-page px-6">
        {/* Hero */}
        <div className="grid lg:grid-cols-12 gap-grid items-center pad-hero">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Server className="w-3.5 h-3.5" /> Anarix MCP
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
              Your marketplace data.{" "}
              <span className="text-gradient-primary">AI-ready.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Anarix MCP is a Model Context Protocol server that gives AI assistants secure, structured access to your Amazon and Walmart advertising data. Ask questions in plain English. Get structured answers.
            </p>
          </motion.div>
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl bg-[#0E1020] border border-border/60 shadow-strong font-mono overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-2 text-[10px] text-white/40 uppercase tracking-wider">anarix-mcp · claude</span>
              </div>
              <div className="p-5 space-y-4 text-xs leading-relaxed">
                <div>
                  <div className="text-[#B8BEFF] mb-1">
                    <span className="text-white/40">›</span> get_account_summary({`marketplace: "amazon-us", lookbackDays: 7`})
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/5 p-3 text-white/70">
                    {"spend: 18420 · sales: 92340 · acos: 19.8% · tacos: 11.2% · orders: 812"}
                  </div>
                </div>
                <div>
                  <div className="text-[#B8BEFF] mb-1">
                    <span className="text-white/40">›</span> list_applied_rules({`status: "running"`})
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/5 p-3 text-white/70">
                    {"3 rules running · 2 paused · guardrails: on"}
                  </div>
                </div>
                <div>
                  <div className="text-[#A78BFA] mb-1">
                    <span className="text-white/40">›</span> echo({`"hello"`})
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/5 p-3 text-emerald-400/90">
                    {"\"hello\" — connection confirmed"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* What is MCP */}
        <motion.div
          className="gap-block pad-card rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-2 gap-grid items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                <Cpu className="w-3.5 h-3.5" /> What is MCP?
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
                The USB-C for AI and your data.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Model Context Protocol (MCP) is an open standard — originally introduced by Anthropic — that creates a universal interface between AI models and external data sources. Think of it like USB-C: one connector that works with everything.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Anarix implements MCP as a server that exposes your marketplace advertising data. Any MCP-compatible AI client — Claude Desktop, ChatGPT, Cursor, Copilot — can connect and query your data in natural language.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Open Standard", desc: "Vendor-neutral, adopted by OpenAI, Google, Microsoft, Amazon" },
                { label: "Secure by Design", desc: "Read-only access, no write permissions to your campaigns" },
                { label: "Works Everywhere", desc: "Claude, ChatGPT, Cursor, Copilot, and 6,400+ MCP servers" },
                { label: "Zero Config", desc: "Anarix handles the server. You just connect and ask." },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-border/30 bg-background/40 hover:bg-card/40 transition-colors">
                  <div className="text-sm font-semibold text-foreground mb-1">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4 gap-block">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="pad-card rounded-xl border border-border/40 bg-card/20 hover:bg-card/50 hover:border-primary/20 transition-all duration-500"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tools */}
        <motion.div
          className="gap-block"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center gap-heading-sm">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Code className="w-3.5 h-3.5" /> Available Tools
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Three tools. Every question answered.
            </h2>
          </div>
          <div className="space-y-3">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                className="pad-card-sm rounded-xl border border-border/40 bg-card/30 hover:bg-card/50 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground font-mono mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tool.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <div className="px-3 py-2 rounded-lg bg-muted/40">
                        <span className="font-semibold text-foreground/70">Input: </span>
                        <span className="text-muted-foreground">{tool.input}</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-muted/40">
                        <span className="font-semibold text-foreground/70">Output: </span>
                        <span className="text-muted-foreground">{tool.output}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Marketplaces */}
        <motion.div
          className="gap-block text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Globe className="w-3.5 h-3.5" /> Multi-Marketplace
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-6">
            One server. Every marketplace.
          </h2>
          <div className="flex justify-center gap-4">
            {marketplaces.map((mp) => (
              <div key={mp.code} className="px-6 py-4 rounded-xl border border-border/40 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="text-2xl mb-2">{mp.flag}</div>
                <div className="text-sm font-semibold text-foreground">{mp.name}</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">{mp.code}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">Ready to connect your AI?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get started with Anarix MCP and let your AI assistant access your marketplace intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine">
                Schedule a Demo
              </Button>
            </a>
            <Link to="/products/platform">
              <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                Explore the Platform
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <NextStep
        title="Ready to wire it up?"
        description="Endpoints, schemas and auth — everything a developer needs to start."
        to="/documentation"
        label="Read the docs"
      />
    </PageLayout>
  );
};

export default McpPage;
