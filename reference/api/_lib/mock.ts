import type { Marketplace, ProductLookupResult } from "./types";
import type { ProductProvider } from "./providers";

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function svgHeroImage(productId: string, marketplace: Marketplace): string {
  const hue = hashString(productId) % 360;
  const accent = `hsl(${hue}, 60%, 45%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f4f6fb"/><rect x="150" y="170" width="500" height="460" rx="32" fill="#ffffff" stroke="${accent}" stroke-width="6"/><rect x="230" y="270" width="340" height="160" rx="24" fill="#e6edf9"/><rect x="230" y="460" width="250" height="36" rx="18" fill="#dbe3f0"/><text x="400" y="530" font-family="Arial, sans-serif" font-size="34" fill="#8fa1bd" text-anchor="middle">${productId}</text><text x="400" y="600" font-family="Arial, sans-serif" font-size="24" fill="#b6c3d8" text-anchor="middle" text-transform="uppercase">${marketplace} demo product</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Deterministic demo provider used when LISTING_OPTIMIZATION_MOCK is enabled. */
export class MockProductProvider implements ProductProvider {
  constructor(private readonly marketplace: Marketplace) {}

  async getProduct(productId: string): Promise<ProductLookupResult> {
    return {
      marketplace: this.marketplace,
      productId,
      title: `Demo Product ${productId}`,
      heroImage: svgHeroImage(productId, this.marketplace),
    };
  }
}