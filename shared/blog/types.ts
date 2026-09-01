// Framework-agnostic content model for the Anarix blog. Imported by both the
// main TanStack Start app (SSR rendering, storage) and the separate admin SPA
// (editing) via the `@blog-shared` alias — this file must never import
// anything React/DOM/Node-specific.

export type ArticleStatus = "draft" | "scheduled" | "published" | "archived";

export interface ImageCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect: number | null;
}

export interface ImageAsset {
  id: string;
  /** URL actually displayed (may be a cropped derivative). */
  url: string;
  /** Untouched original upload — cropping never deletes this. */
  originalUrl: string;
  crop: ImageCrop | null;
  width: number;
  height: number;
  createdAt: string;
}

export type ImageAlign = "left" | "center" | "right";
export type ImageWidth = "inline" | "medium" | "large" | "full";
export type ImageLayout = "within-text" | "between-paragraphs";

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
}

export interface Category {
  id: string;
  label: string;
}

export interface RelatedService {
  id: string;
  label: string;
  href: string;
  description: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

/** Tiptap document JSON — kept loosely typed here so this file has no editor dependency. */
export type ArticleContent = {
  type: "doc";
  content?: Array<Record<string, unknown>>;
};

export interface Article {
  id: string;
  /** Opaque token for the unpublished-preview URL; not a real auth mechanism. */
  previewToken: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ArticleContent;
  heroImage: ImageAsset | null;
  heroImageAlt: string;

  authorId: string;
  category: string;
  topics: string[];
  status: ArticleStatus;

  publishedAt: string | null;
  updatedAt: string;
  scheduledFor: string | null;

  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;

  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;

  relatedArticles: string[];
  relatedServices: string[];
  sources: SourceLink[];

  createdAt: string;
  lastSavedAt: string;
}

export const EMPTY_DOC: ArticleContent = { type: "doc", content: [{ type: "paragraph" }] };

export function createDraftArticle(id: string, now: string, previewToken: string): Article {
  return {
    id,
    previewToken,
    title: "",
    slug: "",
    excerpt: "",
    content: EMPTY_DOC,
    heroImage: null,
    heroImageAlt: "",
    authorId: "",
    category: "",
    topics: [],
    status: "draft",
    publishedAt: null,
    updatedAt: now,
    scheduledFor: null,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: null,
    relatedArticles: [],
    relatedServices: [],
    sources: [],
    createdAt: now,
    lastSavedAt: now,
  };
}
