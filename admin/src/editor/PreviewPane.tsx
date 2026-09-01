import { useState } from "react";
import type { Article } from "@blog-shared";

const WIDTHS: Record<"desktop" | "tablet" | "mobile", string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function PreviewPane({ article, onBack }: { article: Article; onBack: () => void }) {
  const [mode, setMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const src = `/blog/preview/${article.id}?token=${article.previewToken}`;

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
        <iframe
          key={mode}
          title="Article preview"
          src={src}
          className="admin-preview-frame"
          style={{ width: WIDTHS[mode], height: "100%", minHeight: "82vh" }}
        />
      </div>
    </div>
  );
}
