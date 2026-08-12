import { createFileRoute } from "@tanstack/react-router";

import SignalsPage from "@/website/pages/SignalsPage";

export const Route = createFileRoute("/products/signals")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Signals, Real-time Amazon alerts | Anarix.ai" },
      { name: "description", content: "Signals watches listings, buy box, pricing and spend so your team hears about problems before they cost margin." },
      { property: "og:title", content: "Signals, Real-time Amazon alerts | Anarix" },
      { property: "og:description", content: "Signals watches listings, buy box, pricing and spend so your team hears about problems before they cost margin." },
      { property: "og:url", content: "/products/signals" },
    ],
    links: [{ rel: "canonical", href: "/products/signals" }],
  }),
  component: SignalsPage,
});
