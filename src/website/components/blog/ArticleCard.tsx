import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Article, Author } from "@blog-shared";
import { categoryLabel } from "@blog-shared";

import { Link } from "@/lib/router";
import { authorName, formatDate, readingTimeLabel } from "./format";

export function ArticleCard({
  article,
  authors,
  index = 0,
}: {
  article: Article;
  authors: Author[];
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
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
          <span className="ws-article-badge absolute top-3 left-3 z-[1]">
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
            <span className="ws-article-card__arrow">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
