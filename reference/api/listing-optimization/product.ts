import type { ApiRequest, ApiResponse, Marketplace, ProductLookupResult } from "../_lib/types";
import { ApiException } from "../_lib/types";
import { isMockEnabled } from "../_lib/config";
import { parseProductInput } from "../_lib/validation";
import { MockProductProvider } from "../_lib/mock";
import { getProduct } from "../_lib/providers";
import { createLimiter, clientKey } from "../_lib/rate-limit";
import { parseJsonBody, sendJson, RATE_LIMIT_MESSAGE } from "../_lib/http";

const limiter = createLimiter();

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, {
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Method not allowed.",
    });
    return;
  }

  const limit = limiter.check(clientKey(req));
  if (!limit.allowed) {
    res.setHeader?.("Retry-After", String(Math.ceil(limit.retryAfterMs / 1000)));
    sendJson(res, 429, { success: false, error: "RATE_LIMITED", message: RATE_LIMIT_MESSAGE });
    return;
  }

  const body: unknown = await parseJsonBody(req);
  const payload = (body ?? {}) as { input?: unknown };

  const parsed = parseProductInput(typeof payload.input === "string" ? payload.input : "");
  if ("error" in parsed) {
    const err = parsed.error;
    sendJson(res, err.httpStatus, { success: false, error: err.code, message: err.message });
    return;
  }
  const { marketplace, productId } = parsed;

  try {
    const provider = isMockEnabled()
      ? new MockProductProvider(marketplace)
      : null;
    const product: ProductLookupResult = provider
      ? await provider.getProduct(productId)
      : await getProduct(marketplace, productId);
    sendJson(res, 200, { success: true, product });
  } catch (err) {
    if (err instanceof ApiException) {
      sendJson(res, err.httpStatus, { success: false, error: err.code, message: err.message });
      return;
    }
    sendJson(res, 502, {
      success: false,
      error: "PROVIDER_ERROR",
      message: "We couldn't retrieve the product right now. Please try again.",
    });
  }
}