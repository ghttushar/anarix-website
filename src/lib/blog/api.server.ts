// Raw HTTP handler for `/api/blog/*`, called directly from `src/server.ts`
// (same pattern as the existing `/api/jiva` handler in
// `src/website/lib/jivaServer.ts`). This is what the separate admin SPA talks
// to — it never imports the repository directly, keeping the SPA boundary real.

import type { Article, ArticleStatus } from "@blog-shared";
import { CATEGORIES } from "@blog-shared";

import * as repo from "./repository.server";

const STATIC_PAGES = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/products" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/company/contact" },
  { label: "Blog", href: "/blog" },
];

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function notFound(): Response {
  return json({ error: { message: "Not found" } }, 404);
}

export async function handleBlogApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const parts = url.pathname
    .replace(/^\/api\/blog\/?/, "")
    .split("/")
    .filter(Boolean);
  const method = request.method;

  try {
    // /api/blog/meta
    if (parts[0] === "meta" && parts.length === 1 && method === "GET") {
      const authors = await repo.listAuthors();
      return json({ categories: CATEGORIES, authors });
    }

    // /api/blog/search?q=
    if (parts[0] === "search" && parts.length === 1 && method === "GET") {
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const articles = await repo.listArticles({ status: "published" });
      const articleResults = q
        ? articles
            .filter((a) => a.title.toLowerCase().includes(q))
            .map((a) => ({ label: a.title, href: `/blog/${a.slug}`, type: "article" as const }))
        : [];
      const pageResults = q
        ? STATIC_PAGES.filter((p) => p.label.toLowerCase().includes(q)).map((p) => ({
            ...p,
            type: "page" as const,
          }))
        : STATIC_PAGES.map((p) => ({ ...p, type: "page" as const }));
      return json({ results: [...pageResults, ...articleResults].slice(0, 20) });
    }

    // /api/blog/uploads
    if (parts[0] === "uploads" && parts.length === 1) {
      if (method === "GET") return json({ uploads: await repo.listUploads() });
      if (method === "POST") {
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof Blob)) return json({ error: { message: "Missing file" } }, 400);
        const bytes = new Uint8Array(await file.arrayBuffer());
        const asset = await repo.saveUpload(bytes, file.type || "image/jpeg");
        return json({ asset });
      }
    }

    // /api/blog/articles
    if (parts[0] === "articles" && parts.length === 1) {
      if (method === "GET") {
        const filter = {
          status: (url.searchParams.get("status") as ArticleStatus | null) ?? undefined,
          category: url.searchParams.get("category") ?? undefined,
          search: url.searchParams.get("search") ?? undefined,
        };
        return json({ articles: await repo.listArticles(filter) });
      }
      if (method === "POST") {
        return json({ article: await repo.createArticle() }, 201);
      }
    }

    // /api/blog/articles/:id[/action]
    if (parts[0] === "articles" && parts.length >= 2) {
      const id = parts[1];
      const action = parts[2];

      if (!action) {
        if (method === "GET") {
          const article = await repo.getArticleById(id);
          return article ? json({ article }) : notFound();
        }
        if (method === "PATCH") {
          const patch = (await request.json()) as Partial<Article>;
          return json({ article: await repo.updateArticle(id, patch) });
        }
        if (method === "DELETE") {
          await repo.deleteArticle(id);
          return json({ ok: true });
        }
      }

      if (action === "publish" && method === "POST")
        return json({ article: await repo.publishArticle(id) });
      if (action === "unpublish" && method === "POST")
        return json({ article: await repo.unpublishArticle(id) });
      if (action === "duplicate" && method === "POST")
        return json({ article: await repo.duplicateArticle(id) }, 201);
    }

    return notFound();
  } catch (error) {
    console.error("[blog-api]", error);
    return json(
      { error: { message: error instanceof Error ? error.message : "Server error" } },
      500,
    );
  }
}
