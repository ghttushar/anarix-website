import { createFileRoute } from "@tanstack/react-router";

import AanPage from "@/website/pages/AanPage";

export const Route = createFileRoute("/products/aan-ai")({
  head: () => ({
    meta: [
      { title: "Aan AI — Your Amazon growth copilot | Anarix" },
      { name: "description", content: "Aan AI answers account questions, drafts actions and monitors performance across your Amazon catalogue." },
      { property: "og:title", content: "Aan AI — Your Amazon growth copilot | Anarix" },
      { property: "og:description", content: "Aan AI answers account questions, drafts actions and monitors performance across your Amazon catalogue." },
      { property: "og:url", content: "/products/aan-ai" },
    ],
    links: [{ rel: "canonical", href: "/products/aan-ai" }],
  }),
  component: AanPage,
});
