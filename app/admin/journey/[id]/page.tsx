"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Loader2, Trash2, Briefcase, GraduationCap, 
  Award, MonitorPlay, Clock, Building2, CheckCircle2, MapPin
} from "lucide-react";
import { getJourneyItemById, saveJourneyItem, deleteJourneyItem, JourneyItem } from "@/lib/journey-service";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const data = await getJourneyItemById(id);
      if (data) setFormData(data);
      else setError("Data Journey tidak ditemukan.");
    } catch (err) {
      setError("Gagal memuat data journey.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!formData.role || !formData.company || !formData.year) {
        throw new Error("Posisi, Perusahaan, dan Tahun wajib diisi.");
      }
      await saveJourneyItem(formData, isNew ? undefined : id);
      router.push("/admin/journey");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan item journey.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini secara permanen?")) {
      setSaving(true);
      await deleteJourneyItem(id);
      router.push("/admin/journey");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  if (error && !formData.role && !isNew) {
    return (
       <ProtectedRoute>
         <div className="min-h-screen bg-[#050505] text-foreground flex flex-col items-center justify-center p-4">
           <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md shadow-2xl">
             <h3 className="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
             <p className="text-gray-400 mb-8">{error}</p>
             <Button onClick={() => router.push("/admin/journey")} className="rounded-full bg-red-500 hover:bg-red-600 text-white">
               Kembali ke Journey List
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
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/journey")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Entri Journey Baru" : formData.role || "Untitled Role"}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Mode" : "Editing Mode"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isNew && (
                <Button variant="outline" size="icon" onClick={handleDelete} disabled={saving} className="rounded-xl bg-transparent border-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 hidden md:flex">
                  <Trash2 size={16} />
                </Button>
              )}
              <span className="hidden md:flex text-xs font-mono text-gray-500 mr-2 items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", formData.role && formData.company ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]")} />
                {formData.role && formData.company ? "Ready to Save" : "Pending Fields"}
              </span>
              <Button onClick={() => handleSubmit()} disabled={saving} className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Tambahkan Entri" : "Simpan Perubahan"}
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
            {/* KOLOM KIRI: EDITOR FORM (Col 7) */}
            {/* ======================================================== */}
            <div className="lg:col-span-7">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* TYPE SELECTOR (INTERACTIVE CARDS) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Kategori / Tipe</label>
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <TypeSelector 
                        icon={<Briefcase size={20} />} 
                        label="Work" 
                        active={formData.type === "work"} 
                        onClick={() => setFormData({...formData, type: "work"})}
                        activeColor="border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
                      />
                      <TypeSelector 
                        icon={<GraduationCap size={20} />} 
                        label="Education" 
                        active={formData.type === "education"} 
                        onClick={() => setFormData({...formData, type: "education"})}
                        activeColor="border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
                      />
                      <TypeSelector 
                        icon={<Award size={20} />} 
                        label="Certification" 
                        active={formData.type === "certification"} 
                        onClick={() => setFormData({...formData, type: "certification"})}
                        activeColor="border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* MAIN INFO */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Posisi / Gelar *</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white font-bold text-xl placeholder:text-gray-700" 
                        value={formData.role} 
                        onChange={e => setFormData({...formData, role: e.target.value})} 
                        placeholder="Contoh: Senior Software Engineer" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Institusi / Perusahaan *</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            required 
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white text-sm placeholder:text-gray-700" 
                            value={formData.company} 
                            onChange={e => setFormData({...formData, company: e.target.value})} 
                            placeholder="Contoh: PT. Teknologi Nusantara" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Periode / Tahun *</label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            required 
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white font-mono text-sm placeholder:text-gray-700" 
                            value={formData.year} 
                            onChange={e => setFormData({...formData, year: e.target.value})} 
                            placeholder="2021 - Present" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Deskripsi & Pencapaian</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-gray-300 min-h-[160px] resize-y placeholder:text-gray-700 leading-relaxed text-sm" 
                      value={formData.desc} 
                      onChange={e => setFormData({...formData, desc: e.target.value})} 
                      placeholder="Jelaskan tanggung jawab utama, pencapaian penting, atau deskripsi singkat mengenai pengalaman ini..."
                    />
                  </div>

                  {/* Mobile Sticky Action Bar */}
                  <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10 z-40 flex gap-3">
                    {!isNew && (
                      <Button type="button" variant="destructive" size="lg" className="flex-1" onClick={handleDelete}>
                        <Trash2 size={18} />
                      </Button>
                    )}
                    <Button type="submit" size="lg" className="flex-[3] shadow-xl shadow-primary/20" disabled={saving}>
                      {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                      {isNew ? "Tambahkan" : "Simpan"}
                    </Button>
                  </div>

                </form>
              </div>
            </div>

            {/* ======================================================== */}
            {/* KOLOM KANAN: LIVE PREVIEW (Col 5) */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 relative hidden sm:block">
              <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MonitorPlay size={16} className="text-primary"/> Live Timeline Preview
                    </h3>
                  </div>

                  {/* THE TIMELINE PREVIEW UI */}
                  <div className="relative pl-8 border-l-2 border-white/10 py-2 ml-4">
                    
                    {/* The Node */}
                    <div className={cn(
                      "absolute -left-[17px] w-8 h-8 rounded-full bg-[#0a0a0a] border-2 flex items-center justify-center shadow-lg transition-all duration-300",
                      formData.type === "work" ? "border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" :
                      formData.type === "education" ? "border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                      "border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                    )}>
                      {formData.type === "work" ? <Briefcase size={14} /> : 
                       formData.type === "education" ? <GraduationCap size={14} /> : 
                       <Award size={14} />}
                    </div>

                    {/* The Content Card */}
                    <div className={cn(
                      "bg-[#0a0a0a] border rounded-2xl p-5 shadow-lg transition-all duration-300",
                      formData.type === "work" ? "border-blue-500/30" :
                      formData.type === "education" ? "border-emerald-500/30" :
                      "border-yellow-500/30"
                    )}>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          <Clock size={10} /> {formData.year || "Tahun..."}
                        </span>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                          formData.type === "work" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          formData.type === "education" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        )}>
                          {formData.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold font-heading text-white leading-tight mb-1">
                        {formData.role || "Judul Posisi / Gelar..."}
                      </h3>
                      
                      <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-4">
                        {formData.type === "work" ? <Building2 size={12} className="text-primary"/> : 
                         formData.type === "education" ? <GraduationCap size={12} className="text-primary"/> : 
                         <MapPin size={12} className="text-primary"/>}
                        {formData.company || "Nama Perusahaan / Institusi..."}
                      </p>

                      <div className="w-full h-px bg-white/5 mb-4" />

                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        {formData.desc || "Deskripsi pengalaman Anda akan muncul di sini. Tuliskan ringkasan yang menarik agar terlihat profesional."}
                      </p>
                    </div>

                  </div>
                  {/* End Timeline Preview */}

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
function TypeSelector({ icon, label, active, onClick, activeColor }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 outline-none",
        active ? activeColor : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
      )}
    >
      <div className={cn(
        "p-2 rounded-full transition-colors",
        active ? "bg-current/10" : "bg-black/20"
      )}>
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <motion.div
          layoutId="type-selector-active"
          className="absolute inset-0 border-2 rounded-2xl border-inherit pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </button>
  );
}