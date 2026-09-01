/** Renders the exact HTML the shared `renderArticleHtml()` pipeline produces — used by both the live article page and the preview route, so they never visually diverge. */
export function ArticleBody({ html }: { html: string }) {
  return <div className="ws-article-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
