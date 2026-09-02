import { useEffect, useMemo, useState } from "react";
import type { Article, ArticleStatus, Author, Category } from "@blog-shared";

import { navigate } from "../router";
import { api } from "../api";

const STATUSES: ArticleStatus[] = ["draft", "scheduled", "published", "archived"];

function StatusBadge({ status }: { status: ArticleStatus }) {
  return <span className={`admin-badge admin-badge--${status}`}>{status}</span>;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogList() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ArticleStatus | "">("");
  const [category, setCategory] = useState("");
  const [sortDir, setSortDir] = useState<"newest" | "oldest">("newest");

  async function reload() {
    const [{ articles: list }, meta] = await Promise.all([
      api.listArticles({
        status: status || undefined,
        category: category || undefined,
        search: search || undefined,
      }),
      api.meta(),
    ]);
    setArticles(list);
    setCategories(meta.categories);
    setAuthors(meta.authors);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, category]);

  const sorted = useMemo(() => {
    if (!articles) return [];
    const copy = [...articles];
    copy.sort((a, b) =>
      sortDir === "newest"
        ? b.updatedAt.localeCompare(a.updatedAt)
        : a.updatedAt.localeCompare(b.updatedAt),
    );
    return copy;
  }, [articles, sortDir]);

  function categoryLabel(id: string): string {
    return categories.find((c) => c.id === id)?.label ?? id;
  }
  function authorName(id: string): string {
    return authors.find((a) => a.id === id)?.name ?? "—";
  }

  async function handleCreate() {
    const { article } = await api.createArticle();
    navigate(`edit/${article.id}`);
  }

  async function handleDelete(article: Article) {
    if (!window.confirm(`Delete "${article.title || "Untitled"}"? This cannot be undone.`)) return;
    await api.deleteArticle(article.id);
    reload();
  }

  async function handleDuplicate(article: Article) {
    const { article: copy } = await api.duplicate(article.id);
    navigate(`edit/${copy.id}`);
  }

  async function handleTogglePublish(article: Article) {
    if (article.status === "published") await api.unpublish(article.id);
    else await api.publish(article.id);
    reload();
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          Anarix <span>Blog Admin</span>
        </div>
        <a href="/blog" target="_blank" rel="noreferrer" className="admin-btn admin-btn--sm">
          View public blog ↗
        </a>
      </header>

      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Articles</h1>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleCreate}>
            + New article
          </button>
        </div>

        <div className="admin-toolbar-row">
          <input
            className="admin-input"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus | "")}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="admin-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className="admin-select"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="admin-card">
          {!articles ? (
            <div className="admin-loading">Loading…</div>
          ) : sorted.length === 0 ? (
            <div className="admin-empty">No articles match these filters.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Published</th>
                  <th>Last edited</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sorted.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <button
                        type="button"
                        className="admin-table__title"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          font: "inherit",
                          color: "inherit",
                        }}
                        onClick={() => navigate(`edit/${article.id}`)}
                      >
                        {article.title || "Untitled draft"}
                      </button>
                    </td>
                    <td>
                      <StatusBadge status={article.status} />
                    </td>
                    <td>{categoryLabel(article.category)}</td>
                    <td>{authorName(article.authorId)}</td>
                    <td>{formatDate(article.publishedAt)}</td>
                    <td>{formatDate(article.updatedAt)}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm"
                          onClick={() => navigate(`edit/${article.id}`)}
                        >
                          Edit
                        </button>
                        {article.status === "published" ? (
                          <a
                            className="admin-btn admin-btn--sm"
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Preview
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm"
                            onClick={() => navigate(`edit/${article.id}`)}
                            title="Open the editor, then use Preview there"
                          >
                            Preview
                          </button>
                        )}
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm"
                          onClick={() => handleDuplicate(article)}
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm"
                          onClick={() => handleTogglePublish(article)}
                        >
                          {article.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          onClick={() => handleDelete(article)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
