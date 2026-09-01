import type { Article, Author } from "@blog-shared";
import { categoryLabel } from "@blog-shared";

import { Link } from "@/lib/router";
import { authorName, formatDate, readingTimeLabel } from "./format";

export function ArticleCard({ article, authors }: { article: Article; authors: Author[] }) {
  return (
    <Link to={`/blog/${article.slug}`} className="ws-article-card group">
      <div className="ws-article-card__media">
        {article.heroImage ? (
          <img
            src={article.heroImage.url}
            alt={article.heroImageAlt || article.title}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-dot-grid" />
        )}
        <span className="ws-eyebrow absolute top-3 left-3 bg-surface-elevated/90 backdrop-blur-sm">
          {categoryLabel(article.category)}
        </span>
      </div>
      <div className="ws-article-card__body">
        <h3 className="ws-article-card__title text-lg">{article.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <div className="ws-article-card__meta">
          <span>{authorName(authors, article.authorId)}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{readingTimeLabel(article)}</span>
        </div>
      </div>
    </Link>
  );
}
