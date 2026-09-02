import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Newspaper, Sparkles } from "lucide-react";
import type { Article, Author } from "@blog-shared";

import PageLayout from "@/website/components/PageLayout";
import { ArticleCard } from "@/website/components/blog/ArticleCard";
import { FeaturedArticleCard } from "@/website/components/blog/FeaturedArticleCard";
import { TopicNav } from "@/website/components/blog/TopicNav";

const PAGE_SIZE = 6;
const EASE = [0.22, 1, 0.36, 1] as const;

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex items-end justify-between gap-4 mb-7"
    >
      <div>
        <span className="ws-eyebrow">
          <Icon className="w-3.5 h-3.5" /> {eyebrow}
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          {title} <span className="text-gradient-primary">{accent}</span>
        </h2>
      </div>
    </motion.div>
  );
}

export function BlogIndexPage({ articles, authors }: { articles: Article[]; authors: Author[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [featured, ...rest] = articles;
  const latest = rest.slice(0, 3);
  const more = rest.slice(3);

  return (
    <PageLayout>
      <section className="ws-blog-hero pt-6 pb-14 text-center">
        <div className="container-page px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="ws-eyebrow">
              <Sparkles className="w-3.5 h-3.5" /> Blog / Insights
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              Profit intelligence, <span className="text-gradient-primary">field notes.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Practical breakdowns of Amazon, Walmart and retail media strategy, drawn from the same
              patterns our team uses managing live ad spend and margin across hundreds of accounts.
            </p>
          </motion.div>
        </div>
      </section>

      {featured && (
        <section className="container-wide px-6 mb-20">
          <FeaturedArticleCard article={featured} authors={authors} />
        </section>
      )}

      {latest.length > 0 && (
        <section className="container-wide px-6 mb-20">
          <SectionHeading
            icon={Newspaper}
            eyebrow="Fresh off the desk"
            title="Latest"
            accent="insights."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article, i) => (
              <ArticleCard key={article.id} article={article} authors={authors} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="container-wide px-6 mb-20">
        <SectionHeading icon={Compass} eyebrow="Find your lane" title="Browse by" accent="topic." />
        <TopicNav />
      </section>

      {more.length > 0 && (
        <section className="container-wide px-6 mb-24">
          <SectionHeading icon={Sparkles} eyebrow="Keep reading" title="More" accent="articles." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {more.slice(0, visibleCount).map((article, i) => (
              <ArticleCard key={article.id} article={article} authors={authors} index={i} />
            ))}
          </div>
          {visibleCount < more.length && (
            <div className="text-center mt-10">
              <button
                type="button"
                className="ws-btn ws-btn--outline btn-shine"
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
