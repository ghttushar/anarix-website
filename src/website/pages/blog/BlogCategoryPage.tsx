import type { Article, Author } from "@blog-shared";
import { categoryLabel } from "@blog-shared";

import PageLayout from "@/website/components/PageLayout";
import { ArticleCard } from "@/website/components/blog/ArticleCard";
import { TopicNav } from "@/website/components/blog/TopicNav";

export function BlogCategoryPage({
  category,
  articles,
  authors,
}: {
  category: string;
  articles: Article[];
  authors: Author[];
}) {
  return (
    <PageLayout>
      <section className="pt-4 pb-10 text-center">
        <div className="container-page px-6">
          <span className="ws-eyebrow">Topic</span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
            {categoryLabel(category)}
          </h1>
        </div>
      </section>

      <section className="container-wide px-6 mb-10">
        <TopicNav />
      </section>

      <section className="container-wide px-6 pb-20">
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} authors={authors} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">No articles in this topic yet.</p>
        )}
      </section>
    </PageLayout>
  );
}
