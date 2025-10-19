// src/components/shared/MenuBar.tsx

'use client';

import { type Editor } from '@tiptap/react';
import { Bold, Italic, Strikethrough, Code, Heading2, Image as ImageIcon, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuBarProps {
  editor: Editor | null;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };
  
  const addMath = () => {
    const latex = window.prompt('Enter LaTeX Equation');
    if (latex) {
        editor.chain().focus().insertContent(`<span data-type="math-node">${latex}</span> `).run();
    }
  };

  return (
    <div className="border rounded-t-md p-2 flex flex-wrap gap-2">
      <Button variant={editor.isActive('bold') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('italic') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('strike') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('code') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={addImage}><ImageIcon className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={addMath}><Sigma className="h-4 w-4" /></Button>
    </div>
  );
};