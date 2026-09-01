import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info,
  Table as TableIcon,
  Video,
  Link as LinkIcon,
} from "lucide-react";

import { LinkPopover } from "./LinkPopover";
import { ImageInsertMenu } from "./ImageInsertMenu";

function Btn({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rte-btn ${active ? "is-active" : ""}`}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Toolbar({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);

  return (
    <div className="rte-toolbar">
      <select
        className="rte-select"
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(e) => {
          const value = e.target.value;
          const chain = editor.chain().focus();
          if (value === "p") chain.setParagraph().run();
          else chain.toggleHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 }).run();
        }}
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <div className="rte-toolbar__sep" />

      <Btn
        title="Bold (Ctrl+B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </Btn>
      <Btn
        title="Italic (Ctrl+I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </Btn>
      <Btn
        title="Underline (Ctrl+U)"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </Btn>
      <Btn
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={15} />
      </Btn>
      <Btn
        title="Highlight"
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter size={15} />
      </Btn>

      <div className="rte-toolbar__sep" />

      <Btn
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={15} />
      </Btn>
      <Btn
        title="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={15} />
      </Btn>
      <Btn
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={15} />
      </Btn>

      <div className="rte-toolbar__sep" />

      <Btn
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </Btn>
      <Btn
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </Btn>
      <Btn
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </Btn>
      <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={15} />
      </Btn>
      <Btn
        title="Callout"
        active={editor.isActive("callout")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "callout",
              attrs: { variant: "info" },
              content: [{ type: "paragraph" }],
            })
            .run()
        }
      >
        <Info size={15} />
      </Btn>
      <Btn
        title="Table"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={15} />
      </Btn>
      <Btn
        title="Video embed"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({ type: "videoEmbed", attrs: { url: "" } })
            .run()
        }
      >
        <Video size={15} />
      </Btn>

      <div className="rte-toolbar__sep" />

      <div style={{ position: "relative" }}>
        <Btn title="Link" active={editor.isActive("link")} onClick={() => setLinkOpen((v) => !v)}>
          <LinkIcon size={15} />
        </Btn>
        {linkOpen && <LinkPopover editor={editor} onClose={() => setLinkOpen(false)} />}
      </div>

      <ImageInsertMenu editor={editor} />

      <div className="rte-toolbar__sep" />

      <Btn
        title="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 size={15} />
      </Btn>
      <Btn
        title="Redo (Ctrl+Shift+Z)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 size={15} />
      </Btn>
    </div>
  );
}
