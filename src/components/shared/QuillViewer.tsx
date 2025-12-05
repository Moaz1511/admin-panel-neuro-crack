// src/components/shared/QuillViewer.tsx

"use client";

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';

if (typeof window !== 'undefined') {
  (window as any).katex = katex;
}

interface QuillViewerProps {
  content: string | undefined | null;
}

const QuillViewer: React.FC<QuillViewerProps> = ({ content }) => {
  const sanitizedContent = typeof window !== 'undefined' ? DOMPurify.sanitize(content || '') : (content || '');

  return (
    <ReactQuill
      value={sanitizedContent}
      readOnly={true}
      theme="snow"
      modules={{ toolbar: false, formula: true }}
      formats={['formula']}
    />
  );
};

export default QuillViewer;
