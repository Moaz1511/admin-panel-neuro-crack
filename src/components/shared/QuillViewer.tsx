"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import 'katex/dist/katex.min.css';
// You might need to install types: npm i -D @types/katex
import renderMathInElement from 'katex/dist/contrib/auto-render';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css'; // Keep this to maintain the same font/spacing styles

interface QuillViewerProps {
  content: string | undefined | null;
}

const QuillViewer: React.FC<QuillViewerProps> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const sanitizedContent = useMemo(() => {
    // Sanitize content to prevent XSS, but keep structure
    return typeof window !== 'undefined' 
      ? DOMPurify.sanitize(content || '') 
      : (content || '');
  }, [content]);

  useEffect(() => {
    if (contentRef.current) {
      // This options object tells KaTeX what symbols to look for
      const options = {
        delimiters: [
          { left: "$$", right: "$$", display: true }, // Block math
          { left: "$", right: "$", display: false },  // Inline math (your case)
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false,
        trust: true,
        strict: false
      };

      // logic to render math inside the element
      renderMathInElement(contentRef.current, options);
    }
  }, [sanitizedContent]);

  return (
    // We add 'ql-snow' and 'ql-editor' classes to mimic the exact look of ReactQuill
    // so it blends in perfectly with your other content.
    <div className="ql-snow">
      <div 
        ref={contentRef}
        className="ql-editor" 
        style={{ padding: 0 }} // Optional: removes editor padding if you want it compact
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
};

export default React.memo(QuillViewer);