import { CATEGORIES } from "@blog-shared";
import { Link, useLocation } from "@/lib/router";

export function TopicNav() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-wrap gap-2.5">
      {CATEGORIES.map((category) => {
        const active = pathname === `/blog/category/${category.id}`;
        return (
          <Link
            key={category.id}
            to={`/blog/category/${category.id}`}
            className={`ws-topic-pill ${active ? "ws-topic-pill--active" : ""}`}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
