import { createFileRoute } from "@tanstack/react-router";

import PrivacyPolicy from "@/website/pages/legal/PrivacyPolicy";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Anarix" },
      { name: "description", content: "How Anarix collects, uses, stores and protects data across the platform and marketing site." },
      { property: "og:title", content: "Privacy Policy — Anarix" },
      { property: "og:description", content: "How Anarix collects, uses, stores and protects data across the platform and marketing site." },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicy,
});
