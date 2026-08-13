import { motion } from "framer-motion";
import { Bell, RefreshCw, Send, Sparkles } from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Recreation of the Jiva assistant panel — chat thread, report card and suggestion chip. */
const JivaAssistantPanel = () => {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <AanMascot size={24} state="speaking" staticEyes />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Jiva</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="w-3.5 h-3.5" />
          <RefreshCw className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="p-5 space-y-3">
        <motion.div
          className="max-w-[88%] ml-auto rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Generate a report for my last 7 days campaign performance
        </motion.div>

        <motion.div
          className="max-w-[92%] rounded-2xl rounded-tl-sm bg-muted/50 border border-border px-4 py-3 text-sm text-foreground"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        >
          <p className="font-semibold mb-1">Summary</p>
          <p className="text-muted-foreground">
            Total ad spend <span className="font-numeric font-semibold text-foreground">$10,973.60</span>, total
            sales <span className="font-numeric font-semibold text-foreground">$36,955.24</span>, overall{" "}
            <span className="font-numeric font-semibold text-foreground">3.37x ROAS</span>. Top performer is Sponsored
            Products · Catch All Brand at 4.2x.
          </p>
        </motion.div>

        <motion.div
          className="max-w-[92%] rounded-2xl border border-border bg-background px-4 py-3 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Last 7 Day Campaign Report</p>
            <p className="text-[11px] text-muted-foreground">Amazon · Jan 1 – Jan 7 · 7 changes proposed</p>
          </div>
        </motion.div>

        <motion.div
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary font-medium"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.36, ease: EASE }}
        >
          Suggested · Show me wasted spend analysis
        </motion.div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <div className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground">
          Ask Jiva anything…
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Send className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export default JivaAssistantPanel;
