"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Trash, Github, Linkedin, Twitter, Instagram, Globe, Code, PenTool, Music } from "lucide-react";
import { getSocialById, saveSocial, deleteSocial, SocialLink } from "@/lib/socials-service";

const initialData: Partial<SocialLink> = {
  platform: "",
  url: "",
  category: "professional",
  active: true,
};

export default function SocialFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<SocialLink>>(initialData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    const data = await getSocialById(id);
    if (data) setFormData(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSocial(formData, isNew ? undefined : id);
      router.push("/admin/dashboard");
    } catch (err) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this link?")) {
      setSaving(true);
      await deleteSocial(id);
      router.push("/admin/dashboard");
    }
  };

  // Helper untuk mendapatkan ikon berdasarkan kategori
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "professional": return <Linkedin size={18} />;
      case "creative": return <PenTool size={18} />;
      case "social": return <Instagram size={18} />;
      default: return <Globe size={18} />;
    }
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
                {isNew ? "Add New Link" : "Edit Link"}
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

        <main className="container-width py-6 md:py-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <section className="bg-secondary/5 p-5 md:p-8 rounded-2xl border border-white/5 space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Platform Name</label>
                <input 
                  required 
                  className="input-field font-bold text-lg" 
                  placeholder="e.g. LinkedIn, Instagram"
                  value={formData.platform} 
                  onChange={e => setFormData({...formData, platform: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">URL Profile</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    required 
                    className="input-field pl-10 text-blue-400" 
                    placeholder="https://..."
                    value={formData.url} 
                    onChange={e => setFormData({...formData, url: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                <div className="relative">
                  <select 
                    className="input-field h-12 appearance-none pl-10" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="professional">Professional (LinkedIn, GitHub)</option>
                    <option value="creative">Creative (Medium, Behance)</option>
                    <option value="social">Social (Instagram, Twitter)</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    {getCategoryIcon(formData.category || "other")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="active" 
                  className="w-5 h-5 rounded border-white/10 bg-black/20 text-primary focus:ring-primary"
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                />
                <label htmlFor="active" className="text-sm font-bold cursor-pointer select-none">Show in Profile</label>
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
                Save Link
              </Button>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden md:flex justify-end pt-4">
              <Button type="submit" size="lg" className="min-w-[150px] shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                Save Link
              </Button>
            </div>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}