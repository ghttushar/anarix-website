import { useEffect, useState } from "react";
import { EditorContent } from "@tiptap/react";
import { Settings, X } from "lucide-react";
import type { Article, Author, Category } from "@blog-shared";
import { buildPublishingChecklist, canPublish, slugify } from "@blog-shared";

import { navigate } from "../router";
import { api } from "../api";
import { Toolbar } from "../editor/Toolbar";
import { SettingsPanel } from "../editor/SettingsPanel";
import { PublishingChecklist } from "../editor/PublishingChecklist";
import { PreviewPane } from "../editor/PreviewPane";
import { useArticleEditor } from "../editor/useArticleEditor";

export function Editor(props: { mode: "new" } | { mode: "edit"; articleId: string }) {
  useEffect(() => {
    if (props.mode === "new") {
      api.createArticle().then(({ article }) => navigate(`edit/${article.id}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (props.mode === "new") return <div className="admin-loading">Creating draft…</div>;
  return <EditorLoader articleId={props.articleId} />;
}

function EditorLoader({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getArticle(articleId), api.meta(), api.listArticles({})]).then(
      ([a, meta, list]) => {
        if (cancelled) return;
        setArticle(a.article);
        setCategories(meta.categories);
        setAuthors(meta.authors);
        setAllArticles(list.articles);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  if (!article) return <div className="admin-loading">Loading…</div>;

  return (
    <EditorWorkspace
      initialArticle={article}
      categories={categories}
      authors={authors}
      allArticles={allArticles}
    />
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function EditorWorkspace({
  initialArticle,
  categories,
  authors,
  allArticles,
}: {
  initialArticle: Article;
  categories: Category[];
  authors: Author[];
  allArticles: Article[];
}) {
  const [article, setArticle] = useState(initialArticle);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasPreviewed, setHasPreviewed] = useState(false);

  const editor = useArticleEditor(article.content, (content) => {
    setArticle((a) => ({ ...a, content }));
    setDirty(true);
  });

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function handleChange(patch: Partial<Article>) {
    setArticle((a) => ({ ...a, ...patch }));
    setDirty(true);
  }

  async function saveNow(current: Article = article): Promise<Article> {
    setSaving(true);
    try {
      const { article: saved } = await api.updateArticle(current.id, current);
      setArticle(saved);
      setDirty(false);
      return saved;
    } finally {
      setSaving(false);
    }
  }

  const checklist = buildPublishingChecklist(article, { hasPreviewed });
  const readyToPublish = canPublish(checklist);

  async function handlePublish() {
    if (!readyToPublish) {
      setShowSettings(true);
      return;
    }
    await saveNow();
    const { article: published } = await api.publish(article.id);
    setArticle(published);
  }

  async function handleUnpublish() {
    const { article: updated } = await api.unpublish(article.id);
    setArticle(updated);
  }

  async function openPreview() {
    await saveNow();
    setHasPreviewed(true);
    setPreviewOpen(true);
  }

  if (previewOpen) {
    return <PreviewPane article={article} authors={authors} onBack={() => setPreviewOpen(false)} />;
  }

  return (
    <div className="admin-editor">
      <header className="admin-editor__header">
        <button type="button" className="admin-btn admin-btn--sm" onClick={() => navigate("")}>
          ← Back
        </button>
        <div
          className="admin-editor__title-input"
          style={{ color: "var(--muted-foreground)", fontWeight: 500 }}
        >
          {article.title || "Untitled article"}
        </div>
        <div className="admin-editor__actions">
          <span className="admin-editor__saved-at">
            {dirty ? "Unsaved changes" : `Saved ${formatTime(article.lastSavedAt)}`}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            onClick={() => saveNow()}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" className="admin-btn admin-btn--sm" onClick={openPreview}>
            Preview
          </button>
          {article.status === "published" ? (
            <button type="button" className="admin-btn admin-btn--sm" onClick={handleUnpublish}>
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn--sm admin-btn--primary"
              onClick={handlePublish}
            >
              Publish
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--icon"
            title="Toggle settings"
            onClick={() => setShowSettings((v) => !v)}
          >
            {showSettings ? <X size={15} /> : <Settings size={15} />}
          </button>
        </div>
      </header>

      {editor && <Toolbar editor={editor} />}

      <div className="admin-editor__body">
        <div className="admin-editor__content">
          <div className="admin-editor__content-inner">
            <input
              className="admin-editor__title-field"
              placeholder="Article title"
              value={article.title}
              onChange={(e) => {
                const title = e.target.value;
                handleChange({ title, ...(article.slug ? {} : { slug: slugify(title) }) });
              }}
            />
            {editor && <EditorContent editor={editor} />}

            <div
              style={{
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <p style={{ fontWeight: 700, fontSize: "0.8125rem", marginBottom: "0.75rem" }}>
                Publishing checklist
              </p>
              <PublishingChecklist items={checklist} />
            </div>
          </div>
        </div>

        {showSettings && (
          <SettingsPanel
            article={article}
            onChange={handleChange}
            categories={categories}
            authors={authors}
            allArticles={allArticles}
          />
        )}
      </div>
    </div>
  );
}
