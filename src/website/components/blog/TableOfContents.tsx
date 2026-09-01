import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TocItem } from "@blog-shared";

function useActiveTocId(items: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string | null }) {
  return (
    <ul className="ws-toc__list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`ws-toc__link ${item.level === 3 ? "ws-toc__link--level-3" : ""} ${
              activeId === item.id ? "ws-toc__link--active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(item.id);
            }}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Sticky right-rail TOC, desktop only — scroll-spies the active section. */
export function TableOfContentsDesktop({ items }: { items: TocItem[] }) {
  const activeId = useActiveTocId(items);
  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-28 ws-toc">
      <p className="ws-toc__title">On this page</p>
      <TocList items={items} activeId={activeId} />
    </aside>
  );
}

/** Collapsible "On this page" block, placed inline near the top of the article on mobile/tablet. */
export function TableOfContentsMobile({ items }: { items: TocItem[] }) {
  const activeId = useActiveTocId(items);
  if (items.length === 0) return null;

  return (
    <details className="lg:hidden ws-card mb-8 px-4 py-3.5 group">
      <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-foreground">
        On this page
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-3.5 pl-0.5">
        <TocList items={items} activeId={activeId} />
      </div>
    </details>
  );
}
