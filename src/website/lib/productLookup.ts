/**
 * Server-only product lookup for the listing analyzer.
 *
 * Strategy: scrape the public marketplace page first. If a product-data API
 * key is configured (RAINFOREST_API_KEY) it is preferred, because it is far
 * more reliable than scraping. If everything fails we return a deterministic
 * demo product so the visitor flow never dead-ends.
 */

export type Marketplace = "amazon" | "walmart";

export interface ProductLookup {
  marketplace: Marketplace;
  productId: string;
  title: string;
  heroImage: string;
  demo: boolean;
}

const AMAZON_ASIN_REGEX = /^[A-Z0-9]{10}$/;
const WALMART_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9-]{0,39}$/;
const AMAZON_SEGMENT_REGEX = /(?:^|[/?&])([A-Z0-9]{10})(?:[/?#]|$)/i;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export type ParsedInput =
  | { marketplace: Marketplace; productId: string }
  | { error: string };

export function parseProductInput(raw: string): ParsedInput {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return { error: "Enter a product link or ID to get started." };

  const looksLikeUrl =
    /https?:\/\//i.test(trimmed) ||
    /\.(com|in|co|de|fr|es|it|ca|com\.mx|co\.uk|ae|sg|au)/i.test(trimmed);

  if (looksLikeUrl) {
    const host = (trimmed.match(/^https?:\/\/(?:[^/]+@)?([^/]+)/i)?.[1] ?? trimmed).toLowerCase();

    if (host.includes("amazon")) {
      const asin = trimmed.match(AMAZON_SEGMENT_REGEX)?.[1]?.toUpperCase();
      if (!asin || !AMAZON_ASIN_REGEX.test(asin)) {
        return { error: "We couldn't find an ASIN in that Amazon link. Check it and try again." };
      }
      return { marketplace: "amazon", productId: asin };
    }

    if (host.includes("walmart")) {
      const path = trimmed.replace(/^https?:\/\//i, "").split(/[?#]/)[0];
      const id = path.split("/").filter(Boolean).pop();
      if (!id || !WALMART_ID_REGEX.test(id)) {
        return { error: "We couldn't find a product ID in that Walmart link. Check it and try again." };
      }
      return { marketplace: "walmart", productId: id };
    }

    return { error: "We support Amazon and Walmart product links. Try one of those." };
  }

  const bare = trimmed.toUpperCase();
  if (AMAZON_ASIN_REGEX.test(bare)) return { marketplace: "amazon", productId: bare };
  if (WALMART_ID_REGEX.test(trimmed)) return { marketplace: "walmart", productId: trimmed };
  return { error: "That doesn't look like an Amazon or Walmart product link or ID." };
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .trim();
}

function meta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decode(match[1]);
  }
  return null;
}

function firstImageFromHtml(html: string): string | null {
  const og = meta(html, "og:image");
  if (og?.startsWith("http")) return og;

  // Amazon embeds its gallery as JSON inside the page.
  const hiRes = html.match(/"hiRes"\s*:\s*"(https:[^"]+)"/i)?.[1];
  if (hiRes) return decode(hiRes);
  const large = html.match(/"large"\s*:\s*"(https:[^"]+)"/i)?.[1];
  if (large) return decode(large);
  const landing = html.match(/"landingImageUrl"\s*:\s*"(https:[^"]+)"/i)?.[1];
  if (landing) return decode(landing);
  const imgTag = html.match(/id=["']landingImage["'][^>]+src=["'](https:[^"']+)["']/i)?.[1];
  if (imgTag) return decode(imgTag);

  // Walmart / generic JSON-LD.
  const ld = html.match(/"image"\s*:\s*"(https:[^"]+)"/i)?.[1];
  if (ld && isImageUrl(decode(ld))) return decode(ld);
  const walmartAsset = html.match(
    /(https:\/\/i5\.walmartimages\.com\/(?:asr|seo)\/[^\s"'\\]+)/i
  )?.[1];
  if (walmartAsset && isImageUrl(decode(walmartAsset))) return decode(walmartAsset);

  return null;
}

/** Guards against non-image assets (fonts, scripts) matched by loose regexes. */
function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(url) || /\/images?\//i.test(url);
}

/** Marketplaces serve interstitial bot checks with 200 status. */
function isBotWall(html: string): boolean {
  return /Robot or human|Type the characters you see|api-services-support@amazon|captcha/i.test(
    html.slice(0, 4000)
  );
}

function titleFromHtml(html: string): string | null {
  const og = meta(html, "og:title");
  if (og) return og;
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  return t ? decode(t) : null;
}

function cleanTitle(title: string, marketplace: Marketplace): string {
  return title
    .replace(/^Amazon\.com\s*:\s*/i, "")
    .replace(/\s*[-|:]\s*(Amazon\.com|Walmart\.com).*$/i, "")
    .replace(/\s+/g, " ")
    .slice(0, 140)
    .trim() || `${marketplace === "amazon" ? "Amazon" : "Walmart"} product`;
}

function productUrl(marketplace: Marketplace, productId: string): string {
  return marketplace === "amazon"
    ? `https://www.amazon.com/dp/${encodeURIComponent(productId)}`
    : `https://www.walmart.com/ip/${encodeURIComponent(productId)}`;
}

async function scrape(marketplace: Marketplace, productId: string): Promise<ProductLookup | null> {
  try {
    const res = await fetch(productUrl(marketplace, productId), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    const heroImage = firstImageFromHtml(html);
    if (!heroImage) return null;
    return {
      marketplace,
      productId,
      title: cleanTitle(titleFromHtml(html) ?? "", marketplace),
      heroImage,
      demo: false,
    };
  } catch {
    return null;
  }
}

interface RainforestResponse {
  product?: { title?: string; main_image?: { link?: string }; images?: { link?: string }[] } | null;
}

async function viaApiKey(
  marketplace: Marketplace,
  productId: string,
  apiKey: string
): Promise<ProductLookup | null> {
  if (marketplace !== "amazon") return null;
  try {
    const url =
      `https://api.rainforestapi.com/request?api_key=${encodeURIComponent(apiKey)}` +
      `&type=product&amazon_domain=amazon.com&asin=${encodeURIComponent(productId)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as RainforestResponse;
    const link = data.product?.main_image?.link ?? data.product?.images?.[0]?.link;
    if (!link) return null;
    return {
      marketplace,
      productId,
      title: cleanTitle(data.product?.title ?? "", marketplace),
      heroImage: link,
      demo: false,
    };
  } catch {
    return null;
  }
}

function demoImage(productId: string, marketplace: Marketplace): string {
  let hash = 2166136261;
  for (let i = 0; i < productId.length; i += 1) {
    hash ^= productId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hue = (hash >>> 0) % 360;
  const accent = `hsl(${hue}, 55%, 52%)`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">` +
    `<rect width="800" height="800" fill="#f4f6fb"/>` +
    `<rect x="150" y="170" width="500" height="460" rx="32" fill="#fff" stroke="${accent}" stroke-width="6"/>` +
    `<rect x="230" y="270" width="340" height="160" rx="24" fill="#e6edf9"/>` +
    `<rect x="230" y="460" width="250" height="36" rx="18" fill="#dbe3f0"/>` +
    `<text x="400" y="545" font-family="Arial, sans-serif" font-size="32" fill="#8fa1bd" text-anchor="middle">${productId}</text>` +
    `<text x="400" y="600" font-family="Arial, sans-serif" font-size="22" fill="#b6c3d8" text-anchor="middle">${marketplace} sample listing</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function demoProduct(marketplace: Marketplace, productId: string): ProductLookup {
  return {
    marketplace,
    productId,
    title: `Sample listing ${productId}`,
    heroImage: demoImage(productId, marketplace),
    demo: true,
  };
}

export async function lookupProduct(
  marketplace: Marketplace,
  productId: string,
  apiKey?: string
): Promise<ProductLookup> {
  if (apiKey) {
    const viaKey = await viaApiKey(marketplace, productId, apiKey);
    if (viaKey) return viaKey;
  }
  const scraped = await scrape(marketplace, productId);
  return scraped ?? demoProduct(marketplace, productId);
}
