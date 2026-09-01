import * as repo from "./repository.server";

const STATIC_URLS = ["/", "/products", "/case-studies", "/company/contact", "/blog"];
const SITE_URL = "https://anarix.ai";

function urlEntry(loc: string, lastmod?: string): string {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;
}

/** Only published articles are listed — drafts/scheduled/archived stay out of the sitemap. */
export async function handleSitemapRequest(): Promise<Response> {
  const articles = await repo.listPublishedArticles();

  const entries = [
    ...STATIC_URLS.map((loc) => urlEntry(loc)),
    ...articles.map((a) => urlEntry(`/blog/${a.slug}`, a.updatedAt.slice(0, 10))),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
