import type { ArticleContent } from "./types";
import { slugify } from "./slug";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

type DocNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
};

function extractText(node: DocNode | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.content)) return node.content.map(extractText).join("");
  return "";
}

/** Walks the Tiptap doc for H2/H3 headings and builds stable, deduped anchor ids. */
export function extractToc(content: ArticleContent): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  const nodes = (content?.content ?? []) as DocNode[];

  for (const node of nodes) {
    const level = node.type === "heading" ? (node.attrs?.level as number | undefined) : undefined;
    if (level !== 2 && level !== 3) continue;

    const text = extractText(node).trim();
    if (!text) continue;

    let id = slugify(text) || "section";
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    items.push({ id, text, level: level as 2 | 3 });
  }

  return items;
}
