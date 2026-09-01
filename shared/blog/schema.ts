// Shared Tiptap schema for the Anarix blog. Both the admin editor (interactive)
// and the public/preview renderer (HTML generation only, via @tiptap/html) use
// this exact extension list so the two never drift apart. Node views (the
// interactive React chrome around an image node) are bolted on separately in
// the admin app via `.extend({ addNodeView... })` — this file stays renderer-safe.

import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";

import type { ImageAlign, ImageLayout, ImageWidth } from "./types";

export interface ArticleImageAttrs {
  src: string;
  /** The untouched original upload — the crop tool always crops from this, never from a prior derivative. */
  originalSrc: string;
  alt: string;
  caption: string;
  credit: string;
  href: string;
  align: ImageAlign;
  width: ImageWidth;
  layout: ImageLayout;
}

/** Block-level figure: image + optional caption/credit, with the layout controls from spec §9/§10. */
export const ArticleImage = Node.create({
  name: "articleImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: "" },
      originalSrc: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
      credit: { default: "" },
      href: { default: "" },
      align: { default: "center" },
      width: { default: "large" },
      layout: { default: "between-paragraphs" },
    };
  },

  parseHTML() {
    return [{ tag: "figure[data-article-image]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = HTMLAttributes as ArticleImageAttrs;
    const figureClass = [
      "ws-article-figure",
      `ws-article-figure--align-${attrs.align || "center"}`,
      `ws-article-figure--width-${attrs.width || "large"}`,
      `ws-article-figure--layout-${attrs.layout || "between-paragraphs"}`,
    ].join(" ");

    const img: [string, Record<string, string>] = [
      "img",
      { src: attrs.src || "", alt: attrs.alt || "", loading: "lazy" },
    ];
    const imgOrLink = attrs.href
      ? ["a", { href: attrs.href, target: "_blank", rel: "noopener noreferrer" }, img]
      : img;

    const captionText = [attrs.caption, attrs.credit].filter(Boolean).join(" — ");

    return [
      "figure",
      mergeAttributes({ "data-article-image": "", class: figureClass }),
      imgOrLink,
      ...(captionText
        ? [["figcaption", { class: "ws-article-figure__caption" }, captionText]]
        : []),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;
  },
});

export type CalloutVariant = "info" | "tip" | "warning";

/** Information/callout block, spec §4. */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "paragraph+",
  defining: true,

  addAttributes() {
    return { variant: { default: "info" as CalloutVariant } };
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const variant = (node.attrs.variant as CalloutVariant) || "info";
    return [
      "div",
      mergeAttributes({ "data-callout": "", class: `ws-callout ws-callout--${variant}` }),
      ["div", { class: "ws-callout__body" }, 0],
    ];
  },
});

export function parseVideoUrl(url: string): {
  provider: "youtube" | "vimeo" | null;
  embedUrl: string;
} {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : (u.searchParams.get("v") ?? u.pathname.split("/").pop() ?? "");
      return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop() ?? "";
      return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` };
    }
    return { provider: null, embedUrl: url };
  } catch {
    return { provider: null, embedUrl: url };
  }
}

/** Embedded video block, spec §4. Stores the original URL; renders a lazy iframe embed. */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return { url: { default: "" } };
  },

  parseHTML() {
    return [{ tag: "div[data-video-embed]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const url = (HTMLAttributes as { url?: string }).url || "";
    const { embedUrl } = parseVideoUrl(url);
    return [
      "div",
      mergeAttributes({ "data-video-embed": "", class: "ws-video-embed" }),
      [
        "iframe",
        {
          src: embedUrl,
          loading: "lazy",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
          frameborder: "0",
        },
      ],
    ];
  },
});

export function buildArticleExtensions() {
  return [
    StarterKit.configure({ link: false, underline: false }),
    Underline,
    Highlight,
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    ArticleImage,
    Callout,
    VideoEmbed,
    Placeholder.configure({ placeholder: "Start writing…" }),
  ];
}
