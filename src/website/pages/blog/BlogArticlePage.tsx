import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Article, Author, TocItem } from "@blog-shared";
import { categoryLabel } from "@blog-shared";

import { Link } from "@/lib/router";
import PageLayout from "@/website/components/PageLayout";
import { ArticleBody } from "@/website/components/blog/ArticleBody";
import { AuthorBioCard } from "@/website/components/blog/AuthorBioCard";
import { BlogCta } from "@/website/components/blog/BlogCta";
import { ReadingProgress } from "@/website/components/blog/ReadingProgress";
import { RelatedArticles } from "@/website/components/blog/RelatedArticles";
import {
  TableOfContentsDesktop,
  TableOfContentsMobile,
} from "@/website/components/blog/TableOfContents";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/website/components/blog/StructuredData";
import { authorName, formatDate, readingTimeLabel } from "@/website/components/blog/format";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface BlogArticlePageProps {
  article: Article;
  authors: Author[];
  related: Article[];
  html: string;
  toc: TocItem[];
  readingTime: number;
  isPreview?: boolean;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function BlogArticlePage({
  article,
  authors,
  related,
  html,
  toc,
  readingTime,
  isPreview,
}: BlogArticlePageProps) {
  const author = authors.find((a) => a.id === article.authorId);
  const showUpdated =
    article.publishedAt && article.updatedAt.slice(0, 10) !== article.publishedAt.slice(0, 10);

  return (
    <PageLayout>
      {!isPreview && <ReadingProgress />}

      {isPreview && (
        <div className="container-page px-6 mb-6">
          <div className="ws-callout ws-callout--warning">
            <div className="ws-callout__body">
              <p className="text-sm font-semibold text-foreground">Preview mode</p>
              <p className="text-sm text-muted-foreground">
                This is an unpublished draft. It is not listed publicly and is marked noindex.
              </p>
            </div>
          </div>
        </div>
      )}

      <article className="container-page px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-6"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to={`/blog/category/${article.category}`}
            className="hover:text-foreground transition-colors"
          >
            {categoryLabel(article.category)}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate max-w-[240px]">{article.title}</span>
        </nav>

        <motion.header
          className="max-w-[760px] mb-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link to={`/blog/category/${article.category}`} className="ws-eyebrow">
            {categoryLabel(article.category)}
          </Link>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-muted-foreground">
            {author && (
              <>
                <span className="ws-meta-avatar">
                  {author.avatarUrl ? (
                    <img src={author.avatarUrl} alt="" />
                  ) : (
                    initials(authorName(authors, article.authorId))
                  )}
                </span>
                <span className="text-foreground font-medium">
                  {authorName(authors, article.authorId)}
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            {showUpdated && (
              <>
                <span aria-hidden>·</span>
                <span>Updated {formatDate(article.updatedAt)}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{readingTime} min read</span>
          </div>
        </motion.header>

        {article.heroImage && (
          <motion.div
            className="max-w-[960px] mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <img
              src={article.heroImage.url}
              alt={article.heroImageAlt || article.title}
              className="w-full h-auto rounded-3xl border border-border shadow-strong"
            />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-x-16 items-start">
          <div className="max-w-[680px] min-w-0">
            <TableOfContentsMobile items={toc} />
            <ArticleBody html={html} />

            {article.sources.length > 0 && (
              <div className="mt-12 pt-6 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  Sources
                </p>
                <ul className="space-y-1">
                  {article.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {author && (
              <div className="mt-12">
                <AuthorBioCard author={author} />
              </div>
            )}
          </div>

          <TableOfContentsDesktop items={toc} />
        </div>
      </article>

      <div className="container-page px-6 mt-16 space-y-12">
        <RelatedArticles articles={related} authors={authors} />
        <BlogCta serviceId={article.relatedServices[0]} />
      </div>

      {!isPreview && (
        <>
          <ArticleStructuredData article={article} authorName={author?.name ?? "Anarix Team"} />
          <BreadcrumbStructuredData
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: categoryLabel(article.category), path: `/blog/category/${article.category}` },
              { name: article.title, path: `/blog/${article.slug}` },
            ]}
          />
        </>
      )}
    </PageLayout>
  );
}
