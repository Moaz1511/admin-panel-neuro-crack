// src/components/shared/tiptap-editor.tsx

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

interface TiptapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false, // Fix for Tiptap SSR hydration error
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-md min-h-[150px]">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;