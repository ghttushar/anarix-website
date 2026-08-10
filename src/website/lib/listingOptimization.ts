import optimizedImageUrl from "@/assets/optimization/hero-optimized.svg";

export type Marketplace = "amazon" | "walmart";

export interface ProductInfo {
  marketplace: Marketplace;
  productId: string;
  title: string;
  heroImage: string;
}

export interface InputDetection {
  marketplace: Marketplace;
  productId: string;
}

const AMAZON_ASIN_REGEX = /^[A-Z0-9]{10}$/;
const WALMART_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9-]{0,39}$/;
const AMAZON_SEGMENT_REGEX = /(?:^|[/?&])([A-Z0-9]{10})(?:[/?#]|$)/i;

/**
 * Lenient client-side mirror of the API's auto-detection, used to preview the
 * marketplace while typing. The server stays the authority on validation.
 */
export function detectProductInput(raw: string): InputDetection | null {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;

  const looksLikeUrl =
    /https?:\/\//i.test(trimmed) || /\.(com|in|co|de|fr|es|it|ca|co\.uk|ae|sg|au)/i.test(trimmed);

  if (looksLikeUrl) {
    const hostMatch = trimmed.match(/^https?:\/\/(?:[^/]+@)?([^/]+)/i);
    const host = (hostMatch?.[1] ?? trimmed).toLowerCase();
    if (host.includes("amazon")) {
      const asin = trimmed.match(AMAZON_SEGMENT_REGEX)?.[1].toUpperCase() ?? null;
      return asin && AMAZON_ASIN_REGEX.test(asin) ? { marketplace: "amazon", productId: asin } : null;
    }
    if (host.includes("walmart")) {
      const path = trimmed.replace(/^https?:\/\//i, "").split(/[?#]/)[0];
      const last = path.split("/").filter(Boolean).pop();
      if (last && WALMART_ID_REGEX.test(last)) {
        return { marketplace: "walmart", productId: last };
      }
      return null;
    }
    return null;
  }

  const bare = trimmed.toUpperCase();
  if (AMAZON_ASIN_REGEX.test(bare)) return { marketplace: "amazon", productId: bare };
  if (WALMART_ID_REGEX.test(trimmed)) return { marketplace: "walmart", productId: trimmed };
  return null;
}

export type ErrorCode =
  | "EMPTY_INPUT"
  | "INVALID_PRODUCT_ID"
  | "PRODUCT_NOT_FOUND"
  | "PROVIDER_ERROR"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "IMAGE_UNAVAILABLE";

export class ListingOptimizationError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = "ListingOptimizationError";
  }
}

export type Severity = "high" | "medium" | "low";

export interface ListingIssue {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
}

export interface AnalysisResult {
  score: number;
  issues: ListingIssue[];
}

export const TARGET_SCORE = 8.7;

export const PRODUCT_LOADING_MESSAGE = "Finding your product...";

export const ANALYZING_MESSAGES = [
  "Analyzing your product image...",
  "Checking product framing...",
  "Evaluating background...",
  "Checking product visibility...",
  "Evaluating image composition...",
  "Calculating listing score...",
];

export const GENERATING_MESSAGES = [
  "Generating optimized image...",
  "Improving composition...",
  "Optimizing product placement...",
  "Finalizing image...",
];

export const EMAIL_SENDING_MESSAGE = "Sending...";
export const GENERATION_READY_MESSAGE = "Your optimized image is ready!";

const API_TIMEOUT_MS = 12_000;

const GENERIC_SERVER_MESSAGE = "We couldn't analyze your product right now. Please try again.";
const GENERIC_SEND_MESSAGE = "We couldn't send your image right now. Please try again.";

async function postJson(url: string, payload: unknown): Promise<{ status: number; body: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ListingOptimizationError("NETWORK_ERROR", "The request timed out. Please try again.");
    }
    throw new ListingOptimizationError(
      "NETWORK_ERROR",
      "We couldn't reach the server. Check your connection and try again."
    );
  } finally {
    clearTimeout(timer);
  }
}

function toFriendlyError(body: unknown, fallback: string): ListingOptimizationError {
  const payload = (body ?? {}) as { error?: unknown; message?: unknown };
  const code =
    typeof payload.error === "string" &&
    ["EMPTY_INPUT", "INVALID_PRODUCT_ID", "PRODUCT_NOT_FOUND", "PROVIDER_ERROR", "RATE_LIMITED", "NETWORK_ERROR", "IMAGE_UNAVAILABLE"].includes(payload.error)
      ? (payload.error as ErrorCode)
      : "PROVIDER_ERROR";
  const message = typeof payload.message === "string" ? payload.message : fallback;
  return new ListingOptimizationError(code, message);
}

export async function fetchProduct(input: { input: string }): Promise<ProductInfo> {
  const { status, body } = await postJson("/api/listing-optimization/product", input);
  if (status === 200 && body && (body as { success?: boolean }).success === true) {
    const product = (body as { product?: ProductInfo }).product;
    if (product) return product;
  }
  throw toFriendlyError(body, GENERIC_SERVER_MESSAGE);
}

export async function sendOptimizedImage(input: {
  email: string;
  imageUrl: string;
  productId: string;
  marketplace: Marketplace;
}): Promise<void> {
  const { status, body } = await postJson("/api/listing-optimization/send-image", input);
  if (status === 200 && body && (body as { success?: boolean }).success === true) return;
  throw toFriendlyError(body, GENERIC_SEND_MESSAGE);
}

export interface GenerateOptimizedImageInput {
  sourceImage: string;
  productId: string;
  marketplace: Marketplace;
}

/** Mocked optimization — returns the bundled optimized image once done. */
export async function generateOptimizedImage(_input: GenerateOptimizedImageInput): Promise<string> {
  const delay = 4000 + Math.floor(Math.random() * 2000);
  await new Promise<void>((resolve) => setTimeout(resolve, delay));
  return optimizedImageUrl;
}

function seedFromString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ISSUE_POOL: Omit<ListingIssue, "id">[] = [
  {
    title: "Image resolution too low",
    detail: "Your main image is under 1600px on the shortest side, which fails the zoom-friendly threshold.",
    severity: "high",
  },
  {
    title: "Background is not pure white",
    detail: "Off-white or gradient backgrounds reduce approval odds and hurt thumbnail contrast.",
    severity: "high",
  },
  {
    title: "Cluttered composition",
    detail: "Extraneous props compete with the product and dilute the first-impression signal.",
    severity: "medium",
  },
  {
    title: "Text and watermarks present",
    detail: "Embedded logos, badges, or promotional text are flagged by the marketplace review system.",
    severity: "high",
  },
  {
    title: "Missing zoom-ready crop",
    detail: "The product occupies less than 85% of the frame, limiting detail on hover zoom.",
    severity: "medium",
  },
  {
    title: "Inconsistent lighting",
    detail: "Harsh shadows and uneven exposure reduce perceived quality versus top-ranked listings.",
    severity: "medium",
  },
  {
    title: "No lifestyle context",
    detail: "Supporting imagery is absent, lowering engagement signals for discovery placements.",
    severity: "low",
  },
  {
    title: "Color grading is flat",
    detail: "Low saturation makes the thumbnail blend into the search grid instead of standing out.",
    severity: "low",
  },
];

/** Deterministic per-ASIN analysis — mocked pending the real vision pipeline. */
export function analyzeProductImage(productId: string): AnalysisResult {
  const rng = mulberry32(seedFromString(productId));
  const score = Math.round((3.0 + rng() * 3.0) * 10) / 10;
  const issueCount = 3 + Math.floor(rng() * 3);
  const issues: ListingIssue[] = [];
  const used = new Set<number>();
  while (issues.length < issueCount) {
    const index = Math.floor(rng() * ISSUE_POOL.length);
    if (used.has(index)) continue;
    used.add(index);
    issues.push({
      ...ISSUE_POOL[index],
      id: `issue-${index}`,
    });
  }
  return { score, issues };
}