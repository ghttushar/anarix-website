import { createFileRoute } from "@tanstack/react-router";

import About from "@/website/pages/company/About";

export const Route = createFileRoute("/company/about")({
  head: () => ({
    meta: [
      { title: "About Anarix — The team behind the profit OS" },
      { name: "description", content: "Anarix builds the profitability operating system for Amazon brands. Meet the team and the thinking behind it." },
      { property: "og:title", content: "About Anarix — The team behind the profit OS" },
      { property: "og:description", content: "Anarix builds the profitability operating system for Amazon brands. Meet the team and the thinking behind it." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:url", content: "/company/about" },
    ],
    links: [{ rel: "canonical", href: "/company/about" }],
  }),
  component: About,
});
