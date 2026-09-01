import type { Category, RelatedService } from "./types";

export const CATEGORIES: Category[] = [
  { id: "amazon", label: "Amazon" },
  { id: "walmart", label: "Walmart" },
  { id: "advertising", label: "Advertising" },
  { id: "retail-media", label: "Retail Media" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "analytics", label: "Analytics" },
  { id: "strategy", label: "Strategy" },
];

export const RELATED_SERVICES: RelatedService[] = [
  {
    id: "platform",
    label: "Anarix Platform",
    href: "/products",
    description: "Profitability dashboards, Signals alerts and Jiva AI in one workspace.",
  },
  {
    id: "listing-audit",
    label: "Free Listing Audit",
    href: "/company/contact",
    description: "A short teardown of your listings and ad spend from the Anarix team.",
  },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
