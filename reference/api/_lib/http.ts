import type { ApiRequest, ApiResponse } from "./types";

/** Parses the JSON request body regardless of whether the host already parsed it. */
export async function parseJsonBody(req: ApiRequest): Promise<unknown> {
  const body = req.body;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body ?? null;
}

export function sendJson(res: ApiResponse, status: number, body: unknown): void {
  res.status(status).json(body);
}

export const RATE_LIMIT_MESSAGE = "Too many requests. Please try again in a moment.";