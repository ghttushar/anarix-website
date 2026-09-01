// Server functions consumed by public route `loader()`s. TanStack Router
// loaders can re-run on the client during client-side navigation, so the
// filesystem-backed repository must never be called from a loader directly —
// `createServerFn` compiles each of these into a server-only handler, and
// TanStack Start strips the handler body (and everything it imports, incl.
// Tiptap's HTML generator) out of the client bundle, shipping only a small
// RPC stub. Rendering the article to HTML here — instead of in the browser —
// keeps the public bundle free of the editor's parsing runtime entirely.

import { createServerFn } from "@tanstack/react-start";
import { estimateReadingTime, extractToc, renderArticleHtml, type Article } from "@blog-shared";

import * as repo from "./repository.server";

function renderArticle(article: Article) {
  return {
    article,
    html: renderArticleHtml(article.content),
    toc: extractToc(article.content),
    readingTime: estimateReadingTime(article.content),
  };
}

async function resolveRelated(article: Article): Promise<Article[]> {
  const published = await repo.listPublishedArticles();
  const byId = new Map(published.map((a) => [a.id, a]));

  const explicit = article.relatedArticles
    .map((id) => byId.get(id))
    .filter((a): a is Article => !!a);
  if (explicit.length > 0) return explicit.slice(0, 3);

  return published
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);
}

export const getBlogListingData = createServerFn({ method: "GET", strict: false }).handler(
  async () => {
    const [articles, authors] = await Promise.all([
      repo.listPublishedArticles(),
      repo.listAuthors(),
    ]);
    return { articles, authors };
  },
);

export const getArticleBySlug = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const article = await repo.getArticleBySlug(slug);
    if (!article) return null;
    const [authors, related] = await Promise.all([repo.listAuthors(), resolveRelated(article)]);
    return { ...renderArticle(article), authors, related };
  });

export const getArticlesByCategory = createServerFn({ method: "GET", strict: false })
  .validator((category: string) => category)
  .handler(async ({ data: category }) => {
    const [articles, authors] = await Promise.all([
      repo.listArticles({ status: "published", category }),
      repo.listAuthors(),
    ]);
    return { articles, authors };
  });

export const getArticlesByAuthor = createServerFn({ method: "GET", strict: false })
  .validator((authorId: string) => authorId)
  .handler(async ({ data: authorId }) => {
    const [articles, authors] = await Promise.all([
      repo.listArticles({ status: "published", authorId }),
      repo.listAuthors(),
    ]);
    const author = authors.find((a) => a.id === authorId) ?? null;
    return { articles, authors, author };
  });

export const getPreviewArticle = createServerFn({ method: "GET", strict: false })
  .validator((input: { id: string; token: string }) => input)
  .handler(async ({ data }) => {
    const article = await repo.getArticleByPreviewToken(data.id, data.token);
    if (!article) return null;
    const [authors, related] = await Promise.all([repo.listAuthors(), resolveRelated(article)]);
    return { ...renderArticle(article), authors, related };
  });
