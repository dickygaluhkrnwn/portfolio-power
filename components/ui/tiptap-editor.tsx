"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, Italic, List, ListOrdered, Image as ImageIcon, 
  Link as LinkIcon, Quote, Code, Heading1, Heading2, 
  Undo, Redo 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Tulis cerita inspiratif Anda di sini...",
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Prose styling matched global globals.css
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-5 md:p-6 text-gray-300 text-base leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar (Imgur/Cloudinary):");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#050505] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-inner">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-10">
        
        {/* Headings */}
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading1 size={16} />}
          title="Heading 1"
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive("heading", { level: 3 })}
          icon={<Heading2 size={16} />}
          title="Heading 2"
        />
        
        <div className="w-px h-5 bg-white/10 mx-1.5 self-center hidden sm:block" />

        {/* Basic Format */}
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive("bold")}
          icon={<Bold size={16} />}
          title="Bold"
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive("italic")}
          icon={<Italic size={16} />}
          title="Italic"
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleCode().run()} 
          isActive={editor.isActive("code")}
          icon={<Code size={16} />}
          title="Inline Code"
        />

        <div className="w-px h-5 bg-white/10 mx-1.5 self-center hidden sm:block" />

        {/* Lists & Quote */}
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive("bulletList")}
          icon={<List size={16} />}
          title="Bullet List"
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive("orderedList")}
          icon={<ListOrdered size={16} />}
          title="Numbered List"
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive("blockquote")}
          icon={<Quote size={16} />}
          title="Blockquote"
        />

        <div className="w-px h-5 bg-white/10 mx-1.5 self-center hidden sm:block" />

        {/* Media */}
        <ToolbarBtn onClick={setLink} isActive={editor.isActive("link")} icon={<LinkIcon size={16} />} title="Insert Link" />
        <ToolbarBtn onClick={addImage} isActive={false} icon={<ImageIcon size={16} />} title="Insert Image" />

        <div className="flex-grow hidden sm:block" />

        {/* History */}
        <div className="hidden sm:flex items-center gap-1 pr-1">
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo size={16} />} title="Undo" />
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo size={16} />} title="Redo" />
        </div>

      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} className="bg-transparent cursor-text min-h-[300px]" />
    </div>
  );
}

function ToolbarBtn({ onClick, isActive, icon, title }: any) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white active:scale-95 touch-manipulation outline-none", 
        isActive && "bg-white/10 text-white shadow-sm border border-white/5"
      )}
    >
      {icon}
    </button>
  );
}