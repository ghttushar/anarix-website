import type { ArticleContent } from "./types";

const WORDS_PER_MINUTE = 200;

type DocNode = { text?: string; content?: DocNode[] };

function countWords(node: DocNode | undefined): number {
  if (!node) return 0;
  if (typeof node.text === "string") return node.text.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(node.content))
    return node.content.reduce((sum, child) => sum + countWords(child), 0);
  return 0;
}

/** Whole minutes, always at least 1 — matches the "N min read" convention used across the spec. */
export function estimateReadingTime(content: ArticleContent): number {
  const words = countWords(content as DocNode);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
