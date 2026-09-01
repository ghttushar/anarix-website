import { extractToc } from "./toc";
import type { Article, ArticleContent } from "./types";

export interface ChecklistItem {
  key: string;
  label: string;
  required: boolean;
  ok: boolean;
  message?: string;
}

type DocNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: DocNode[];
};

function walk(content: ArticleContent, visit: (node: DocNode) => void) {
  const stack: DocNode[] = [...((content?.content ?? []) as DocNode[])];
  while (stack.length) {
    const node = stack.shift();
    if (!node) continue;
    visit(node);
    if (Array.isArray(node.content)) stack.push(...node.content);
  }
}

function hasContent(content: ArticleContent): boolean {
  let found = false;
  walk(content, (node) => {
    if (typeof node.text === "string" && node.text.trim()) found = true;
    if (node.type === "articleImage" || node.type === "videoEmbed") found = true;
  });
  return found;
}

function hasMissingImageAlt(content: ArticleContent): boolean {
  let missing = false;
  walk(content, (node) => {
    if (node.type === "articleImage" && !String(node.attrs?.alt ?? "").trim()) missing = true;
  });
  return missing;
}

function hasInternalLink(content: ArticleContent): boolean {
  let found = false;
  walk(content, (node) => {
    for (const mark of node.marks ?? []) {
      if (mark.type === "link" && String(mark.attrs?.href ?? "").startsWith("/")) found = true;
    }
  });
  return found;
}

/** Publishing checklist, spec §18 — only required items block publishing. */
export function buildPublishingChecklist(
  article: Article,
  opts: { hasPreviewed: boolean },
): ChecklistItem[] {
  const toc = extractToc(article.content);

  return [
    { key: "title", label: "Title", required: true, ok: !!article.title.trim() },
    { key: "slug", label: "Slug", required: true, ok: !!article.slug.trim() },
    { key: "content", label: "Article content", required: true, ok: hasContent(article.content) },
    { key: "author", label: "Author", required: true, ok: !!article.authorId },
    { key: "category", label: "Category", required: true, ok: !!article.category },
    {
      key: "excerpt",
      label: "Excerpt",
      required: false,
      ok: !!article.excerpt.trim(),
      message: "Add a short excerpt so listing cards read well.",
    },
    {
      key: "heroImage",
      label: "Hero image",
      required: false,
      ok: !!article.heroImage,
      message: "Add a hero image for the article header and listing card.",
    },
    {
      key: "seoTitle",
      label: "SEO title",
      required: false,
      ok: !!article.seoTitle.trim(),
      message: "Add an SEO title, or the article title will be used instead.",
    },
    {
      key: "metaDescription",
      label: "Meta description",
      required: false,
      ok: !!article.metaDescription.trim(),
      message: "Add a meta description, or the excerpt will be used instead.",
    },
    {
      key: "imageAlt",
      label: "Image alt text",
      required: false,
      ok: !hasMissingImageAlt(article.content),
      message: "One or more images are missing alt text.",
    },
    {
      key: "internalLinks",
      label: "Internal links",
      required: false,
      ok: hasInternalLink(article.content),
      message: "Consider linking to a related Anarix article or page.",
    },
    {
      key: "headings",
      label: "Article headings",
      required: false,
      ok: toc.length > 0,
      message: "Add H2/H3 headings so readers get a table of contents.",
    },
    {
      key: "socialImage",
      label: "Social image",
      required: false,
      ok: !!(article.ogImage || article.heroImage),
      message: "Add an Open Graph image, or the hero image will be used instead.",
    },
    {
      key: "previewChecked",
      label: "Preview checked",
      required: false,
      ok: opts.hasPreviewed,
      message: "Open Preview at least once before publishing.",
    },
  ];
}

export function canPublish(checklist: ChecklistItem[]): boolean {
  return checklist.filter((item) => item.required).every((item) => item.ok);
}
