import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Article, Author } from "@blog-shared";
import { categoryLabel } from "@blog-shared";

import { Link } from "@/lib/router";
import { authorName, formatDate, readingTimeLabel } from "./format";

export function FeaturedArticleCard({ article, authors }: { article: Article; authors: Author[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/blog/${article.slug}`} className="ws-featured-article group">
        <div className="ws-featured-article__media">
          {article.heroImage ? (
            <img src={article.heroImage.url} alt={article.heroImageAlt || article.title} />
          ) : (
            <div className="w-full h-full bg-dot-grid" />
          )}
          <span className="ws-article-badge ws-featured-article__badge">
            {categoryLabel(article.category)}
          </span>
        </div>
        <div className="ws-featured-article__body">
          <span className="ws-eyebrow w-fit">Featured</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-[1.1] tracking-tight text-foreground">
            {article.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{article.excerpt}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {authorName(authors, article.authorId)}
            </span>
            <span aria-hidden>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{readingTimeLabel(article)}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-2 w-fit">
            Read article
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
