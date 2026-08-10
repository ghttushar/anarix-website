import { createFileRoute } from "@tanstack/react-router";

import { lookupProduct, parseProductInput } from "@/website/lib/productLookup";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/listing-optimization/product")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "anonymous";
        if (rateLimited(ip)) {
          return json(
            { success: false, error: "RATE_LIMITED", message: "Too many requests. Please wait a moment." },
            429
          );
        }

        let input = "";
        try {
          const body = (await request.json()) as { input?: unknown };
          input = typeof body.input === "string" ? body.input.slice(0, 500) : "";
        } catch {
          input = "";
        }

        const parsed = parseProductInput(input);
        if ("error" in parsed) {
          return json({ success: false, error: "INVALID_PRODUCT_ID", message: parsed.error }, 400);
        }

        const product = await lookupProduct(
          parsed.marketplace,
          parsed.productId,
          process.env["RAINFOREST_API_KEY"]
        );

        return json({ success: true, product });
      },
    },
  },
});
