// One-off dev seed script — writes sample authors/articles into data/blog/*.json.
// Run with: node scripts/seed-blog.mjs
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data", "blog");

const now = new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

const authors = [
  {
    id: "anarix-team",
    name: "Anarix Team",
    role: "Content & Strategy",
    bio: "The Anarix team writes from the trenches: pattern-matching what actually moves profit across hundreds of managed Amazon and Walmart accounts.",
    avatarUrl: null,
  },
  {
    id: "sunil",
    name: "Sunil",
    role: "Founder, Anarix",
    bio: "Sunil founded Anarix to bring an operating-system view of profit to marketplace sellers, built from years running growth for Amazon-native brands.",
    avatarUrl: null,
  },
];

function p(...content) {
  return { type: "paragraph", content };
}
function text(t, marks) {
  return marks ? { type: "text", text: t, marks } : { type: "text", text: t };
}
function h(level, t) {
  return { type: "heading", attrs: { level }, content: [text(t)] };
}
function bulletList(items) {
  return { type: "bulletList", content: items.map((i) => ({ type: "listItem", content: [p(text(i))] })) };
}
function orderedList(items) {
  return { type: "orderedList", attrs: { start: 1 }, content: items.map((i) => ({ type: "listItem", content: [p(text(i))] })) };
}
function blockquote(t) {
  return { type: "blockquote", content: [p(text(t))] };
}
function callout(variant, t) {
  return { type: "callout", attrs: { variant }, content: [p(text(t))] };
}
function image(src, alt, caption, align, width, layout) {
  return { type: "articleImage", attrs: { src, alt, caption: caption ?? "", credit: "", href: "", align, width, layout } };
}
function hr() {
  return { type: "horizontalRule" };
}
function table(headerRow, rows) {
  const row = (cells, isHeader) => ({
    type: "tableRow",
    content: cells.map((c) => ({ type: isHeader ? "tableHeader" : "tableCell", content: [p(text(c))] })),
  });
  return { type: "table", content: [row(headerRow, true), ...rows.map((r) => row(r, false))] };
}

const article1Content = {
  type: "doc",
  content: [
    p(text("Most Amazon sellers treat listing optimization as a one-time task. It isn't — it's an ongoing feedback loop between conversion rate, ad efficiency and organic rank.")),
    h(2, "What Is Listing Optimization?"),
    p(text("Listing optimization is the practice of improving every element a shopper sees before they click ", null), text("Add to Cart", [{ type: "bold" }]), text(": images, title, bullets, A+ content and reviews.")),
    callout("info", "A 2% lift in conversion rate on a $50 ASIN doing 1,000 sessions a month is roughly 10 extra orders — often the cheapest growth lever available."),
    h(2, "How to Optimize the Listing"),
    p(text("Work through these in order of shopper attention, not alphabetically.")),
    h(3, "Product Images"),
    image(
      "/testimonials/joey-dweck-poster.jpg",
      "Before and after example of an optimized Amazon main image",
      "A clearer main image alone lifted this listing's click-through rate.",
      "center",
      "large",
      "between-paragraphs",
    ),
    p(text("Your main image needs to win the thumbnail battle in search results before anything else matters.")),
    bulletList([
      "Fill 85% of the frame on white background",
      "Show scale with a human hand or familiar object",
      "Lead the gallery with your strongest lifestyle shot second",
    ]),
    h(3, "Product Title"),
    image(
      "/testimonials/brianna-poster.jpg",
      "Example seller reviewing listing analytics",
      "",
      "left",
      "medium",
      "within-text",
    ),
    p(text("Front-load the keyword shoppers actually search, then the differentiator, then the pack size or variant. Keep it readable — titles are for humans first, the algorithm second.")),
    orderedList([
      "Primary keyword",
      "Brand name",
      "Key differentiator (e.g. \"Unscented\", \"12-Pack\")",
      "Size or variant",
    ]),
    blockquote("The listings that convert best read like a helpful store clerk, not a keyword dump."),
    hr(),
    h(2, "Common Mistakes"),
    p(text("The same handful of mistakes show up across almost every audit we run — see our "), text("free listing audit", [{ type: "link", attrs: { href: "/company/contact", target: "_blank" } }]), text(" if you want a second pair of eyes.")),
    callout("warning", "Keyword-stuffed titles get flagged by Amazon's suppression bots more often than sellers expect — readability matters for compliance, not just conversion."),
  ],
};

const article2Content = {
  type: "doc",
  content: [
    p(text("Retail media budgets rarely fail because of the platform — they fail because of how they're split across it.")),
    h(2, "Start With Contribution Margin, Not ACOS"),
    p(text("ACOS tells you how efficient a campaign is in isolation. It says nothing about whether that efficiency is actually profitable once fees, COGS and returns are in the picture.")),
    table(
      ["Channel", "Typical Share", "Optimizes For"],
      [
        ["Sponsored Products", "55–65%", "Bottom-of-funnel conversion"],
        ["Sponsored Brands", "15–20%", "New-to-brand share"],
        ["Sponsored Display", "10–15%", "Retargeting & defense"],
      ],
    ),
    h(2, "A Simple Allocation Framework"),
    bulletList([
      "Protect: enough spend on branded terms to defend your own listings",
      "Grow: a fixed test budget on new match types every month",
      "Harvest: scale anything already clearing your contribution-margin target",
    ]),
    callout("tip", "Review the split monthly, not weekly — retail media budgets need a full purchase cycle to show a real signal."),
  ],
};

const article3Content = {
  type: "doc",
  content: [
    p(text("Revenue is a vanity metric until you subtract ads, fees, and cost of goods. Contribution margin is what's left — and it's the only number that tells you whether growth is actually worth having.")),
    h(2, "The Formula"),
    p(text("Contribution margin = Net Revenue − COGS − Fulfillment Fees − Advertising Spend − Returns.")),
    callout("info", "Track it per-ASIN, not just at the account level — the account-level number hides which SKUs are quietly subsidizing the rest."),
    h(2, "Reading It Like an Operator"),
    orderedList([
      "Rank SKUs by contribution margin dollars, not percentage",
      "Flag anything trending down for two consecutive weeks",
      "Re-check ad spend allocation against the ranked list monthly",
    ]),
    blockquote("A profitable SKU losing share is usually a pricing problem. A growing SKU losing margin is usually an ad-spend problem."),
  ],
};

const articles = [
  {
    id: randomUUID(),
    previewToken: randomUUID(),
    title: "How to Optimize an Amazon Listing for Conversion",
    slug: "amazon-listing-optimization",
    excerpt: "A practical, in-order framework for images, titles and copy that actually moves conversion rate — not just keyword density.",
    content: article1Content,
    heroImage: null,
    heroImageAlt: "",
    authorId: "sunil",
    category: "amazon",
    topics: ["amazon", "strategy"],
    status: "published",
    publishedAt: daysAgo(6),
    updatedAt: daysAgo(2),
    scheduledFor: null,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: null,
    relatedArticles: [],
    relatedServices: ["listing-audit"],
    sources: [{ label: "Amazon Seller Central — Listing Quality Dashboard", url: "https://sellercentral.amazon.com" }],
    createdAt: daysAgo(6),
    lastSavedAt: daysAgo(2),
  },
  {
    id: randomUUID(),
    previewToken: randomUUID(),
    title: "Retail Media Budgets: A Practical Allocation Framework",
    slug: "retail-media-budget-allocation",
    excerpt: "How to split spend across Sponsored Products, Brands and Display without guessing — protect, grow, harvest.",
    content: article2Content,
    heroImage: null,
    heroImageAlt: "",
    authorId: "anarix-team",
    category: "retail-media",
    topics: ["advertising", "strategy"],
    status: "published",
    publishedAt: daysAgo(3),
    updatedAt: daysAgo(3),
    scheduledFor: null,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: null,
    relatedArticles: [],
    relatedServices: ["platform"],
    sources: [],
    createdAt: daysAgo(3),
    lastSavedAt: daysAgo(3),
  },
  {
    id: randomUUID(),
    previewToken: randomUUID(),
    title: "Reading Contribution Margin Like an Operator",
    slug: "contribution-margin-for-operators",
    excerpt: "Revenue is vanity. Contribution margin per ASIN is the number that tells you if growth is actually worth having.",
    content: article3Content,
    heroImage: null,
    heroImageAlt: "",
    authorId: "sunil",
    category: "analytics",
    topics: ["analytics", "strategy"],
    status: "published",
    publishedAt: daysAgo(1),
    updatedAt: daysAgo(1),
    scheduledFor: null,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: null,
    relatedArticles: [],
    relatedServices: ["platform"],
    sources: [],
    createdAt: daysAgo(1),
    lastSavedAt: daysAgo(1),
  },
];

await mkdir(DATA_DIR, { recursive: true });
await writeFile(path.join(DATA_DIR, "authors.json"), JSON.stringify(authors, null, 2));
await writeFile(path.join(DATA_DIR, "articles.json"), JSON.stringify(articles, null, 2));
await writeFile(path.join(DATA_DIR, "uploads.json"), JSON.stringify([], null, 2));

console.log(`Seeded ${articles.length} articles and ${authors.length} authors into ${DATA_DIR}`);
