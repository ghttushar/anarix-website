import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

export function CalloutView({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="rte-callout" data-variant={node.attrs.variant}>
      <select
        className="rte-select"
        contentEditable={false}
        value={node.attrs.variant}
        onChange={(e) => updateAttributes({ variant: e.target.value })}
        style={{ marginBottom: "0.5rem" }}
      >
        <option value="info">Info</option>
        <option value="tip">Tip</option>
        <option value="warning">Warning</option>
      </select>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
