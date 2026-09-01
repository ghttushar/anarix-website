import { ArrowRight } from "lucide-react";
import type { Author } from "@blog-shared";

import { Link } from "@/lib/router";

export function AuthorBioCard({ author }: { author: Author }) {
  const initials = author.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="ws-author-card">
      <div className="ws-author-card__avatar">
        {author.avatarUrl ? <img src={author.avatarUrl} alt={author.name} /> : initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
          Written by
        </p>
        <p className="font-display text-lg font-semibold text-foreground">{author.name}</p>
        <p className="text-sm text-muted-foreground">{author.role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{author.bio}</p>
        <Link
          to={`/blog/author/${author.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3"
        >
          View all articles <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
