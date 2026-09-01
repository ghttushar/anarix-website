import type { Article, Author } from "@blog-shared";

import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({ articles, authors }: { articles: Article[]; authors: Author[] }) {
  if (articles.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Related Insights</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} authors={authors} />
        ))}
      </div>
    </section>
  );
}
