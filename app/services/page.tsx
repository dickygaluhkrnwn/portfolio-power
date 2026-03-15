"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { getAllServices } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  Search, X, Loader2, Sparkles, Filter, 
  Star, ShoppingCart, ArrowRight, Zap, Timer, CheckCircle2, ArrowDownUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// Kategori Layanan
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
  
  // State Filter, Search, Sort & Slider
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadData() {
      const data = await getAllServices();
      setServices(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter Logic: Flash Sale Items
  const flashSaleItems = useMemo(() => services.filter(s => s.isFlashSale), [services]);

  // Siapkan layanan untuk Hero Slider (Ambil 5 terbaik/rekomendasi)
  const featuredServices = useMemo(() => {
    const featured = services.filter(s => s.recommended || s.isFlashSale);
    return featured.length > 0 ? featured.slice(0, 5) : services.slice(0, 5);
  }, [services]);

  // Auto-Slider Timer
  useEffect(() => {
    if (featuredServices.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredServices.length);
    }, 5000); // Ganti slide setiap 5 detik
    return () => clearInterval(timer);
  }, [featuredServices.length]);
  
  // Logic Filtering & Sorting Utama
  const filteredServices = useMemo(() => {
    let result = services.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.shortDesc || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Terapkan Pengurutan
    if (sortBy === "popular") {
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    } else {
      // Default newest (asumsi data awal sudah berurut terbaru)
      // Jika butuh sorting by date, bisa ditambahkan logic tanggal di sini
    }

    return result;
  }, [services, searchQuery, activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full">
        
        {/* --- 1. HERO FEATURED SLIDER (Marketplace Banner) --- */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 mb-12">
          {loading ? (
            <div className="w-full h-[350px] md:h-[480px] bg-white/5 rounded-[2rem] animate-pulse border border-white/10" />
          ) : featuredServices.length > 0 ? (
            <div className="w-full h-[350px] md:h-[480px] relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group bg-[#050505]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div 
                    onClick={() => router.push(`/services/${featuredServices[currentSlide].id}`)} 
                    className="block w-full h-full relative outline-none cursor-pointer"
                  >
                    {featuredServices[currentSlide].thumbnail ? (
                      <img 
                        src={featuredServices[currentSlide].thumbnail} 
                        alt={featuredServices[currentSlide].title} 
                        className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0d1117] flex items-center justify-center">
                        <Sparkles className="w-20 h-20 text-white/5" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-95" />
                    
                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                          <Zap className="w-3 h-3 fill-primary" /> Sorotan
                        </span>
                        <span className="text-gray-300 text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/5">
                          {categories.find(c => c.id === featuredServices[currentSlide].category)?.label || featuredServices[currentSlide].category}
                        </span>
                      </div>
                      <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold font-heading line-clamp-2 leading-tight mb-4 max-w-4xl group-hover:text-primary transition-colors">
                        {featuredServices[currentSlide].title}
                      </h2>
                      <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl font-light">
                        {featuredServices[currentSlide].shortDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Pagination Dots */}
              <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                {featuredServices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      idx === currentSlide ? "bg-primary w-8" : "bg-white/30 w-2 hover:bg-white/60"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          {/* --- 2. CONTROLS BAR (Search, Sort & Categories) --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-xl mb-12 flex flex-col gap-5 shadow-2xl relative z-20"
          >
            {/* Top Row: Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              {/* Search Bar (flex-1 agar mengisi ruang kosong) */}
              <div className="relative w-full flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari layanan, source code, atau template..." 
                  className="w-full pl-11 pr-10 py-3 bg-[#050505]/50 border border-white/5 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-sm text-white placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Button (shrink-0 agar ukurannya solid dan menempel) */}
              <div className="flex items-center shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => setSortBy(prev => prev === "newest" ? "popular" : "newest")}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#050505]/50 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-sm text-gray-300 font-medium w-full md:w-auto"
                >
                  <ArrowDownUp className="w-4 h-4 text-gray-500" />
                  {sortBy === "newest" ? "Terbaru" : "Terpopuler"}
                </button>
              </div>
            </div>

            {/* Bottom Row: Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
              <Filter className="w-4 h-4 text-gray-600 shrink-0 mr-2" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border",
                    activeCategory === cat.id 
                      ? "bg-primary text-white border-primary shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]" 
                      : "bg-transparent border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* --- FLASH SALE SECTION --- */}
          <AnimatePresence>
            {!loading && flashSaleItems.length > 0 && activeCategory === "all" && !searchQuery && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 64 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-6 px-2">
                  <div className="p-2.5 bg-red-500/20 rounded-xl text-red-500 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/30 rounded-xl blur-md animate-pulse" />
                    <Zap size={24} fill="currentColor" className="relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-heading text-white tracking-tight">Flash Sale Terbatas</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Diskon gila-gilaan. Segera <b>checkout</b> sebelum waktu habis!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 rounded-[2rem] bg-[#0a0a0a] border border-red-500/20 relative shadow-2xl">
                  {/* Background accent */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
                  
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
          </AnimatePresence>

          {/* --- PRODUCT GRID --- */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold font-heading text-white tracking-tight">
                {activeCategory === "all" && !searchQuery 
                  ? "Semua Layanan" 
                  : searchQuery 
                    ? "Hasil Pencarian" 
                    : categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <span className="text-sm font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                {filteredServices.length} Item
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-[380px] bg-white/5 rounded-3xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              // Empty State
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm w-full"
              >
                <Filter className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Layanan Tidak Ditemukan</h3>
                <p className="text-gray-400 max-w-sm mx-auto text-sm">
                  Coba gunakan kata kunci lain atau ubah filter kategori Anda.
                </p>
                <button 
                  onClick={() => {setSearchQuery(""); setActiveCategory("all");}}
                  className="mt-6 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all"
                >
                  Reset Semua Filter
                </button>
              </motion.div>
            ) : (
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
                      transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
                      key={item.id}
                      className="h-full"
                    >
                      <ServiceMarketCard 
                        item={item} 
                        onClick={() => router.push(`/services/${item.id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

// --- PRODUCT COUNTDOWN COMPONENT ---
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
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        const h = hours < 10 ? `0${hours}` : hours;
        const m = minutes < 10 ? `0${minutes}` : minutes;
        const s = seconds < 10 ? `0${seconds}` : seconds;
        setTimeLeft(`${h}:${m}:${s}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!timeLeft || timeLeft === "EXPIRED") return null;

  return (
    <div className="absolute bottom-3 left-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 z-20 border border-red-400/30">
        <Timer size={14} className="animate-pulse" />
        <span className="font-mono tracking-widest">{timeLeft}</span>
    </div>
  );
}

// --- SUB-COMPONENT: PREMIUM MARKET CARD ---
function ServiceMarketCard({ item, onClick, isFlashSaleView = false }: { item: ServicePackage, onClick: () => void, isFlashSaleView?: boolean }) {
  const salesCount = item.sales ?? 0;
  const ratingValue = item.rating ?? 0;
  
  // Logic Diskon
  const hasDiscount = Boolean(item.originalPrice && item.originalPrice !== "");
  const flashSaleEndDate = (item as any).flashSaleEndDate;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer h-full bg-[#0a0a0a] border",
        isFlashSaleView 
          ? "border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]"
          : "border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)] hover:bg-[#111]"
      )}
    >
      {/* 1. Image Thumbnail Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d1117] border-b border-white/5 shrink-0">
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/5">
            <Sparkles size={64}/>
          </div>
        )}
        
        {/* Soft Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-col gap-2">
            {item.recommended && !isFlashSaleView && (
              <span className="bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-lg w-fit flex items-center gap-1 uppercase tracking-wider border border-white/10">
                <Star size={10} className="fill-white" /> Rekomendasi
              </span>
            )}
            {isFlashSaleView && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-lg w-fit animate-pulse flex items-center gap-1 uppercase tracking-wider border border-white/10">
                <Zap size={10} className="fill-white" /> Flash Sale
              </span>
            )}
          </div>

          {/* Discount Ribbon / Badge */}
          {hasDiscount && (
            <div className={cn(
              "text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-lg flex flex-col items-center leading-none border border-white/10",
              isFlashSaleView ? "bg-red-500/90 backdrop-blur-md" : "bg-orange-500/90 backdrop-blur-md"
            )}>
              <span className="text-sm">{item.discountValue}%</span>
              <span className="text-[8px] uppercase tracking-widest mt-0.5">OFF</span>
            </div>
          )}
        </div>

        {/* Timer UI inside Image */}
        {isFlashSaleView && flashSaleEndDate && (
           <ProductCountdown targetDateStr={flashSaleEndDate} />
        )}
      </div>

      {/* 2. Content Details */}
      <div className="p-5 md:p-6 flex flex-col flex-grow relative z-10">
        
        {/* Category & Stats */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
            {categories.find(c => c.id === item.category)?.label || item.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20">
            <Star size={10} className="fill-yellow-400" /> {ratingValue > 0 ? ratingValue : "New"}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-lg text-white mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Short Desc */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-6 leading-relaxed font-light flex-grow">
          {item.shortDesc || "Layanan premium siap pakai untuk meningkatkan bisnis Anda."}
        </p>

        {/* Price & Action Section */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-gray-500 line-through decoration-red-500/50 mb-0.5">
                  {item.originalPrice}
                </span>
                <span className={cn("text-xl font-bold font-mono tracking-tight", isFlashSaleView ? "text-red-400" : "text-white")}>
                  {item.price}
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Mulai dari</span>
                <span className="text-xl font-bold font-mono text-white tracking-tight">{item.price}</span>
              </>
            )}
          </div>

          <button 
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isFlashSaleView 
                ? "bg-red-500 text-white group-hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]"
                : "bg-white/5 text-gray-300 border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClick(); // Sekarang cukup memanggil fungsi onClick dari props!
            }}
          >
            {isFlashSaleView ? <ShoppingCart size={18} /> : <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform" />}
          </button>
        </div>

        {/* Footer info (Sales) */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          <CheckCircle2 size={12} className={salesCount > 0 ? "text-emerald-500" : "text-gray-600"} />
          <span>{salesCount > 0 ? `${salesCount} Lisensi Terjual` : "Rilis Baru"}</span>
        </div>

      </div>
    </div>
  );
}