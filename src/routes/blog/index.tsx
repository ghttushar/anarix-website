import { createFileRoute } from "@tanstack/react-router";

import { getBlogListingData } from "@blog-shared";
import { BlogIndexPage } from "@/website/pages/blog/BlogIndexPage";

export const Route = createFileRoute("/blog/")({
  loader: () => getBlogListingData(),
  head: () => ({
    meta: [
      { title: "Blog, Amazon and Walmart growth insights | Anarix.ai" },
      {
        name: "description",
        content:
          "Practical breakdowns of Amazon, Walmart and retail media strategy from the team behind Anarix.",
      },
      { property: "og:title", content: "Anarix Blog, Amazon and Walmart growth insights" },
      {
        property: "og:description",
        content:
          "Practical breakdowns of Amazon, Walmart and retail media strategy from the team behind Anarix.",
      },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndexRoute,
});

function BlogIndexRoute() {
  const { articles, authors } = Route.useLoaderData();
  return <BlogIndexPage articles={articles} authors={authors} />;
}
