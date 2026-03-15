"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Loader2, Trash2, Github, Linkedin, Twitter, 
  Instagram, Globe, PenTool, Music, MonitorPlay, 
  Briefcase, MessageCircle, Link2, CheckCircle2, X, Youtube, Facebook
} from "lucide-react";
import { getSocialById, saveSocial, deleteSocial, SocialLink } from "@/lib/socials-service";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialData: Partial<SocialLink> = {
  platform: "",
  url: "",
  category: "professional",
  active: true,
};

// Helper untuk ikon dinamis berdasarkan nama platform
const getPlatformIcon = (platform: string, size = 18) => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Github size={size} />;
  if (p.includes("linkedin")) return <Linkedin size={size} />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter size={size} />;
  if (p.includes("facebook")) return <Facebook size={size} />;
  if (p.includes("instagram")) return <Instagram size={size} />;
  if (p.includes("youtube")) return <Youtube size={size} />;
  if (p.includes("dribbble") || p.includes("behance") || p.includes("medium")) return <PenTool size={size} />;
  if (p.includes("spotify") || p.includes("soundcloud")) return <Music size={size} />;
  if (p.includes("whatsapp") || p.includes("telegram") || p.includes("discord")) return <MessageCircle size={size} />;
  return <Globe size={size} />;
};

export default function SocialFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<SocialLink>>(initialData);
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
      setError(null);
      const data = await getSocialById(id);
      if (data) setFormData(data);
      else setError("Tautan tidak ditemukan.");
    } catch (err) {
      setError("Gagal memuat data tautan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.platform || !formData.url) {
        throw new Error("Platform dan URL wajib diisi.");
      }
      
      // Auto-formatting URL if missing http/https
      let finalUrl = formData.url.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:')) {
        finalUrl = `https://${finalUrl}`;
      }

      await saveSocial({ ...formData, url: finalUrl }, isNew ? undefined : id);
      router.push("/admin/socials");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan tautan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus tautan ini secara permanen?")) {
      setSaving(true);
      await deleteSocial(id);
      router.push("/admin/socials");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-rose-500 w-10 h-10" /></div>;
  }

  if (error && !formData.platform && !isNew) {
    return (
       <ProtectedRoute>
         <div className="min-h-screen bg-[#050505] text-foreground flex flex-col items-center justify-center p-4">
           <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md shadow-2xl">
             <h3 className="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
             <p className="text-gray-400 mb-8">{error}</p>
             <Button onClick={() => router.push("/admin/socials")} className="rounded-full bg-red-500 hover:bg-red-600 text-white">
               Kembali ke Link Hubs
             </Button>
           </div>
         </div>
       </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground pb-24 relative selection:bg-rose-500/30 selection:text-white">
        
        {/* Background FX (Rose Theme) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-clip fixed">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* --- STICKY HEADER --- */}
        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/socials")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Tautan Baru" : formData.platform || "Untitled Link"}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Link" : "Editing Link"}
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
                <div className={cn("w-2 h-2 rounded-full", formData.platform && formData.url ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]")} />
                {formData.platform && formData.url ? "Ready to Save" : "Pending Fields"}
              </span>
              <Button onClick={() => handleSubmit()} disabled={saving} className="w-full sm:w-auto rounded-xl shadow-lg shadow-rose-500/20 bg-rose-600 text-white hover:bg-rose-500 font-bold tracking-wide border border-rose-500/50">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Tambahkan Link" : "Simpan Perubahan"}
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
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                
                {/* Subtle internal glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* MAIN INFO */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Platform Name *</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 focus:border-rose-500/50 outline-none transition-colors text-white font-bold text-xl md:text-2xl placeholder:text-gray-700" 
                        value={formData.platform} 
                        onChange={e => setFormData({...formData, platform: e.target.value})} 
                        placeholder="Contoh: GitHub, LinkedIn, Dribbble..." 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">URL Profile *</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors">
                          <Link2 size={18} />
                        </div>
                        <input 
                          required 
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-rose-500/50 outline-none transition-colors text-gray-300 font-mono text-sm placeholder:text-gray-700" 
                          value={formData.url} 
                          onChange={e => setFormData({...formData, url: e.target.value})} 
                          placeholder="https://..." 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* CATEGORY SELECTOR (INTERACTIVE CARDS) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Pilih Kategori</label>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <CategoryCard 
                        icon={<Briefcase size={18} />} 
                        label="Professional" 
                        desc="LinkedIn, GitHub, Resume"
                        active={formData.category === "professional"} 
                        onClick={() => setFormData({...formData, category: "professional"})}
                        activeColor="border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]"
                      />
                      <CategoryCard 
                        icon={<PenTool size={18} />} 
                        label="Creative" 
                        desc="Dribbble, Behance, Medium"
                        active={formData.category === "creative"} 
                        onClick={() => setFormData({...formData, category: "creative"})}
                        activeColor="border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]"
                      />
                      <CategoryCard 
                        icon={<Instagram size={18} />} 
                        label="Social" 
                        desc="Instagram, Twitter/X"
                        active={formData.category === "social"} 
                        onClick={() => setFormData({...formData, category: "social"})}
                        activeColor="border-rose-500 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]"
                      />
                      <CategoryCard 
                        icon={<Globe size={18} />} 
                        label="Other" 
                        desc="Website, Link Lainnya"
                        active={formData.category === "other"} 
                        onClick={() => setFormData({...formData, category: "other"})}
                        activeColor="border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* STATUS TOGGLE */}
                  <div className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                        <Globe size={16} className={formData.active ? "text-emerald-400" : "text-gray-500"}/> Visibilitas Profil
                      </h4>
                      <p className="text-xs text-gray-500">Tentukan apakah tautan ini dimunculkan di halaman publik (Contact/Navbar).</p>
                    </div>
                    <div 
                      className={cn(
                        "relative flex items-center w-28 h-10 rounded-full p-1 cursor-pointer transition-colors border",
                        formData.active ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/5 border-white/10"
                      )}
                      onClick={() => setFormData({...formData, active: !formData.active})}
                    >
                      <div className={cn(
                        "absolute flex items-center justify-center w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-full transition-transform duration-300 ease-in-out shadow-sm",
                        formData.active ? "translate-x-full bg-emerald-500 text-white" : "translate-x-0 bg-gray-500 text-white"
                      )}>
                        {formData.active ? <CheckCircle2 size={14} /> : <X size={14} />}
                      </div>
                      <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-emerald-400 z-10">ON</div>
                      <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 z-10">OFF</div>
                    </div>
                  </div>

                  {/* Mobile Sticky Action Bar */}
                  <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10 z-40 flex gap-3">
                    {!isNew && (
                      <Button type="button" variant="destructive" size="lg" className="flex-1" onClick={handleDelete}>
                        <Trash2 size={18} />
                      </Button>
                    )}
                    <Button type="submit" size="lg" className="flex-[3] shadow-xl shadow-rose-500/20 bg-rose-600 hover:bg-rose-500 border border-rose-500/50 text-white" disabled={saving}>
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
                      <MonitorPlay size={16} className="text-rose-400"/> Live Bento Preview
                    </h3>
                  </div>

                  {/* THE BENTO CARD PREVIEW UI */}
                  <div className="pointer-events-none select-none scale-[0.95] origin-top">
                    <div className={cn(
                      "bg-[#0a0a0a] rounded-2xl p-5 border transition-all duration-300 flex flex-col relative overflow-hidden",
                      formData.active ? "border-rose-500/30 shadow-[0_0_30px_-10px_rgba(244,63,94,0.15)]" : "border-white/10 opacity-70"
                    )}>
                      
                      {/* Glow Accent */}
                      {formData.active && (
                        <div className="absolute top-0 left-0 w-1 bg-rose-500/50 h-full" />
                      )}

                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                            formData.active ? "bg-white/5 border-white/10 text-rose-400" : "bg-black/20 border-white/5 text-gray-600"
                          )}>
                            {getPlatformIcon(formData.platform || "globe", 20)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white truncate max-w-[150px]">
                              {formData.platform || "Platform Name"}
                            </h3>
                            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest inline-block mt-1">
                              {formData.category || "Kategori"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                        <p className={cn(
                          "text-xs font-mono truncate w-full",
                          formData.url ? "text-gray-300" : "text-gray-600"
                        )}>
                          {formData.url || "https://..."}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Warning Info if Not Active */}
                  {!formData.active && (
                    <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3 text-yellow-400/80">
                      <Globe size={16} className="shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">
                        Tautan ini sedang disembunyikan. Klien dan pengunjung web tidak akan melihat tautan ini di halaman Contact atau navigasi manapun.
                      </p>
                    </div>
                  )}

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
function CategoryCard({ icon, label, desc, active, onClick, activeColor }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-3 p-4 rounded-2xl border transition-all duration-300 outline-none text-left",
        active ? activeColor : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-colors border",
        active ? "bg-current/10 border-current/20" : "bg-black/20 border-white/5"
      )}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold">{label}</div>
        <div className={cn("text-[10px] mt-0.5", active ? "opacity-80" : "text-gray-500")}>{desc}</div>
      </div>
      {active && (
        <motion.div
          layoutId="category-selector-active"
          className="absolute inset-0 border-2 rounded-2xl border-inherit pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </button>
  );
}