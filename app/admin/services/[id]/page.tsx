"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Trash, Plus, X } from "lucide-react";
import { getServiceById, saveService, deleteService } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";

const initialData: Partial<ServicePackage> = {
  title: "",
  price: "",
  duration: "",
  description: "",
  category: "frontend",
  features: [],
  recommended: false,
};

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<ServicePackage>>(initialData);
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    const data = await getServiceById(id);
    if (data) setFormData(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveService(formData, isNew ? undefined : id);
      router.push("/admin/dashboard");
    } catch (err) {
      alert("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this service?")) {
      setSaving(true);
      await deleteService(id);
      router.push("/admin/dashboard");
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== idx)
    }));
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
                {isNew ? "Add Service Package" : "Edit Service Package"}
              </h1>
            </div>
            {!isNew && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash size={16} className="mr-2" /> Delete
              </Button>
            )}
          </div>
        </header>

        <main className="container-width py-12 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/5 p-8 rounded-xl border border-white/5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Package Title</label>
                <input required className="input-field" placeholder="e.g. Landing Page UMKM"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  <option value="frontend">Frontend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (String)</label>
                <input required className="input-field" placeholder="e.g. Rp 1.500.000"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <input required className="input-field" placeholder="e.g. 3-5 Hari Kerja"
                  value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required className="input-field min-h-[80px]" placeholder="Short description..."
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            {/* Feature List Manager */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <label className="text-sm font-medium">Features List</label>
              <div className="flex gap-2">
                <input 
                  className="input-field" 
                  placeholder="Add a feature (e.g. Free Domain)"
                  value={featureInput} 
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="secondary"><Plus size={18}/></Button>
              </div>
              
              <div className="space-y-2">
                {formData.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/20 p-2 rounded px-3 text-sm">
                    <span>{feat}</span>
                    <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" id="rec" 
                className="w-4 h-4 rounded bg-black/20 border-white/10"
                checked={formData.recommended}
                onChange={e => setFormData({...formData, recommended: e.target.checked})}
              />
              <label htmlFor="rec" className="text-sm cursor-pointer select-none">Mark as Recommended / Best Value</label>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                Save Package
              </Button>
            </div>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}