import { createFileRoute } from "@tanstack/react-router";

import CaseStudies from "@/website/pages/CaseStudies";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case studies — Profit results from Anarix customers" },
      { name: "description", content: "How apparel, supplement and marketplace brands used Anarix to lift contribution profit and cut wasted ad spend." },
      { property: "og:title", content: "Case studies — Profit results from Anarix customers" },
      { property: "og:description", content: "How apparel, supplement and marketplace brands used Anarix to lift contribution profit and cut wasted ad spend." },
      { property: "og:url", content: "/case-studies" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudies,
});
