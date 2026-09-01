// Server-only blog storage. Reads/writes a JSON file on local disk — this
// works because `npm run dev` / `vite preview` run this app as a normal Node
// process. The production deploy target for this repo is Cloudflare Workers
// (nitro `cloudflare-module` preset), which has no filesystem at runtime, so
// before a real production deploy this file's storage calls (only this file)
// need to be swapped for Cloudflare D1 (metadata) + R2 (uploaded images).
// Every other module in the blog feature talks to storage only through the
// functions exported here, so that swap stays localized to this one file.
//
// Never import this file from client code — only from `api.server.ts` and
// `server-fn.ts` in this same folder.

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  createDraftArticle,
  type Article,
  type ArticleStatus,
  type Author,
  type ImageAsset,
} from "@blog-shared";

const DATA_DIR = path.join(process.cwd(), "data", "blog");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
const AUTHORS_FILE = path.join(DATA_DIR, "authors.json");
const UPLOADS_INDEX_FILE = path.join(DATA_DIR, "uploads.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "blog");
const UPLOADS_PUBLIC_PATH = "/uploads/blog";

const DEFAULT_AUTHORS: Author[] = [
  {
    id: "anarix-team",
    name: "Anarix Team",
    role: "Content & Strategy",
    bio: "The Anarix team writes from the trenches: pattern-matching what actually moves profit across hundreds of managed Amazon and Walmart accounts.",
    avatarUrl: null,
  },
  {
    id: "sunil",
    name: "Sunil",
    role: "Founder, Anarix",
    bio: "Sunil founded Anarix to bring an operating-system view of profit to marketplace sellers, built from years running growth for Amazon-native brands.",
    avatarUrl: null,
  },
];

async function ensureDataFiles(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
  await ensureJsonFile(ARTICLES_FILE, []);
  await ensureJsonFile(AUTHORS_FILE, DEFAULT_AUTHORS);
  await ensureJsonFile(UPLOADS_INDEX_FILE, []);
}

async function ensureJsonFile<T>(file: string, fallback: T): Promise<void> {
  try {
    await readFile(file, "utf-8");
  } catch {
    await writeFile(file, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

async function readJson<T>(file: string): Promise<T> {
  await ensureDataFiles();
  const raw = await readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf-8");
}

export interface ArticleFilter {
  status?: ArticleStatus;
  category?: string;
  authorId?: string;
  search?: string;
}

function matchesFilter(article: Article, filter: ArticleFilter): boolean {
  if (filter.status && article.status !== filter.status) return false;
  if (filter.category && article.category !== filter.category) return false;
  if (filter.authorId && article.authorId !== filter.authorId) return false;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    if (!article.title.toLowerCase().includes(q) && !article.slug.toLowerCase().includes(q))
      return false;
  }
  return true;
}

export async function listArticles(filter: ArticleFilter = {}): Promise<Article[]> {
  const articles = await readJson<Article[]>(ARTICLES_FILE);
  return articles
    .filter((a) => matchesFilter(a, filter))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listPublishedArticles(): Promise<Article[]> {
  const articles = await listArticles({ status: "published" });
  return articles.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const articles = await readJson<Article[]>(ARTICLES_FILE);
  return articles.find((a) => a.id === id);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await readJson<Article[]>(ARTICLES_FILE);
  return articles.find((a) => a.slug === slug && a.status === "published");
}

export async function getArticleByPreviewToken(
  id: string,
  token: string,
): Promise<Article | undefined> {
  const article = await getArticleById(id);
  return article && article.previewToken === token ? article : undefined;
}

export async function createArticle(): Promise<Article> {
  const articles = await readJson<Article[]>(ARTICLES_FILE);
  const now = new Date().toISOString();
  const article = createDraftArticle(randomUUID(), now, randomUUID());
  articles.push(article);
  await writeJson(ARTICLES_FILE, articles);
  return article;
}

export async function updateArticle(id: string, patch: Partial<Article>): Promise<Article> {
  const articles = await readJson<Article[]>(ARTICLES_FILE);
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) throw new Error(`Article not found: ${id}`);

  const now = new Date().toISOString();
  const updated: Article = { ...articles[index], ...patch, id, updatedAt: now, lastSavedAt: now };
  articles[index] = updated;
  await writeJson(ARTICLES_FILE, articles);
  return updated;
}

export async function deleteArticle(id: string): Promise<void> {
  const articles = await readJson<Article[]>(ARTICLES_FILE);
  await writeJson(
    ARTICLES_FILE,
    articles.filter((a) => a.id !== id),
  );
}

export async function duplicateArticle(id: string): Promise<Article> {
  const source = await getArticleById(id);
  if (!source) throw new Error(`Article not found: ${id}`);

  const articles = await readJson<Article[]>(ARTICLES_FILE);
  const now = new Date().toISOString();
  const copy: Article = {
    ...source,
    id: randomUUID(),
    previewToken: randomUUID(),
    title: `${source.title} (copy)`,
    slug: `${source.slug}-copy-${Date.now().toString(36)}`,
    status: "draft",
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
    lastSavedAt: now,
  };
  articles.push(copy);
  await writeJson(ARTICLES_FILE, articles);
  return copy;
}

export async function publishArticle(id: string): Promise<Article> {
  const article = await getArticleById(id);
  return updateArticle(id, {
    status: "published",
    publishedAt: article?.publishedAt ?? new Date().toISOString(),
  });
}

export async function unpublishArticle(id: string): Promise<Article> {
  return updateArticle(id, { status: "draft" });
}

export async function listAuthors(): Promise<Author[]> {
  return readJson<Author[]>(AUTHORS_FILE);
}

export async function getAuthorById(id: string): Promise<Author | undefined> {
  const authors = await listAuthors();
  return authors.find((a) => a.id === id);
}

function extensionFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

export async function saveUpload(bytes: Uint8Array, mime: string): Promise<ImageAsset> {
  await ensureDataFiles();
  const id = randomUUID();
  const ext = extensionFromMime(mime);
  const filename = `${id}.${ext}`;
  await writeFile(path.join(UPLOADS_DIR, filename), bytes);

  const dimensions = readPngOrJpegDimensions(bytes) ?? { width: 1200, height: 800 };
  const asset: ImageAsset = {
    id,
    url: `${UPLOADS_PUBLIC_PATH}/${filename}`,
    originalUrl: `${UPLOADS_PUBLIC_PATH}/${filename}`,
    crop: null,
    width: dimensions.width,
    height: dimensions.height,
    createdAt: new Date().toISOString(),
  };

  const index = await readJson<ImageAsset[]>(UPLOADS_INDEX_FILE);
  index.unshift(asset);
  await writeJson(UPLOADS_INDEX_FILE, index);
  return asset;
}

export async function listUploads(): Promise<ImageAsset[]> {
  return readJson<ImageAsset[]>(UPLOADS_INDEX_FILE);
}

/** Minimal PNG/JPEG dimension sniffing so uploads don't need a full image-processing dependency. */
function readPngOrJpegDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const isPng =
    bytes.length > 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  if (isPng) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  const isJpeg = bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8;
  if (isJpeg) {
    let offset = 2;
    while (offset < bytes.length - 9) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      const isSofMarker =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSofMarker) {
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      const segmentLength = view.getUint16(offset + 2);
      offset += 2 + segmentLength;
    }
  }

  return null;
}
