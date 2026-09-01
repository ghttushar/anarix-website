import { useState } from "react";

export function SocialPreview({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string | null;
}) {
  const [mode, setMode] = useState<"linkedin" | "og">("linkedin");

  return (
    <div>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "var(--muted-foreground)",
          marginBottom: "0.5rem",
        }}
      >
        Social Preview
      </p>
      <div className="admin-tabs" style={{ marginBottom: "0.625rem" }}>
        <button
          type="button"
          className={`admin-tab ${mode === "linkedin" ? "is-active" : ""}`}
          onClick={() => setMode("linkedin")}
        >
          LinkedIn
        </button>
        <button
          type="button"
          className={`admin-tab ${mode === "og" ? "is-active" : ""}`}
          onClick={() => setMode("og")}
        >
          Generic Open Graph
        </button>
      </div>
      <div className="admin-social-preview">
        <div
          className="admin-social-preview__image"
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        />
        <div className="admin-social-preview__body">
          <div className="admin-social-preview__site">anarix.ai</div>
          <div className="admin-social-preview__title">{title || "Article title"}</div>
          {mode === "og" && (
            <div className="admin-social-preview__desc">
              {description || "Short social description"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
