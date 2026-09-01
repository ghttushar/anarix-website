import { ArrowRight } from "lucide-react";
import type { Article, Author } from "@blog-shared";
import { categoryLabel } from "@blog-shared";

import { Link } from "@/lib/router";
import { authorName, formatDate, readingTimeLabel } from "./format";

export function FeaturedArticleCard({ article, authors }: { article: Article; authors: Author[] }) {
  return (
    <Link to={`/blog/${article.slug}`} className="ws-featured-article group">
      <div className="ws-featured-article__media">
        {article.heroImage ? (
          <img src={article.heroImage.url} alt={article.heroImageAlt || article.title} />
        ) : (
          <div className="w-full h-full bg-dot-grid" />
        )}
      </div>
      <div className="ws-featured-article__body">
        <span className="ws-eyebrow w-fit">{categoryLabel(article.category)}</span>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-[1.15] tracking-tight text-foreground">
          {article.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{authorName(authors, article.authorId)}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{readingTimeLabel(article)}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-1">
          Read article
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
