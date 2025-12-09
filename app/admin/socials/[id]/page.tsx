"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { getSocialById, saveSocial, SocialLink } from "@/lib/socials-service";

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin" /></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-white/10 bg-secondary/5 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-heading text-xl font-bold">
              {isNew ? "Add New Link" : "Edit Link"}
            </h1>
          </div>
        </header>

        <main className="container-width py-12 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/5 p-8 rounded-xl border border-white/5">
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <input 
                required 
                className="input-field" 
                placeholder="e.g. LinkedIn, Instagram"
                value={formData.platform} 
                onChange={e => setFormData({...formData, platform: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL Profile</label>
              <input 
                required 
                className="input-field" 
                placeholder="https://..."
                value={formData.url} 
                onChange={e => setFormData({...formData, url: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                className="input-field" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value as any})}
              >
                <option value="professional">Professional (LinkedIn, GitHub)</option>
                <option value="creative">Creative (Medium, Behance)</option>
                <option value="social">Social (Instagram, Twitter)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={saving}>
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