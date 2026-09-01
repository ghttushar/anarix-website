import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";

import { buildArticleExtensions } from "./schema";
import { extractToc } from "./toc";
import type { ArticleContent } from "./types";

/**
 * Renders an article's Tiptap JSON to real, semantic HTML server-side (and in
 * the admin's full preview) — the exact same extension set the editor uses,
 * so the public page and the editor never disagree on markup.
 */
export function renderArticleHtml(content: ArticleContent): string {
  const extensions = buildArticleExtensions();
  const html = generateHTML(content as JSONContent, extensions);
  return injectHeadingIds(html, content);
}

/** Stamps the same ids `extractToc` computed onto the H2/H3 tags, in document order, so TOC links resolve. */
function injectHeadingIds(html: string, content: ArticleContent): string {
  const toc = extractToc(content);
  if (toc.length === 0) return html;

  let cursor = 0;
  return html.replace(/<h([23])>/g, (match, level: string) => {
    const item = toc[cursor];
    cursor += 1;
    return item ? `<h${level} id="${item.id}">` : match;
  });
}
