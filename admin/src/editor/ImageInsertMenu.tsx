import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Image as ImageIcon } from "lucide-react";
import type { ImageAsset } from "@blog-shared";

import { api } from "../api";

function insertImage(editor: Editor, src: string) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "articleImage",
      attrs: {
        src,
        originalSrc: src,
        alt: "",
        caption: "",
        credit: "",
        href: "",
        align: "center",
        width: "large",
        layout: "between-paragraphs",
      },
    })
    .run();
}

export function ImageInsertMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"upload" | "existing" | "url">("upload");
  const [uploads, setUploads] = useState<ImageAsset[]>([]);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && tab === "existing") api.listUploads().then((res) => setUploads(res.uploads));
  }, [open, tab]);

  async function handleFile(file: File) {
    const { asset } = await api.upload(file);
    insertImage(editor, asset.url);
    setOpen(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="rte-btn"
        title="Insert image"
        onClick={() => setOpen((v) => !v)}
      >
        <ImageIcon size={15} />
      </button>
      {open && (
        <div
          className="admin-popover"
          style={{ position: "absolute", top: "2.5rem", left: 0, width: 320 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${tab === "upload" ? "is-active" : ""}`}
              onClick={() => setTab("upload")}
            >
              Upload
            </button>
            <button
              type="button"
              className={`admin-tab ${tab === "existing" ? "is-active" : ""}`}
              onClick={() => setTab("existing")}
            >
              Choose existing
            </button>
            <button
              type="button"
              className={`admin-tab ${tab === "url" ? "is-active" : ""}`}
              onClick={() => setTab("url")}
            >
              Paste URL
            </button>
          </div>

          {tab === "upload" && (
            <div>
              <button
                type="button"
                className="admin-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose file…
              </button>
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
            </div>
          )}

          {tab === "existing" && (
            <div className="admin-upload-grid">
              {uploads.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    insertImage(editor, u.url);
                    setOpen(false);
                  }}
                >
                  <img src={u.url} alt="" />
                </button>
              ))}
              {uploads.length === 0 && <p className="admin-field__hint">No uploads yet.</p>}
            </div>
          )}

          {tab === "url" && (
            <div>
              <input
                className="admin-input"
                placeholder="https://…"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
              />
              <div className="admin-popover__actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--primary"
                  onClick={() => {
                    insertImage(editor, urlValue);
                    setOpen(false);
                  }}
                  disabled={!urlValue.trim()}
                >
                  Insert
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
