"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllServices } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  Search, X, Loader2, Sparkles, Filter, 
  Star, ShoppingCart, ArrowRight, Zap, Timer, CheckCircle2, ArrowDownUp,
  Monitor, Smartphone, Database, PenTool, Code2, LayoutGrid, ChevronLeft, ChevronRight,
  Palette, Megaphone, SearchCode, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// --- ENHANCED CATEGORIES WITH ICONS (Shopee-Style Round Icons) ---
const categories = [
  { id: "all", label: "Semua Produk", icon: <LayoutGrid size={24} />, color: "from-blue-500 to-cyan-400" },
  { id: "mobile", label: "Mobile App", icon: <Smartphone size={24} />, color: "from-purple-500 to-indigo-400" },
  { id: "frontend", label: "Frontend", icon: <Monitor size={24} />, color: "from-emerald-500 to-teal-400" },
  { id: "backend", label: "Backend", icon: <Database size={24} />, color: "from-orange-500 to-amber-400" },
  { id: "fullstack", label: "Fullstack", icon: <Code2 size={24} />, color: "from-rose-500 to-pink-400" },
  { id: "design", label: "UI/UX Design", icon: <Palette size={24} />, color: "from-fuchsia-500 to-pink-400" },
  { id: "marketing", label: "Marketing", icon: <Megaphone size={24} />, color: "from-red-500 to-orange-400" },
  { id: "seo", label: "SEO Opt", icon: <SearchCode size={24} />, color: "from-lime-500 to-green-400" },
  { id: "consulting", label: "Consulting", icon: <Briefcase size={24} />, color: "from-amber-600 to-yellow-500" },
  { id: "maintenance", label: "Maintenance", icon: <PenTool size={24} />, color: "from-gray-500 to-slate-400" },
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // State Filter, Search, Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    async function loadData() {
      const data = await getAllServices();
      // Filter out draft services
      setServices(data.filter(s => !s.isDraft));
      setLoading(false);
    }
    loadData();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter Logic: Flash Sale Items
  const flashSaleItems = useMemo(() => services.filter(s => s.isFlashSale), [services]);
  const recommendedItems = useMemo(() => services.filter(s => s.recommended && !s.isFlashSale), [services]);

  // Siapkan layanan untuk Shopee-Style Hero (Ambil 5 terbaik)
  const heroServices = useMemo(() => {
    const featured = services.filter(s => s.recommended || s.isFlashSale);
    return featured.length >= 5 ? featured.slice(0, 5) : services.slice(0, 5);
  }, [services]);

  // Pisahkan untuk Slider (Kiri) dan Static Promos (Kanan)
  const sliderItems = heroServices.slice(0, Math.max(heroServices.length - 2, 1));
  const staticItems = heroServices.slice(sliderItems.length, sliderItems.length + 2);

  // Auto-Slider Timer
  useEffect(() => {
    if (sliderItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 4000); // Ganti slide setiap 4 detik
    return () => clearInterval(timer);
  }, [sliderItems.length]);

  const handlePrevSlide = (e?: React.SyntheticEvent | Event) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  const handleNextSlide = (e?: React.SyntheticEvent | Event) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  };

  // Logic Filtering & Sorting Utama
  const filteredServices = useMemo(() => {
    let result = services.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.shortDesc || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "popular") {
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    return result;
  }, [services, searchQuery, activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full pt-28 md:pt-36">
        
        {/* =========================================
            1. HERO SECTION (SHOPEE STYLE)
        ========================================= */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
          {loading ? (
            <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] bg-white/5 rounded-2xl md:rounded-3xl animate-pulse border border-white/10" />
          ) : sliderItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[450px]">
              
              {/* KIRI: Slider Carousel (Lebar 65-70%) */}
              <div className="lg:flex-[2.2] h-[280px] sm:h-[350px] lg:h-full relative rounded-2xl md:rounded-3xl overflow-hidden group border border-white/10 shadow-2xl bg-[#0d1117]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 cursor-pointer active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        handleNextSlide();
                      } else if (swipe > swipeConfidenceThreshold) {
                        handlePrevSlide();
                      }
                    }}
                    onClick={() => router.push(`/services/${sliderItems[currentSlide].id}`)}
                  >
                    {sliderItems[currentSlide].thumbnail ? (
                      <img 
                        src={sliderItems[currentSlide].thumbnail} 
                        alt={sliderItems[currentSlide].title} 
                        className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 pointer-events-none" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5 pointer-events-none">
                        <Sparkles size={64} />
                      </div>
                    )}
                    
                    {/* Dark Overlay for Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 pointer-events-none">
                      <div className="flex items-center gap-2 mb-3">
                        {sliderItems[currentSlide].isFlashSale && (
                          <span className="bg-red-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1 shadow-lg shadow-red-500/20">
                            <Zap size={10} className="fill-white" /> Flash Sale
                          </span>
                        )}
                        <span className="bg-primary/90 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur-md shadow-lg shadow-primary/20">
                          {categories.find(c => c.id === sliderItems[currentSlide].category)?.label || sliderItems[currentSlide].category}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-4xl font-heading font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors max-w-2xl line-clamp-2 drop-shadow-md">
                        {sliderItems[currentSlide].title}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 md:mt-4">
                         <div className="flex flex-col">
                           <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-mono">Spesial</span>
                           <span className="text-lg sm:text-xl md:text-3xl font-bold font-mono text-white drop-shadow-md">{sliderItems[currentSlide].price}</span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Nav Buttons (Kiri Kanan) - Tampil Saat Hover & Hidden on Mobile */}
                <button 
                  onClick={handlePrevSlide}
                  className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-primary text-white items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 border border-white/20"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNextSlide}
                  className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-primary text-white items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 border border-white/20"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Slider Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {sliderItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        idx === currentSlide ? "bg-white w-6" : "bg-white/40 w-1.5 hover:bg-white/80"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* KANAN: 2 Static Promo Banners (Lebar 30-35%) */}
              <div className="lg:flex-1 hidden md:flex flex-row lg:flex-col gap-4 h-full">
                {staticItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => router.push(`/services/${item.id}`)}
                    className="flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg bg-[#0d1117]"
                  >
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5">
                        <Sparkles size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                    
                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                       <h3 className="text-lg md:text-xl font-bold font-heading text-white line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors drop-shadow-md">
                         {item.title}
                       </h3>
                       <div className="flex justify-between items-end">
                         <span className="text-base md:text-lg font-bold font-mono text-purple-400 drop-shadow-md">{item.price}</span>
                         <span className="text-[9px] text-gray-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md uppercase tracking-widest font-bold border border-white/20">Promo</span>
                       </div>
                    </div>
                  </div>
                ))}
                
                {/* Fallback jika item statis kurang dari 2 */}
                {staticItems.length < 2 && (
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                     <Star className="w-10 h-10 text-primary mb-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                     <h3 className="text-white font-bold mb-1">Mulai Karir Digitalmu</h3>
                     <p className="text-xs text-gray-400">Jelajahi seluruh layanan premium kami.</p>
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>


        {/* =========================================
            2. CATEGORY MENU (Shopee-Style Round Icons)
        ========================================= */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="md:hidden flex items-center gap-1.5 mb-4 text-[9px] font-mono uppercase tracking-widest text-primary animate-pulse">
                Kategori <ArrowRight size={10} />
            </div>
            
            {/* Horizontal Swipe with bleeding edges on mobile */}
            <div className="flex gap-4 md:gap-8 overflow-x-auto pt-4 pb-6 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex flex-col items-center gap-2 md:gap-3 shrink-0 group min-w-[70px] md:min-w-[90px] snap-center"
                  >
                    <div className={cn(
                      "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-300 relative",
                      isActive 
                        ? "shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110" 
                        : "opacity-80 group-hover:scale-105 group-hover:opacity-100"
                    )}>
                      {/* Gradient Background */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity",
                        cat.color
                      )} />
                      {/* Icon */}
                      <div className="relative z-10 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                        {React.cloneElement(cat.icon as React.ReactElement<any>, { size: isMobile ? 20 : 24 })}
                      </div>
                      
                      {/* Active Ring */}
                      {isActive && (
                        <div className="absolute -inset-1.5 rounded-3xl border-[2.5px] border-primary/60" />
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] md:text-sm font-medium whitespace-nowrap transition-colors mt-1 md:mt-0",
                      isActive ? "text-primary font-bold" : "text-gray-400 group-hover:text-gray-200"
                    )}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          

          {/* =========================================
              3. FLASH SALE SECTION
          ========================================= */}
          <AnimatePresence>
            {!loading && flashSaleItems.length > 0 && activeCategory === "all" && !searchQuery && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 64 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="w-full h-px bg-white/10 mb-6 md:mb-8" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 md:p-2.5 bg-red-500/20 rounded-lg md:rounded-xl text-red-500 relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500/30 rounded-xl blur-md animate-pulse" />
                      <Zap size={isMobile ? 18 : 24} fill="currentColor" className="relative z-10" />
                    </div>
                    <div className="flex items-baseline gap-4">
                      <h2 className="text-xl md:text-2xl font-bold font-heading text-red-500 tracking-tight italic">F L A S H  <span className="text-white ml-2">S A L E</span></h2>
                    </div>
                  </div>
                  <div className="md:hidden flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-red-500 animate-pulse border border-red-500/30 px-2 py-0.5 rounded-full w-fit">
                    Swipe <ArrowRight size={10} />
                  </div>
                </div>

                {/* Horizontal Swipe for Flash Sale */}
                <div className="flex overflow-x-auto gap-4 md:gap-6 pt-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                  {flashSaleItems.map((item) => (
                    <div key={item.id} className="w-[70vw] sm:w-[280px] md:min-w-[320px] md:max-w-[350px] snap-center shrink-0">
                      <ServiceMarketCard 
                        item={item} 
                        onClick={() => router.push(`/services/${item.id}`)}
                        isFlashSaleView={true}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =========================================
              4. RECOMMENDED SECTION
          ========================================= */}
          <AnimatePresence>
            {!loading && recommendedItems.length > 0 && activeCategory === "all" && !searchQuery && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 64 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="w-full h-px bg-white/10 mb-6 md:mb-8" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 md:p-2.5 bg-yellow-500/20 rounded-lg md:rounded-xl text-yellow-500 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-yellow-500/10 rounded-xl blur-md" />
                    <Star size={isMobile ? 18 : 24} fill="currentColor" className="relative z-10" />
                  </div>
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-xl md:text-2xl font-bold font-heading text-yellow-500 tracking-tight italic">REKOMENDASI</h2>
                  </div>
                </div>

                {/* Grid for Recommended */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {recommendedItems.slice(0, 8).map((item) => (
                    <div key={item.id} className="h-full">
                      <ServiceMarketCard 
                        item={item} 
                        onClick={() => router.push(`/services/${item.id}`)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =========================================
              5. PRODUCT GRID
          ========================================= */}
          <div className="w-full">
            <div className="w-full h-px bg-white/10 mb-6 md:mb-8" />
            
            {/* --- FILTER & SORT CONTROLS --- */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10">
              <h2 className="text-lg md:text-2xl font-bold font-heading text-white tracking-tight flex-1 flex items-center gap-3 w-full">
                  <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg text-blue-500 inline-flex shrink-0">
                    <Filter size={isMobile ? 14 : 18} fill="currentColor" />
                  </div>
                  <span className="truncate">
                  {activeCategory === "all" && !searchQuery 
                    ? "Eksplorasi Jasa" 
                    : searchQuery 
                      ? "Hasil Pencarian" 
                      : categories.find(c => c.id === activeCategory)?.label}
                  </span>
              </h2>

              <div className="flex flex-row gap-3 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 md:w-4 md:h-4 group-focus-within:text-white transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Cari jasa..." 
                    className="w-full pl-9 md:pl-11 pr-8 md:pr-10 py-2 md:py-2.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-xs md:text-sm text-white placeholder:text-gray-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 rounded-full transition-colors">
                      <X size={12} className="md:w-[14px] md:h-[14px]" />
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => setSortBy(prev => prev === "newest" ? "popular" : "newest")}
                  className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/30 transition-all text-[10px] md:text-sm text-gray-300 font-medium shrink-0"
                >
                  <ArrowDownUp className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                  {sortBy === "newest" ? "Terbaru" : "Terpopuler"}
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-[250px] md:h-[380px] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              // Empty State
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 md:py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm w-full"
              >
                <Filter className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Pencarian Tidak Ditemukan</h3>
                <p className="text-gray-400 max-w-sm mx-auto text-xs md:text-sm px-4">
                  Ubah kata kunci pencarian atau kategori untuk melihat jasa lainnya.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
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

      if (days > 0) {
        setTimeLeft(`${days}h ${hours}j`); // Shorter format for small cards
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
    <div className="absolute bottom-2 left-2 right-2 bg-red-600/90 backdrop-blur-md text-white text-[9px] md:text-xs font-bold px-1.5 md:px-2 py-1 md:py-1.5 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center gap-1 md:gap-1.5 z-20">
        <Timer size={10} className="animate-pulse md:w-[12px] md:h-[12px]" />
        <span className="font-mono tracking-widest leading-none mt-0.5">{timeLeft}</span>
    </div>
  );
}

// --- E-COMMERCE PREMIUM MARKET CARD (SHOPEE STYLE) ---
function ServiceMarketCard({ item, onClick, isFlashSaleView = false }: { item: ServicePackage, onClick: () => void, isFlashSaleView?: boolean }) {
  const salesCount = item.sales ?? 0;
  const ratingValue = item.rating ?? 0;
  
  const displayPrice = (isFlashSaleView && item.flashSalePrice) ? item.flashSalePrice : item.price;
  const displayOriginalPrice = (isFlashSaleView && item.flashSalePrice) ? (item.originalPrice || item.price) : item.originalPrice;
  
  const hasDiscount = Boolean(displayOriginalPrice && displayOriginalPrice !== "");
  const flashSaleEndDate = (item as any).flashSaleEndDate;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col bg-white/[0.02] backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer h-full border hover:-translate-y-1 hover:shadow-2xl hover:bg-white/[0.04]",
        isFlashSaleView 
          ? "border-red-500/30 hover:border-red-400"
          : "border-white/5 hover:border-primary/50"
      )}
    >
      {/* Image Area */}
      <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden bg-black shrink-0">
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/5 group-hover:scale-110 transition-transform duration-700">
            <Sparkles size={48}/>
          </div>
        )}
        
        {/* Shadow Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Shopee-style Product Badge */}
        <div className="absolute top-0 left-0 z-10">
          {item.recommended && !isFlashSaleView && (
             <div className="bg-primary text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-br-lg shadow-lg uppercase tracking-wider flex items-center gap-1">
               <Star size={8} className="fill-white md:w-[10px] md:h-[10px]" /> Pilihan
             </div>
          )}
          {isFlashSaleView && (
             <div className="bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-br-lg shadow-lg uppercase tracking-wider flex items-center gap-1">
               <Zap size={8} className="fill-white md:w-[10px] md:h-[10px]" /> Diskon
             </div>
          )}
        </div>

        {/* Shopee-style Discount Ribbon (Top Right) */}
        {hasDiscount && (
          <div className="absolute top-0 right-0 bg-[#FFD100] text-[#ee4d2d] px-1 md:px-1.5 py-0.5 md:py-1 text-center rounded-bl-lg shadow-md z-10">
             <div className="text-[9px] md:text-[11px] font-bold leading-none py-0.5">{item.discountValue}</div>
             <div className="text-[6px] md:text-[8px] font-bold uppercase leading-none mt-0.5">OFF</div>
          </div>
        )}

        {isFlashSaleView && flashSaleEndDate && (
           <ProductCountdown targetDateStr={flashSaleEndDate} />
        )}
      </div>

      {/* Content Area */}
      <div className="p-2.5 md:p-4 flex flex-col flex-grow relative z-10">
        
        {/* Title */}
        <h3 className="font-heading font-medium text-[11px] sm:text-sm md:text-base text-gray-200 mb-1.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Price Section */}
        <div className="mt-auto pt-1 md:pt-2 flex flex-col">
          {hasDiscount ? (
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] md:text-xs text-gray-500 line-through truncate">{displayOriginalPrice}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {item.packages && item.packages.length > 0 && (
                <span className="text-[8px] md:text-[10px] text-gray-500 font-medium -mb-0.5">Mulai dari</span>
              )}
              <span className={cn("text-xs sm:text-sm md:text-lg font-bold font-mono tracking-tight leading-tight", isFlashSaleView ? "text-red-500 drop-shadow-md" : "text-primary drop-shadow-sm")}>
                {displayPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Ratings & Sales (Shopee Bottom Style) */}
        <div className="mt-2 md:mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] md:text-[10px] text-gray-400 font-medium">
           <div className="flex items-center gap-1">
             <Star size={10} className="text-yellow-400 fill-yellow-400" /> 
             <span>{ratingValue > 0 ? ratingValue : "Baru"}</span>
           </div>
           <span>{salesCount > 0 ? `${salesCount} Terjual` : ""}</span>
        </div>
        
      </div>
    </div>
  );
}