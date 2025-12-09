"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { getPostById, savePost, BlogPost } from "@/lib/blog-service";
import TiptapEditor from "@/components/ui/tiptap-editor"; // Import Editor Baru

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin" /></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground pb-20">
        <header className="border-b border-white/10 bg-secondary/5 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-heading text-xl font-bold">
              {isNew ? "Write New Article" : "Edit Article"}
            </h1>
          </div>
        </header>

        <main className="container-width py-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Main Info */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  required 
                  className="input-field text-lg font-bold" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Judul Artikel yang Menarik..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (Auto Generated)</label>
                  <input 
                    className="input-field" 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    placeholder="judul-artikel-anda"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publish Date</label>
                  <input 
                    type="datetime-local"
                    className="input-field" 
                    value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""} 
                    onChange={e => setFormData({...formData, publishedAt: new Date(e.target.value).toISOString()})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL (Imgur)</label>
                <input 
                  className="input-field" 
                  value={formData.coverImage} 
                  onChange={e => setFormData({...formData, coverImage: e.target.value})} 
                  placeholder="https://i.imgur.com/..."
                />
                {formData.coverImage && (
                  <img src={formData.coverImage} alt="Preview" className="h-40 w-full object-cover rounded-lg mt-2 border border-white/10" />
                )}
              </div>
            </section>

            {/* Content Editor */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt (Ringkasan)</label>
                <textarea 
                  required 
                  className="input-field min-h-[80px]" 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                  placeholder="Ringkasan singkat untuk ditampilkan di card..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                {/* Ganti textarea dengan TiptapEditor */}
                <TiptapEditor 
                  content={formData.content || ""} 
                  onChange={(html) => setFormData({...formData, content: html})} 
                />
              </div>
            </section>

            {/* Tags & Status */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <input 
                    className="input-field" 
                    value={tagInput} 
                    onChange={e => setTagInput(e.target.value)} 
                    placeholder="Add a tag..."
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="secondary"><Plus size={18}/></Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags?.map((tag, idx) => (
                    <span key={idx} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(idx)} className="hover:text-white"><X size={14}/></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input 
                  type="checkbox" 
                  id="published" 
                  className="w-5 h-5 rounded border-gray-600 bg-black/20 text-primary focus:ring-primary"
                  checked={formData.isPublished}
                  onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                />
                <label htmlFor="published" className="text-sm font-medium cursor-pointer">Publish Immediately</label>
              </div>
            </section>

            {/* Submit */}
            <div className="sticky bottom-4 flex justify-end">
              <Button type="submit" size="lg" className="shadow-xl shadow-primary/20" disabled={saving}>
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