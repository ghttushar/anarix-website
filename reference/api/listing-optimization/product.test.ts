import { afterEach, beforeEach, describe, expect, it } from "vitest";
import handler from "./product";

function makeResponse() {
  return {
    statusCode: 0,
    body: null as unknown,
    headers: {} as Record<string, string>,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
  };
}

async function post(payload: unknown, ip = "ip-1") {
  const res = makeResponse();
  await handler(
    { method: "POST", headers: { "x-forwarded-for": ip }, body: payload },
    res
  );
  return res;
}

beforeEach(() => {
  process.env.LISTING_OPTIMIZATION_MOCK = "true";
});

afterEach(() => {
  delete process.env.LISTING_OPTIMIZATION_MOCK;
  delete process.env.RAINFOREST_API_KEY;
  delete process.env.WALMART_CLIENT_ID;
  delete process.env.WALMART_CLIENT_SECRET;
  delete process.env.VERCEL_ENV;
});

describe("POST /api/listing-optimization/product", () => {
  it("detects an Amazon link and returns the normalized product", async () => {
    const res = await post({ input: "https://www.amazon.com/dp/b0bntfzw4h" }, "ip-happy");
    expect(res.statusCode).toBe(200);
    const body = res.body as { success: boolean; product: { marketplace: string; productId: string; title: string; heroImage: string } };
    expect(body.success).toBe(true);
    expect(body.product.marketplace).toBe("amazon");
    expect(body.product.productId).toBe("B0BNTFZW4H");
    expect(body.product.title).toBe("Demo Product B0BNTFZW4H");
    expect(body.product.heroImage.startsWith("data:image/svg+xml")).toBe(true);
  });

  it("detects a Walmart link and returns the Walmart product", async () => {
    const res = await post(
      { input: "https://www.walmart.com/ip/Awesome-Gadget/3F2X3QZ87V6Y" },
      "ip-walmart"
    );
    expect(res.statusCode).toBe(200);
    const body = res.body as { success: boolean; product: { marketplace: string; productId: string } };
    expect(body.success).toBe(true);
    expect(body.product.marketplace).toBe("walmart");
    expect(body.product.productId).toBe("3F2X3QZ87V6Y");
  });

  it("rejects an unsupported marketplace link with a client-safe message", async () => {
    const res = await post({ input: "https://www.ebay.com/itm/1234567890" }, "ip-ebay");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: "INVALID_PRODUCT_ID",
      message: "We support Amazon and Walmart product links. Try one of those.",
    });
  });

  it("rejects an empty input", async () => {
    const res = await post({ input: "   " }, "ip-empty");
    expect(res.statusCode).toBe(400);
    expect((res.body as { error: string }).error).toBe("EMPTY_INPUT");
  });

  it("returns 429 with Retry-After once the rate limit is hit", async () => {
    const ip = "ip-flood";
    for (let i = 0; i < 10; i += 1) {
      const ok = await post({ input: "B0BNTFZW4H" }, ip);
      expect(ok.statusCode).toBe(200);
    }
    const blocked = await post({ input: "B0BNTFZW4H" }, ip);
    expect(blocked.statusCode).toBe(429);
    expect(blocked.headers["Retry-After"]).toBe("60");
    expect(blocked.body).toMatchObject({ success: false, error: "RATE_LIMITED" });
  });

  it("returns 405 for non-POST methods", async () => {
    const res = makeResponse();
    await handler(
      { method: "GET", headers: { "x-forwarded-for": "ip-get" }, body: null },
      res
    );
    expect(res.statusCode).toBe(405);
  });

  it("never leaks provider errors when real providers are forced without credentials", async () => {
    process.env.LISTING_OPTIMIZATION_MOCK = "false";
    const res = await post({ input: "B0BNTFZW4H" }, "ip-nocreds");
    expect(res.statusCode).toBe(502);
    const body = res.body as { error: string; message: string };
    expect(body.error).toBe("PROVIDER_ERROR");
    expect(body.message).toBe("We couldn't retrieve the product right now. Please try again.");
  });
});