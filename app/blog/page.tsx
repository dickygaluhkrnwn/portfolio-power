"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { BlogPost, getPublishedPosts } from "@/lib/blog-service";
import { 
  Calendar, ArrowRight, BookOpen, Search, X, 
  LayoutGrid, List as ListIcon, ArrowDownUp, Tag, Clock, ChevronRight, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- FEATURES STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await getPublishedPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Siapkan artikel untuk Hero Slider (Ambil 5 terbaru)
  const featuredPosts = useMemo(() => posts.slice(0, 5), [posts]);

  // Auto-Slider Timer
  useEffect(() => {
    if (featuredPosts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 5000); // Ganti slide setiap 5 detik
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  // Extract unique tags & urutkan A-Z
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    // Mengurutkan tags secara alfabetis (A-Z)
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Process posts (Filter & Sort)
  const processedPosts = useMemo(() => {
    let result = [...posts];

    // 1. Apply Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) || 
        post.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 2. Apply Tag Filter
    if (selectedTag) {
      result = result.filter(post => post.tags?.includes(selectedTag));
    }

    // 3. Apply Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, searchQuery, selectedTag, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Disamakan spasi atasnya dengan halaman Projects/Services: pt-28 md:pt-40 */}
      <div className="relative z-10 w-full pt-28 md:pt-40">
        
        {/* --- 1. HERO FEATURED SLIDER (Satu per Satu) --- */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-20">
          {loading ? (
            <div className="w-full h-[350px] md:h-[480px] bg-white/5 rounded-[2rem] animate-pulse border border-white/10" />
          ) : featuredPosts.length > 0 ? (
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
                  <Link href={`/blog/${featuredPosts[currentSlide].slug}`} className="block w-full h-full relative outline-none">
                    {featuredPosts[currentSlide].coverImage ? (
                      <img 
                        src={featuredPosts[currentSlide].coverImage} 
                        alt={featuredPosts[currentSlide].title} 
                        className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0d1117] flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-white/5" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay yang elegan */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-95" />
                    
                    {/* Konten Hero */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                          <Zap className="w-3 h-3 fill-primary" /> Sorotan
                        </span>
                        {featuredPosts[currentSlide].tags?.[0] && (
                          <span className="text-gray-300 text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/5">
                            {featuredPosts[currentSlide].tags[0]}
                          </span>
                        )}
                      </div>
                      <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold font-heading line-clamp-2 leading-tight mb-4 max-w-4xl group-hover:text-primary transition-colors">
                        {featuredPosts[currentSlide].title}
                      </h2>
                      <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl font-light">
                        {featuredPosts[currentSlide].excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Slider Pagination Dots */}
              <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                {featuredPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
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
          {/* --- 2. CONTROLS BAR (Search, Filter, Sort, View) --- */}
          <div className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-xl mb-10 flex flex-col gap-5 shadow-2xl relative z-20">
            
            {/* Top Row: Search & Toggles */}
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              
              {/* Search Bar (Memenuhi sisa ruang kosong dengan flex-1) */}
              <div className="relative w-full flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari artikel atau topik..." 
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

              {/* Actions (Sort & View) ditarik ke kanan */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
                
                {/* Sort Toggle */}
                <button 
                  onClick={() => setSortBy(prev => prev === "newest" ? "oldest" : "newest")}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#050505]/50 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-sm text-gray-300 font-medium w-full md:w-auto"
                >
                  <ArrowDownUp className="w-4 h-4 text-gray-500" />
                  {sortBy === "newest" ? "Terbaru" : "Terlama"}
                </button>

                {/* View Mode Toggles */}
                <div className="flex items-center p-1 rounded-xl bg-[#050505]/50 border border-white/5 shrink-0">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300"
                    )}
                    title="Tampilan Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-gray-600 hover:text-gray-300"
                    )}
                    title="Tampilan List"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Bottom Row: Tags Filter */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
                <Tag className="w-4 h-4 text-gray-600 shrink-0 mr-2" />
                <button
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border",
                    selectedTag === null 
                      ? "bg-primary/10 border-primary/30 text-primary" 
                      : "bg-transparent border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300"
                  )}
                >
                  Semua Topik
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border",
                      selectedTag === tag 
                        ? "bg-primary/10 border-primary/30 text-primary" 
                        : "bg-transparent border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- 3. BLOG CONTENT --- */}
          {loading ? (
            <div className={cn(
              "grid gap-6 md:gap-8 w-full",
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className={cn(
                   "bg-white/5 rounded-3xl animate-pulse border border-white/5",
                   viewMode === "grid" ? "h-[420px]" : "h-[160px]"
                 )} />
               ))}
            </div>
          ) : processedPosts.length === 0 ? (
            // Empty State
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm w-full"
            >
              <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h3>
              <p className="text-gray-400 max-w-sm mx-auto text-sm">
                Tidak ada artikel yang cocok dengan filter atau kata kunci <span className="text-white font-medium">"{searchQuery}"</span>.
              </p>
              {(searchQuery || selectedTag) && (
                 <button 
                   onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
                   className="mt-6 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all"
                 >
                   Reset Filter
                 </button>
              )}
            </motion.div>
          ) : (
            // Grid / List Artikel
            <motion.div 
              key={`${viewMode}-${sortBy}-${selectedTag}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "grid gap-6 md:gap-8 w-full",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              {processedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full outline-none w-full">
                  
                  {/* --- CARD VIEW (GRID) --- */}
                  {viewMode === "grid" ? (
                    <article className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-[#111] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] relative">
                      {/* Image */}
                      <div className="h-48 sm:h-56 overflow-hidden relative border-b border-white/5 shrink-0">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white/5" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                        
                        {/* Floating Tag */}
                        {post.tags?.[0] && (
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-mono tracking-widest uppercase border border-white/10">
                            {post.tags[0]}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 min</span>
                        </div>

                        <h2 className="text-xl font-bold font-heading mb-3 line-clamp-2 text-white group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-light">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-widest mt-auto group-hover:text-white transition-colors">
                          Baca Artikel <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  ) : (

                  /* --- LIST VIEW --- */
                    <article className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-5 sm:p-6 bg-[#0a0a0a] border border-white/10 rounded-3xl hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 w-full">
                      {/* Image for List */}
                      <div className="hidden sm:block shrink-0 w-48 h-32 rounded-2xl overflow-hidden relative border border-white/5">
                         {post.coverImage ? (
                           <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         ) : (
                           <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                             <BookOpen className="w-8 h-8 text-white/5" />
                           </div>
                         )}
                      </div>

                      {/* Content for List */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500 mb-2.5">
                          <span className="flex items-center gap-1.5 text-primary/80"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}</span>
                          {post.tags?.[0] && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="uppercase tracking-widest text-white/70">{post.tags[0]}</span>
                            </>
                          )}
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold font-heading mb-2 text-white group-hover:text-primary transition-colors leading-snug truncate">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed font-light mb-1">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Arrow Icon for List */}
                      <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full border border-white/10 items-center justify-center bg-white/[0.02] group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </article>
                  )}

                </Link>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </main>
  );
}