"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Plus, Trash2, Loader2, Image as ImageIcon, 
  Link as LinkIcon, Layers, FileText, CheckCircle2,
  ArrowUp, ArrowDown, Sparkles, LayoutPanelTop, MonitorPlay, Code2, X
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { Project } from "@/app/data/projects";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

type TabType = "general" | "content" | "media" | "tech";

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const isNew = projectId === "new";

  const [formData, setFormData] = useState<Partial<Project>>(initialProject);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("general");

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.title || !formData.desc) {
        throw new Error("Judul dan Deskripsi Utama wajib diisi.");
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

  // --- Helper Functions for Arrays (With SORTING Feature) ---

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

  const moveTech = (index: number, direction: 'up' | 'down') => {
    const newStack = [...(formData.techStack || [])];
    if (direction === 'up' && index > 0) {
      [newStack[index - 1], newStack[index]] = [newStack[index], newStack[index - 1]];
    } else if (direction === 'down' && index < newStack.length - 1) {
      [newStack[index + 1], newStack[index]] = [newStack[index], newStack[index + 1]];
    }
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

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...(formData.features || [])];
    if (direction === 'up' && index > 0) {
      [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
    } else if (direction === 'down' && index < newFeatures.length - 1) {
      [newFeatures[index + 1], newFeatures[index]] = [newFeatures[index], newFeatures[index + 1]];
    }
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  if (error && !formData.title && !isNew) {
     return (
        <ProtectedRoute>
          <div className="min-h-screen bg-[#050505] text-foreground flex flex-col items-center justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-400 mb-8">{error}</p>
              <Button onClick={() => router.push("/admin/dashboard")} className="rounded-full bg-red-500 hover:bg-red-600 text-white">
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </ProtectedRoute>
     );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground pb-24 relative selection:bg-primary/30 selection:text-white">
        
        {/* Background FX */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-clip fixed">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* --- STICKY HEADER --- */}
        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/dashboard")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Project Baru" : formData.title}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Mode" : "Editing Mode"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="hidden md:flex text-xs font-mono text-gray-500 mr-2 items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", formData.title ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]")} />
                {formData.title ? "Ready to Save" : "Pending Title"}
              </span>
              <Button onClick={() => handleSubmit()} disabled={saving} className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Publish Project" : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ======================================================== */}
            {/* KOLOM KIRI: EDITOR (Col 7 atau 8) */}
            {/* ======================================================== */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Premium Tab Navigation */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden shadow-inner sticky top-[88px] z-40 backdrop-blur-xl">
                <TabBtn active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={<LayoutPanelTop size={14} />} label="General Info" />
                <TabBtn active={activeTab === "content"} onClick={() => setActiveTab("content")} icon={<FileText size={14} />} label="Case Study" />
                <TabBtn active={activeTab === "media"} onClick={() => setActiveTab("media")} icon={<ImageIcon size={14} />} label="Media & Links" />
                <TabBtn active={activeTab === "tech"} onClick={() => setActiveTab("tech")} icon={<Code2 size={14} />} label="Tech Stack" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl min-h-[500px]"
                >
                  {/* --- TAB: GENERAL INFO --- */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Judul Project *</label>
                          <input 
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white font-bold text-xl placeholder:text-gray-700" 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            placeholder="Contoh: Nexa - AI Productivity App" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Kategori</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white appearance-none cursor-pointer" 
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value as any})}
                          >
                            <option value="frontend" className="bg-[#111]">Frontend</option>
                            <option value="backend" className="bg-[#111]">Backend</option>
                            <option value="fullstack" className="bg-[#111]">Full Stack</option>
                            <option value="mobile" className="bg-[#111]">Mobile App</option>
                            <option value="uiux" className="bg-[#111]">UI/UX Design</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tahun Rilis</label>
                          <input 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                            value={formData.year} 
                            onChange={e => setFormData({...formData, year: e.target.value})} 
                            placeholder="2024"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Role Anda</label>
                          <input 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                            value={formData.role} 
                            onChange={e => setFormData({...formData, role: e.target.value})} 
                            placeholder="Lead Frontend Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Subtitle / Slogan</label>
                          <input 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                            value={formData.subtitle} 
                            onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                            placeholder="Empowering productivity with AI."
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2 mt-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2">
                            <Sparkles size={14} className="text-primary"/> Tampilkan di Highlight?
                          </label>
                          <div 
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                              formData.featured ? "bg-primary/10 border-primary/30" : "bg-white/5 border-white/10 hover:border-white/20"
                            )}
                            onClick={() => setFormData({...formData, featured: !formData.featured})}
                          >
                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", formData.featured ? "border-primary bg-primary" : "border-gray-500")}>
                              {formData.featured && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <div>
                              <div className={cn("text-sm font-bold", formData.featured ? "text-primary" : "text-white")}>Tandai sebagai Featured Project</div>
                              <div className="text-xs text-gray-500">Project akan muncul besar di halaman utama dan disorot dengan badge emas.</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* --- TAB: CASE STUDY (CONTENT) --- */}
                  {activeTab === "content" && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex justify-between">
                          <span>Deskripsi Utama (Rich Text) *</span>
                        </label>
                        <TiptapEditor 
                          content={formData.desc || ""} 
                          onChange={(html) => setFormData({...formData, desc: html})} 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-red-400 ml-1 flex items-center gap-2">The Challenge</label>
                          <textarea 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-colors text-gray-300 min-h-[150px] resize-none" 
                            value={formData.challenge} 
                            onChange={e => setFormData({...formData, challenge: e.target.value})} 
                            placeholder="Apa masalah atau tantangan utama yang dihadapi?"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-green-400 ml-1 flex items-center gap-2">The Solution</label>
                          <textarea 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500/50 outline-none transition-colors text-gray-300 min-h-[150px] resize-none" 
                            value={formData.solution} 
                            onChange={e => setFormData({...formData, solution: e.target.value})} 
                            placeholder="Bagaimana Anda menyelesaikannya secara elegan?"
                          />
                        </div>
                      </div>

                      {/* --- ADVANCED FEATURE LIST WITH SORTING --- */}
                      <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Key Features List</label>
                          <Button type="button" size="sm" variant="outline" onClick={addFeature} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-xs h-8">
                            <Plus size={14} className="mr-1"/> Add Feature
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {formData.features?.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 group">
                              <div className="flex flex-col gap-0.5">
                                <button type="button" onClick={() => moveFeature(idx, 'up')} disabled={idx === 0} className="text-gray-500 hover:text-primary disabled:opacity-20 transition-colors"><ArrowUp size={14}/></button>
                                <button type="button" onClick={() => moveFeature(idx, 'down')} disabled={idx === formData.features!.length - 1} className="text-gray-500 hover:text-primary disabled:opacity-20 transition-colors"><ArrowDown size={14}/></button>
                              </div>
                              <input 
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-sm text-gray-300 flex-1" 
                                value={feature}
                                onChange={e => updateFeature(idx, e.target.value)}
                                placeholder="Contoh: Real-time synchronization dengan WebSocket"
                              />
                              <button type="button" onClick={() => removeFeature(idx)} className="text-red-500/50 hover:text-red-400 p-2.5 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          {(!formData.features || formData.features.length === 0) && (
                            <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                              <p className="text-sm text-gray-500">Belum ada fitur ditambahkan.</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* --- TAB: MEDIA & LINKS --- */}
                  {activeTab === "media" && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Cover Image URL</label>
                        <input 
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                          value={formData.image} 
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                          placeholder="https://i.imgur.com/... atau URL gambar lainnya"
                        />
                        
                        {/* Live Image Preview (Glassmorphism) */}
                        {formData.image && (
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl mt-4 group">
                            <img 
                              src={formData.image} 
                              alt="Cover Preview" 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                              onError={(e) => (e.currentTarget.src = "https://grainy-gradients.vercel.app/noise.svg")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 pointer-events-none">
                              <span className="text-[10px] font-mono text-gray-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Live Preview</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2"><MonitorPlay size={14}/> Live Demo URL</label>
                          <input 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700 text-sm" 
                            value={formData.demoLink} 
                            onChange={e => setFormData({...formData, demoLink: e.target.value})} 
                            placeholder="https://your-project.vercel.app" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2"><Code2 size={14}/> Repository URL</label>
                          <input 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700 text-sm" 
                            value={formData.repoLink} 
                            onChange={e => setFormData({...formData, repoLink: e.target.value})} 
                            placeholder="https://github.com/username/repo" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: TECH STACK (WITH SORTING) --- */}
                  {activeTab === "tech" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-white">Kelola Tech Stack</h3>
                          <p className="text-xs text-gray-500 mt-1">Susun teknologi utama yang digunakan di proyek ini.</p>
                        </div>
                        <Button type="button" size="sm" onClick={addTech} className="rounded-xl shadow-lg shadow-primary/20 bg-white/10 text-white hover:bg-white/20 border border-white/10">
                          <Plus size={14} className="mr-1"/> Tambah Tech
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.techStack?.map((tech, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 group hover:border-white/20 transition-colors">
                            {/* Sort Controls */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <button type="button" onClick={() => moveTech(idx, 'up')} disabled={idx === 0} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors"><ArrowUp size={12}/></button>
                              <button type="button" onClick={() => moveTech(idx, 'down')} disabled={idx === formData.techStack!.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors"><ArrowDown size={12}/></button>
                            </div>
                            
                            {/* Color Picker */}
                            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20 shadow-inner">
                              <input 
                                type="color"
                                className="absolute -inset-2 w-12 h-12 cursor-pointer bg-transparent border-0 p-0" 
                                value={tech.color || "#ffffff"}
                                onChange={e => updateTech(idx, "color", e.target.value)}
                              />
                            </div>

                            {/* Name Input */}
                            <input 
                              className="w-full bg-transparent border-b border-transparent focus:border-white/20 outline-none text-sm text-white font-medium placeholder:text-gray-700 transition-colors py-1" 
                              placeholder="Nama Tech (e.g React)"
                              value={tech.name}
                              onChange={e => updateTech(idx, "name", e.target.value)}
                            />
                            
                            {/* Delete */}
                            <button type="button" onClick={() => removeTech(idx)} className="text-gray-500 hover:text-red-400 p-1.5 transition-colors shrink-0">
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {(!formData.techStack || formData.techStack.length === 0) && (
                        <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                          <Code2 className="w-8 h-8 mx-auto text-gray-600 mb-3" />
                          <p className="text-sm text-gray-500">Belum ada Tech Stack yang ditambahkan.</p>
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ======================================================== */}
            {/* KOLOM KANAN: LIVE PREVIEW CARD (Col 4) */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-[112px] flex flex-col gap-6">
                
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MonitorPlay size={16} className="text-primary"/> Live Card Preview
                    </h3>
                  </div>

                  {/* Render the actual UI Card with current formData! */}
                  <div className="pointer-events-none select-none scale-[0.9] origin-top">
                    {/* Simplified version of ProjectCard for Preview to avoid loop dependencies */}
                    <div className={cn(
                      "group relative bg-[#0a0a0a] rounded-3xl border overflow-hidden flex flex-col h-full transition-all duration-500",
                      formData.featured ? "border-primary/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)]" : "border-white/10"
                    )}>
                      <div className="h-40 bg-[#0d1117] relative overflow-hidden border-b border-white/5 shrink-0">
                        {formData.image ? (
                           <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                           <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                              <ImageIcon size={32} className="text-white/10" />
                           </div>
                        )}
                        {formData.featured && (
                          <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-primary/90 text-white text-[9px] font-bold rounded-md uppercase tracking-widest shadow-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Sorotan
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow relative z-20 bg-[#0a0a0a]">
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 block">
                          {formData.category || "Kategori"}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-white line-clamp-1 mb-2">
                          {formData.title || "Judul Project"}
                        </h3>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                          {formData.subtitle || "Tuliskan deskripsi singkat atau subtitle project..."}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {formData.techStack?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1">
                              {tech.color && <span className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: tech.color }}/>}
                              {tech.name || "Tech"}
                            </span>
                          ))}
                          {(formData.techStack?.length || 0) > 3 && (
                             <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-white/[0.02] text-gray-500 border border-white/5">
                               +{(formData.techStack?.length || 0) - 3}
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Status</p>
                      <p className={cn("text-xs font-mono font-medium", formData.featured ? "text-emerald-400" : "text-gray-300")}>
                        {formData.featured ? "Featured" : "Standard"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Kelengkapan</p>
                      <p className="text-xs font-mono font-medium text-gray-300">
                        {formData.title && formData.desc ? "100%" : "Incomplete"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// --- SUB-COMPONENTS ---
function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        "relative flex items-center justify-center gap-2 py-2 px-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap outline-none rounded-xl",
        active 
          ? "text-white font-bold bg-white/10" 
          : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      <span className={cn(active ? "text-primary" : "opacity-70")}>{icon}</span>
      {label}
    </button>
  );
}