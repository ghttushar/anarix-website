import { Layers } from "lucide-react";
import type { Article, Author } from "@blog-shared";

import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({ articles, authors }: { articles: Article[]; authors: Author[] }) {
  if (articles.length === 0) return null;

  return (
    <section>
      <span className="ws-eyebrow">
        <Layers className="w-3.5 h-3.5" /> Keep exploring
      </span>
      <h2 className="mt-3 mb-6 font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
        Related <span className="text-gradient-primary">insights.</span>
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} authors={authors} index={i} />
        ))}
      </div>
    </section>
  );
}
