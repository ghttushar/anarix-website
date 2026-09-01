import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPreviewArticle } from "@/lib/blog/server-fn";
import { BlogArticlePage } from "@/website/pages/blog/BlogArticlePage";

export const Route = createFileRoute("/blog/preview/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: async ({ params, deps }) => {
    const data = await getPreviewArticle({ data: { id: params.id, token: deps.token } });
    if (!data) throw notFound();
    return data;
  },
  head: () => ({
    meta: [{ title: "Preview | Anarix Blog" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: BlogPreviewRoute,
});

function BlogPreviewRoute() {
  const { article, authors, related, html, toc, readingTime } = Route.useLoaderData();
  return (
    <BlogArticlePage
      article={article}
      authors={authors}
      related={related}
      html={html}
      toc={toc}
      readingTime={readingTime}
      isPreview
    />
  );
}
