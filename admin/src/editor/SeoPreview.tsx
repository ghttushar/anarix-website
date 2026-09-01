export function SeoPreview({
  title,
  slug,
  description,
}: {
  title: string;
  slug: string;
  description: string;
}) {
  return (
    <div className="admin-seo-preview">
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "var(--muted-foreground)",
          marginBottom: "0.5rem",
        }}
      >
        Google Search Preview
      </p>
      <div className="admin-seo-preview__url">anarix.ai › blog › {slug || "your-article-slug"}</div>
      <div className="admin-seo-preview__title">{title || "Your SEO title will appear here"}</div>
      <div className="admin-seo-preview__desc">
        {description ||
          "Your meta description will appear here, summarizing the article for search results."}
      </div>
    </div>
  );
}
