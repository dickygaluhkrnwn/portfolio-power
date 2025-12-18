"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Trash, Briefcase, GraduationCap, Award } from "lucide-react";
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
                {isNew ? "Add Journey Item" : "Edit Journey Item"}
              </h1>
            </div>
            
            {/* Desktop Actions */}
            {!isNew && (
              <div className="hidden md:block">
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash size={16} className="mr-2" /> Delete
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="container-width py-6 md:py-8 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Form Card */}
            <section className="bg-secondary/5 p-5 md:p-8 rounded-2xl border border-white/5 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Type</label>
                  <div className="relative">
                    <select 
                      className="input-field h-12 appearance-none" 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="work">Work Experience</option>
                      <option value="education">Education</option>
                      <option value="certification">Certification / Award</option>
                    </select>
                    {/* Icon visual hint based on selection */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        {formData.type === "work" && <Briefcase size={18} />}
                        {formData.type === "education" && <GraduationCap size={18} />}
                        {formData.type === "certification" && <Award size={18} />}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Year / Period</label>
                  <input 
                    required 
                    className="input-field font-medium" 
                    placeholder="e.g. 2023 - Present"
                    value={formData.year} 
                    onChange={e => setFormData({...formData, year: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Role / Degree</label>
                <input 
                  required 
                  className="input-field text-lg font-bold" 
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Company / Institution</label>
                <input 
                  required 
                  className="input-field" 
                  placeholder="e.g. Google Indonesia"
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                <textarea 
                  required 
                  className="input-field min-h-[150px] leading-relaxed resize-y" 
                  placeholder="Describe your responsibilities, achievements, or key learnings..."
                  value={formData.desc} 
                  onChange={e => setFormData({...formData, desc: e.target.value})} 
                />
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
                Save Item
              </Button>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden md:flex justify-end pt-4">
              <Button type="submit" size="lg" className="min-w-[150px] shadow-xl shadow-primary/20" disabled={saving}>
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