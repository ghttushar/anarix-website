import { useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Crop as CropIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import type { ArticleImageAttrs, ImageAlign, ImageLayout, ImageWidth } from "@blog-shared";

import { api } from "../api";
import { CropModal } from "./CropModal";

export function ArticleImageView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const attrs = node.attrs as ArticleImageAttrs;
  const [showCrop, setShowCrop] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setAlign(align: ImageAlign) {
    updateAttributes({ align });
  }
  function setWidth(width: ImageWidth) {
    updateAttributes({ width });
  }
  function setLayout(layout: ImageLayout) {
    updateAttributes({ layout });
  }

  async function handleReplaceFile(file: File) {
    setBusy(true);
    try {
      const { asset } = await api.upload(file);
      updateAttributes({ src: asset.url, originalSrc: asset.url });
    } finally {
      setBusy(false);
    }
  }

  async function handleCropApply(blob: Blob) {
    setBusy(true);
    try {
      const { asset } = await api.upload(blob);
      updateAttributes({ src: asset.url });
      setShowCrop(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <NodeViewWrapper
      className={`rte-image rte-image--align-${attrs.align} rte-image--width-${attrs.width} rte-image--layout-${attrs.layout}`}
      data-drag-handle
    >
      {selected && (
        <div className="rte-image__toolbar" contentEditable={false}>
          <button
            type="button"
            className={`rte-btn ${attrs.align === "left" ? "is-active" : ""}`}
            title="Align left"
            onClick={() => setAlign("left")}
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            className={`rte-btn ${attrs.align === "center" ? "is-active" : ""}`}
            title="Align center"
            onClick={() => setAlign("center")}
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            className={`rte-btn ${attrs.align === "right" ? "is-active" : ""}`}
            title="Align right"
            onClick={() => setAlign("right")}
          >
            <AlignRight size={14} />
          </button>
          <div className="rte-toolbar__sep" />
          <select
            className="rte-select"
            value={attrs.width}
            onChange={(e) => setWidth(e.target.value as ImageWidth)}
            title="Width"
          >
            <option value="inline">Inline</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="full">Full width</option>
          </select>
          <select
            className="rte-select"
            value={attrs.layout}
            onChange={(e) => setLayout(e.target.value as ImageLayout)}
            title="Position"
          >
            <option value="within-text">Within text</option>
            <option value="between-paragraphs">Between paragraphs</option>
          </select>
          <div className="rte-toolbar__sep" />
          <button
            type="button"
            className="rte-btn"
            title="Crop"
            onClick={() => setShowCrop(true)}
            disabled={busy}
          >
            <CropIcon size={14} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Replace"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
          >
            <RefreshCw size={14} />
          </button>
          <button type="button" className="rte-btn" title="Delete" onClick={() => deleteNode()}>
            <Trash2 size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleReplaceFile(file);
              e.target.value = "";
            }}
          />
        </div>
      )}

      <img src={attrs.src} alt={attrs.alt} />
      <input
        className="rte-image__caption-input"
        placeholder="Add a caption…"
        value={attrs.caption}
        contentEditable={false}
        onChange={(e) => updateAttributes({ caption: e.target.value })}
      />

      {selected && (
        <div
          style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
          contentEditable={false}
        >
          <input
            className="admin-input"
            placeholder="Alt text (required)"
            value={attrs.alt}
            onChange={(e) => updateAttributes({ alt: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="Link URL (optional)"
            value={attrs.href}
            onChange={(e) => updateAttributes({ href: e.target.value })}
          />
        </div>
      )}

      {showCrop && (
        <CropModal
          originalSrc={attrs.originalSrc || attrs.src}
          onCancel={() => setShowCrop(false)}
          onApply={handleCropApply}
        />
      )}
    </NodeViewWrapper>
  );
}
