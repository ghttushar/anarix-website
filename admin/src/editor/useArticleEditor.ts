import { useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import { buildArticleExtensions, type ArticleContent } from "@blog-shared";

import { ArticleImageView } from "./ArticleImageView";
import { CalloutView } from "./CalloutView";
import { VideoEmbedView } from "./VideoEmbedView";

const NODE_VIEWS: Record<string, unknown> = {
  articleImage: ArticleImageView,
  callout: CalloutView,
  videoEmbed: VideoEmbedView,
};

export function useArticleEditor(
  initialContent: ArticleContent,
  onUpdate: (content: ArticleContent) => void,
) {
  const extensions = buildArticleExtensions().map((extension) => {
    const view = NODE_VIEWS[extension.name];
    if (!view) return extension;
    // Tiptap's per-extension `.extend()` overloads don't unify across a
    // heterogeneous array, so this generic node-view attachment needs `any`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extendable = extension as any;
    return extendable.extend({
      addNodeView() {
        return ReactNodeViewRenderer(view as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });
  });

  return useEditor({
    extensions,
    content: initialContent,
    onUpdate: ({ editor }) => onUpdate(editor.getJSON() as ArticleContent),
  });
}
