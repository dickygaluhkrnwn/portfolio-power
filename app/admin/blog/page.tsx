"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Plus, Sparkles, Search, X, RefreshCw, ExternalLink, 
  Pencil, Trash2, FileText, CheckCircle2, Clock, Image as ImageIcon,
  ArrowDownUp, LayoutGrid, List as ListIcon
} from "lucide-react";
import { getAllPosts, deletePost, BlogPost } from "@/lib/blog-service";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ADVANCED FEATURES STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "a-z">("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list"); // Default desktop view

  const loadData = async () => {
    setLoading(true);
    const data = await getAllPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.")) {
      await deletePost(id);
      loadData();
    }
  };

  // --- LOGIC: FILTER & SORT ---
  const filteredData = useMemo(() => {
    let result = [...posts];

    // 1. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.slug.toLowerCase().includes(q) ||
        p.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      const isPub = statusFilter === "published";
      result = result.filter(p => p.isPublished === isPub);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (sortBy === "oldest") return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [posts, searchQuery, statusFilter, sortBy]);

  // --- STATS ---
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter(p => p.isPublished).length,
    drafts: posts.filter(p => !p.isPublished).length
  }), [posts]);

  return (
    <AdminLayout 
      title="Blog Management" 
      description="Kelola artikel, tutorial, dan publikasi konten untuk audiens Anda."
      actionButton={
        <Button onClick={() => router.push("/admin/blog/new")} size="lg" className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
          <Plus size={18} className="mr-2" /> Tulis Artikel Baru
        </Button>
      }
    >
      {/* --- QUICK INSIGHTS (STATS) --- */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><FileText size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Total Artikel</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0"><CheckCircle2 size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Published</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.published}</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0"><Clock size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Drafts</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.drafts}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- ADVANCED TOOLBAR --- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shadow-lg">
        
        {/* Left: Status Filter (Segmented Control) */}
        <div className="flex w-full md:w-auto p-1 bg-white/5 rounded-xl border border-white/5">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "flex-1 md:w-28 relative py-2 text-xs font-semibold uppercase tracking-wider transition-colors z-10",
                statusFilter === status ? "text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              {statusFilter === status && (
                <motion.div layoutId="blog-status-filter" className="absolute inset-0 bg-[#1a1a1a] rounded-lg border border-white/10 -z-10 shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {status === "all" ? "Semua" : status === "published" ? "Published" : "Draft"}
            </button>
          ))}
        </div>

        {/* Right: Search, Sort, View Mode & Refresh */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {/* Search */}
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari judul atau tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 text-sm text-white placeholder:text-gray-600 transition-all shadow-inner h-10"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <div className="relative border border-white/10 rounded-xl bg-black/40 flex items-center h-10 px-3 hover:bg-white/5 transition-colors">
              <ArrowDownUp size={14} className="text-gray-500 mr-2" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm text-gray-300 outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="newest" className="bg-[#111]">Terbaru</option>
                <option value="oldest" className="bg-[#111]">Terlama</option>
                <option value="a-z" className="bg-[#111]">A - Z</option>
              </select>
            </div>

            {/* View Mode Toggles (Hidden on Mobile, always Grid on Mobile) */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-black/40 border border-white/10 h-10">
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Tabel"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Grid/Card"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <Button variant="outline" onClick={loadData} size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-black/40 border-white/10 hover:bg-white/5 hover:text-white transition-colors">
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
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Sinkronisasi Artikel...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <Sparkles className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau filter status Anda.</p>
          </motion.div>
        ) : (
          <motion.div layout className="w-full">
            
            {/* TAMPILAN MOBILE (Selalu Cards) ATAU DESKTOP GRID VIEW */}
            <div className={cn(
              "flex flex-col gap-4",
              viewMode === "grid" ? "md:grid md:grid-cols-2 lg:grid-cols-3" : "md:hidden"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredData.map((post) => (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    transition={{ duration: 0.2 }} 
                    key={post.id}
                  >
                    <GridBlogCard post={post} onEdit={() => router.push(`/admin/blog/${post.id}`)} onDelete={() => handleDelete(post.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* TAMPILAN DESKTOP (LIST / TABLE VIEW) */}
            <div className={cn(
              "hidden bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-xl overflow-hidden",
              viewMode === "list" ? "md:block" : ""
            )}>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-1/2">Artikel & Detail</th>
                    <th className="px-6 py-4 font-semibold">Tgl Publikasi</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((post) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                        
                        {/* Column 1: Image + Title + Tags */}
                        <td className="px-6 py-5">
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#0d1117] border border-white/10 shrink-0 relative flex items-center justify-center">
                              {post.coverImage ? (
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={20} className="text-white/10" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <h4 className="font-bold text-white text-base truncate mb-1">{post.title}</h4>
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">/{post.slug}</span>
                                {post.tags && post.tags.length > 0 && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 uppercase tracking-wider">{post.tags[0]}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Date */}
                        <td className="px-6 py-5 text-gray-400 font-medium">
                          {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>

                        {/* Column 3: Status */}
                        <td className="px-6 py-5 text-center">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            post.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          )}>
                            {post.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        {/* Column 4: Actions */}
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 text-gray-400" onClick={() => window.open(`/blog/${post.slug}`)} title="Preview"><ExternalLink size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-400" onClick={() => router.push(`/admin/blog/${post.id}`)} title="Edit"><Pencil size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-400" onClick={() => handleDelete(post.id)} title="Hapus"><Trash2 size={14}/></Button>
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
    </AdminLayout>
  );
}

// --- LOCAL UI COMPONENT FOR GRID & MOBILE ---

function GridBlogCard({ post, onEdit, onDelete }: { post: BlogPost, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:border-white/20 transition-all group flex flex-col h-full">
      <div className="h-40 bg-[#0d1117] relative border-b border-white/5 shrink-0">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/5"><ImageIcon size={32} /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={cn(
            "px-2.5 py-1 rounded border text-[9px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg",
            post.isPublished ? "bg-emerald-500/80 border-emerald-400/50 text-white" : "bg-yellow-500/80 border-yellow-400/50 text-black"
          )}>
            {post.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1.5 uppercase tracking-wider">
          <Clock size={12} /> {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">{post.excerpt}</p>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-auto">
          <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg bg-transparent border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10" onClick={() => window.open(`/blog/${post.slug}`)}><ExternalLink size={14} className="mr-1.5"/> View</Button>
          <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg bg-transparent border-white/10 text-gray-400 hover:text-yellow-400 hover:border-yellow-500/30 hover:bg-yellow-500/10" onClick={onEdit}><Pencil size={14} className="mr-1.5"/> Edit</Button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg bg-transparent border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30" onClick={onDelete}><Trash2 size={14}/></Button>
        </div>
      </div>
    </div>
  );
}