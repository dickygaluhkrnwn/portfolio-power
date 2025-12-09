"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getAllServices } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  Check, MessageSquare, Clock, ArrowRight, Loader2, Sparkles, 
  Search, X 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Kategori disesuaikan dengan data baru (Web Focused)
const categories = [
  { id: "all", label: "Semua Paket" },
  { id: "frontend", label: "Frontend Website" },
  { id: "fullstack", label: "Fullstack / Sistem" },
  { id: "backend", label: "Backend / API" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function loadData() {
      const data = await getAllServices();
      setServices(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Logic Filtering
  const filteredServices = services.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleWhatsApp = (pkg: ServicePackage) => {
    const phone = "6285904320201"; 
    const message = `Halo Iky, saya tertarik dengan paket *${pkg.title}* (${pkg.price}). Bisa diskusi lebih lanjut?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleNego = (pkgTitle: string) => {
    const phone = "6285904320201";
    const message = `Halo Iky, saya ingin negosiasi harga untuk paket *${pkgTitle}*. Apakah bisa?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-32 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Investasi Digital</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Pilih Paket, <br/><span className="text-gradient-primary">Mulai Digital.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Jelajahi 16 pilihan paket layanan spesifik untuk kebutuhan website Anda. Transparan dan profesional.
            </p>
          </motion.div>
        </div>

        {/* --- SEARCH & FILTER SECTION --- */}
        <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-y border-white/5 py-4 mb-12 -mx-4 px-4 md:mx-0 md:rounded-2xl md:border">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari paket (misal: Toko Online)..." 
                className="w-full pl-10 pr-10 py-2.5 bg-secondary/10 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Tabs (Scrollable) */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex gap-2 min-w-max px-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-medium transition-all border",
                      activeCategory === cat.id 
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                        : "bg-transparent border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                    className={cn(
                      "relative flex flex-col p-6 rounded-2xl border transition-all duration-300 h-full group",
                      item.recommended 
                        ? "bg-secondary/20 border-primary/50 shadow-xl shadow-primary/5 z-10 ring-1 ring-primary/20" 
                        : "bg-secondary/10 border-white/5 hover:border-white/20 hover:bg-secondary/15"
                    )}
                  >
                    {/* Recommended Badge */}
                    {item.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent px-3 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-lg whitespace-nowrap">
                        Best Value
                      </div>
                    )}

                    <div className="mb-6 border-b border-white/5 pb-4">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        {item.category.toUpperCase()}
                      </div>
                      <h3 className="font-heading text-lg font-bold mb-2 leading-snug min-h-[44px] flex items-center">
                        {item.title}
                      </h3>
                      <div className="text-xl font-bold text-foreground mb-1">{item.price}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={12} className="text-primary" /> {item.duration}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 min-h-[60px] line-clamp-3">
                      {item.description}
                    </p>

                    <div className="space-y-2.5 mb-8 flex-grow">
                      {item.features.slice(0, 6).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <div className="mt-0.5 min-w-[14px]">
                            <Check size={14} className="text-green-400" />
                          </div>
                          <span className="text-foreground/80 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto space-y-3">
                      <Button 
                        className="w-full rounded-xl group text-sm h-11" 
                        variant={item.recommended ? "primary" : "outline"}
                        onClick={() => handleWhatsApp(item)}
                      >
                        Pilih Paket <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <button 
                        onClick={() => handleNego(item.title)}
                        className="w-full flex items-center justify-center gap-2 text-[11px] text-muted-foreground hover:text-white transition-colors py-2"
                      >
                        <MessageSquare size={12} /> Nego Harga via WhatsApp
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <Search size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Paket tidak ditemukan</h3>
                <p className="text-muted-foreground">Coba ubah kata kunci atau filter kategori.</p>
                <button 
                  onClick={() => {setSearchQuery(""); setActiveCategory("all");}}
                  className="mt-4 text-primary text-sm hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}