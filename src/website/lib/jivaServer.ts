export type ChatMsg = { role: "user" | "assistant"; content: string };

/** Baseline brand system prompt. Enhanced wrapper arrives with brand context. */
export const GEMINI_SYSTEM = `You are Jiva, the friendly AI assistant for Anarix (anarix.ai). Anarix is a marketplace growth platform for brands selling on Amazon, Walmart, Shopify and TikTok Shop. Jiva turns account data into clear, prioritized decisions, not to-do lists. The platform includes the Insight Engine (profitability dashboards), Signals (automatic opportunity alerts), MCP tooling for rules, and managed services with a dedicated team. You are embedded in the public marketing site. Answer concisely and helpfully about Anarix, its products, pricing, integrations, and how it works. If you do not know something, say so honestly and point the visitor to the contact page. Keep answers short, plain and friendly, using markdown sparingly.`;

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

const FRIENDLY_LIMIT =
  "Jiva has reached its daily message limit. Please contact the Anarix team via the contact page and we will be happy to help.";

/**
 * Relay a chat request to the Gemini API and stream the reply back as SSE.
 * Runs server-side only — the API key never leaves the server.
 */
export async function handleJivaRequest(request: Request): Promise<Response> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      {
        error: {
          message: "Jiva is not configured yet",
          friendly: "Jiva is not configured yet. Please contact the Anarix team.",
        },
      },
      { status: 503 },
    );
  }

  let messages: ChatMsg[];
  try {
    const body = (await request.json()) as { messages?: ChatMsg[] };
    messages = body.messages?.slice(0, 12) ?? [];
  } catch {
    return Response.json({ error: { message: "Invalid request body" } }, { status: 400 });
  }
  if (messages.length === 0) {
    return Response.json({ error: { message: "No messages" } }, { status: 400 });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${key}`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: GEMINI_SYSTEM }] },
      contents: messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    const friendly =
      upstream.status === 429 || /quota|rate limit/i.test(text) ? FRIENDLY_LIMIT : undefined;
    return Response.json(
      { error: { message: text || `Request failed (${upstream.status})`, friendly } },
      { status: upstream.status },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      "x-accel-buffering": "no",
    },
  });
}