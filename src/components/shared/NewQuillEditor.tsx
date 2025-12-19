// src/components/shared/NewQuillEditor.tsx

"use client";

import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';

if (typeof window !== 'undefined') {
  (window as any).katex = katex;
}

interface NewQuillEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const NewQuillEditor: React.FC<NewQuillEditorProps> = ({ content, onUpdate }) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'video'],
      ['formula'],
      ['clean']
    ],
    formula: true,
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'link', 'image', 'video', 'formula'
  ];

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // You can now access the Quill instance via the editor object
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={content}
      onChange={onUpdate}
      modules={modules}
      formats={formats}
    />
  );
};

export default NewQuillEditor;
