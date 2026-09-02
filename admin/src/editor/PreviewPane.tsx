import { useState } from "react";
import type { Article, Author } from "@blog-shared";
import { categoryLabel, estimateReadingTime, extractToc, renderArticleHtml } from "@blog-shared";

const WIDTHS: Record<"desktop" | "tablet" | "mobile", string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

function formatDate(iso: string | null): string {
  if (!iso) return "Not published yet";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Renders the article inline using the exact same shared rendering pipeline
 * (renderArticleHtml/extractToc) the public site would use — no iframe, no
 * server round trip, so this works with zero backend.
 */
export function PreviewPane({
  article,
  authors,
  onBack,
}: {
  article: Article;
  authors: Author[];
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const html = renderArticleHtml(article.content);
  const toc = extractToc(article.content);
  const readingTime = estimateReadingTime(article.content);
  const author = authors.find((a) => a.id === article.authorId);

  return (
    <div className="admin-editor">
      <div className="admin-preview-bar">
        <button type="button" className="admin-btn admin-btn--sm" onClick={onBack}>
          ← Back to editor
        </button>
        <div className="admin-preview-modes">
          {(["desktop", "tablet", "mobile"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`admin-btn admin-btn--sm ${mode === m ? "admin-btn--primary" : ""}`}
              onClick={() => setMode(m)}
            >
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-preview-frame-wrap">
        <div className="admin-preview-frame preview-article" style={{ width: WIDTHS[mode] }}>
          <p className="preview-article__eyebrow">{categoryLabel(article.category)}</p>
          <h1 className="preview-article__title">{article.title || "Untitled article"}</h1>
          {article.excerpt && <p className="preview-article__excerpt">{article.excerpt}</p>}
          <div className="preview-article__meta">
            {author && <span>{author.name}</span>}
            <span aria-hidden>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{readingTime} min read</span>
          </div>

          {article.heroImage && (
            <img
              className="preview-article__hero"
              src={article.heroImage.url}
              alt={article.heroImageAlt || article.title}
            />
          )}

          {toc.length > 0 && (
            <div className="preview-article__toc">
              <p className="preview-article__toc-title">On this page</p>
              <ul>
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "is-sub" : ""}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="preview-article__body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
