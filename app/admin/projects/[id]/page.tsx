"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash, Loader2, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { Project } from "@/app/data/projects";
import TiptapEditor from "@/components/ui/tiptap-editor";

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
  const [error, setError] = useState<string | null>(null); // New Error State

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
        // Merge with initial data to ensure all fields exist
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
      // Basic Validation
      if (!formData.title || !formData.desc) {
        throw new Error("Judul dan Deskripsi wajib diisi.");
      }

      if (isNew) {
        // Create new
        const newDocRef = doc(collection(db, "projects"));
        await setDoc(newDocRef, { ...formData, id: newDocRef.id });
      } else {
        // Update existing
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

  // Render Error State
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
      <div className="min-h-screen bg-background text-foreground pb-20">
        <header className="border-b border-white/10 bg-secondary/5 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-heading text-xl font-bold">
              {isNew ? "Create New Project" : "Edit Project"}
            </h1>
          </div>
        </header>

        <main className="container-width py-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            
            {/* Show Error Alert inside form if save fails */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-400 text-sm mb-6 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Basic Info Section */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <input required className="input-field font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <input className="input-field" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Rich Text) *</label>
                <TiptapEditor 
                  content={formData.desc || ""} 
                  onChange={(html) => setFormData({...formData, desc: html})} 
                />
                <p className="text-xs text-muted-foreground">Gunakan editor ini untuk membuat paragraf, list, atau format teks lainnya.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="mobile">Mobile</option>
                    <option value="uiux">UI/UX</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <input className="input-field" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>
              </div>
            </section>

            {/* Media & Links */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                 <ImageIcon size={18} /> Media & Links
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL (Imgur Link)</label>
                <input 
                  className="input-field" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://i.imgur.com/..."
                />
                {formData.image && (
                  <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Demo Link (URL)</label>
                  <input className="input-field" value={formData.demoLink} onChange={e => setFormData({...formData, demoLink: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Repo Link (GitHub)</label>
                  <input className="input-field" value={formData.repoLink} onChange={e => setFormData({...formData, repoLink: e.target.value})} />
                </div>
              </div>
            </section>

            {/* Tech Stack Manager */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                <h3 className="text-lg font-bold">Tech Stack</h3>
                <Button type="button" size="sm" variant="outline" onClick={addTech}><Plus size={14} className="mr-1"/> Add Tech</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.techStack?.map((tech, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-black/20 p-2 rounded-lg">
                    <input 
                      className="input-field flex-1 text-sm" 
                      placeholder="Tech Name (e.g React)"
                      value={tech.name}
                      onChange={e => updateTech(idx, "name", e.target.value)}
                    />
                    <input 
                      type="color"
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" 
                      value={tech.color || "#ffffff"}
                      onChange={e => updateTech(idx, "color", e.target.value)}
                    />
                    <button type="button" onClick={() => removeTech(idx)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Case Study Details */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Case Study Details</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">The Challenge</label>
                <textarea className="input-field min-h-[100px]" value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">The Solution</label>
                <textarea className="input-field min-h-[100px]" value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Key Features</label>
                  <Button type="button" size="sm" variant="ghost" onClick={addFeature}><Plus size={14}/> Add Feature</Button>
                </div>
                {formData.features?.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      className="input-field flex-1" 
                      value={feature}
                      onChange={e => updateFeature(idx, e.target.value)}
                    />
                    <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300 p-2">
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Submit Button */}
            <div className="sticky bottom-4 flex justify-end">
              <Button type="submit" size="lg" className="shadow-xl shadow-primary/20" disabled={saving}>
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