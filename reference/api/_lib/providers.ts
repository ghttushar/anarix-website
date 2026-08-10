import type { Marketplace, ProductLookupResult } from "./types";
import { ApiException } from "./types";
import { getEnv } from "./config";

export interface ProductProvider {
  getProduct(productId: string): Promise<ProductLookupResult>;
}

const GENERIC_PROVIDER_MESSAGE = "We couldn't retrieve the product right now. Please try again.";

function correlationId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface RainforestResponse {
  request_info?: { success?: boolean; message?: string };
  product?: {
    title?: string;
    main_image?: string;
    images?: { link?: string }[];
  } | null;
}

class AmazonProductProvider implements ProductProvider {
  async getProduct(productId: string): Promise<ProductLookupResult> {
    const apiKey = getEnv("RAINFOREST_API_KEY");
    if (!apiKey) {
      throw new ApiException(
        "PROVIDER_ERROR",
        GENERIC_PROVIDER_MESSAGE,
        502
      );
    }
    const url = `https://api.rainforestapi.com/request?api_key=${encodeURIComponent(
      apiKey
    )}&type=product&amazon_domain=amazon.com&asin=${encodeURIComponent(productId)}`;

    let data: RainforestResponse | null = null;
    try {
      const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) {
        throw new ApiException("PROVIDER_ERROR", GENERIC_PROVIDER_MESSAGE, 502);
      }
      data = (await res.json()) as RainforestResponse;
    } catch (err) {
      if (err instanceof ApiException) throw err;
      throw new ApiException("PROVIDER_ERROR", GENERIC_PROVIDER_MESSAGE, 502);
    }

    if (!data || data.request_info?.success === false || !data.product) {
      throw new ApiException(
        "PRODUCT_NOT_FOUND",
        "We couldn't find that product. Check the ID and try again.",
        404
      );
    }

    const title = typeof data.product.title === "string" ? data.product.title : "";
    const heroImage =
      typeof data.product.main_image === "string"
        ? data.product.main_image
        : data.product.images?.[0]?.link ?? "";
    if (!heroImage) {
      throw new ApiException(
        "IMAGE_UNAVAILABLE",
        "We found the product, but couldn't retrieve its main image.",
        422
      );
    }
    return { marketplace: "amazon", productId, title, heroImage };
  }
}

interface WalmartTokenResponse {
  access_token?: string;
}

interface WalmartItemResponse {
  itemResponse?: {
    title?: string;
    mainImageUrl?: string;
    images?: { url?: string }[];
  }[];
}

class WalmartProductProvider implements ProductProvider {
  private async getAccessToken(): Promise<string> {
    const clientId = getEnv("WALMART_CLIENT_ID");
    const clientSecret = getEnv("WALMART_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new ApiException("PROVIDER_ERROR", GENERIC_PROVIDER_MESSAGE, 502);
    }
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    try {
      const res = await fetch(
        "https://marketplace.walmartapis.com/v3/token?grant_type=client_credentials",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${basic}`,
            Accept: "application/json",
            "WM_QOS.CORRELATION_ID": correlationId(),
          },
        }
      );
      if (!res.ok) throw new Error(`token status ${res.status}`);
      const data = (await res.json()) as WalmartTokenResponse;
      if (!data.access_token) throw new Error("no access_token");
      return data.access_token;
    } catch {
      throw new ApiException("PROVIDER_ERROR", GENERIC_PROVIDER_MESSAGE, 502);
    }
  }

  async getProduct(productId: string): Promise<ProductLookupResult> {
    const token = await this.getAccessToken();
    const url = `https://marketplace.walmartapis.com/v3/items/walmart/search?asin=${encodeURIComponent(
      productId
    )}&responseFormat=SPEC`;

    let data: WalmartItemResponse | null = null;
    try {
      const res = await fetch(url, {
        headers: {
          "WM_SEC.ACCESS_TOKEN": token,
          "WM_QOS.CORRELATION_ID": correlationId(),
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error(`search status ${res.status}`);
      data = (await res.json()) as WalmartItemResponse;
    } catch {
      throw new ApiException("PROVIDER_ERROR", GENERIC_PROVIDER_MESSAGE, 502);
    }

    const item = Array.isArray(data?.itemResponse) ? data.itemResponse[0] : undefined;
    if (!item) {
      throw new ApiException(
        "PRODUCT_NOT_FOUND",
        "We couldn't find a Walmart product with that ID. Check the ID and try again.",
        404
      );
    }
    const heroImage =
      typeof item.mainImageUrl === "string"
        ? item.mainImageUrl
        : item.images?.[0]?.url ?? "";
    if (!heroImage) {
      throw new ApiException(
        "IMAGE_UNAVAILABLE",
        "We found the product, but couldn't retrieve its main image.",
        422
      );
    }
    return {
      marketplace: "walmart",
      productId,
      title: typeof item.title === "string" ? item.title : "",
      heroImage,
    };
  }
}

export function getProduct(marketplace: Marketplace, productId: string): Promise<ProductLookupResult> {
  const provider: ProductProvider =
    marketplace === "amazon" ? new AmazonProductProvider() : new WalmartProductProvider();
  return provider.getProduct(productId);
}