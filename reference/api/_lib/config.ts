export function getEnv(name: string): string | undefined {
  return process.env[name];
}

export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

function hasAllCredentials(): boolean {
  return Boolean(
    getEnv("RAINFOREST_API_KEY") &&
      getEnv("WALMART_CLIENT_ID") &&
      getEnv("WALMART_CLIENT_SECRET")
  );
}

/**
 * Mock mode rules:
 * - LISTING_OPTIMIZATION_MOCK=true  → always mock
 * - LISTING_OPTIMIZATION_MOCK=false → always real providers
 * - credentials missing + not production → mock, loudly logged (dev convenience)
 * - credentials missing + production → never mock; real providers return PROVIDER_ERROR
 */
export function isMockEnabled(): boolean {
  const flag = getEnv("LISTING_OPTIMIZATION_MOCK");
  if (flag === "true") return true;
  if (flag === "false") return false;
  if (hasAllCredentials()) return false;
  if (isProduction()) {
    console.error(
      "[listing-optimization] Missing API credentials (RAINFOREST_API_KEY, WALMART_CLIENT_ID, WALMART_CLIENT_SECRET) in production — refusing to serve mock data."
    );
    return false;
  }
  console.error(
    "[listing-optimization] API credentials not configured — using mock providers for local development. Set LISTING_OPTIMIZATION_MOCK=false once credentials exist."
  );
  return true;
}