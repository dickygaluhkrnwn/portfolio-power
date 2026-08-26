"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Loader2, Trash2, Box, Award,
  MonitorPlay, Hash, CheckCircle2, X, FileBadge, Link2,
  Plus, Sparkles, FolderGit2, Star, Clock, Trophy
} from "lucide-react";
import { getSkillById, saveSkill, deleteSkill, SkillItem, SkillProject } from "@/lib/skills-service";
import { Project } from "@/app/data/projects";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialData: Partial<SkillItem> = {
  name: "",
  category: "Digital Marketing",
  description: "",
  hasCertificate: false,
  certificateUrl: "",
  color: "",
  order: 0,
  projectsUsed: [],
  proficiency: "Intermediate",
  experienceYears: 1,
  isFeatured: false,
};

const SUGGESTED_CATEGORIES = [
  "Digital Marketing", 
  "API Integrations", 
  "Design", 
  "Organization/Soft Skills", 
  "Web Development",
  "Other"
];

const PROFICIENCIES = ["Familiar", "Intermediate", "Advanced", "Expert", "Professional"];

export default function SkillFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<SkillItem>>(initialData);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for dynamic category
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [id, isNew]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isNew && id) {
        const data = await getSkillById(id);
        if (data) {
          setFormData(data);
          if (!SUGGESTED_CATEGORIES.includes(data.category)) {
            setIsCustomCategory(true);
            setCustomCategory(data.category);
          }
        } else {
          setError("Skill tidak ditemukan.");
        }
      }
    } catch (err) {
      setError("Gagal memuat data skill.");
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.name) throw new Error("Nama skill wajib diisi.");
      
      const finalCategory = isCustomCategory ? customCategory : formData.category;
      if (!finalCategory) throw new Error("Kategori wajib diisi.");

      let finalUrl = formData.certificateUrl?.trim() || "";
      if (formData.hasCertificate && finalUrl && !finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
      }

      await saveSkill({ 
        ...formData, 
        category: finalCategory,
        certificateUrl: finalUrl 
      }, isNew ? undefined : id);
      
      router.push("/admin/skills");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus skill ini secara permanen?")) {
      setSaving(true);
      await deleteSkill(id);
      router.push("/admin/skills");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground pb-24 relative selection:bg-indigo-500/30 selection:text-white">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-clip fixed">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/skills")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Skill Baru" : formData.name || "Untitled Skill"}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Skill" : "Editing Skill"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isNew && (
                <Button variant="outline" size="icon" onClick={handleDelete} disabled={saving} className="rounded-xl bg-transparent border-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 hidden md:flex">
                  <Trash2 size={16} />
                </Button>
              )}
              <Button onClick={() => handleSubmit()} disabled={saving} className="w-full sm:w-auto rounded-xl shadow-lg shadow-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-500 font-bold tracking-wide border border-indigo-500/50">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Simpan Skill" : "Update Skill"}
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
            <div className="lg:col-span-7">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* --- BASIC INFO --- */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Nama Skill *</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-colors text-white font-bold text-xl md:text-2xl placeholder:text-gray-700" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Contoh: Google Ads, React.js..." 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">URL Icon Logo (Opsional)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="text"
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-colors text-white font-medium text-sm placeholder:text-gray-700" 
                          value={formData.icon || ""} 
                          onChange={e => setFormData({...formData, icon: e.target.value})} 
                          onBlur={() => {
                            let val = formData.icon?.trim();
                            if (!val) return;
                            if (val.match(/\.(jpeg|jpg|gif|png|svg|webp|ico)$/i) || val.includes("google.com/s2") || val.includes("clearbit.com")) return;
                            try {
                              let domain = val;
                              if (val.includes("http")) domain = new URL(val).hostname;
                              setFormData({ ...formData, icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128` });
                            } catch(e) {}
                          }}
                          placeholder="https://example.com/logo.png atau cukup ketik canva.com" 
                        />
                        {formData.icon && (
                          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <img src={formData.icon} alt="Preview" className="w-6 h-6 object-contain" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 ml-1 mt-1">Bisa pakai URL gambar (.png/.svg), atau cukup ketik nama webnya (contoh: <b>canva.com</b> atau <b>google.com</b>), nanti otomatis jadi logo!</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Mini Deskripsi (Opsional)</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-colors text-gray-300 font-medium text-sm placeholder:text-gray-700 min-h-[100px] resize-none" 
                        value={formData.description || ""} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        placeholder="Ceritakan sedikit tentang seberapa dalam kamu menguasai skill ini, atau tools apa saja yang kamu pakai..." 
                      />
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* --- CATEGORY --- */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Kategori Skill *</label>
                      <button 
                        type="button"
                        onClick={() => setIsCustomCategory(!isCustomCategory)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                      >
                        {isCustomCategory ? "Pilih dari template" : "Buat kategori sendiri"}
                      </button>
                    </div>

                    {isCustomCategory ? (
                      <input 
                        required 
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/30 focus:border-indigo-500 outline-none transition-colors text-white font-bold" 
                        value={customCategory} 
                        onChange={e => setCustomCategory(e.target.value)} 
                        placeholder="Masukkan Kategori Custom (e.g. Finance Tech)" 
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SUGGESTED_CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({...formData, category: cat})}
                            className={cn(
                              "relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 outline-none text-left",
                              formData.category === cat ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]" : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
                            )}
                          >
                            <div className="text-sm font-bold">{cat}</div>
                            {formData.category === cat && (
                              <motion.div
                                layoutId="category-selector-active"
                                className="absolute inset-0 border-2 rounded-2xl border-indigo-500 pointer-events-none"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* --- ADVANCED "SELLING" INFO --- */}
                  <div className="space-y-6">
                    <h3 className="font-bold text-white flex items-center gap-2"><Trophy size={18} className="text-indigo-400"/> Nilai Jual (Selling Points)</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tingkat Kemahiran</label>
                        <div className="relative border border-white/10 rounded-xl bg-white/5 flex items-center h-[50px] px-3 focus-within:border-indigo-500/50 transition-colors">
                          <select 
                            value={formData.proficiency || "Intermediate"} 
                            onChange={(e) => setFormData({...formData, proficiency: e.target.value as any})}
                            className="bg-transparent text-sm text-white outline-none w-full appearance-none cursor-pointer pr-4 font-bold"
                          >
                            {PROFICIENCIES.map(p => <option key={p} value={p} className="bg-[#111]">{p}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Pengalaman (Tahun)</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <Clock size={16} />
                          </div>
                          <input 
                            type="number"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none transition-colors text-white font-bold" 
                            value={formData.experienceYears || 0} 
                            onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} 
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.04] transition-colors"
                         onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}>
                      <div>
                        <h4 className="text-white font-bold text-sm flex items-center gap-2">
                          <Star size={16} className={formData.isFeatured ? "text-amber-400 fill-amber-400" : "text-gray-500"}/> 
                          Jadikan "Featured Skill"
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">Skill ini akan disorot di bagian paling atas halaman portfolio/about.</p>
                      </div>
                      <div className={cn(
                        "w-10 h-6 rounded-full p-1 transition-colors relative",
                        formData.isFeatured ? "bg-amber-500" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white transition-transform",
                          formData.isFeatured ? "translate-x-4" : "translate-x-0"
                        )} />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />



                  {/* --- CERTIFICATE & MISC --- */}
                  <div className="space-y-4">
                    <div className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                          <Award size={16} className={formData.hasCertificate ? "text-amber-400" : "text-gray-500"}/> Sertifikasi
                        </h4>
                        <p className="text-xs text-gray-500">Apakah Anda memiliki sertifikat resmi untuk skill ini?</p>
                      </div>
                      <div 
                        className={cn(
                          "relative flex items-center w-28 h-10 rounded-full p-1 cursor-pointer transition-colors border shrink-0",
                          formData.hasCertificate ? "bg-amber-500/20 border-amber-500/30" : "bg-white/5 border-white/10"
                        )}
                        onClick={() => setFormData({...formData, hasCertificate: !formData.hasCertificate})}
                      >
                        <div className={cn(
                          "absolute flex items-center justify-center w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-full transition-transform duration-300 ease-in-out shadow-sm",
                          formData.hasCertificate ? "translate-x-full bg-amber-500 text-white" : "translate-x-0 bg-gray-500 text-white"
                        )}>
                          {formData.hasCertificate ? <CheckCircle2 size={14} /> : <X size={14} />}
                        </div>
                        <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-amber-400 z-10">YA</div>
                        <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 z-10">TDK</div>
                      </div>
                    </div>

                    {formData.hasCertificate && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">URL Sertifikat (Opsional)</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-400 transition-colors">
                            <Link2 size={18} />
                          </div>
                          <input 
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 outline-none transition-colors text-gray-300 font-mono text-sm placeholder:text-gray-700" 
                            value={formData.certificateUrl} 
                            onChange={e => setFormData({...formData, certificateUrl: e.target.value})} 
                            placeholder="https://..." 
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Mobile Action */}
                  <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10 z-40 flex gap-3">
                    <Button type="submit" size="lg" className="w-full shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 text-white" disabled={saving}>
                      {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                      {isNew ? "Tambahkan" : "Simpan"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden sm:block">
              <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MonitorPlay size={16} className="text-indigo-400"/> Card Preview
                    </h3>
                  </div>

                  <div className="pointer-events-none select-none scale-[0.95] origin-top">
                    <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 transition-all duration-300 flex flex-col relative overflow-hidden">
                      {formData.color ? (
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: formData.color }} />
                      ) : (
                        <div className="absolute top-0 left-0 w-1 bg-indigo-500/50 h-full" />
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-white truncate max-w-[200px] flex items-center gap-2">
                            {formData.name || "Nama Skill"}
                            {formData.isFeatured && <Star size={16} className="text-amber-400 fill-amber-400" />}
                          </h3>
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest inline-block mt-1">
                            {isCustomCategory ? customCategory || "Kategori" : formData.category}
                          </span>
                        </div>
                        {formData.hasCertificate && (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <FileBadge size={14} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-xs font-mono text-gray-400">
                        <span className="flex items-center gap-1.5"><Award size={14}/> {formData.proficiency || "Proficiency"}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {formData.experienceYears || 0} Tahun</span>
                      </div>

                      {formData.description && (
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                          {formData.description}
                        </p>
                      )}

                      {(formData.projectsUsed?.length || 0) > 0 && (
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Dipakai di {formData.projectsUsed?.length} Project:</p>
                          <div className="flex gap-2">
                            {formData.projectsUsed?.slice(0,3).map((p, i) => (
                              <div key={i} className="text-xs bg-white/5 px-2 py-1 rounded truncate max-w-[100px] text-gray-300">
                                {p.projectName || "Project"}
                              </div>
                            ))}
                            {(formData.projectsUsed?.length || 0) > 3 && (
                              <div className="text-xs bg-white/5 px-2 py-1 rounded text-gray-500">+{formData.projectsUsed!.length - 3}</div>
                            )}
                          </div>
                        </div>
                      )}
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
