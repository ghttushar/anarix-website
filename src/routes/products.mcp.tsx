import { createFileRoute } from "@tanstack/react-router";

import McpPage from "@/website/pages/McpPage";

export const Route = createFileRoute("/products/mcp")({
  head: () => ({
    meta: [
      { title: "Anarix MCP — Connect your stack to Amazon data" },
      { name: "description", content: "Use the Anarix MCP server to query your Amazon commerce data from any agent, notebook or internal tool." },
      { property: "og:title", content: "Anarix MCP — Connect your stack to Amazon data" },
      { property: "og:description", content: "Use the Anarix MCP server to query your Amazon commerce data from any agent, notebook or internal tool." },
      { property: "og:url", content: "/products/mcp" },
    ],
    links: [{ rel: "canonical", href: "/products/mcp" }],
  }),
  component: McpPage,
});
