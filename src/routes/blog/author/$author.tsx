import { createFileRoute } from "@tanstack/react-router";

import { getArticlesByAuthor } from "@/lib/blog/server-fn";
import { BlogAuthorPage } from "@/website/pages/blog/BlogAuthorPage";

export const Route = createFileRoute("/blog/author/$author")({
  loader: ({ params }) => getArticlesByAuthor({ data: params.author }),
  head: ({ loaderData, params }) => {
    const name = loaderData?.author?.name ?? "Author";
    return {
      meta: [
        { title: `${name} | Anarix Blog` },
        { name: "description", content: `Articles written by ${name} on the Anarix blog.` },
        { property: "og:title", content: `${name} | Anarix Blog` },
        { property: "og:url", content: `/blog/author/${params.author}` },
      ],
      links: [{ rel: "canonical", href: `/blog/author/${params.author}` }],
    };
  },
  component: BlogAuthorRoute,
});

function BlogAuthorRoute() {
  const { author, articles, authors } = Route.useLoaderData();
  return <BlogAuthorPage author={author} articles={articles} authors={authors} />;
}
