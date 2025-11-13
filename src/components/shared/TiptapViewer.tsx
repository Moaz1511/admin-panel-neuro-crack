// src/components/shared/TiptapViewer.tsx

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from 'react';
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image';
import { Node } from '@tiptap/core';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Custom Tiptap Node for rendering math
const MathNode = Node.create({
  name: 'mathNode',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      'data-type': {
        default: 'math-node',
      },
    };
  },
  parseHTML: () => [{ tag: 'span[data-type="math-node"]' }],
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
});

interface TiptapViewerProps {
  content: string;
}

const TiptapViewer: React.FC<TiptapViewerProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, MathNode],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none',
      },
    },
  });

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
  }, [editor, content]);

  return (
    <EditorContent editor={editor} />
  );
};

export default TiptapViewer;
