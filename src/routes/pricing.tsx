import { createFileRoute } from "@tanstack/react-router";

import Pricing from "@/website/pages/Pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Plans for sellers, agencies and enterprises | Anarix.ai" },
      { name: "description", content: "Transparent Anarix pricing by operating model, with monthly and yearly plans and a free trial on every track." },
      { property: "og:title", content: "Pricing — Plans for sellers, agencies and enterprises | Anarix" },
      { property: "og:description", content: "Transparent Anarix pricing by operating model, with monthly and yearly plans and a free trial on every track." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});
