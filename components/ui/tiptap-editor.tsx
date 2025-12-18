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
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-gray-300 text-base md:text-lg leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar (Imgur):");
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
    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-secondary/10 sticky top-0 z-10">
        
        {/* Headings */}
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading1 size={18} />}
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive("heading", { level: 3 })}
          icon={<Heading2 size={18} />}
        />
        
        <div className="w-px h-6 bg-white/10 mx-1 self-center hidden sm:block" />

        {/* Basic Format */}
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive("bold")}
          icon={<Bold size={18} />}
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive("italic")}
          icon={<Italic size={18} />}
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleCode().run()} 
          isActive={editor.isActive("code")}
          icon={<Code size={18} />}
        />

        <div className="w-px h-6 bg-white/10 mx-1 self-center hidden sm:block" />

        {/* Lists & Quote */}
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive("bulletList")}
          icon={<List size={18} />}
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive("orderedList")}
          icon={<ListOrdered size={18} />}
        />
        <ToolbarBtn 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive("blockquote")}
          icon={<Quote size={18} />}
        />

        <div className="w-px h-6 bg-white/10 mx-1 self-center hidden sm:block" />

        {/* Media */}
        <ToolbarBtn onClick={setLink} isActive={editor.isActive("link")} icon={<LinkIcon size={18} />} />
        <ToolbarBtn onClick={addImage} isActive={false} icon={<ImageIcon size={18} />} />

        <div className="flex-grow hidden sm:block" />

        {/* History */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo size={18} />} />
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo size={18} />} />

      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} className="bg-black/10 min-h-[300px] cursor-text" />
    </div>
  );
}

function ToolbarBtn({ onClick, isActive, icon }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white active:scale-95 touch-manipulation", // Larger padding & touch feedback
        isActive && "bg-primary/20 text-primary"
      )}
    >
      {icon}
    </button>
  );
}