"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Trash } from "lucide-react";
import { getJourneyItemById, saveJourneyItem, deleteJourneyItem, JourneyItem } from "@/lib/journey-service";

const initialData: Partial<JourneyItem> = {
  year: "",
  role: "",
  company: "",
  type: "work",
  desc: "",
};

export default function JourneyFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<JourneyItem>>(initialData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    const data = await getJourneyItemById(id);
    if (data) setFormData(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveJourneyItem(formData, isNew ? undefined : id);
      router.push("/admin/dashboard");
    } catch (err) {
      alert("Failed to save journey item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      setSaving(true);
      await deleteJourneyItem(id);
      router.push("/admin/dashboard");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin" /></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-white/10 bg-secondary/5 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft size={20} />
              </Button>
              <h1 className="font-heading text-xl font-bold">
                {isNew ? "Add Journey Item" : "Edit Journey Item"}
              </h1>
            </div>
            {!isNew && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash size={16} className="mr-2" /> Delete
              </Button>
            )}
          </div>
        </header>

        <main className="container-width py-12 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/5 p-8 rounded-xl border border-white/5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="input-field" 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="work">Work Experience</option>
                  <option value="education">Education</option>
                  <option value="certification">Certification / Award</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Year / Period</label>
                <input 
                  required 
                  className="input-field" 
                  placeholder="e.g. 2023 - Present"
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Degree</label>
              <input 
                required 
                className="input-field" 
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company / Institution</label>
              <input 
                required 
                className="input-field" 
                placeholder="e.g. Google Indonesia"
                value={formData.company} 
                onChange={e => setFormData({...formData, company: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                required 
                className="input-field min-h-[120px]" 
                placeholder="Describe your responsibilities or achievements..."
                value={formData.desc} 
                onChange={e => setFormData({...formData, desc: e.target.value})} 
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                Save Item
              </Button>
            </div>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}