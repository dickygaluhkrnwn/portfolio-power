"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Search, X, RefreshCw, ExternalLink, Pencil, Trash2, LayoutGrid, List } from "lucide-react";
import { getAllProjects } from "@/lib/projects-service";
import { Project } from "@/app/data/projects";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New States
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const loadData = async () => {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus project ini?")) {
      await deleteDoc(doc(db, "projects", id));
      loadData();
    }
  };

  const filteredData = useMemo(() => {
    let result = [...projects];

    // 1. Text Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // 2. Type Filter
    if (filterType !== "all") {
      result = result.filter(p => (p.projectType || "software") === filterType);
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title-asc": return a.title.localeCompare(b.title);
        case "title-desc": return b.title.localeCompare(a.title);
        case "newest": return Number(b.year || 0) - Number(a.year || 0);
        case "oldest": return Number(a.year || 0) - Number(b.year || 0);
        default: return 0;
      }
    });

    return result;
  }, [projects, searchQuery, filterType, sortBy]);

  return (
    <>
      <AdminPageHeader 
        title="Projects Management" 
        description="Kelola portofolio project yang akan ditampilkan di halaman utama." 
        actionButton={{ label: 'Buat Project Baru', href: '/admin/projects/new' }}
      />
      <AdminToolbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={loadData} 
        itemCount={filteredData.length} 
        loading={loading} 
      />

      <div className="min-h-[400px]">
        {filteredData.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <Sparkles className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada data</h3>
            <p className="text-gray-500 text-sm">Cobalah ubah filter pencarian Anda.</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW (Selalu Card) */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredData.map((p) => (
                <MobileCard key={p.id} title={p.title} subtitle={`${p.projectType || 'software'} • ${p.category}`} status={p.featured ? "Featured" : ""}>
                  <ActionButtons onView={() => window.open(`/projects/${p.id}`)} onEdit={() => router.push(`/admin/projects/${p.id}`)} onDelete={() => handleDelete(String(p.id))} />
                </MobileCard>
              ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block">
              {viewMode === "list" ? (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-white/5 text-xs uppercase tracking-widest text-gray-500 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Informasi Utama</th>
                        <th className="px-6 py-4 font-semibold">Detail Spesifik</th>
                        <th className="px-6 py-4 font-semibold text-center">Status / Label</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredData.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell primary={p.title} secondary={`${p.projectType || 'software'} • ${p.category}`} />
                          <TableCell text={`${p.techStack?.length || 0} Tech Stack/Tools`} />
                          <TableStatus status={p.featured ? "Featured" : "Standard"} type={p.featured ? "success" : "neutral"} />
                          <TableActions onView={() => window.open(`/projects/${p.id}`)} onEdit={() => router.push(`/admin/projects/${p.id}`)} onDelete={() => handleDelete(String(p.id))} />
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((p) => (
                    <DesktopGridCard 
                      key={p.id} 
                      project={p}
                      onView={() => window.open(`/projects/${p.id}`)} 
                      onEdit={() => router.push(`/admin/projects/${p.id}`)} 
                      onDelete={() => handleDelete(String(p.id))}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// --- LOCAL UI COMPONENTS (Fully Customizable for Projects Page) ---

function AdminToolbar({ 
  searchQuery, setSearchQuery, 
  filterType, setFilterType,
  sortBy, setSortBy,
  viewMode, setViewMode,
  onRefresh, itemCount, loading 
}: any) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96 group shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari project..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 text-sm text-white placeholder:text-gray-600 transition-all shadow-inner"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          {/* Filters */}
          <div className="relative">
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 text-white text-sm font-bold rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-primary/50 appearance-none min-w-[140px] cursor-pointer"
            >
              <option value="all">Semua Tipe</option>
              <option value="software">💻 Software & App</option>
              <option value="marketing">📈 Marketing</option>
              <option value="design">🎨 Design</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 text-white text-sm font-bold rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-primary/50 appearance-none min-w-[140px] cursor-pointer"
            >
              <option value="title-asc">Urutkan: A - Z</option>
              <option value="title-desc">Urutkan: Z - A</option>
              <option value="newest">Paling Baru</option>
              <option value="oldest">Paling Lama</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex bg-[#0a0a0a] border border-white/10 rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-lg transition-colors", viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-white")}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded-lg transition-colors", viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-white")}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block mx-1" />

          <Button variant="outline" size="icon" onClick={onRefresh} className="rounded-xl bg-[#0a0a0a] border-white/10 hover:bg-white/5 hover:text-white transition-colors shrink-0">
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </Button>
        </div>
      </div>
      
      <div className="text-sm font-mono text-gray-500 flex items-center justify-between">
        <span>Total: <span className="text-white font-bold">{itemCount}</span> Project ditemukan</span>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

function DesktopGridCard({ project, onView, onEdit, onDelete }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 hover:border-primary/50 transition-colors rounded-2xl overflow-hidden shadow-xl group flex flex-col h-full">
      <div className="h-44 relative bg-white/5 border-b border-white/10 overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-[#111]">
            <Sparkles size={24} className="mb-2 opacity-50"/>
            <span className="text-xs uppercase tracking-widest font-mono">No Cover</span>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg shadow-emerald-500/20">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md rounded-lg p-1.5 flex gap-1 border border-white/10">
          <button onClick={onView} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors"><ExternalLink size={14}/></button>
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors"><Pencil size={14}/></button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-colors"><Trash2 size={14}/></button>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/>
          {project.projectType || 'software'} • {project.category}
        </div>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {project.desc || "Tidak ada deskripsi yang ditambahkan untuk project ini."}
        </p>
        <div className="pt-4 border-t border-white/10 text-[11px] font-mono font-bold text-gray-500 flex justify-between items-center">
          <span>{project.techStack?.length || 0} Tech / Tools</span>
          <span>{project.year || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-white/[0.02] transition-colors group">{children}</tr>;
}

function TableCell({ primary, secondary, text }: any) {
  if (text) return <td className="px-6 py-4 text-gray-400">{text}</td>;
  return (
    <td className="px-6 py-4">
      <div className="font-medium text-white mb-1 truncate max-w-[300px]">{primary}</div>
      {secondary && <div className="text-xs text-gray-500 font-mono uppercase tracking-wider truncate max-w-[300px]">{secondary}</div>}
    </td>
  );
}

function TableStatus({ status, type = "neutral" }: { status: string, type?: "success" | "warning" | "danger" | "neutral" }) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-white/5 text-gray-400 border-white/10",
  };
  return (
    <td className="px-6 py-4 text-center">
      <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border", styles[type as keyof typeof styles] || styles.neutral)}>
        {status}
      </span>
    </td>
  );
}

function ActionButtons({ onView, onEdit, onDelete }: any) {
  return (
    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      {onView && (
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 text-gray-400" onClick={onView} title="Lihat"><ExternalLink size={14}/></Button>
      )}
      {onEdit && (
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-400" onClick={onEdit} title="Edit"><Pencil size={14}/></Button>
      )}
      {onDelete && (
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-400" onClick={onDelete} title="Hapus"><Trash2 size={14}/></Button>
      )}
    </div>
  );
}

function TableActions(props: any) {
  return <td className="px-6 py-4 text-right"><ActionButtons {...props} /></td>;
}

function MobileCard({ title, subtitle, status, children }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <h3 className="font-bold text-white text-base truncate">{title}</h3>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider truncate">{subtitle}</p>
        </div>
        {status && <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/10 text-gray-300 shrink-0">{status}</span>}
      </div>
      <div className="pt-4 border-t border-white/5 flex justify-end">{children}</div>
    </div>
  );
}