import { motion } from "framer-motion";
import type { Article, Author } from "@blog-shared";

import PageLayout from "@/website/components/PageLayout";
import { ArticleCard } from "@/website/components/blog/ArticleCard";
import { AuthorBioCard } from "@/website/components/blog/AuthorBioCard";

export function BlogAuthorPage({
  author,
  articles,
  authors,
}: {
  author: Author | null;
  articles: Article[];
  authors: Author[];
}) {
  return (
    <PageLayout>
      <section className="ws-blog-hero pt-6 pb-10">
        <div className="container-page px-6">
          {author ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <AuthorBioCard author={author} />
            </motion.div>
          ) : (
            <h1 className="font-display text-3xl font-semibold text-foreground text-center">
              Author not found
            </h1>
          )}
        </div>
      </section>

      <section className="container-wide px-6 pb-24">
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} authors={authors} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">
            No published articles from this author yet.
          </p>
        )}
      </section>
    </PageLayout>
  );
}
