import type { Article, Author } from "@blog-shared";
import { estimateReadingTime } from "@blog-shared";

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function authorName(authors: Author[], authorId: string): string {
  return authors.find((a) => a.id === authorId)?.name ?? "Anarix Team";
}

export function readingTimeLabel(article: Pick<Article, "content">): string {
  return `${estimateReadingTime(article.content)} min read`;
}
