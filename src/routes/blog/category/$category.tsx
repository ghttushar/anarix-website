import { createFileRoute } from "@tanstack/react-router";
import { categoryLabel } from "@blog-shared";

import { getArticlesByCategory } from "@/lib/blog/server-fn";
import { BlogCategoryPage } from "@/website/pages/blog/BlogCategoryPage";

export const Route = createFileRoute("/blog/category/$category")({
  loader: ({ params }) => getArticlesByCategory({ data: params.category }),
  head: ({ params }) => {
    const label = categoryLabel(params.category);
    return {
      meta: [
        { title: `${label} articles | Anarix Blog` },
        { name: "description", content: `Anarix articles about ${label}.` },
        { property: "og:title", content: `${label} articles | Anarix Blog` },
        { property: "og:url", content: `/blog/category/${params.category}` },
      ],
      links: [{ rel: "canonical", href: `/blog/category/${params.category}` }],
    };
  },
  component: BlogCategoryRoute,
});

function BlogCategoryRoute() {
  const { category } = Route.useParams();
  const { articles, authors } = Route.useLoaderData();
  return <BlogCategoryPage category={category} articles={articles} authors={authors} />;
}
