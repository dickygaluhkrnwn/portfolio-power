"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost, getPublishedPosts } from "@/lib/blog-service";
import { 
  Calendar, ArrowRight, BookOpen, Search, X, 
  Tag, Clock, Flame, Heart, MessageCircle, TrendingUp, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- FEATURES STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getPublishedPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Extract unique tags & urutkan A-Z
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Process posts (Filter)
  const isFiltering = searchQuery.trim() !== "" || selectedTag !== null;
  const processedPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) || 
        post.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      result = result.filter(post => post.tags?.includes(selectedTag));
    }

    return result;
  }, [posts, searchQuery, selectedTag]);

  // --- SECTIONS DATA (Hanya saat tidak mencari) ---
  const postsByLikes = useMemo(() => {
    return [...posts].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
  }, [posts]);

  const topViralPost = postsByLikes.length > 0 ? postsByLikes[0] : null;
  const trendingPosts = postsByLikes.slice(1, 4); // Top 2, 3, 4
  
  const latestPosts = useMemo(() => {
    const excludeIds = new Set([topViralPost?.id, ...trendingPosts.map(p => p.id)]);
    return [...posts].filter(p => !excludeIds.has(p.id)).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [posts, topViralPost, trendingPosts]);


  const renderEmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm w-full mt-10"
    >
      <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h3>
      <p className="text-gray-400 max-w-sm mx-auto text-sm">
        Tidak ada artikel yang cocok dengan filter atau kata kunci <span className="text-white font-medium">"{searchQuery}"</span>.
      </p>
      <button 
        onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
        className="mt-6 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all"
      >
        Reset Filter
      </button>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full pt-24 md:pt-32">
        
        {loading ? (
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="w-full h-[60vh] bg-white/5 rounded-[2rem] animate-pulse border border-white/10" />
          </div>
        ) : (
          <>
            {/* --- HERO SECTION: VIRAL POST --- */}
            {/* Hanya tampil jika tidak sedang menggunakan filter */}
            <AnimatePresence>
              {!isFiltering && topViralPost && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.5 }}
                  className="container max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-16"
                >
                  <div className="group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-[#050505] shadow-2xl h-[50vh] min-h-[380px] md:h-[60vh] md:min-h-[500px]">
                    <Link href={`/blog/${topViralPost.slug}`} className="block w-full h-full relative">
                      {topViralPost.coverImage ? (
                        <img 
                          src={topViralPost.coverImage} 
                          alt={topViralPost.title} 
                          className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full bg-[#0d1117] flex items-center justify-center">
                          <Flame className="w-20 h-20 md:w-32 md:h-32 text-white/5" />
                        </div>
                      )}
                      
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                      
                      <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
                        <motion.span 
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs md:text-sm font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        >
                          <Flame className="w-4 h-4 fill-red-400 animate-pulse" /> Artikel Terviral
                        </motion.span>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col justify-end z-10">
                        <motion.h2 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-white text-3xl md:text-5xl lg:text-6xl font-bold font-heading line-clamp-3 leading-tight mb-4 group-hover:text-primary transition-colors max-w-4xl"
                        >
                          {topViralPost.title}
                        </motion.h2>
                        <motion.p 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-gray-300 text-sm md:text-lg line-clamp-2 max-w-3xl font-light mb-6"
                        >
                          {topViralPost.excerpt}
                        </motion.p>
                        
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-mono font-medium"
                        >
                          <span className="flex items-center gap-1.5 text-gray-300 bg-black/50 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl border border-white/10"><Calendar className="w-4 h-4 text-primary" /> {new Date(topViralPost.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center gap-1.5 text-pink-400 bg-pink-500/10 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl border border-pink-500/20"><Heart className="w-4 h-4 fill-pink-400" /> {topViralPost.likesCount || 0} Likes</span>
                          <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl border border-blue-500/20"><MessageCircle className="w-4 h-4 fill-blue-400" /> {topViralPost.commentsCount || 0} Diskusi</span>
                        </motion.div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- STICKY CONTROLS BAR (Search & Filter) --- */}
            <div className="sticky top-20 z-50 container max-w-7xl mx-auto px-4 sm:px-6 mb-12">
              <div className="w-full bg-[#050505]/80 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] flex flex-col gap-4 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                  <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Cari artikel inspiratif..." 
                      className="w-full pl-11 pr-10 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-500 shadow-inner"
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
                </div>

                {allTags.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-[calc(100%+2rem)] md:w-full">
                    <Tag className="w-4 h-4 text-gray-600 shrink-0 mr-2 hidden md:block" />
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] md:text-xs font-mono whitespace-nowrap transition-all border shrink-0 snap-start",
                        selectedTag === null 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-transparent border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      Semua Topik
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] md:text-xs font-mono whitespace-nowrap transition-all border shrink-0 snap-start",
                          selectedTag === tag 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-transparent border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* --- MAIN GRID AREA --- */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              {isFiltering ? (
                // Tampilan saat mencari/filter
                processedPosts.length === 0 ? renderEmptyState() : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {processedPosts.map(post => <BentoCard key={post.id} post={post} />)}
                  </div>
                )
              ) : (
                // Tampilan normal
                <div className="flex flex-col gap-16 lg:gap-24">
                  
                  {/* SECTION: TRENDING ROW */}
                  {trendingPosts.length > 0 && (
                    <div className="flex flex-col gap-6 md:gap-8 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3 text-white font-heading font-bold text-xl md:text-3xl">
                          <TrendingUp className="text-primary w-6 h-6 md:w-8 md:h-8 p-1 md:p-1.5 bg-primary/20 rounded-lg md:rounded-xl" /> Sedang Tren
                        </div>
                        <div className="md:hidden flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-primary animate-pulse border border-primary/20 px-2 py-0.5 rounded-full w-fit">
                            Swipe <ArrowRight size={10} />
                        </div>
                      </div>
                      
                      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 md:gap-6 pb-6 md:pb-0 pt-2 md:pt-0 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {trendingPosts.map((post, idx) => (
                          <Link key={post.id} href={`/blog/${post.slug}`} className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center group relative bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col gap-4 hover:border-white/20 hover:bg-[#111] transition-all shadow-xl hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]">
                            <div className="text-5xl md:text-6xl font-bold font-heading text-white/5 group-hover:text-primary/10 absolute top-4 right-6 transition-colors z-0">
                              0{idx + 2}
                            </div>
                            <div className="w-full h-32 md:h-40 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative z-10">
                              {post.coverImage ? (
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <div className="w-full h-full bg-[#111] flex items-center justify-center"><BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white/10" /></div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center relative z-10 min-w-0 flex-grow">
                              <h3 className="text-white text-base md:text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-3 md:mb-4">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-mono text-gray-500 mt-auto pt-3 md:pt-4 border-t border-white/5">
                                <span className="flex items-center gap-1.5 group-hover:text-pink-400 transition-colors"><Heart className="w-3 h-3 md:w-3.5 md:h-3.5" /> {post.likesCount || 0}</span>
                                <span className="flex items-center gap-1.5 group-hover:text-blue-400 transition-colors"><MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> {post.commentsCount || 0}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION: LATEST & DISCOVER (BENTO GRID) */}
                  {latestPosts.length > 0 && (
                    <div className="flex flex-col gap-8">
                      <div className="flex items-center gap-2 md:gap-3 text-white font-heading font-bold text-xl md:text-3xl">
                        <Zap className="text-primary w-6 h-6 md:w-8 md:h-8 p-1 md:p-1.5 bg-primary/20 rounded-lg md:rounded-xl" /> Artikel Terbaru
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestPosts.map((post, index) => {
                          const isLarge = index === 0 || index === 5;
                          return (
                            <div key={post.id} className={cn(isLarge ? "md:col-span-2 lg:col-span-2" : "")}>
                              <BentoCard post={post} isLarge={isLarge} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// --- SUB-COMPONENT: BENTO CARD ---
function BentoCard({ post, isLarge = false }: { post: BlogPost, isLarge?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full outline-none w-full relative">
      <article className={cn(
        "flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-white/20 hover:bg-[#111] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] relative h-full",
        isLarge ? "min-h-[450px] sm:min-h-[400px] sm:flex-row" : "min-h-[400px]"
      )}>
        {/* Image */}
        <div className={cn(
          "overflow-hidden relative shrink-0",
          isLarge ? "h-48 sm:h-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-white/5" : "h-48 border-b border-white/5"
        )}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white/5" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          
          {post.tags?.[0] && (
            <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono tracking-widest uppercase border border-white/10 shadow-lg">
              {post.tags[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "p-6 flex flex-col flex-grow",
          isLarge ? "sm:p-8 sm:w-1/2 justify-center" : ""
        )}>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-3">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {new Date(post.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}</span>
          </div>

          <h2 className={cn(
            "font-bold font-heading mb-3 line-clamp-2 text-white group-hover:text-primary transition-colors leading-snug",
            isLarge ? "text-2xl lg:text-3xl" : "text-xl"
          )}>
            {post.title}
          </h2>
          
          <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-light">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-5">
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1.5 group-hover:text-pink-400 transition-colors"><Heart className="w-4 h-4" /> {post.likesCount || 0}</span>
              <span className="flex items-center gap-1.5 group-hover:text-blue-400 transition-colors"><MessageCircle className="w-4 h-4" /> {post.commentsCount || 0}</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}