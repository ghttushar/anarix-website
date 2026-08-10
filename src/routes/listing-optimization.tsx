import { createFileRoute } from "@tanstack/react-router";

import ListingOptimization from "@/website/pages/ListingOptimization";

export const Route = createFileRoute("/listing-optimization")({
  head: () => ({
    meta: [
      { title: "Listing optimization — Rank and convert better | Anarix" },
      { name: "description", content: "Audit and improve Amazon listings with keyword, content and imagery guidance driven by Anarix data." },
      { property: "og:title", content: "Listing optimization — Rank and convert better | Anarix" },
      { property: "og:description", content: "Audit and improve Amazon listings with keyword, content and imagery guidance driven by Anarix data." },
      { property: "og:url", content: "/listing-optimization" },
    ],
    links: [{ rel: "canonical", href: "/listing-optimization" }],
  }),
  component: ListingOptimization,
});
