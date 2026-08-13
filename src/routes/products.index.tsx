import { createFileRoute } from "@tanstack/react-router";

import Products from "@/website/pages/Products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products, Anarix platform, Jiva AI, Signals and MCP | Anarix.ai" },
      {
        name: "description",
        content:
          "Explore the Anarix product suite: the profitability platform, Jiva AI copilot, Signals alerts and the MCP developer surface.",
      },
      { property: "og:title", content: "Products, Anarix platform, Jiva AI, Signals and MCP" },
      {
        property: "og:description",
        content:
          "Explore the Anarix product suite: the profitability platform, Jiva AI copilot, Signals alerts and the MCP developer surface.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});
