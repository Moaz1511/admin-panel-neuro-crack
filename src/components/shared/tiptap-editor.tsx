// src/components/shared/tiptap-editor.tsx

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { MenuBar } from "./menu-bar"; // Assuming your toolbar is in the same folder
import Image from '@tiptap/extension-image';
import { Node } from '@tiptap/core';
import katex from 'katex';

// Custom Tiptap Node for rendering math
const MathNode = Node.create({
  name: 'mathNode',
  group: 'inline',
  inline: true,
  atom: true,
  toDOM: () => ['span', { 'data-type': 'math-node' }, 0],
  parseHTML: () => [{ tag: 'span[data-type="math-node"]' }],
});

interface TiptapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, MathNode],
    content: content,
    // This setting helps prevent hydration mismatches
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none p-4 min-h-[150px]',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  // Effect to render KaTeX when the editor content changes
  useEffect(() => {
    if (editor?.view.dom) {
      const mathNodes = editor.view.dom.querySelectorAll('span[data-type="math-node"]');
      mathNodes.forEach((node) => {
        try {
          katex.render(node.textContent || '', node as HTMLElement, {
            throwOnError: false,
          });
        } catch (error) {
          console.error("KaTeX rendering error:", error);
          node.textContent = `[Math Error: ${node.textContent}]`;
        }
      });
    }
  }, [editor, content]); // Rerun when editor is ready or content changes

  return (
    <div className="border rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;