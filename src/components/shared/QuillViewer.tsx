// src/components/shared/QuillViewer.tsx

"use client";

import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// THIS IS THE ONLY SETUP NEEDED
if (typeof window !== 'undefined') {
  (window as any).katex = katex;
}

interface QuillViewerProps {
  content: string;
}

const QuillViewer: React.FC<QuillViewerProps> = ({ content }) => {
  const { quill, quillRef } = useQuill({ 
    modules: { 
      toolbar: false,
      formula: true // This will now work
    },
    formats: ['formula'],
    readOnly: true
  });

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(content);
      quill.disable();
    }
  }, [quill, content]);

  return (
    <div style={{ width: '100%' }}>
      <div ref={quillRef} />
    </div>
  );
};

export default QuillViewer;