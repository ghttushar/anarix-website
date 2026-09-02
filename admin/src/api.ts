// Pure frontend mock — no server, no network, no persistence. Everything
// lives in memory for the current tab session (resets on reload) and image
// "uploads" are just local object URLs. This intentionally mirrors the
// shape of a real API client so the rest of the admin UI doesn't need to
// know the difference.
import {
  CATEGORIES,
  MOCK_ARTICLES,
  MOCK_AUTHORS,
  createDraftArticle,
  type Article,
  type ArticleStatus,
  type Author,
  type Category,
  type ImageAsset,
} from "@blog-shared";

const STATIC_PAGES = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/products" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/company/contact" },
  { label: "Blog", href: "/blog" },
];

export interface SearchResult {
  label: string;
  href: string;
  type: "article" | "page";
}

let articles: Article[] = MOCK_ARTICLES.map((a) => ({ ...a }));
let uploads: ImageAsset[] = [];

function resolve<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function now(): string {
  return new Date().toISOString();
}

function loadImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res({ width: img.naturalWidth || 1200, height: img.naturalHeight || 800 });
    img.onerror = () => res({ width: 1200, height: 800 });
    img.src = url;
  });
}

export const api = {
  listArticles: (filter: { status?: ArticleStatus; category?: string; search?: string } = {}) => {
    const q = filter.search?.toLowerCase().trim();
    const result = articles.filter((a) => {
      if (filter.status && a.status !== filter.status) return false;
      if (filter.category && a.category !== filter.category) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.slug.toLowerCase().includes(q))
        return false;
      return true;
    });
    return resolve({ articles: result });
  },

  getArticle: (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) throw new Error(`Article not found: ${id}`);
    return resolve({ article });
  },

  createArticle: () => {
    const article = createDraftArticle(crypto.randomUUID(), now(), crypto.randomUUID());
    articles = [article, ...articles];
    return resolve({ article });
  },

  updateArticle: (id: string, patch: Partial<Article>) => {
    const timestamp = now();
    let updated: Article | undefined;
    articles = articles.map((a) => {
      if (a.id !== id) return a;
      updated = { ...a, ...patch, id, updatedAt: timestamp, lastSavedAt: timestamp };
      return updated;
    });
    if (!updated) throw new Error(`Article not found: ${id}`);
    return resolve({ article: updated });
  },

  deleteArticle: (id: string) => {
    articles = articles.filter((a) => a.id !== id);
    return resolve({ ok: true as const });
  },

  publish: (id: string) => {
    const existing = articles.find((a) => a.id === id);
    return api.updateArticle(id, {
      status: "published",
      publishedAt: existing?.publishedAt ?? now(),
    });
  },

  unpublish: (id: string) => api.updateArticle(id, { status: "draft" }),

  duplicate: (id: string) => {
    const source = articles.find((a) => a.id === id);
    if (!source) throw new Error(`Article not found: ${id}`);
    const timestamp = now();
    const copy: Article = {
      ...source,
      id: crypto.randomUUID(),
      previewToken: crypto.randomUUID(),
      title: `${source.title} (copy)`,
      slug: `${source.slug}-copy-${Date.now().toString(36)}`,
      status: "draft",
      publishedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastSavedAt: timestamp,
    };
    articles = [copy, ...articles];
    return resolve({ article: copy });
  },

  meta: () => resolve({ categories: CATEGORIES as Category[], authors: MOCK_AUTHORS as Author[] }),

  search: (q: string) => {
    const query = q.trim().toLowerCase();
    if (!query)
      return resolve({ results: STATIC_PAGES.map((p) => ({ ...p, type: "page" as const })) });
    const pageResults = STATIC_PAGES.filter((p) => p.label.toLowerCase().includes(query)).map(
      (p) => ({
        ...p,
        type: "page" as const,
      }),
    );
    const articleResults = articles
      .filter((a) => a.status === "published" && a.title.toLowerCase().includes(query))
      .map((a) => ({ label: a.title, href: `/blog/${a.slug}`, type: "article" as const }));
    return resolve({ results: [...pageResults, ...articleResults].slice(0, 20) });
  },

  listUploads: () => resolve({ uploads }),

  upload: async (file: Blob) => {
    const url = URL.createObjectURL(file);
    const { width, height } = await loadImageSize(url);
    const asset: ImageAsset = {
      id: crypto.randomUUID(),
      url,
      originalUrl: url,
      crop: null,
      width,
      height,
      createdAt: now(),
    };
    uploads = [asset, ...uploads];
    return { asset };
  },
};
