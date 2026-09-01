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
      <section className="pt-4 pb-10">
        <div className="container-page px-6">
          {author ? (
            <AuthorBioCard author={author} />
          ) : (
            <h1 className="font-display text-3xl font-semibold text-foreground text-center">
              Author not found
            </h1>
          )}
        </div>
      </section>

      <section className="container-wide px-6 pb-20">
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} authors={authors} />
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
