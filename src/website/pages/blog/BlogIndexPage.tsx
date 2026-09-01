import { useState } from "react";
import type { Article, Author } from "@blog-shared";

import PageLayout from "@/website/components/PageLayout";
import { ArticleCard } from "@/website/components/blog/ArticleCard";
import { FeaturedArticleCard } from "@/website/components/blog/FeaturedArticleCard";
import { TopicNav } from "@/website/components/blog/TopicNav";

const PAGE_SIZE = 6;

export function BlogIndexPage({ articles, authors }: { articles: Article[]; authors: Author[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [featured, ...rest] = articles;
  const latest = rest.slice(0, 3);
  const more = rest.slice(3);

  return (
    <PageLayout>
      <section className="pt-4 pb-12 text-center">
        <div className="container-page px-6">
          <span className="ws-eyebrow">Blog / Insights</span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.08]">
            Profit intelligence, <span className="text-gradient-primary">field notes.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Practical breakdowns of Amazon, Walmart and retail media strategy, drawn from the same
            patterns our team uses managing live ad spend and margin across hundreds of accounts.
          </p>
        </div>
      </section>

      {featured && (
        <section className="container-wide px-6 mb-16">
          <FeaturedArticleCard article={featured} authors={authors} />
        </section>
      )}

      {latest.length > 0 && (
        <section className="container-wide px-6 mb-16">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            Latest Insights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} authors={authors} />
            ))}
          </div>
        </section>
      )}

      <section className="container-wide px-6 mb-16">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
          Browse by Topic
        </h2>
        <TopicNav />
      </section>

      {more.length > 0 && (
        <section className="container-wide px-6 mb-20">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            More Articles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {more.slice(0, visibleCount).map((article) => (
              <ArticleCard key={article.id} article={article} authors={authors} />
            ))}
          </div>
          {visibleCount < more.length && (
            <div className="text-center mt-10">
              <button
                type="button"
                className="ws-btn ws-btn--outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load more
              </button>
            </div>
          )}
        </section>
      )}

      {articles.length === 0 && (
        <div className="container-page px-6 py-24 text-center text-muted-foreground">
          No articles published yet. Check back soon.
        </div>
      )}
    </PageLayout>
  );
}
