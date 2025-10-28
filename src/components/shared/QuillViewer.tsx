// src/components/shared/QuillViewer.tsx

"use client";

import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Add css for snow theme
import { useEffect } from 'react';

interface QuillViewerProps {
  content: string;
}

const QuillViewer: React.FC<QuillViewerProps> = ({ content }) => {
  const { quill, quillRef } = useQuill({ modules: { toolbar: false } });

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(content);
      quill.disable();
    }
  }, [quill, content]);

  return (
    <div style={{ width: '100%', minHeight: 150 }}>
      <div ref={quillRef} />
    </div>
  );
};

export default QuillViewer;
