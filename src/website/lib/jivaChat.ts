export type ChatMsg = { role: "user" | "assistant"; content: string };

/**
 * Jiva transport order:
 * 1. VITE_JIVA_PROXY_URL — your organization's AI service, when connected
 *    (same contract: POST { messages } -> SSE stream, no key on the client).
 * 2. /api/jiva — the built-in server route (Node SSR on Vercel today;
 *    retired when the site moves to static hosting, at which point the
 *    proxy URL above takes over).
 */
const CHAT_URL = import.meta.env.VITE_JIVA_PROXY_URL || "/api/jiva";

interface StreamOptions {
  messages: ChatMsg[];
  signal: AbortSignal;
  onChunk: (text: string) => void;
}

/** Stream a Jiva reply token by token through the server-side proxy. */
export async function streamJivaReply({ messages, signal, onChunk }: StreamOptions) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    const j = await resp.json().catch(() => ({}));
    const fatal = j.error ?? {};
    throw new Error(fatal.friendly || fatal.message || `Request failed (${resp.status})`);
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