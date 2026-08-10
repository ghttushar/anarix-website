import { createFileRoute } from "@tanstack/react-router";

import Contact from "@/website/pages/company/Contact";

export const Route = createFileRoute("/company/contact")({
  head: () => ({
    meta: [
      { title: "Contact Anarix — Talk to our team" },
      { name: "description", content: "Questions about the platform, pricing or partnerships? Reach the Anarix team and get a same-day reply." },
      { property: "og:title", content: "Contact Anarix — Talk to our team" },
      { property: "og:description", content: "Questions about the platform, pricing or partnerships? Reach the Anarix team and get a same-day reply." },
      { property: "og:url", content: "/company/contact" },
    ],
    links: [{ rel: "canonical", href: "/company/contact" }],
  }),
  component: Contact,
});
