"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Plus, Sparkles, Search, X, RefreshCw, ExternalLink, Pencil, 
  Trash2, Share2, Link2, LayoutGrid, List as ListIcon, 
  ArrowDownUp, Copy, CheckCircle2, Globe, Layers
} from "lucide-react";
import { getAllSocials, deleteSocial, SocialLink } from "@/lib/socials-service";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSocials() {
  const router = useRouter();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ADVANCED FEATURES STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Linktree style default
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAllSocials();
    setSocials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus tautan ini?")) {
      await deleteSocial(id);
      loadData();
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- DYNAMIC CATEGORIES ---
  const categories = useMemo(() => {
    const cats = new Set(socials.map(s => s.category));
    return ["all", ...Array.from(cats)];
  }, [socials]);

  // --- LOGIC: FILTER & SORT ---
  const filteredData = useMemo(() => {
    let result = [...socials];

    // 1. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.platform.toLowerCase().includes(q) || 
        s.url.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "a-z") return a.platform.localeCompare(b.platform);
      if (sortBy === "z-a") return b.platform.localeCompare(a.platform);
      return 0; // newest / default
    });

    return result;
  }, [socials, searchQuery, categoryFilter, sortBy]);

  // --- STATS ---
  const stats = useMemo(() => ({
    total: socials.length,
    categoriesCount: categories.length - 1, // minus "all"
    socialMedia: socials.filter(s => s.category.toLowerCase().includes("social")).length,
  }), [socials, categories]);

  return (
    <>
      <AdminPageHeader 
        title="Link & Hubs" 
        description="Kelola tautan sosial media, GitHub, dan profil eksternal ala Linktree." 
        actionButton={{ label: 'Tambah Tautan', href: '/admin/socials/new' }}
      />
      {/* --- QUICK INSIGHTS (STATS) --- */}
      {!loading && socials.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0"><Link2 size={18} /></div>
            <div className="relative z-10">
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Total Tautan</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors" />
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><Share2 size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Kategori</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.categoriesCount}</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0"><Globe size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Social Accounts</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.socialMedia}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- ADVANCED TOOLBAR --- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-3 flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 shadow-lg">
        
        {/* Left: Dynamic Category Filter */}
        <div className="flex w-full lg:w-auto gap-2 overflow-x-auto pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {categories.map(cat => (
            <FilterPill 
              key={cat}
              active={categoryFilter === cat} 
              onClick={() => setCategoryFilter(cat)} 
              label={cat === "all" ? "Semua Tautan" : cat} 
            />
          ))}
        </div>

        {/* Right: Search, Sort, View Mode & Refresh */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Search */}
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-rose-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari platform atau URL..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-sm text-white placeholder:text-gray-600 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <div className="relative border border-white/10 rounded-xl bg-white/[0.02] flex items-center h-[42px] px-3 hover:bg-white/5 transition-colors">
              <ArrowDownUp size={14} className="text-gray-500 mr-2" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm text-gray-300 outline-none appearance-none cursor-pointer pr-4 font-medium"
              >
                <option value="newest" className="bg-[#111]">Default</option>
                <option value="a-z" className="bg-[#111]">A - Z</option>
                <option value="z-a" className="bg-[#111]">Z - A</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-white/[0.02] border border-white/10">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Kartu (Bento)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Tabel"
              >
                <ListIcon className="w-4 h-4" />
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
            <RefreshCw className="animate-spin w-8 h-8 text-rose-500 mb-4" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Sinkronisasi Tautan...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <Link2 className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada tautan ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau kategori Anda.</p>
          </motion.div>
        ) : (
          <motion.div layout className="w-full">
            
            {/* ===================================== */}
            {/* TAMPILAN GRID (Linktree/Bento Style) */}
            {/* ===================================== */}
            <div className={cn(
              "flex flex-col gap-4",
              viewMode === "grid" ? "md:grid md:grid-cols-2 lg:grid-cols-3" : "md:hidden"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredData.map((social) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={social.id}
                  >
                    <SocialBentoCard 
                      social={social} 
                      onEdit={() => router.push(`/admin/socials/${social.id}`)} 
                      onDelete={() => handleDelete(social.id)}
                      onCopy={() => handleCopy(social.url, social.id)}
                      isCopied={copiedId === social.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ===================================== */}
            {/* TAMPILAN LIST (Table) */}
            {/* ===================================== */}
            <div className={cn(
              "hidden bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-xl overflow-hidden",
              viewMode === "list" ? "md:block" : ""
            )}>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Platform & Kategori</th>
                    <th className="px-6 py-4 font-semibold w-1/2">Tautan (URL)</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((social) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} key={social.id} className="hover:bg-white/[0.02] transition-colors group">
                        
                        <td className="px-6 py-4">
                          <div className="font-bold text-white mb-1 flex items-center gap-2">
                            {social.platform}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                            {social.category}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 font-mono text-xs truncate max-w-[300px] xl:max-w-[400px]">
                              {social.url}
                            </span>
                            <button 
                              onClick={() => handleCopy(social.url, social.id)} 
                              className="text-gray-500 hover:text-white transition-colors"
                              title="Copy Link"
                            >
                              {copiedId === social.id ? <CheckCircle2 size={14} className="text-emerald-400"/> : <Copy size={14}/>}
                            </button>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 text-gray-400" onClick={() => window.open(social.url)} title="Lihat"><ExternalLink size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-400" onClick={() => router.push(`/admin/socials/${social.id}`)} title="Edit"><Pencil size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-400" onClick={() => handleDelete(social.id)} title="Hapus"><Trash2 size={14}/></Button>
                          </div>
                        </td>
                        
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

          </motion.div>
        )}
      </div>
    </>
  );
}

// --- LOCAL UI COMPONENTS ---

function FilterPill({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border outline-none capitalize",
        active 
          ? "text-white border-rose-500/50 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]" 
          : "bg-transparent border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      {label}
    </button>
  );
}

// --- BENTO CARD COMPONENT (Linktree Style) ---
function SocialBentoCard({ social, onEdit, onDelete, onCopy, isCopied }: { social: SocialLink, onEdit: () => void, onDelete: () => void, onCopy: () => void, isCopied: boolean }) {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-white/10 hover:border-rose-500/50 hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)] transition-all duration-300 flex flex-col h-full relative group overflow-hidden">
      
      <div className="absolute top-0 left-0 w-1 bg-rose-500/50 h-full opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Globe size={18} className="text-gray-400 group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white truncate max-w-[150px]">{social.platform}</h3>
            <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest inline-block mt-1">
              {social.category}
            </span>
          </div>
        </div>
        
        {/* Quick Copy Action */}
        <button 
          onClick={onCopy} 
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors border",
            isCopied ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/10"
          )}
          title="Copy Link"
        >
          {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-4 group-hover:border-white/10 transition-colors">
        <p className="text-xs text-gray-400 font-mono truncate w-full group-hover:text-gray-300 transition-colors">
          {social.url}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button variant="outline" className="flex-1 rounded-xl bg-transparent border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-gray-400 h-9" onClick={onEdit}>
          <Pencil size={14} className="mr-2" /> Edit
        </Button>
        <Button variant="outline" size="icon" className="w-10 rounded-xl bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-gray-500 h-9" onClick={onDelete}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}