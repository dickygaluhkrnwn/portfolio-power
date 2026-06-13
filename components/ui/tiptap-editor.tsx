"use client";

import React, { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bold, Italic, List, ListOrdered, Image as ImageIcon, 
  Link as LinkIcon, Quote, Code, Heading1, Heading2, 
  Undo, Redo, Loader2, Check, X, Unlink
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Link Input State
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  
  // Image Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-2xl border border-white/10 shadow-2xl max-w-full h-auto my-8 object-cover w-full",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Tulis cerita atau ide luar biasa Anda di sini...",
        emptyEditorClass: "before:content-[attr(data-placeholder)] before:text-gray-600 before:absolute before:pointer-events-none",
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-5 md:p-8 text-gray-300 text-base leading-relaxed relative",
      },
    },
  });

  // Focus link input automatically when shown
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  if (!editor) {
    return <div className="min-h-[400px] w-full bg-white/5 animate-pulse rounded-2xl border border-white/10" />;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Harus berupa file gambar!");
      setTimeout(() => setUploadError(null), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Maksimal ukuran 5MB!");
      setTimeout(() => setUploadError(null), 3000);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Upload gagal");

      const data = await response.json();
      
      // Sisipkan gambar ke dalam editor di posisi kursor saat ini
      editor.chain().focus().setImage({ src: data.secure_url }).run();
      
    } catch (err: any) {
      console.error("Cloudinary error:", err);
      setUploadError("Gagal mengunggah gambar.");
      setTimeout(() => setUploadError(null), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleLinkInput = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      setShowLinkInput(false);
    } else {
      setShowLinkInput(!showLinkInput);
      setLinkUrl(editor.getAttributes('link').href || "");
    }
  };

  const applyLink = () => {
    if (linkUrl.trim() === "") {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      // Validasi protokol URL
      const validUrl = /^https?:\/\//.test(linkUrl) ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a0a] focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-xl flex flex-col relative group">
      
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#111] sticky top-0 z-20 backdrop-blur-xl">
        
        {/* Headings */}
        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={<Heading1 size={15} />} title="Heading 1" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} icon={<Heading2 size={15} />} title="Heading 2" />
        </div>
        
        <div className="w-px h-5 bg-white/10 mx-1 self-center hidden sm:block" />

        {/* Basic Format */}
        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={<Bold size={15} />} title="Bold" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={<Italic size={15} />} title="Italic" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} icon={<Code size={15} />} title="Inline Code" />
        </div>

        <div className="w-px h-5 bg-white/10 mx-1 self-center hidden sm:block" />

        {/* Lists & Quote */}
        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} icon={<List size={15} />} title="Bullet List" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} icon={<ListOrdered size={15} />} title="Numbered List" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} icon={<Quote size={15} />} title="Blockquote" />
        </div>

        <div className="w-px h-5 bg-white/10 mx-1 self-center hidden sm:block" />

        {/* Media & Links */}
        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5 items-center relative">
          <ToolbarBtn onClick={toggleLinkInput} isActive={editor.isActive("link") || showLinkInput} icon={editor.isActive("link") ? <Unlink size={15}/> : <LinkIcon size={15} />} title={editor.isActive("link") ? "Remove Link" : "Insert Link"} />
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Insert Image (Cloudinary)"
            className={cn(
              "p-2 rounded-md transition-colors outline-none flex items-center justify-center",
              isUploading ? "text-emerald-400" : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            {isUploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
          </button>
        </div>

        {/* Error Message for Upload */}
        <AnimatePresence>
          {uploadError && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="ml-2 flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{uploadError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-grow hidden sm:block" />

        {/* History */}
        <div className="hidden sm:flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5 pr-0.5">
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo size={14} />} title="Undo" />
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo size={14} />} title="Redo" />
        </div>
      </div>

      {/* --- INLINE LINK INPUT POPOVER --- */}
      <AnimatePresence>
        {showLinkInput && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111] border-b border-white/5 p-3 flex gap-2 items-center z-10 shadow-xl"
          >
            <LinkIcon size={14} className="text-gray-500 shrink-0" />
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              onKeyDown={(e) => e.key === "Enter" && applyLink()}
            />
            <button type="button" onClick={applyLink} className="p-1.5 bg-primary/20 text-primary hover:bg-primary border border-primary/30 hover:text-white rounded-lg transition-colors shrink-0"><Check size={14}/></button>
            <button type="button" onClick={() => setShowLinkInput(false)} className="p-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"><X size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDITOR CONTENT */}
      <div className="relative flex-grow">
        <EditorContent 
          editor={editor} 
          className={cn(
            "cursor-text h-full max-h-[600px] overflow-y-auto custom-scrollbar",
            "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
          )} 
        />
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TOOLBAR BUTTON ---
function ToolbarBtn({ onClick, isActive, icon, title }: { onClick: () => void, isActive: boolean, icon: React.ReactNode, title: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "p-2 rounded-md hover:bg-white/10 transition-colors active:scale-95 touch-manipulation outline-none flex items-center justify-center", 
        isActive ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
      )}
    >
      {icon}
    </button>
  );
}