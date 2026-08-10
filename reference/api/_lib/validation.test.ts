import { describe, expect, it } from "vitest";
import { normalizeProductId, parseProductInput, validateEmail, validateMarketplace } from "./validation";

describe("parseProductInput — auto-detection", () => {
  it("detects an Amazon URL and extracts the ASIN", () => {
    expect(parseProductInput("https://www.amazon.com/dp/b0bntfzw4h?th=1")).toEqual({
      marketplace: "amazon",
      productId: "B0BNTFZW4H",
    });
  });

  it("detects an Amazon gp/product URL", () => {
    expect(parseProductInput("https://www.amazon.com/gp/product/B0BNTFZW4H")).toEqual({
      marketplace: "amazon",
      productId: "B0BNTFZW4H",
    });
  });

  it("detects Walmart /ip/ URLs and keeps the final ID segment", () => {
    expect(
      parseProductInput("https://www.walmart.com/ip/Great-Product-Name/3F2X3QZ87V6Y")
    ).toEqual({ marketplace: "walmart", productId: "3F2X3QZ87V6Y" });
  });

  it("treats a bare 10-character alphanumeric id as an Amazon ASIN", () => {
    expect(parseProductInput("b0bntfzw4h")).toEqual({
      marketplace: "amazon",
      productId: "B0BNTFZW4H",
    });
  });

  it("treats a bare non-ASIN id as a Walmart product ID", () => {
    expect(parseProductInput("FHD24ERV4X8G")).toEqual({
      marketplace: "walmart",
      productId: "FHD24ERV4X8G",
    });
  });

  it("rejects empty input", () => {
    const result = parseProductInput("   ");
    expect("error" in result && result.error.code).toBe("EMPTY_INPUT");
  });

  it("rejects unsupported marketplaces", () => {
    const result = parseProductInput("https://www.ebay.com/itm/1234567890");
    expect("error" in result && result.error.code).toBe("INVALID_PRODUCT_ID");
  });

  it("rejects an Amazon link without an ASIN", () => {
    const result = parseProductInput("https://www.amazon.com/s?k=wireless+headphones");
    expect("error" in result && result.error.code).toBe("INVALID_PRODUCT_ID");
  });

  it("rejects gibberish", () => {
    const result = parseProductInput("not-a-product-id-!");
    expect("error" in result && result.error.code).toBe("INVALID_PRODUCT_ID");
  });
});

describe("normalizeProductId (amazon)", () => {
  it("trims and uppercases a valid ASIN", () => {
    const result = normalizeProductId("amazon", "  b0bntfzw4h ");
    expect(result).toEqual({ value: "B0BNTFZW4H" });
  });

  it("rejects a too-short ASIN", () => {
    const result = normalizeProductId("amazon", "B0BN");
    expect("error" in result && result.error.code).toBe("INVALID_PRODUCT_ID");
  });

  it("rejects a non-alphanumeric ASIN", () => {
    const result = normalizeProductId("amazon", "B0BN--ZW4H");
    expect("error" in result && result.error.code).toBe("INVALID_PRODUCT_ID");
  });

  it("rejects an empty input", () => {
    const result = normalizeProductId("amazon", "   ");
    expect("error" in result && result.error.code).toBe("EMPTY_INPUT");
  });
});

describe("normalizeProductId (walmart)", () => {
  it("accepts a valid Walmart product ID", () => {
    const result = normalizeProductId("walmart", "FHD24ERV4X8G");
    expect(result).toEqual({ value: "FHD24ERV4X8G" });
  });

  it("rejects an ID longer than 40 characters", () => {
    const result = normalizeProductId("walmart", "A".repeat(41));
    expect("error" in result && result.error.code).toBe("INVALID_PRODUCT_ID");
  });
});

describe("validateEmail", () => {
  it("accepts a well-formed email", () => {
    expect(validateEmail(" someone@example.com ")).toBe(true);
  });

  it.each(["not-an-email", "a@b", "", "  "])("rejects %j", (value) => {
    expect(validateEmail(value)).toBe(false);
  });
});

describe("validateMarketplace", () => {
  it("accepts amazon and walmart", () => {
    expect(validateMarketplace("amazon")).toBe(true);
    expect(validateMarketplace("walmart")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(validateMarketplace("ebay")).toBe(false);
    expect(validateMarketplace(42)).toBe(false);
    expect(validateMarketplace(undefined)).toBe(false);
  });
});