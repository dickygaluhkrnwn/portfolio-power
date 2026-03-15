"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Plus, Sparkles, Search, X, RefreshCw, ExternalLink, Pencil, 
  Trash2, DollarSign, Zap, Star, ArrowDownUp, LayoutGrid, 
  List as ListIcon, CheckCircle2, Tag
} from "lucide-react";
import { getAllServices, deleteService } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminServices() {
  const router = useRouter();
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ADVANCED FEATURES STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Services look best in grid by default

  const loadData = async () => {
    setLoading(true);
    const data = await getAllServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket layanan ini?")) {
      await deleteService(id);
      loadData();
    }
  };

  // --- DYNAMIC CATEGORIES ---
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ["all", ...Array.from(cats)];
  }, [services]);

  // --- LOGIC: FILTER & SORT ---
  const filteredData = useMemo(() => {
    let result = [...services];

    // 1. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) ||
        s.features?.some(f => f.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter);
    }

    // 3. Smart Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return 0; // Assuming initial fetch is already chronological or by ID
      
      // Extract numbers from price strings (e.g., "Rp 5.000.000" -> 5000000)
      const getPriceValue = (priceStr: string) => {
        const num = parseInt(priceStr.replace(/\D/g, ''), 10);
        return isNaN(num) ? 0 : num;
      };

      const priceA = getPriceValue(a.price);
      const priceB = getPriceValue(b.price);

      return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
    });

    return result;
  }, [services, searchQuery, categoryFilter, sortBy]);

  // --- STATS ---
  const stats = useMemo(() => ({
    total: services.length,
    promo: services.filter(s => s.isFlashSale).length,
    recommended: services.filter(s => s.recommended).length,
  }), [services]);

  return (
    <AdminLayout 
      title="Services Management" 
      description="Kelola etalase paket layanan, harga, dan penawaran spesial Anda."
      actionButton={
        <Button onClick={() => router.push("/admin/services/new")} size="lg" className="w-full md:w-auto rounded-xl shadow-lg shadow-purple-500/20 bg-purple-600 text-white hover:bg-purple-500 font-bold tracking-wide border border-purple-500/50">
          <Plus size={18} className="mr-2" /> Buat Layanan Baru
        </Button>
      }
    >
      {/* --- QUICK INSIGHTS (STATS) --- */}
      {!loading && services.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0"><Tag size={18} /></div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">Total Paket</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/30 transition-colors" />
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0"><Zap size={18} /></div>
            <div className="relative z-10">
              <p className="text-[10px] md:text-xs text-red-400/80 font-mono uppercase tracking-widest">Active Promo</p>
              <p className="text-xl md:text-2xl font-bold text-red-100">{stats.promo}</p>
            </div>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500/20 rounded-full blur-2xl group-hover:bg-yellow-500/30 transition-colors" />
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0"><Star size={18} /></div>
            <div className="relative z-10">
              <p className="text-[10px] md:text-xs text-yellow-400/80 font-mono uppercase tracking-widest">Unggulan</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-100">{stats.recommended}</p>
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
              label={cat === "all" ? "Semua Layanan" : cat} 
            />
          ))}
        </div>

        {/* Right: Search, Sort, View Mode & Refresh */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Search */}
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari paket layanan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 text-sm text-white placeholder:text-gray-600 transition-all"
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
                <option value="price-asc" className="bg-[#111]">Termurah</option>
                <option value="price-desc" className="bg-[#111]">Termahal</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-white/[0.02] border border-white/10">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300")}
                title="Tampilan Kartu (Pricing)"
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
            <RefreshCw className="animate-spin w-8 h-8 text-purple-500 mb-4" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Sinkronisasi Layanan...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <DollarSign className="w-12 h-12 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada layanan ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau kategori Anda.</p>
          </motion.div>
        ) : (
          <motion.div layout className="w-full">
            
            {/* ===================================== */}
            {/* TAMPILAN GRID (Pricing Cards SaaS Style) */}
            {/* ===================================== */}
            <div className={cn(
              "flex flex-col gap-6",
              viewMode === "grid" ? "md:grid md:grid-cols-2 lg:grid-cols-3" : "md:hidden"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredData.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={service.id}
                  >
                    <PricingCard 
                      service={service} 
                      onEdit={() => router.push(`/admin/services/${service.id}`)} 
                      onDelete={() => handleDelete(service.id)} 
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
                    <th className="px-6 py-4 font-semibold">Nama Paket & Kategori</th>
                    <th className="px-6 py-4 font-semibold">Harga & Durasi</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((service) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} key={service.id} className="hover:bg-white/[0.02] transition-colors group">
                        
                        <td className="px-6 py-4">
                          <div className="font-bold text-white mb-1 truncate max-w-[250px]">{service.title}</div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider truncate max-w-[250px]">{service.category}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="font-bold text-purple-400 mb-1">{service.price}</div>
                          <div className="text-[10px] text-gray-500 font-mono tracking-wider">{service.duration}</div>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            {service.isFlashSale && <span className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border-red-500/20">Flash Sale</span>}
                            {service.recommended && <span className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Recommended</span>}
                            {!service.isFlashSale && !service.recommended && <span className="text-[10px] text-gray-600 font-mono">Regular</span>}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 text-gray-400" onClick={() => window.open(`/services/${service.id}`)} title="Lihat"><ExternalLink size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-400" onClick={() => router.push(`/admin/services/${service.id}`)} title="Edit"><Pencil size={14}/></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-transparent border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-400" onClick={() => handleDelete(service.id)} title="Hapus"><Trash2 size={14}/></Button>
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

// --- LOCAL UI COMPONENTS ---

function FilterPill({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border outline-none capitalize",
        active 
          ? "text-white border-purple-500/50 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
          : "bg-transparent border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      {label}
    </button>
  );
}

// --- PRICING CARD COMPONENT ---
function PricingCard({ service, onEdit, onDelete }: { service: ServicePackage, onEdit: () => void, onDelete: () => void }) {
  // Determine card styling based on status
  const isSpecial = service.isFlashSale || service.recommended;
  const cardBorder = service.isFlashSale ? "border-red-500/50" : service.recommended ? "border-yellow-500/50" : "border-white/10 hover:border-white/20";
  const glowEffect = service.isFlashSale ? "shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]" : service.recommended ? "shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)]" : "shadow-lg";

  return (
    <div className={cn(
      "bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col h-full transition-all duration-300 border relative overflow-hidden group",
      cardBorder, glowEffect
    )}>
      {/* Background Subtle Gradient for Special Cards */}
      {isSpecial && (
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full",
          service.isFlashSale ? "bg-red-500" : "bg-yellow-500"
        )} />
      )}

      {/* Header Badges */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-widest">
          {service.category}
        </span>
        <div className="flex gap-2">
          {service.isFlashSale && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30">
              <Zap size={10} className="fill-current"/> Promo
            </span>
          )}
          {service.recommended && !service.isFlashSale && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
              <Star size={10} className="fill-current"/> Unggulan
            </span>
          )}
        </div>
      </div>

      {/* Title & Price */}
      <h3 className="text-xl font-bold text-white mb-2 leading-tight relative z-10">{service.title}</h3>
      <div className="mb-2 relative z-10">
        <span className={cn("text-3xl font-heading font-bold tracking-tight", service.isFlashSale ? "text-red-400" : "text-purple-400")}>
          {service.price}
        </span>
      </div>
      <p className="text-xs text-gray-500 font-mono mb-6 pb-6 border-b border-white/10">{service.duration}</p>

      {/* Features List */}
      <div className="flex-grow space-y-3 mb-8">
        {service.features?.slice(0, 4).map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300 leading-snug">{feature}</span>
          </div>
        ))}
        {(service.features?.length || 0) > 4 && (
          <div className="flex items-center gap-2 pt-2">
            <span className="w-4 h-px bg-white/20" />
            <span className="text-xs text-gray-500 font-mono italic">+ {(service.features?.length || 0) - 4} fitur lainnya</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 relative z-10">
        <Button variant="outline" className="flex-1 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:text-white" onClick={onEdit}>
          <Pencil size={14} className="mr-2" /> Edit Layanan
        </Button>
        <Button variant="outline" size="icon" className="w-11 rounded-xl bg-transparent border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-gray-500" onClick={onDelete}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}