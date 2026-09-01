import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import { api, type SearchResult } from "../api";

export function LinkPopover({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const existing = editor.getAttributes("link") as { href?: string; target?: string };
  const [tab, setTab] = useState<"url" | "search">("url");
  const [url, setUrl] = useState(existing.href ?? "");
  const [openInNewTab, setOpenInNewTab] = useState(existing.target === "_blank");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (tab !== "search") return;
    const timer = setTimeout(() => {
      api.search(query).then((res) => setResults(res.results));
    }, 200);
    return () => clearTimeout(timer);
  }, [query, tab]);

  function apply(href: string) {
    if (!href.trim()) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href, target: openInNewTab ? "_blank" : null })
      .run();
    onClose();
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  }

  return (
    <div
      className="admin-popover"
      style={{ position: "absolute", top: "2.5rem", left: 0 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${tab === "url" ? "is-active" : ""}`}
          onClick={() => setTab("url")}
        >
          URL
        </button>
        <button
          type="button"
          className={`admin-tab ${tab === "search" ? "is-active" : ""}`}
          onClick={() => setTab("search")}
        >
          Search Anarix content
        </button>
      </div>

      {tab === "url" ? (
        <>
          <label className="admin-label">URL</label>
          <input
            className="admin-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or /blog/…"
            autoFocus
          />
          <div className="admin-popover__row">
            <span>Open in new tab</span>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
              />
              <span className="admin-switch__track" />
              <span className="admin-switch__thumb" />
            </label>
          </div>
        </>
      ) : (
        <>
          <label className="admin-label">Search articles, services, pages…</label>
          <input
            className="admin-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="admin-popover__list">
            {results.map((r) => (
              <button
                key={r.href}
                type="button"
                className="admin-popover__list-item"
                onClick={() => apply(r.href)}
              >
                {r.label}
                <small>{r.href}</small>
              </button>
            ))}
            {results.length === 0 && query && (
              <p className="admin-field__hint" style={{ padding: "0.5rem 0" }}>
                No matches.
              </p>
            )}
          </div>
        </>
      )}

      <div className="admin-popover__actions">
        {existing.href && (
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--danger"
            onClick={removeLink}
          >
            Remove link
          </button>
        )}
        <button type="button" className="admin-btn admin-btn--sm" onClick={onClose}>
          Cancel
        </button>
        {tab === "url" && (
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--primary"
            onClick={() => apply(url)}
          >
            {existing.href ? "Update link" : "Add link"}
          </button>
        )}
      </div>
    </div>
  );
}
