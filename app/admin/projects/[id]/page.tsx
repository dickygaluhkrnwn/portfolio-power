"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash, Loader2, Image as ImageIcon, Link as LinkIcon, Layers } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { Project } from "@/app/data/projects";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";

// Initial empty state
const initialProject: Partial<Project> = {
  title: "",
  subtitle: "",
  desc: "",
  category: "frontend",
  techStack: [],
  image: "",
  demoLink: "",
  repoLink: "",
  featured: false,
  challenge: "",
  solution: "",
  features: [],
  year: new Date().getFullYear().toString(),
  role: "",
  client: "",
};

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const isNew = projectId === "new";

  const [formData, setFormData] = useState<Partial<Project>>(initialProject);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data if editing
  useEffect(() => {
    if (!isNew && projectId) {
      loadProject(projectId);
    }
  }, [projectId, isNew]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Project;
        setFormData({ ...initialProject, ...data, id: docSnap.id });
      } else {
        setError("Project tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error loading project:", error);
      setError("Gagal memuat data project. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.title || !formData.desc) {
        throw new Error("Judul dan Deskripsi wajib diisi.");
      }

      if (isNew) {
        const newDocRef = doc(collection(db, "projects"));
        await setDoc(newDocRef, { ...formData, id: newDocRef.id });
      } else {
        await setDoc(doc(db, "projects", projectId), formData, { merge: true });
      }
      
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Error saving project:", err);
      setError(err.message || "Gagal menyimpan project.");
    } finally {
      setSaving(false);
    }
  };

  // --- Helper Functions for Arrays ---

  const addTech = () => {
    setFormData(prev => ({
      ...prev,
      techStack: [...(prev.techStack || []), { name: "", color: "#ffffff" }]
    }));
  };

  const removeTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack?.filter((_, i) => i !== index)
    }));
  };

  const updateTech = (index: number, field: "name" | "color", value: string) => {
    const newStack = [...(formData.techStack || [])];
    newStack[index] = { ...newStack[index], [field]: value };
    setFormData(prev => ({ ...prev, techStack: newStack }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), ""]
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (error && !formData.title && !isNew) {
     return (
        <ProtectedRoute>
          <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center max-w-md">
              <h3 className="text-xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </ProtectedRoute>
     );
  }

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
              <h1 className="font-heading text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-none">
                {isNew ? "Create New Project" : `Edit: ${formData.title}`}
              </h1>
            </div>
            
            {/* Desktop Save Button */}
            <div className="hidden md:block">
              <Button onClick={handleSubmit} disabled={saving} size="sm">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <main className="container-width py-6 md:py-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Basic Info Section */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                <Layers className="text-primary" size={20} /> Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title *</label>
                  <input required className="input-field font-bold text-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Project Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Subtitle</label>
                  <input className="input-field" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} placeholder="Short tagline" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description (Rich Text) *</label>
                <div className="min-h-[300px]">
                  <TiptapEditor 
                    content={formData.desc || ""} 
                    onChange={(html) => setFormData({...formData, desc: html})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                  <select className="input-field h-12" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="mobile">Mobile</option>
                    <option value="uiux">UI/UX</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Year</label>
                  <input className="input-field" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>
              </div>
            </section>

            {/* Media & Links */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                 <ImageIcon className="text-accent" size={20} /> Media & Links
              </h3>
              
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cover Image URL (Imgur)</label>
                <div className="flex gap-2">
                  <input 
                    className="input-field flex-1" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})} 
                    placeholder="https://i.imgur.com/..."
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 relative h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                    <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <span className="text-xs text-white/80 font-mono bg-black/50 px-2 py-1 rounded">{formData.image}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2"><LinkIcon size={12}/> Demo Link</label>
                  <input className="input-field" value={formData.demoLink} onChange={e => setFormData({...formData, demoLink: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2"><LinkIcon size={12}/> Repo Link</label>
                  <input className="input-field" value={formData.repoLink} onChange={e => setFormData({...formData, repoLink: e.target.value})} placeholder="https://github.com/..." />
                </div>
              </div>
            </section>

            {/* Tech Stack Manager */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold">Tech Stack</h3>
                <Button type="button" size="sm" variant="outline" onClick={addTech}><Plus size={14} className="mr-1"/> Add Tech</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.techStack?.map((tech, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-black/20 p-2 rounded-xl border border-white/5">
                    <input 
                      className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-foreground placeholder:text-muted-foreground" 
                      placeholder="Name (e.g React)"
                      value={tech.name}
                      onChange={e => updateTech(idx, "name", e.target.value)}
                    />
                    <div className="h-6 w-[1px] bg-white/10 mx-1" />
                    <input 
                      type="color"
                      className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0 p-0 overflow-hidden" 
                      value={tech.color || "#ffffff"}
                      onChange={e => updateTech(idx, "color", e.target.value)}
                    />
                    <button type="button" onClick={() => removeTech(idx)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
                {(!formData.techStack || formData.techStack.length === 0) && (
                  <p className="text-sm text-muted-foreground italic col-span-full text-center py-4">No tech stack added yet.</p>
                )}
              </div>
            </section>

            {/* Case Study Details */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-4">Case Study Details</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">The Challenge</label>
                <textarea 
                  className="input-field min-h-[120px] leading-relaxed" 
                  value={formData.challenge} 
                  onChange={e => setFormData({...formData, challenge: e.target.value})} 
                  placeholder="Describe the problem..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">The Solution</label>
                <textarea 
                  className="input-field min-h-[120px] leading-relaxed" 
                  value={formData.solution} 
                  onChange={e => setFormData({...formData, solution: e.target.value})} 
                  placeholder="How did you solve it?"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Key Features</label>
                  <Button type="button" size="sm" variant="ghost" onClick={addFeature} className="h-8"><Plus size={14} className="mr-1"/> Add Feature</Button>
                </div>
                {formData.features?.map((feature, idx) => (
                  <div key={idx} className="flex gap-2 group">
                    <input 
                      className="input-field flex-1" 
                      value={feature}
                      onChange={e => updateFeature(idx, e.target.value)}
                      placeholder={`Feature ${idx + 1}`}
                    />
                    <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300 p-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors">
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Mobile Sticky Save Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10 z-40">
              <Button type="submit" size="lg" className="w-full shadow-xl shadow-primary/20 h-12 text-base font-bold" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                {isNew ? "Create Project" : "Save Changes"}
              </Button>
            </div>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}