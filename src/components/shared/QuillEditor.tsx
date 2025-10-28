// src/components/shared/QuillEditor.tsx

"use client";

import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Add css for snow theme
import { useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface QuillEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, onUpdate }) => {
  const { quill, quillRef } = useQuill({
    modules: {
      formula: true,
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
      'header',
      'bold', 'italic', 'underline', 'strike',
      'list',
      'link', 'image', 'video',
      'formula'
    ],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.katex = katex;
    }
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          onUpdate(quill.root.innerHTML);
        }
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