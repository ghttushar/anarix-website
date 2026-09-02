import { motion } from "framer-motion";
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
      <section className="ws-blog-hero pt-6 pb-12 text-center">
        <div className="container-page px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="ws-eyebrow">Topic</span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              <span className="text-gradient-primary">{categoryLabel(category)}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Every article we&apos;ve published on {categoryLabel(category)}.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-wide px-6 mb-12">
        <TopicNav />
      </section>

      <section className="container-wide px-6 pb-24">
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} authors={authors} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">No articles in this topic yet.</p>
        )}
      </section>
    </PageLayout>
  );
}
