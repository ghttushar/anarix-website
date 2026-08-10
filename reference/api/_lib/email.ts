import type { Marketplace } from "./types";

export interface SendImagePayload {
  email: string;
  imageUrl: string;
  productId: string;
  marketplace: Marketplace;
}

export interface EmailProvider {
  sendEmail(payload: SendImagePayload): Promise<void>;
}

/**
 * MVP email provider: simulates the send and logs the payload server-side.
 * Swap this implementation (or add a real one behind the interface) once an
 * email service is configured — no client code changes required.
 */
export class SimulatedEmailProvider implements EmailProvider {
  async sendEmail(payload: SendImagePayload): Promise<void> {
    console.info(
      `[listing-optimization] simulated email → ${payload.email} | product=${payload.productId} (${payload.marketplace}) | image=${payload.imageUrl}`
    );
  }
}

export function getEmailProvider(): EmailProvider {
  return new SimulatedEmailProvider();
}