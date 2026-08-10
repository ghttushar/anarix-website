import { createFileRoute } from "@tanstack/react-router";

import Documentation from "@/website/pages/Documentation";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Documentation — Anarix guides and API reference | Anarix.ai" },
      { name: "description", content: "Setup guides, data model reference and integration docs for the Anarix platform and MCP server." },
      { property: "og:title", content: "Documentation — Anarix guides and API reference" },
      { property: "og:description", content: "Setup guides, data model reference and integration docs for the Anarix platform and MCP server." },
      { property: "og:url", content: "/documentation" },
    ],
    links: [{ rel: "canonical", href: "/documentation" }],
  }),
  component: Documentation,
});
