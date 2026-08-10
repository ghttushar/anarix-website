import { createFileRoute } from "@tanstack/react-router";

import Career from "@/website/pages/company/Career";

export const Route = createFileRoute("/company/career")({
  head: () => ({
    meta: [
      { title: "Careers at Anarix — Build the profit OS | Anarix.ai" },
      { name: "description", content: "Open roles at Anarix across engineering, data and go-to-market. Remote-friendly and operator-obsessed." },
      { property: "og:title", content: "Careers at Anarix — Build the profit OS" },
      { property: "og:description", content: "Open roles at Anarix across engineering, data and go-to-market. Remote-friendly and operator-obsessed." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:url", content: "/company/career" },
    ],
    links: [{ rel: "canonical", href: "/company/career" }],
  }),
  component: Career,
});
