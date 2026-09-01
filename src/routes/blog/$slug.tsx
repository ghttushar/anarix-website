import { createFileRoute, notFound } from "@tanstack/react-router";

import { getArticleBySlug } from "@/lib/blog/server-fn";
import { BlogArticlePage } from "@/website/pages/blog/BlogArticlePage";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const data = await getArticleBySlug({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { article } = loaderData;
    const title = article.seoTitle || `${article.title} | Anarix.ai`;
    const description = article.metaDescription || article.excerpt;
    const ogImage = article.ogImage || article.heroImage?.url;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: article.ogTitle || article.title },
        { property: "og:description", content: article.ogDescription || description },
        { property: "og:url", content: `/blog/${article.slug}` },
        ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
        { property: "article:published_time", content: article.publishedAt ?? "" },
        { property: "article:modified_time", content: article.updatedAt },
        {
          name: "robots",
          content: `${article.robotsIndex ? "index" : "noindex"}, ${article.robotsFollow ? "follow" : "nofollow"}`,
        },
      ],
      links: [{ rel: "canonical", href: article.canonicalUrl || `/blog/${article.slug}` }],
    };
  },
  component: BlogArticleRoute,
});

function BlogArticleRoute() {
  const { article, authors, related, html, toc, readingTime } = Route.useLoaderData();
  return (
    <BlogArticlePage
      article={article}
      authors={authors}
      related={related}
      html={html}
      toc={toc}
      readingTime={readingTime}
    />
  );
}
