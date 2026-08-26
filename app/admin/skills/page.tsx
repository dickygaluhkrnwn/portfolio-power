"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, X, RefreshCw, Pencil, Trash2, LayoutGrid, List as ListIcon, 
  ArrowDownUp, Award, Box, FileBadge
} from "lucide-react";
import { getAllSkills, deleteSkill, SkillItem } from "@/lib/skills-service";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSkills() {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a">("a-z");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const loadData = async () => {
    setLoading(true);
    const data = await getAllSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus skill ini?")) {
      await deleteSkill(id);
      loadData();
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(skills.map(s => s.category));
    return ["all", ...Array.from(cats)];
  }, [skills]);

  const filteredData = useMemo(() => {
    let result = [...skills];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "a-z") return a.name.localeCompare(b.name);
      if (sortBy === "z-a") return b.name.localeCompare(a.name);
      return (a.order || 0) - (b.order || 0); // newest / default by order
    });

    return result;
  }, [skills, searchQuery, categoryFilter, sortBy]);

  const stats = useMemo(() => ({
    total: skills.length,
    withCert: skills.filter(s => s.hasCertificate).length,
    categoriesCount: categories.length - 1,
  }), [skills, categories]);

  return (
    <>
      <AdminPageHeader 
        title="Skills & Abilities" 
        description="Kelola daftar skill, teknologi, dan sertifikasi Anda." 
        actionButton={{ label: 'Tambah Skill', href: '/admin/skills/new' }}
      />
      {!loading && skills.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Box size={18} /></div>
            <div className="relative z-10">
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Total Skills</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><LayoutGrid size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Kategori</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.categoriesCount}</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0"><Award size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Bersertifikat</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.withCert}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-3 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 shadow-lg">
        {/* LEFT: Search */}
        <div className="relative w-full md:w-96 group shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari nama skill..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-sm text-white placeholder:text-gray-600 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* RIGHT: Filters & Tools */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          
          <div className="relative border border-white/10 rounded-xl bg-white/[0.02] flex items-center h-[42px] px-3 hover:bg-white/5 transition-colors shrink-0">
            <select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-300 outline-none appearance-none cursor-pointer pr-4 font-medium min-w-[120px]"
            >
              <option value="all" className="bg-[#111]">Semua Kategori</option>
              {categories.filter(c => c !== "all").map(cat => (
                <option key={cat} value={cat} className="bg-[#111]">{cat}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowDownUp className="w-3 h-3 text-gray-500" />
            </div>
          </div>

          <div className="relative border border-white/10 rounded-xl bg-white/[0.02] flex items-center h-[42px] px-3 hover:bg-white/5 transition-colors shrink-0">
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

          <div className="hidden md:flex items-center p-1 rounded-xl bg-white/[0.02] border border-white/10 h-[42px] shrink-0">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-lg transition-all", viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <Button variant="outline" onClick={loadData} size="icon" className="h-[42px] w-[42px] shrink-0 rounded-xl bg-white/[0.02] border-white/10 hover:bg-white/5 hover:text-white transition-colors">
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="min-h-[400px] relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin w-8 h-8 text-indigo-500 mb-4" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Sinkronisasi Skills...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <Box className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada skill ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba tambahkan skill baru atau ubah pencarian.</p>
          </motion.div>
        ) : (
          <motion.div layout className="w-full">
            
            <div className={cn(
              "flex flex-col gap-4",
              viewMode === "grid" ? "md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "md:hidden"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredData.map((skill) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={skill.id}
                  >
                    <SkillBentoCard 
                      skill={skill} 
                      onEdit={() => router.push(`/admin/skills/${skill.id}`)} 
                      onDelete={() => handleDelete(skill.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className={cn(
              "hidden bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-xl overflow-hidden",
              viewMode === "list" ? "md:block" : ""
            )}>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Skill & Kategori</th>
                    <th className="px-6 py-4 font-semibold">Sertifikasi</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((skill) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} key={skill.id} className="hover:bg-white/[0.02] transition-colors group">
                        
                        <td className="px-6 py-4">
                          <div className="font-bold text-white mb-1 flex items-center gap-3">
                            {skill.icon ? (
                              <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
                            ) : (
                              <Box size={16} className="text-indigo-400" />
                            )}
                            {skill.name}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                            {skill.category}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {skill.hasCertificate ? (
                            <div className="flex items-center gap-2 text-amber-400">
                              <Award size={14} />
                              <span className="text-xs font-medium">Bersertifikat</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-600">-</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-400" onClick={() => router.push(`/admin/skills/${skill.id}`)} title="Edit"><Pencil size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-400" onClick={() => handleDelete(skill.id)} title="Hapus"><Trash2 size={14}/></Button>
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



function SkillBentoCard({ skill, onEdit, onDelete }: { skill: SkillItem, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)] transition-all duration-300 flex flex-col h-full relative group overflow-hidden">
      
      {skill.color && (
        <div className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: skill.color }} />
      )}
      {!skill.color && (
        <div className="absolute top-0 left-0 w-1 bg-indigo-500/50 h-full opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {skill.icon ? (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Box size={18} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white truncate max-w-[200px]">{skill.name}</h3>
            <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest inline-block mt-1">
              {skill.category}
            </span>
          </div>
        </div>
        
        {skill.hasCertificate && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/30" title="Bersertifikat">
            <FileBadge size={14} />
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-4">
        <Button variant="outline" className="flex-1 rounded-xl bg-transparent border-white/10 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 text-gray-400 h-9" onClick={onEdit}>
          <Pencil size={14} className="mr-2" /> Edit
        </Button>
        <Button variant="outline" size="icon" className="w-10 rounded-xl bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-gray-500 h-9" onClick={onDelete}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
