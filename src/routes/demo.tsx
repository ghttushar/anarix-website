import { createFileRoute } from "@tanstack/react-router";

import Demo from "@/website/pages/Demo";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Book a demo — See Anarix on your data | Anarix.ai" },
      { name: "description", content: "Walk through Anarix with a specialist and see profitability, ads and listing insights mapped to your catalogue." },
      { property: "og:title", content: "Book a demo — See Anarix on your data" },
      { property: "og:description", content: "Walk through Anarix with a specialist and see profitability, ads and listing insights mapped to your catalogue." },
      { property: "og:url", content: "/demo" },
    ],
    links: [{ rel: "canonical", href: "/demo" }],
  }),
  component: Demo,
});
