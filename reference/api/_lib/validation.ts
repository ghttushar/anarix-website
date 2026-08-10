import type { Marketplace } from "./types";
import { ApiException } from "./types";

export const AMAZON_ASIN_REGEX = /^[A-Z0-9]{10}$/;
const WALMART_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9-]{0,39}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AMAZON_SEGMENT_REGEX = /(?:^|[/?&])([A-Z0-9]{10})(?:[/?#]|$)/i;

export type ValidationResult = { value: string } | { error: ApiException };

export interface DetectedInput {
  marketplace: Marketplace;
  productId: string;
}

export type InputParseResult = DetectedInput | { error: ApiException };

function invalid(message: string): InputParseResult {
  return { error: new ApiException("INVALID_PRODUCT_ID", message) };
}

function lastPathSegment(raw: string): string | null {
  const path = raw.split(/[?#]/)[0];
  const cleaned = path.split("/").filter(Boolean).pop();
  return cleaned && WALMART_ID_REGEX.test(cleaned) ? cleaned : null;
}

/**
 * Auto-detects the marketplace and extracts a normalized product ID from
 * either a full marketplace link or a bare product ID.
 */
export function parseProductInput(raw: string): InputParseResult {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) {
    return { error: new ApiException("EMPTY_INPUT", "Enter a product link or ID to get started.") };
  }

  const looksLikeUrl = /https?:\/\//i.test(trimmed) || /\.(com|in|co|de|fr|es|it|ca|com\.mx|co\.uk|ae|sg|au)/i.test(trimmed);
  if (looksLikeUrl) {
    const hostMatch = trimmed.match(/^https?:\/\/(?:[^/]+@)?([^/]+)/i);
    const host = (hostMatch?.[1] ?? trimmed).toLowerCase();

    if (host.includes("amazon")) {
      const asinMatch = trimmed.match(AMAZON_SEGMENT_REGEX);
      const asin = asinMatch?.[1].toUpperCase() ?? null;
      if (!asin || !AMAZON_ASIN_REGEX.test(asin)) {
        return invalid("We couldn't find an ASIN in that Amazon link. Check it and try again.");
      }
      return { marketplace: "amazon", productId: asin };
    }

    if (host.includes("walmart")) {
      const id = lastPathSegment(trimmed.replace(/^https?:\/\//i, "").split("?")[0]);
      if (!id) {
        return invalid(
          "We couldn't find a product ID in that Walmart link. Check it and try again."
        );
      }
      return { marketplace: "walmart", productId: id };
    }

    return invalid("We support Amazon and Walmart product links. Try one of those.");
  }

  const bare = trimmed.toUpperCase();
  if (AMAZON_ASIN_REGEX.test(bare)) {
    return { marketplace: "amazon", productId: bare };
  }
  if (WALMART_ID_REGEX.test(trimmed)) {
    return { marketplace: "walmart", productId: trimmed };
  }
  return invalid(
    "That doesn't look like an Amazon or Walmart product link or ID. Check it and try again."
  );
}

/** Lenient client-side mirror used only to preview the detection while typing. */
export function previewDetectedMarketplace(raw: string): Marketplace | null {
  const result = parseProductInput(raw);
  return "error" in result ? null : result.marketplace;
}

/** Normalizes and validates a product ID for the given marketplace. */
export function normalizeProductId(
  marketplace: Marketplace,
  raw: string
): ValidationResult {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) {
    return { error: new ApiException("EMPTY_INPUT", "Enter a product ID to get started.") };
  }
  if (marketplace === "amazon") {
    const value = trimmed.toUpperCase();
    if (!AMAZON_ASIN_REGEX.test(value)) {
      return {
        error: new ApiException(
          "INVALID_PRODUCT_ID",
          "That doesn't look like a valid ASIN. Check it and try again."
        ),
      };
    }
    return { value };
  }
  if (!WALMART_ID_REGEX.test(trimmed)) {
    return {
      error: new ApiException(
        "INVALID_PRODUCT_ID",
        "That doesn't look like a valid Walmart product ID. Check it and try again."
      ),
    };
  }
  return { value: trimmed };
}

export function validateEmail(raw: string): boolean {
  return EMAIL_REGEX.test(String(raw ?? "").trim());
}

export function validateMarketplace(value: unknown): value is Marketplace {
  return value === "amazon" || value === "walmart";
}