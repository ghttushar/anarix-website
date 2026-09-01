import type { Article, ArticleStatus, Author, Category, ImageAsset } from "@blog-shared";

const BASE = "/api/blog";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

function jsonBody(body: unknown): RequestInit {
  return { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export interface SearchResult {
  label: string;
  href: string;
  type: "article" | "page";
}

export const api = {
  listArticles: (filter: { status?: ArticleStatus; category?: string; search?: string } = {}) => {
    const params = new URLSearchParams(
      Object.entries(filter).filter(([, v]) => v) as [string, string][],
    );
    return request<{ articles: Article[] }>(`/articles?${params.toString()}`);
  },
  getArticle: (id: string) => request<{ article: Article }>(`/articles/${id}`),
  createArticle: () => request<{ article: Article }>(`/articles`, { method: "POST" }),
  updateArticle: (id: string, patch: Partial<Article>) =>
    request<{ article: Article }>(`/articles/${id}`, { method: "PATCH", ...jsonBody(patch) }),
  deleteArticle: (id: string) => request<{ ok: true }>(`/articles/${id}`, { method: "DELETE" }),
  publish: (id: string) =>
    request<{ article: Article }>(`/articles/${id}/publish`, { method: "POST" }),
  unpublish: (id: string) =>
    request<{ article: Article }>(`/articles/${id}/unpublish`, { method: "POST" }),
  duplicate: (id: string) =>
    request<{ article: Article }>(`/articles/${id}/duplicate`, { method: "POST" }),
  meta: () => request<{ categories: Category[]; authors: Author[] }>(`/meta`),
  search: (q: string) => request<{ results: SearchResult[] }>(`/search?q=${encodeURIComponent(q)}`),
  listUploads: () => request<{ uploads: ImageAsset[] }>(`/uploads`),
  upload: (file: Blob) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ asset: ImageAsset }>(`/uploads`, { method: "POST", body: form });
  },
};
