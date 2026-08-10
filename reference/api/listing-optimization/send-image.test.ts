import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import handler from "./send-image";

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

const VALID = {
  email: "someone@example.com",
  imageUrl: "https://img.example/hero.jpg",
  productId: "B0BNTFZW4H",
  marketplace: "amazon",
};

let infoSpy: MockInstance;

beforeEach(() => {
  infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
});

afterEach(() => {
  infoSpy.mockRestore();
});

describe("POST /api/listing-optimization/send-image", () => {
  it("accepts a valid payload and hands it to the email provider", async () => {
    const res = await post(VALID, "ip-ok");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining("simulated email → someone@example.com")
    );
  });

  it("rejects an invalid email address", async () => {
    const res = await post({ ...VALID, email: "nope" }, "ip-bademail");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: "EMPTY_INPUT",
      message: "Please enter a valid email address.",
    });
  });

  it("rejects a missing email", async () => {
    const res = await post({ ...VALID, email: "" }, "ip-noemail");
    expect(res.statusCode).toBe(400);
  });

  it("rejects a missing marketplace", async () => {
    const res = await post({ ...VALID, marketplace: "ebay" }, "ip-nomarket");
    expect(res.statusCode).toBe(400);
  });

  it("rejects a missing image URL", async () => {
    const res = await post({ ...VALID, imageUrl: "" }, "ip-noimage");
    expect(res.statusCode).toBe(400);
  });

  it("rejects a non-http image URL", async () => {
    const res = await post({ ...VALID, imageUrl: "data:image/svg+xml;utf8,abc" }, "ip-datauri");
    expect(res.statusCode).toBe(400);
  });

  it("returns 429 once the rate limit is hit", async () => {
    const ip = "ip-flood2";
    for (let i = 0; i < 10; i += 1) {
      const ok = await post(VALID, ip);
      expect(ok.statusCode).toBe(200);
    }
    const blocked = await post(VALID, ip);
    expect(blocked.statusCode).toBe(429);
    expect(blocked.headers["Retry-After"]).toBe("60");
  });

  it("returns 405 for non-POST methods", async () => {
    const res = makeResponse();
    await handler(
      { method: "PUT", headers: { "x-forwarded-for": "ip-put" }, body: null },
      res
    );
    expect(res.statusCode).toBe(405);
  });
});