import { createFileRoute } from "@tanstack/react-router";

import Home from "@/website/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anarix — Profit intelligence for Amazon sellers | Anarix.ai" },
      { name: "description", content: "Anarix unifies ads, listings and margins into one operating system so Amazon brands and agencies grow profit, not just revenue." },
      { property: "og:title", content: "Anarix — Profit intelligence for Amazon sellers" },
      { property: "og:description", content: "Anarix unifies ads, listings and margins into one operating system so Amazon brands and agencies grow profit, not just revenue." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});
