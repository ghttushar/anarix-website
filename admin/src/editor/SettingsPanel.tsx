import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { Article, ArticleStatus, Author, Category } from "@blog-shared";
import { estimateReadingTime, slugify } from "@blog-shared";

import { api } from "../api";
import { SeoPreview } from "./SeoPreview";
import { SocialPreview } from "./SocialPreview";

type Patch = Partial<Article>;

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="admin-settings-section" open={defaultOpen}>
      <summary>
        {title}
        <ChevronDown size={16} className="chev" />
      </summary>
      {children}
    </details>
  );
}

function HeroImageField({
  article,
  onChange,
}: {
  article: Article;
  onChange: (patch: Patch) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const { asset } = await api.upload(file);
    onChange({ heroImage: asset });
  }

  return (
    <div className="admin-field">
      <label className="admin-label">Hero image</label>
      {article.heroImage ? (
        <div style={{ marginBottom: "0.5rem" }}>
          <img
            src={article.heroImage.url}
            alt=""
            style={{ width: "100%", borderRadius: 8, border: "1px solid var(--border)" }}
          />
        </div>
      ) : null}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => fileInputRef.current?.click()}
        >
          {article.heroImage ? "Replace" : "Upload"}
        </button>
        {article.heroImage && (
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--danger"
            onClick={() => onChange({ heroImage: null })}
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      {article.heroImage && (
        <input
          className="admin-input"
          style={{ marginTop: "0.5rem" }}
          placeholder="Alt text (required before publishing looks its best)"
          value={article.heroImageAlt}
          onChange={(e) => onChange({ heroImageAlt: e.target.value })}
        />
      )}
    </div>
  );
}

export function SettingsPanel({
  article,
  onChange,
  categories,
  authors,
  allArticles,
}: {
  article: Article;
  onChange: (patch: Patch) => void;
  categories: Category[];
  authors: Author[];
  allArticles: Article[];
}) {
  const readingTime = estimateReadingTime(article.content);

  function toggleTopic(id: string) {
    const topics = article.topics.includes(id)
      ? article.topics.filter((t) => t !== id)
      : [...article.topics, id];
    onChange({ topics });
  }

  function toggleRelatedArticle(id: string) {
    const related = article.relatedArticles.includes(id)
      ? article.relatedArticles.filter((r) => r !== id)
      : [...article.relatedArticles, id];
    onChange({ relatedArticles: related });
  }

  return (
    <div className="admin-settings-panel">
      <Section title="Publishing" defaultOpen>
        <div className="admin-field">
          <label className="admin-label">Status</label>
          <select
            className="admin-select"
            value={article.status}
            onChange={(e) => onChange({ status: e.target.value as ArticleStatus })}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="admin-field">
          <label className="admin-label">Author</label>
          <select
            className="admin-select"
            value={article.authorId}
            onChange={(e) => onChange({ authorId: e.target.value })}
          >
            <option value="">Select an author…</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label className="admin-label">Category</label>
          <select
            className="admin-select"
            value={article.category}
            onChange={(e) => onChange({ category: e.target.value })}
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        {article.status === "scheduled" && (
          <div className="admin-field">
            <label className="admin-label">Schedule publishing</label>
            <input
              className="admin-input"
              type="datetime-local"
              value={article.scheduledFor ? article.scheduledFor.slice(0, 16) : ""}
              onChange={(e) =>
                onChange({
                  scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
            />
          </div>
        )}
        <div className="admin-field">
          <label className="admin-label">Publish date</label>
          <p className="admin-field__hint" style={{ marginTop: 0 }}>
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleString()
              : "Not published yet"}
          </p>
        </div>
        <div className="admin-field">
          <label className="admin-label">Last updated</label>
          <p className="admin-field__hint" style={{ marginTop: 0 }}>
            {new Date(article.updatedAt).toLocaleString()}
          </p>
        </div>
      </Section>

      <Section title="Article">
        <div className="admin-field">
          <label className="admin-label">Slug</label>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            <input
              className="admin-input"
              value={article.slug}
              onChange={(e) => onChange({ slug: slugify(e.target.value) })}
            />
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={() => onChange({ slug: slugify(article.title) })}
            >
              Auto
            </button>
          </div>
        </div>
        <div className="admin-field">
          <label className="admin-label">Excerpt</label>
          <textarea
            className="admin-textarea"
            value={article.excerpt}
            onChange={(e) => onChange({ excerpt: e.target.value })}
          />
        </div>
        <HeroImageField article={article} onChange={onChange} />
        <div className="admin-field">
          <label className="admin-label">Reading time</label>
          <p className="admin-field__hint" style={{ marginTop: 0 }}>
            {readingTime} min read (calculated automatically)
          </p>
        </div>
      </Section>

      <Section title="SEO">
        <div className="admin-field">
          <label className="admin-label">SEO title ({article.seoTitle.length}/60)</label>
          <input
            className="admin-input"
            value={article.seoTitle}
            placeholder={article.title}
            onChange={(e) => onChange({ seoTitle: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">
            Meta description ({article.metaDescription.length}/160)
          </label>
          <textarea
            className="admin-textarea"
            value={article.metaDescription}
            placeholder={article.excerpt}
            onChange={(e) => onChange({ metaDescription: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Canonical URL</label>
          <input
            className="admin-input"
            value={article.canonicalUrl}
            placeholder={`/blog/${article.slug || "…"}`}
            onChange={(e) => onChange({ canonicalUrl: e.target.value })}
          />
        </div>
        <div className="admin-popover__row" style={{ marginTop: 0 }}>
          <span>Index</span>
          <label className="admin-switch">
            <input
              type="checkbox"
              checked={article.robotsIndex}
              onChange={(e) => onChange({ robotsIndex: e.target.checked })}
            />
            <span className="admin-switch__track" />
            <span className="admin-switch__thumb" />
          </label>
        </div>
        <div className="admin-popover__row">
          <span>Follow</span>
          <label className="admin-switch">
            <input
              type="checkbox"
              checked={article.robotsFollow}
              onChange={(e) => onChange({ robotsFollow: e.target.checked })}
            />
            <span className="admin-switch__track" />
            <span className="admin-switch__thumb" />
          </label>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <SeoPreview
            title={article.seoTitle || article.title}
            slug={article.slug}
            description={article.metaDescription || article.excerpt}
          />
        </div>
      </Section>

      <Section title="Social">
        <div className="admin-field">
          <label className="admin-label">Open Graph title</label>
          <input
            className="admin-input"
            value={article.ogTitle}
            placeholder={article.title}
            onChange={(e) => onChange({ ogTitle: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Open Graph description</label>
          <textarea
            className="admin-textarea"
            value={article.ogDescription}
            placeholder={article.excerpt}
            onChange={(e) => onChange({ ogDescription: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Open Graph image URL</label>
          <input
            className="admin-input"
            value={article.ogImage ?? ""}
            placeholder={article.heroImage?.url ?? "Falls back to hero image"}
            onChange={(e) => onChange({ ogImage: e.target.value || null })}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <SocialPreview
            title={article.ogTitle || article.title}
            description={article.ogDescription || article.excerpt}
            image={article.ogImage || article.heroImage?.url || null}
          />
        </div>
      </Section>

      <Section title="Organization">
        <div className="admin-field">
          <label className="admin-label">Secondary topics</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {categories
              .filter((c) => c.id !== article.category)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`admin-btn admin-btn--sm ${article.topics.includes(c.id) ? "admin-btn--primary" : ""}`}
                  onClick={() => toggleTopic(c.id)}
                >
                  {c.label}
                </button>
              ))}
          </div>
        </div>
        <div className="admin-field">
          <label className="admin-label">Related articles</label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              maxHeight: 160,
              overflowY: "auto",
            }}
          >
            {allArticles
              .filter((a) => a.id !== article.id)
              .map((a) => (
                <label
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.8125rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={article.relatedArticles.includes(a.id)}
                    onChange={() => toggleRelatedArticle(a.id)}
                  />
                  {a.title || "Untitled draft"}
                </label>
              ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
