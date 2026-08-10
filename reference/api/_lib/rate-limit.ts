import type { ApiRequest } from "./types";

interface CheckResult {
  allowed: boolean;
  retryAfterMs: number;
}

/**
 * Lightweight in-memory sliding-window limiter, keyed by client IP.
 * Serverless-compatible: state lives per function instance, which is enough
 * to stop accidental/abuse loops without any external store.
 */
export class SlidingWindowLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number
  ) {}

  check(key: string): CheckResult {
    const now = Date.now();
    const list = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (list.length >= this.limit) {
      this.hits.set(key, list);
      return { allowed: false, retryAfterMs: Math.max(1, this.windowMs - (now - list[0])) };
    }
    list.push(now);
    this.hits.set(key, list);
    return { allowed: true, retryAfterMs: 0 };
  }
}

export function clientKey(req: ApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `ip:${ip}`;
}

export function createLimiter(): SlidingWindowLimiter {
  const limit = Number(process.env.LISTING_OPTIMIZATION_RATE_LIMIT ?? 10) || 10;
  const windowMs = Number(process.env.LISTING_OPTIMIZATION_RATE_WINDOW_MS ?? 60_000) || 60_000;
  return new SlidingWindowLimiter(limit, windowMs);
}