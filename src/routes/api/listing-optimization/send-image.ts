import { createFileRoute } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/**
 * Email delivery seam. Validation and the request contract are final; plug a
 * mail provider (or your own server) into `deliver` when it is available.
 */
async function deliver(payload: {
  email: string;
  imageUrl: string;
  productId: string;
  marketplace: string;
}): Promise<void> {
  console.info(
    `[listing-optimization] queued image delivery → ${payload.email} | ${payload.marketplace}/${payload.productId}`
  );
}

export const Route = createFileRoute("/api/listing-optimization/send-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: {
          email?: unknown;
          imageUrl?: unknown;
          productId?: unknown;
          marketplace?: unknown;
        } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          body = {};
        }

        const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
        if (!EMAIL_REGEX.test(email)) {
          return json(
            { success: false, error: "EMPTY_INPUT", message: "Please enter a valid email address." },
            400
          );
        }

        const marketplace = body.marketplace === "amazon" || body.marketplace === "walmart" ? body.marketplace : "";
        const productId = typeof body.productId === "string" ? body.productId.trim().slice(0, 64) : "";
        const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.slice(0, 2000) : "";
        if (!marketplace || !productId || !imageUrl) {
          return json(
            { success: false, error: "EMPTY_INPUT", message: "Missing product details. Please retry the analysis." },
            400
          );
        }

        try {
          await deliver({ email, imageUrl, productId, marketplace });
          return json({ success: true });
        } catch {
          return json(
            {
              success: false,
              error: "PROVIDER_ERROR",
              message: "We couldn't send your image right now. Please try again.",
            },
            502
          );
        }
      },
    },
  },
});
