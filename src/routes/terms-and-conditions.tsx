import { createFileRoute } from "@tanstack/react-router";

import TermsAndConditions from "@/website/pages/legal/TermsAndConditions";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Anarix.ai" },
      { name: "description", content: "The terms that govern use of the Anarix platform, website and related services." },
      { property: "og:title", content: "Terms and Conditions — Anarix" },
      { property: "og:description", content: "The terms that govern use of the Anarix platform, website and related services." },
      { property: "og:url", content: "/terms-and-conditions" },
    ],
    links: [{ rel: "canonical", href: "/terms-and-conditions" }],
  }),
  component: TermsAndConditions,
});
