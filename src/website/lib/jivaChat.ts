export type ChatMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/website-aan`;

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

const GEMINI_SYSTEM = `You are Jiva, the friendly AI assistant for Anarix (anarix.ai). Anarix is a marketplace growth platform for brands selling on Amazon, Walmart, Shopify and TikTok Shop. Jiva turns account data into clear, prioritized decisions, not to-do lists. The platform includes the Insight Engine (profitability dashboards), Signals (automatic opportunity alerts), MCP tooling for rules, and managed services with a dedicated team. You are embedded in the public marketing site. Answer concisely and helpfully about Anarix, its products, pricing, integrations, and how it works. If you do not know something, say so honestly and point the visitor to the contact page. Keep answers short, plain and friendly, using markdown sparingly.`;

interface StreamOptions {
  messages: ChatMsg[];
  signal: AbortSignal;
  onChunk: (text: string) => void;
}

/**
 * Stream a Jiva reply token by token. Prefers a direct Gemini API key when
 * present; otherwise falls back to the Supabase edge function.
 */
export async function streamJivaReply({ messages, signal, onChunk }: StreamOptions) {
  const viaGemini = Boolean(GEMINI_KEY);
  const resp = viaGemini
    ? await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
        {
          method: "POST",
          signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: GEMINI_SYSTEM }] },
            contents: messages.map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.content }],
            })),
          }),
        },
      )
    : await fetch(CHAT_URL, {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages, scope: "general" }),
      });

  if (!resp.ok || !resp.body) {
    const j = await resp.json().catch(() => ({}));
    throw new Error(j.error?.message || j.error || `Request failed (${resp.status})`);
  }

  const reader = resp.body.getReader();
  const dec = new TextDecoder();
  let raw = "";
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    if (d) break;
    raw += dec.decode(value, { stream: true });
    let idx: number;
    while ((idx = raw.indexOf("\n")) !== -1) {
      let line = raw.slice(0, idx);
      raw = raw.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const j = line.slice(6).trim();
      if (j === "[DONE]") {
        done = true;
        break;
      }
      try {
        const p = JSON.parse(j);
        const c = p.choices?.[0]?.delta?.content ?? p.candidates?.[0]?.content?.parts?.[0]?.text;
        if (c) onChunk(c);
      } catch {
        raw = line + "\n" + raw;
        break;
      }
    }
  }
}
