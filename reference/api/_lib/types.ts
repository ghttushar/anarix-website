export type Marketplace = "amazon" | "walmart";

export interface ProductLookupResult {
  marketplace: Marketplace;
  productId: string;
  title: string;
  heroImage: string;
}

export type ErrorCode =
  | "EMPTY_INPUT"
  | "INVALID_PRODUCT_ID"
  | "PRODUCT_NOT_FOUND"
  | "PROVIDER_ERROR"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "IMAGE_UNAVAILABLE";

export interface ErrorBody {
  success: false;
  error: string;
  message: string;
}

/** Minimal request/response shapes — structurally compatible with Vercel functions. */
export interface ApiRequest {
  method?: string;
  headers: { [key: string]: string | string[] | undefined };
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader?(name: string, value: string): void;
}

export class ApiException extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly httpStatus = 400
  ) {
    super(message);
    this.name = "ApiException";
  }
}