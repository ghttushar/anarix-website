import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductLookupResult } from "./types";
import { ApiException } from "./types";
import { getProduct } from "./providers";
import { MockProductProvider } from "./mock";

const fetchMock = vi.fn();

beforeEach(() => {
  process.env.RAINFOREST_API_KEY = "test-key";
  process.env.WALMART_CLIENT_ID = "client-id";
  process.env.WALMART_CLIENT_SECRET = "client-secret";
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  delete process.env.RAINFOREST_API_KEY;
  delete process.env.WALMART_CLIENT_ID;
  delete process.env.WALMART_CLIENT_SECRET;
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
}

async function expectError(promise: Promise<ProductLookupResult>): Promise<ApiException> {
  return (await promise.catch((e) => e)) as ApiException;
}

describe("AmazonProductProvider (Rainforest)", () => {
  it("returns a normalized product", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ request_info: { success: true }, product: { title: "Widget", main_image: "https://img/widget.jpg" } })
    );
    const result = await getProduct("amazon", "B0BNTFZW4H");
    expect(result).toEqual({
      marketplace: "amazon",
      productId: "B0BNTFZW4H",
      title: "Widget",
      heroImage: "https://img/widget.jpg",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("type=product&amazon_domain=amazon.com&asin=B0BNTFZW4H"),
      expect.anything()
    );
  });

  it("maps a failed request to PRODUCT_NOT_FOUND", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ request_info: { success: false }, product: null }));
    const err = await expectError(getProduct("amazon", "B0BNTFZW4H"));
    expect(err.code).toBe("PRODUCT_NOT_FOUND");
    expect(err.httpStatus).toBe(404);
    expect(err.message).toBe("We couldn't find that product. Check the ID and try again.");
  });

  it("maps a missing image to IMAGE_UNAVAILABLE", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ product: { title: "Widget" } }));
    const err = await expectError(getProduct("amazon", "B0BNTFZW4H"));
    expect(err.code).toBe("IMAGE_UNAVAILABLE");
  });

  it("maps an upstream failure to PROVIDER_ERROR", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    const err = await expectError(getProduct("amazon", "B0BNTFZW4H"));
    expect(err.code).toBe("PROVIDER_ERROR");
    expect(err.httpStatus).toBe(502);
  });

  it("maps a network failure to PROVIDER_ERROR without leaking internals", async () => {
    fetchMock.mockRejectedValueOnce(new Error("RAINFOREST_SECRET_BODY"));
    const err = await expectError(getProduct("amazon", "B0BNTFZW4H"));
    expect(err.code).toBe("PROVIDER_ERROR");
    expect(err.message).not.toContain("RAINFOREST_SECRET_BODY");
  });
});

describe("WalmartProductProvider", () => {
  it("fetches a token then the item", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ access_token: "tok-123" }))
      .mockResolvedValueOnce(jsonResponse({ itemResponse: [{ title: "Widget", mainImageUrl: "https://img/w.jpg" }] }));
    const result = await getProduct("walmart", "FHD24ERV4X8G");
    expect(result).toEqual({
      marketplace: "walmart",
      productId: "FHD24ERV4X8G",
      title: "Widget",
      heroImage: "https://img/w.jpg",
    });
    const tokenCall = fetchMock.mock.calls[0][0] as string;
    const searchCall = fetchMock.mock.calls[1][0] as string;
    expect(tokenCall).toContain("/v3/token");
    expect(searchCall).toContain("/v3/items/walmart/search?asin=FHD24ERV4X8G");
    expect(fetchMock.mock.calls[1][1].headers["WM_SEC.ACCESS_TOKEN"]).toBe("tok-123");
  });

  it("maps an empty result set to the Walmart-specific not-found message", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ access_token: "tok" }))
      .mockResolvedValueOnce(jsonResponse({ itemResponse: [] }));
    const err = await expectError(getProduct("walmart", "FHD24ERV4X8G"));
    expect(err.code).toBe("PRODUCT_NOT_FOUND");
    expect(err.message).toBe("We couldn't find a Walmart product with that ID. Check the ID and try again.");
  });
});

describe("MockProductProvider", () => {
  it("returns a deterministic demo product without any network calls", async () => {
    const provider = new MockProductProvider("amazon");
    const a = await provider.getProduct("B0BNTFZW4H");
    const b = await provider.getProduct("B0BNTFZW4H");
    expect(a.productId).toBe("B0BNTFZW4H");
    expect(a.title).toBe("Demo Product B0BNTFZW4H");
    expect(a.heroImage.startsWith("data:image/svg+xml")).toBe(true);
    expect(a.heroImage).toBe(b.heroImage);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});