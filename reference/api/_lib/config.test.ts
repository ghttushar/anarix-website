import { afterEach, describe, expect, it } from "vitest";
import { isMockEnabled } from "./config";

const KEYS = [
  "LISTING_OPTIMIZATION_MOCK",
  "RAINFOREST_API_KEY",
  "WALMART_CLIENT_ID",
  "WALMART_CLIENT_SECRET",
  "VERCEL_ENV",
];

afterEach(() => {
  for (const key of KEYS) delete process.env[key];
});

describe("isMockEnabled", () => {
  it("returns true when LISTING_OPTIMIZATION_MOCK=true", () => {
    process.env.LISTING_OPTIMIZATION_MOCK = "true";
    expect(isMockEnabled()).toBe(true);
  });

  it("returns false when LISTING_OPTIMIZATION_MOCK=false even without credentials", () => {
    process.env.LISTING_OPTIMIZATION_MOCK = "false";
    expect(isMockEnabled()).toBe(false);
  });

  it("mocks in local dev when credentials are missing", () => {
    process.env.VERCEL_ENV = "development";
    expect(isMockEnabled()).toBe(true);
  });

  it("never mocks in production when credentials are missing", () => {
    process.env.VERCEL_ENV = "production";
    expect(isMockEnabled()).toBe(false);
  });

  it("uses real providers when all credentials exist", () => {
    process.env.RAINFOREST_API_KEY = "rk";
    process.env.WALMART_CLIENT_ID = "wc";
    process.env.WALMART_CLIENT_SECRET = "ws";
    expect(isMockEnabled()).toBe(false);
  });
});