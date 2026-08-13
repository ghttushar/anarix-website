export type Marketplace = "amazon" | "walmart";

export interface ParsedListing {
  marketplace: Marketplace;
  /** Amazon ASIN or Walmart item id. */
  id: string;
}

const ASIN = /^(B0[A-Z0-9]{8}|[0-9]{9}[0-9X])$/i;
const WALMART_ITEM = /^[0-9]{6,12}$/;

/**
 * Parses a pasted ASIN, Walmart item id, or Amazon/Walmart product URL.
 * Returns null when the input is not a recognisable listing reference.
 */
export const parseListingInput = (raw: string): ParsedListing | null => {
  const value = raw.trim();
  if (!value) return null;

  if (ASIN.test(value)) return { marketplace: "amazon", id: value.toUpperCase() };
  if (WALMART_ITEM.test(value)) return { marketplace: "walmart", id: value };

  if (!/^https?:\/\//i.test(value) && !/^www\./i.test(value)) return null;

  let host = "";
  let path = "";
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    host = url.hostname.toLowerCase();
    path = url.pathname;
  } catch {
    return null;
  }

  if (host.includes("amazon.")) {
    const match = path.match(/\/(?:dp|gp\/product|gp\/aw\/d|product)\/([A-Z0-9]{10})/i);
    if (match) return { marketplace: "amazon", id: match[1].toUpperCase() };
    return null;
  }

  if (host.includes("walmart.com")) {
    const match = path.match(/\/ip\/(?:[^/]+\/)?([0-9]{4,15})/);
    if (match) return { marketplace: "walmart", id: match[1] };
    return null;
  }

  return null;
};

export const LISTING_INPUT_ERROR =
  "Paste an Amazon ASIN, Walmart item ID, or a product link from either.";
