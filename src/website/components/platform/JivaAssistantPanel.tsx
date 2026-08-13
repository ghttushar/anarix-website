import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, RefreshCw, Send, Sparkles } from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";
import { streamJivaReply, type ChatMsg } from "@/website/lib/jivaChat";

const EASE = [0.22, 1, 0.36, 1] as const;

const INITIAL: ChatMsg[] = [
  {
    role: "user",
    content: "Generate a report for my last 7 days campaign performance",
  },
  {
    role: "assistant",
    content:
      "Summary — total ad spend $10,973.60, total sales $36,955.24, overall 3.37x ROAS. Top performer is Sponsored Products · Catch All Brand at 4.2x.",
  },
];

/** Live Jiva demo on the products page — same streaming client as the chat panel. */
const JivaAssistantPanel = () => {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    let buf = "";
    let pushed = false;
    const upsert = (chunk: string) => {
      buf += chunk;
      setMessages((prev) => {
        if (!pushed) {
          pushed = true;
          return [...prev, { role: "assistant", content: buf }];
        }
        return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: buf } : m));
      });
    };

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamJivaReply({ messages: next, signal: controller.signal, onChunk: upsert });
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <AanMascot size={24} state={loading ? "thinking" : "speaking"} staticEyes />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Jiva
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="w-3.5 h-3.5" />
          <RefreshCw className="w-3.5 h-3.5" />
        </div>
      </div>

      <div ref={threadRef} className="max-h-[300px] overflow-y-auto p-5 space-y-3">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <motion.div
              key={`u-${i}`}
              className="max-w-[88%] ml-auto rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {m.content}
            </motion.div>
          ) : (
            <motion.div
              key={`a-${i}`}
              className="max-w-[92%] rounded-2xl rounded-tl-sm bg-muted/50 border border-border px-4 py-3 text-sm text-foreground whitespace-pre-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {m.content}
            </motion.div>
          ),
        )}
        {loading && (
          <div className="flex items-center gap-1.5 px-2 py-1">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-1.5 w-1.5 rounded-full bg-primary/60"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, delay: d * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-3">
        <motion.div
          className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              Last 7 Day Campaign Report
            </p>
            <p className="text-[11px] text-muted-foreground">
              Amazon · Jan 1 – Jan 7 · 7 changes proposed
            </p>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={() => send("Show me wasted spend analysis")}
          disabled={loading}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary font-medium transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          Suggested · Show me wasted spend analysis
        </button>
      </div>

      <form
        className="flex items-center gap-2 border-t border-border px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ask Jiva anything…"
          aria-label="Ask Jiva anything"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Send message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {error && <p className="px-4 pb-3 text-[11px] leading-relaxed text-destructive">{error}</p>}
    </div>
  );
};

export default JivaAssistantPanel;
