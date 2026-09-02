// Pure, synchronous queries over the static mock data — safe to call from
// either the public site's route loaders or the admin SPA. No I/O of any kind.
import { estimateReadingTime } from "./reading-time";
import { extractToc } from "./toc";
import { renderArticleHtml } from "./render";
import { MOCK_ARTICLES, MOCK_AUTHORS } from "./mock";
import type { Article } from "./types";

function published(): Article[] {
  return MOCK_ARTICLES.filter((a) => a.status === "published").sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
}

function renderArticle(article: Article) {
  return {
    article,
    html: renderArticleHtml(article.content),
    toc: extractToc(article.content),
    readingTime: estimateReadingTime(article.content),
  };
}

function resolveRelated(article: Article): Article[] {
  const pool = published();
  const explicit = article.relatedArticles
    .map((id) => pool.find((a) => a.id === id))
    .filter((a): a is Article => !!a);
  if (explicit.length > 0) return explicit.slice(0, 3);
  return pool.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
}

export function getBlogListingData() {
  return { articles: published(), authors: MOCK_AUTHORS };
}

export function getArticleBySlug(slug: string) {
  const article = published().find((a) => a.slug === slug);
  if (!article) return null;
  return { ...renderArticle(article), authors: MOCK_AUTHORS, related: resolveRelated(article) };
}

export function getArticlesByCategory(category: string) {
  return { articles: published().filter((a) => a.category === category), authors: MOCK_AUTHORS };
}

export function getArticlesByAuthor(authorId: string) {
  const author = MOCK_AUTHORS.find((a) => a.id === authorId) ?? null;
  return {
    articles: published().filter((a) => a.authorId === authorId),
    authors: MOCK_AUTHORS,
    author,
  };
}
