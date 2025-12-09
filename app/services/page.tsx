"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getAllServices } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  Search, X, Loader2, Sparkles, Filter, 
  Star, ShoppingCart, Heart, Eye, Zap, Timer 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Kategori (Update sesuai data baru)
const categories = [
  { id: "all", label: "Semua Produk" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Fullstack App" },
  { id: "maintenance", label: "Maintenance" },
];

export default function ServicesPage() {
  const router = useRouter();
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

  // Filter Logic: Flash Sale Items
  const flashSaleItems = services.filter(s => s.isFlashSale);
  
  // Logic Filtering Utama
  const filteredServices = services.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.shortDesc || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-32 pb-20 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Digital Marketplace</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-gradient-primary">Solutions.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Temukan paket layanan yang tepat untuk kebutuhan digital Anda. Transparan, cepat, dan profesional.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-80 relative"
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Cari layanan..." 
                className="w-full pl-10 pr-10 py-3 bg-secondary/10 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-sm backdrop-blur-sm focus:bg-secondary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white p-1 hover:bg-white/10 rounded-full"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* --- FLASH SALE SECTION --- */}
        {!loading && flashSaleItems.length > 0 && activeCategory === "all" && !searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 animate-pulse">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading text-white">Flash Sale Terbatas</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>Jangan lewatkan penawaran spesial ini!</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 rounded-3xl bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/20 relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              {flashSaleItems.map((item) => (
                <ServiceMarketCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => router.push(`/services/${item.id}`)}
                  isFlashSaleView={true}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* --- CATEGORY TABS --- */}
        <div className="sticky top-24 z-30 mb-8 -mx-4 px-4 md:mx-0">
          <div className="bg-background/80 backdrop-blur-xl border border-white/5 rounded-xl p-1.5 flex gap-1 overflow-x-auto scrollbar-hide md:w-fit">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  activeCategory === cat.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Memuat katalog...</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                  >
                    <ServiceMarketCard 
                      item={item} 
                      onClick={() => router.push(`/services/${item.id}`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <Filter size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Tidak ada layanan ditemukan</h3>
                <p className="text-muted-foreground">Coba ganti kata kunci atau kategori lain.</p>
                <button 
                  onClick={() => {setSearchQuery(""); setActiveCategory("all");}}
                  className="mt-6 text-primary text-sm font-medium hover:underline"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

// --- PRODUCT COUNTDOWN COMPONENT (NEW) ---
function ProductCountdown({ targetDateStr }: { targetDateStr: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDateStr) return;
    const targetDate = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format string
      if (days > 0) {
        setTimeLeft(`${days}h ${hours}j ${minutes}m`);
      } else {
        const h = hours < 10 ? `0${hours}` : hours;
        const m = minutes < 10 ? `0${minutes}` : minutes;
        const s = seconds < 10 ? `0${seconds}` : seconds;
        setTimeLeft(`${h}:${m}:${s}`);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!timeLeft || timeLeft === "EXPIRED") return null;

  return (
    <div className="absolute bottom-3 left-3 right-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center justify-center gap-2 z-20 border border-red-400/30 animate-in fade-in">
        <Timer size={12} className="animate-pulse" />
        <span className="font-mono tracking-wide">{timeLeft}</span>
    </div>
  );
}

// --- SUB-COMPONENT: MARKET CARD ---
function ServiceMarketCard({ item, onClick, isFlashSaleView = false }: { item: ServicePackage, onClick: () => void, isFlashSaleView?: boolean }) {
  const salesCount = item.sales ?? 0;
  const ratingValue = item.rating ?? 0;
  
  // Logic Diskon
  const hasDiscount = Boolean(item.originalPrice && item.originalPrice !== "");
  const flashSaleEndDate = (item as any).flashSaleEndDate; // Ambil tanggal berakhir jika ada

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer h-full border",
        isFlashSaleView 
          ? "bg-black/40 border-red-500/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10"
          : "bg-secondary/10 border-white/5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
      )}
    >
      {/* 1. Image Thumbnail Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-white/5">
            <Sparkles className="opacity-20" size={48}/>
          </div>
        )}
        
        {/* Badges & Ribbons */}
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start pointer-events-none z-10">
          <div className="flex flex-col gap-2">
            {item.recommended && !isFlashSaleView && (
              <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm shadow-lg w-fit">
                Best Seller
              </span>
            )}
            {isFlashSaleView && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm shadow-lg w-fit animate-pulse">
                ⚡ Flash Sale
              </span>
            )}
          </div>

          {/* Discount Ribbon */}
          {hasDiscount && (
            <div className={cn(
              "text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-lg flex flex-col items-center leading-tight",
              isFlashSaleView ? "bg-red-500" : "bg-orange-500"
            )}>
              <span>{item.discountValue}%</span>
              <span className="text-[8px] uppercase">OFF</span>
            </div>
          )}
        </div>

        {/* TIMER DI DALAM KARTU (Khusus Flash Sale View) */}
        {isFlashSaleView && flashSaleEndDate && (
           <ProductCountdown targetDateStr={flashSaleEndDate} />
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-30">
          <button className="p-2 rounded-full bg-white text-black hover:scale-110 transition-transform" title="Lihat Detail">
            <Eye size={20} />
          </button>
          <button className="p-2 rounded-full bg-white/20 text-white hover:bg-primary hover:scale-110 transition-all" title="Simpan">
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* 2. Content Details */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Category & Rating */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium bg-white/5 px-2 py-0.5 rounded">
            {item.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
            <Star size={12} fill="currentColor" /> {ratingValue > 0 ? ratingValue : "New"}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-foreground mb-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
          {item.title}
        </h3>

        {/* Short Desc */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {item.shortDesc || "Deskripsi singkat belum tersedia untuk layanan ini."}
        </p>

        {/* Price Section */}
        <div className="mt-auto pt-2 mb-3">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                {item.originalPrice}
              </span>
              <div className="flex items-center gap-2">
                <span className={cn("text-lg font-bold", isFlashSaleView ? "text-red-400" : "text-orange-400")}>
                  {item.price}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] text-muted-foreground">Mulai dari</p>
              <p className="text-lg font-bold text-foreground">{item.price}</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <span>{salesCount > 0 ? `${salesCount} Terjual` : "Baru Rilis"}</span>
          </div>
          
          <button 
            className={cn(
              "p-2 rounded-lg transition-colors",
              isFlashSaleView 
                ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              alert("Fitur Keranjang akan segera hadir!");
            }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}