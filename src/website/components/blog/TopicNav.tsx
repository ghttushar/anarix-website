import { BarChart3, Compass, Megaphone, Package, Radio, ShoppingCart, Store } from "lucide-react";
import { CATEGORIES } from "@blog-shared";
import { Link, useLocation } from "@/lib/router";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  amazon: ShoppingCart,
  walmart: Store,
  advertising: Megaphone,
  "retail-media": Radio,
  ecommerce: Package,
  analytics: BarChart3,
  strategy: Compass,
};

export function TopicNav() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-wrap gap-2.5">
      {CATEGORIES.map((category) => {
        const active = pathname === `/blog/category/${category.id}`;
        const Icon = ICONS[category.id];
        return (
          <Link
            key={category.id}
            to={`/blog/category/${category.id}`}
            className={`ws-topic-pill ${active ? "ws-topic-pill--active" : ""}`}
          >
            {Icon && <Icon className="shrink-0" />}
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
