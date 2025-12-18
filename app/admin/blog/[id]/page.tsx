"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Plus, X, Image as ImageIcon, Calendar, Tag, Trash } from "lucide-react";
import { getPostById, savePost, deletePost, BlogPost } from "@/lib/blog-service";
import TiptapEditor from "@/components/ui/tiptap-editor";

const initialPost: Partial<BlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: [],
  isPublished: true,
  publishedAt: new Date().toISOString(),
};

export default function BlogPostForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<BlogPost>>(initialPost);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    const data = await getPostById(id);
    if (data) setFormData(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await savePost(formData, isNew ? undefined : id);
      router.push("/admin/dashboard");
    } catch (err) {
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setSaving(true);
      await deletePost(id);
      router.push("/admin/dashboard");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if it's new or empty
      slug: isNew || !prev.slug 
        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        : prev.slug
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground pb-24 md:pb-20">
        
        {/* Sticky Header */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")} className="hover:bg-white/10">
                <ArrowLeft size={20} />
              </Button>
              <h1 className="font-heading text-lg md:text-xl font-bold truncate">
                {isNew ? "Write New Article" : "Edit Article"}
              </h1>
            </div>
            
            {!isNew && (
              <div className="hidden md:block">
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                  <Trash size={16} className="mr-2" /> Delete
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="container-width py-6 md:py-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            
            {/* --- MAIN INFO & METADATA --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
                <input 
                  required 
                  className="input-field text-xl md:text-2xl font-bold h-auto py-3" 
                  value={formData.title} 
                  onChange={handleTitleChange} 
                  placeholder="Judul Artikel yang Menarik..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Slug (URL)</label>
                  <input 
                    className="input-field font-mono text-sm" 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    placeholder="judul-artikel-anda"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                    <Calendar size={12} /> Publish Date
                  </label>
                  <input 
                    type="datetime-local"
                    className="input-field" 
                    value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""} 
                    onChange={e => setFormData({...formData, publishedAt: new Date(e.target.value).toISOString()})} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                  <ImageIcon size={12} /> Cover Image URL (Imgur)
                </label>
                <input 
                  className="input-field" 
                  value={formData.coverImage} 
                  onChange={e => setFormData({...formData, coverImage: e.target.value})} 
                  placeholder="https://i.imgur.com/..."
                />
                {formData.coverImage && (
                  <div className="mt-2 relative h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img 
                      src={formData.coverImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* --- CONTENT EDITOR --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Excerpt (Ringkasan)</label>
                <textarea 
                  required 
                  className="input-field min-h-[80px] leading-relaxed" 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                  placeholder="Ringkasan singkat untuk ditampilkan di card..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Content (Rich Text)</label>
                <div className="min-h-[400px]">
                  <TiptapEditor 
                    content={formData.content || ""} 
                    onChange={(html) => setFormData({...formData, content: html})} 
                  />
                </div>
              </div>
            </section>

            {/* --- TAGS & STATUS --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                  <Tag size={12} /> Tags
                </label>
                <div className="flex gap-2">
                  <input 
                    className="input-field" 
                    value={tagInput} 
                    onChange={e => setTagInput(e.target.value)} 
                    placeholder="Add a tag..."
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="secondary" className="px-3"><Plus size={18}/></Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags?.map((tag, idx) => (
                    <span key={idx} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-primary/20">
                      {tag}
                      <button type="button" onClick={() => removeTag(idx)} className="hover:text-white transition-colors"><X size={14}/></button>
                    </span>
                  ))}
                  {(!formData.tags || formData.tags.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">No tags added yet.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="published" 
                    className="w-5 h-5 rounded border-white/10 bg-black/20 text-primary focus:ring-primary"
                    checked={formData.isPublished}
                    onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                  />
                  <label htmlFor="published" className="text-sm font-bold cursor-pointer select-none">Publish Immediately</label>
                </div>
              </div>
            </section>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10 z-40 flex gap-3">
              {!isNew && (
                <Button type="button" variant="destructive" size="lg" className="flex-1" onClick={handleDelete}>
                  <Trash size={18} />
                </Button>
              )}
              <Button type="submit" size="lg" className="flex-[3] shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                {isNew ? "Publish" : "Save Changes"}
              </Button>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden md:flex justify-end pt-4">
              <Button type="submit" size="lg" className="min-w-[150px] shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                {isNew ? "Publish Article" : "Save Changes"}
              </Button>
            </div>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}