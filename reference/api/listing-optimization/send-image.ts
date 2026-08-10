import type { ApiRequest, ApiResponse } from "../_lib/types";
import { ApiException } from "../_lib/types";
import { validateEmail, validateMarketplace } from "../_lib/validation";
import { getEmailProvider } from "../_lib/email";
import { createLimiter, clientKey } from "../_lib/rate-limit";
import { parseJsonBody, sendJson, RATE_LIMIT_MESSAGE } from "../_lib/http";

const limiter = createLimiter();
const IMAGE_URL_REGEX = /^https?:\/\/.+/i;

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
  const payload = (body ?? {}) as {
    email?: unknown;
    imageUrl?: unknown;
    productId?: unknown;
    marketplace?: unknown;
  };

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email || !validateEmail(email)) {
    sendJson(res, 400, {
      success: false,
      error: "EMPTY_INPUT",
      message: "Please enter a valid email address.",
    });
    return;
  }

  if (!validateMarketplace(payload.marketplace)) {
    sendJson(res, 400, { success: false, error: "EMPTY_INPUT", message: "Select Amazon or Walmart." });
    return;
  }

  const productId = typeof payload.productId === "string" ? payload.productId.trim() : "";
  if (!productId) {
    sendJson(res, 400, { success: false, error: "EMPTY_INPUT", message: "Product ID is required." });
    return;
  }

  const imageUrl = typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";
  if (!IMAGE_URL_REGEX.test(imageUrl)) {
    sendJson(res, 400, { success: false, error: "EMPTY_INPUT", message: "A valid image URL is required." });
    return;
  }

  try {
    await getEmailProvider().sendEmail({
      email,
      imageUrl,
      productId,
      marketplace: payload.marketplace,
    });
    sendJson(res, 200, { success: true });
  } catch (err) {
    if (err instanceof ApiException) {
      sendJson(res, err.httpStatus, { success: false, error: err.code, message: err.message });
      return;
    }
    sendJson(res, 502, {
      success: false,
      error: "PROVIDER_ERROR",
      message: "We couldn't send your image right now. Please try again.",
    });
  }
}