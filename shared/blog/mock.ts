// Static mock content — no server, no filesystem, no network. Bundled
// directly into whichever app imports it (public site or admin SPA), so
// there's nothing to break on a serverless deploy.
import articlesJson from "../../data/blog/articles.json";
import authorsJson from "../../data/blog/authors.json";

import type { Article, Author } from "./types";

export const MOCK_ARTICLES = articlesJson as unknown as Article[];
export const MOCK_AUTHORS = authorsJson as unknown as Author[];
