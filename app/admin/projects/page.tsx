"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Search, X, RefreshCw, ExternalLink, Pencil, Trash2 } from "lucide-react";
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
    const q = searchQuery.toLowerCase();
    return projects.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  return (
    <AdminLayout 
      title="Projects Management" 
      description="Kelola portofolio project yang akan ditampilkan di halaman utama."
      actionButton={
        <Button onClick={() => router.push("/admin/projects/new")} size="lg" className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
          <Plus size={18} className="mr-2" /> Buat Project Baru
        </Button>
      }
    >
      <AdminToolbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onRefresh={loadData} 
        itemCount={filteredData.length} 
        loading={loading} 
      />

      <div className="min-h-[400px]">
        {filteredData.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <Sparkles className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada data</h3>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredData.map((p) => (
                <MobileCard key={p.id} title={p.title} subtitle={p.category} status={p.featured ? "Featured" : ""}>
                  <ActionButtons onView={() => window.open(`/projects/${p.id}`)} onEdit={() => router.push(`/admin/projects/${p.id}`)} onDelete={() => handleDelete(String(p.id))} />
                </MobileCard>
              ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
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
                      <TableCell primary={p.title} secondary={p.category} />
                      <TableCell text={`${p.techStack?.length || 0} Tech Stack Digunakan`} />
                      <TableStatus status={p.featured ? "Featured" : "Standard"} type={p.featured ? "success" : "neutral"} />
                      <TableActions onView={() => window.open(`/projects/${p.id}`)} onEdit={() => router.push(`/admin/projects/${p.id}`)} onDelete={() => handleDelete(String(p.id))} />
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// --- LOCAL UI COMPONENTS (Fully Customizable for Projects Page) ---

function AdminToolbar({ searchQuery, setSearchQuery, onRefresh, itemCount, loading, children }: any) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="relative w-full sm:w-96 group">
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
      
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {children}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm font-mono text-gray-500 hidden sm:inline-block">{itemCount} Item</span>
          <Button variant="outline" onClick={onRefresh} className="w-full sm:w-auto rounded-xl bg-[#0a0a0a] border-white/10 hover:bg-white/5 hover:text-white transition-colors">
            <RefreshCw size={16} className={cn("mr-2", loading && "animate-spin")} /> Refresh
          </Button>
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