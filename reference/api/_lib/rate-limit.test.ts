import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SlidingWindowLimiter, clientKey } from "./rate-limit";

describe("SlidingWindowLimiter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows requests under the limit", () => {
    const limiter = new SlidingWindowLimiter(2, 1000);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("blocks and reports Retry-After once the window fills", () => {
    const limiter = new SlidingWindowLimiter(2, 10_000);
    limiter.check("ip");
    limiter.check("ip");
    const blocked = limiter.check("ip");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(10_000);
  });

  it("lets the window slide after time passes", () => {
    const limiter = new SlidingWindowLimiter(2, 1000);
    limiter.check("ip");
    limiter.check("ip");
    vi.advanceTimersByTime(1500);
    expect(limiter.check("ip").allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = new SlidingWindowLimiter(1, 1000);
    limiter.check("ip-a");
    expect(limiter.check("ip-b").allowed).toBe(true);
    expect(limiter.check("ip-a").allowed).toBe(false);
  });
});

describe("clientKey", () => {
  it("uses the first x-forwarded-for entry", () => {
    const req = { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } };
    expect(clientKey(req as never)).toBe("ip:1.2.3.4");
  });

  it("falls back to unknown", () => {
    expect(clientKey({ headers: {} } as never)).toBe("ip:unknown");
  });
});