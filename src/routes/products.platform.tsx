import { createFileRoute } from "@tanstack/react-router";

import Platform from "@/website/pages/Product";

export const Route = createFileRoute("/products/platform")({
  head: () => ({
    meta: [
      { title: "Anarix Platform — Profitability analytics for Amazon | Anarix.ai" },
      { name: "description", content: "See true profit by ASIN, channel and campaign with the Anarix profitability platform built for operators." },
      { property: "og:title", content: "Anarix Platform — Profitability analytics for Amazon" },
      { property: "og:description", content: "See true profit by ASIN, channel and campaign with the Anarix profitability platform built for operators." },
      { property: "og:url", content: "/products/platform" },
    ],
    links: [{ rel: "canonical", href: "/products/platform" }],
  }),
  component: Platform,
});
