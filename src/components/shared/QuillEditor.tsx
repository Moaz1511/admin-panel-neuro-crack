// src/components/shared/QuillEditor.tsx

"use client";

import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// THIS IS THE ONLY SETUP NEEDED
if (typeof window !== 'undefined') {
  window.katex = katex;
}

interface QuillEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, onUpdate }) => {
  const { quill, quillRef } = useQuill({
    modules: {
      formula: true, // This will now work
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['formula'],
        ['clean']
      ],
    },
    formats: [
      'header', 'bold', 'italic', 'underline', 'strike',
      'list', 'link', 'image', 'video', 'formula'
    ],
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        onUpdate(quill.root.innerHTML);
      });
    }
  }, [quill, onUpdate]);

  useEffect(() => {
    if (quill && content !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(content);
    }
  }, [quill, content]);

  return (
    <div style={{ width: '100%', minHeight: 150 }}>
      <div ref={quillRef} />
    </div>
  );
};

export default QuillEditor;