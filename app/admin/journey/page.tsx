"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Plus, Sparkles, Search, X, RefreshCw, Pencil, Trash2, 
  Briefcase, GraduationCap, Award, ArrowDownUp, LayoutGrid, 
  GitCommit, Clock, Building2
} from "lucide-react";
import { getAllJourneyItems, deleteJourneyItem, JourneyItem } from "@/lib/journey-service";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminJourney() {
  const router = useRouter();
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ADVANCED FEATURES STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "work" | "education" | "certification">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline"); // Default to timeline

  const loadData = async () => {
    setLoading(true);
    const data = await getAllJourneyItems();
    setJourneyItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item journey ini? Tindakan ini permanen.")) {
      await deleteJourneyItem(id);
      loadData();
    }
  };

  // --- LOGIC: FILTER & SORT ---
  const filteredData = useMemo(() => {
    let result = [...journeyItems];

    // 1. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => 
        j.role.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) ||
        j.desc.toLowerCase().includes(q)
      );
    }

    // 2. Type Filter
    if (typeFilter !== "all") {
      result = result.filter(j => j.type === typeFilter);
    }

    // 3. Chronological Sort (Mencoba parse 4 digit pertama dari string year)
    result.sort((a, b) => {
      const getYear = (yearStr: string) => {
        const match = yearStr.match(/\d{4}/);
        return match ? parseInt(match[0], 10) : 0;
      };
      
      const yearA = getYear(a.year);
      const yearB = getYear(b.year);

      // Jika tahun sama, pertahankan urutan asli atau fallback ke ID
      if (yearA === yearB) return 0; 
      
      return sortBy === "newest" ? yearB - yearA : yearA - yearB;
    });

    return result;
  }, [journeyItems, searchQuery, typeFilter, sortBy]);

  // --- STATS ---
  const stats = useMemo(() => ({
    total: journeyItems.length,
    work: journeyItems.filter(j => j.type === "work").length,
    education: journeyItems.filter(j => j.type === "education").length,
    certification: journeyItems.filter(j => j.type === "certification").length,
  }), [journeyItems]);

  return (
    <AdminLayout 
      title="Journey Management" 
      description="Susun lini masa karir, edukasi, dan pencapaian profesional Anda."
      actionButton={
        <Button onClick={() => router.push("/admin/journey/new")} size="lg" className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
          <Plus size={18} className="mr-2" /> Tambah Journey
        </Button>
      }
    >
      {/* --- QUICK INSIGHTS (STATS) --- */}
      {!loading && journeyItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
            <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">Total Entri</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 md:p-5 flex flex-col justify-center relative overflow-hidden">
            <Briefcase className="absolute -right-2 -bottom-2 w-12 h-12 text-blue-500/10" />
            <p className="text-[10px] md:text-xs text-blue-400 font-mono uppercase tracking-widest mb-1">Pengalaman Kerja</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.work}</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 md:p-5 flex flex-col justify-center relative overflow-hidden">
            <GraduationCap className="absolute -right-2 -bottom-2 w-12 h-12 text-emerald-500/10" />
            <p className="text-[10px] md:text-xs text-emerald-400 font-mono uppercase tracking-widest mb-1">Edukasi</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.education}</p>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-4 md:p-5 flex flex-col justify-center relative overflow-hidden">
            <Award className="absolute -right-2 -bottom-2 w-12 h-12 text-yellow-500/10" />
            <p className="text-[10px] md:text-xs text-yellow-400 font-mono uppercase tracking-widest mb-1">Sertifikasi</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.certification}</p>
          </div>
        </div>
      )}

      {/* --- ADVANCED TOOLBAR --- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-3 flex flex-col lg:flex-row gap-4 justify-between items-center mb-10 shadow-lg">
        
        {/* Left: Type Filter (Interactive Pills) */}
        <div className="flex w-full lg:w-auto gap-2 overflow-x-auto pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")} icon={<Sparkles size={14}/>} label="Semua" />
          <FilterPill active={typeFilter === "work"} onClick={() => setTypeFilter("work")} icon={<Briefcase size={14}/>} label="Work" activeColor="text-blue-400 border-blue-500/30 bg-blue-500/10" />
          <FilterPill active={typeFilter === "education"} onClick={() => setTypeFilter("education")} icon={<GraduationCap size={14}/>} label="Education" activeColor="text-emerald-400 border-emerald-500/30 bg-emerald-500/10" />
          <FilterPill active={typeFilter === "certification"} onClick={() => setTypeFilter("certification")} icon={<Award size={14}/>} label="Certification" activeColor="text-yellow-400 border-yellow-500/30 bg-yellow-500/10" />
        </div>

        {/* Right: Search, Sort, View Mode & Refresh */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Search */}
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari role atau perusahaan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 text-sm text-white placeholder:text-gray-600 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort Toggle */}
            <button 
              onClick={() => setSortBy(prev => prev === "newest" ? "oldest" : "newest")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/5 transition-all text-sm text-gray-300 font-medium"
            >
              <ArrowDownUp className="w-4 h-4 text-gray-500" />
              {sortBy === "newest" ? "Terbaru" : "Terlama"}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.02] border border-white/10">
              <button 
                onClick={() => setViewMode("timeline")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "timeline" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Timeline"
              >
                <GitCommit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Grid/Card"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button variant="outline" onClick={loadData} size="icon" className="h-[42px] w-[42px] shrink-0 rounded-xl bg-white/[0.02] border-white/10 hover:bg-white/5 hover:text-white transition-colors">
              <RefreshCw size={16} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px] relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin w-8 h-8 text-primary mb-4" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Sinkronisasi Lini Masa...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <GitCommit className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada data ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau filter tipe Anda.</p>
          </motion.div>
        ) : (
          <motion.div layout className="w-full">
            
            {/* ===================================== */}
            {/* TAMPILAN TIMELINE (Khas Halaman Journey) */}
            {/* ===================================== */}
            {viewMode === "timeline" && (
              <div className="relative pl-6 md:pl-10 border-l border-white/10 space-y-10 py-4 ml-2 md:ml-4">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      key={item.id}
                      className="relative group"
                    >
                      {/* Timeline Node / Circle */}
                      <div className={cn(
                        "absolute -left-[35px] md:-left-[55px] w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#0a0a0a] border-2 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                        item.type === "work" ? "border-blue-500 text-blue-400 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" :
                        item.type === "education" ? "border-emerald-500 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                        "border-yellow-500 text-yellow-400 group-hover:bg-yellow-500/20 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                      )}>
                        {item.type === "work" ? <Briefcase size={12} className="md:w-3.5 md:h-3.5" /> : 
                         item.type === "education" ? <GraduationCap size={12} className="md:w-3.5 md:h-3.5" /> : 
                         <Award size={12} className="md:w-3.5 md:h-3.5" />}
                      </div>

                      {/* Content Card */}
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-lg hover:border-white/20 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                <Clock size={12} /> {item.year}
                              </span>
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border",
                                item.type === "work" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                item.type === "education" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              )}>
                                {item.type}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold font-heading text-white leading-tight">{item.role}</h3>
                            <p className="text-sm font-medium text-primary mt-1 flex items-center gap-1.5">
                              {item.type === "work" ? <Building2 size={14}/> : item.type === "education" ? <GraduationCap size={14}/> : <Award size={14}/>}
                              {item.company}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="h-8 bg-transparent border-white/10 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-400 px-3" onClick={() => router.push(`/admin/journey/${item.id}`)}>
                              <Pencil size={14} className="mr-1.5"/> Edit
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-gray-400 px-3" onClick={() => handleDelete(item.id)}>
                              <Trash2 size={14} className="mr-1.5"/> Hapus
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed font-light">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* ===================================== */}
            {/* TAMPILAN GRID (Alternatif) */}
            {/* ===================================== */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={item.id}
                      className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-lg hover:border-white/20 transition-all flex flex-col h-full group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner",
                          item.type === "work" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                          item.type === "education" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                          "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        )}>
                           {item.type === "work" ? <Briefcase size={18} /> : item.type === "education" ? <GraduationCap size={18} /> : <Award size={18} />}
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                          {item.year}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-white text-lg leading-snug mb-1">{item.role}</h3>
                      <p className="text-primary text-sm font-medium mb-4">{item.company}</p>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-6 flex-grow">{item.desc}</p>
                      
                      <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent border-white/10 hover:bg-yellow-500/10 hover:text-yellow-400 text-gray-400" onClick={() => router.push(`/admin/journey/${item.id}`)}>
                          <Pencil size={14} className="mr-1.5"/> Edit
                        </Button>
                        <Button variant="outline" size="icon" className="w-9 h-9 bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 text-gray-400 shrink-0" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

// --- LOCAL UI COMPONENT ---
function FilterPill({ active, onClick, icon, label, activeColor = "text-white border-white/30 bg-white/10" }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border outline-none",
        active ? activeColor : "bg-transparent border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      {icon} {label}
    </button>
  );
}