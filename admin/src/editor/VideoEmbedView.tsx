import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { parseVideoUrl } from "@blog-shared";

export function VideoEmbedView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const url = node.attrs.url as string;
  const { embedUrl } = url ? parseVideoUrl(url) : { embedUrl: "" };

  return (
    <NodeViewWrapper className="rte-video" data-drag-handle>
      <div contentEditable={false}>
        <input
          className="admin-input"
          placeholder="YouTube or Vimeo URL"
          value={url}
          onChange={(e) => updateAttributes({ url: e.target.value })}
        />
        {embedUrl && (
          <div className="rte-video__frame" style={{ marginTop: "0.5rem" }}>
            <iframe src={embedUrl} title="Video preview" />
          </div>
        )}
        <button
          type="button"
          className="admin-btn admin-btn--sm admin-btn--danger"
          style={{ marginTop: "0.5rem" }}
          onClick={() => deleteNode()}
        >
          Remove video
        </button>
      </div>
    </NodeViewWrapper>
  );
}
