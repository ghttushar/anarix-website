import { motion } from "framer-motion";
import { Bot, Plug, Database, Zap } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const nodes = [
  { icon: Bot, label: "Your AI model", sub: "Claude, GPT, Gemini, LLaMA", x: "0%" },
  { icon: Plug, label: "MCP", sub: "Model Context Protocol", x: "50%" },
  { icon: Database, label: "Live marketplace data", sub: "Accounts, rules, signals", x: "100%" },
];

const PACKET_COUNT = 5;

/**
 * Animated model -> MCP -> marketplace data flow. Packets travel left to
 * right along a gradient connector while the model node pulses on input.
 */
const McpFlowViz = () => {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative grid grid-cols-3 items-center gap-2 sm:gap-4">
        {/* Connector lines (behind nodes) */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-8 w-full -translate-y-1/2 sm:block"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mcp-flow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "hsl(var(--periwinkle))", stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <line x1="12" y1="4" x2="88" y2="4" stroke="url(#mcp-flow-grad)" strokeWidth="0.4" strokeOpacity="0.5" />
        </svg>

        {/* Moving packets */}
        {nodes.slice(0, 2).map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full sm:block"
            style={{
              background: "hsl(var(--primary))",
              boxShadow: "0 0 6px hsl(var(--primary) / 0.8)",
              left: i === 0 ? "16%" : "66%",
            }}
            animate={{ x: ["0%", "33%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeInOut",
              delay: i * 1.1,
            }}
          />
        ))}

        {nodes.map((node, i) => (
          <motion.div
            key={node.label}
            className="relative z-10 flex flex-col items-center rounded-2xl border border-border/60 bg-card/80 p-4 text-center backdrop-blur-md"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
          >
            <motion.span
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10"
              animate={
                i === 0
                  ? { scale: [1, 1.08, 1] }
                  : i === 1
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
              }
              transition={
                i === 1
                  ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                  : i === 0
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : undefined
              }
            >
              <node.icon className="h-5 w-5 text-primary" />
            </motion.span>
            <p className="mt-2 text-xs font-semibold text-foreground sm:text-sm">{node.label}</p>
            <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">{node.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Zap className="h-3.5 w-3.5 text-primary" />
        Live, structured marketplace data in the model's native format
      </div>
    </div>
  );
};

export default McpFlowViz;
