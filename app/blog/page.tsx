"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { BlogPost, getPublishedPosts } from "@/lib/blog-service";
import { Calendar, ArrowRight, BookOpen, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getPublishedPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Filter posts based on search
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-accent/5 rounded-full blur-[60px] md:blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-24 pb-16 md:pt-32 md:pb-20 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Insights & <span className="text-gradient-primary">Thoughts.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Berbagi pengalaman, tutorial teknis, dan pemikiran seputar pengembangan software dan teknologi terkini.
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
                placeholder="Cari artikel..." 
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

        {/* BLOG GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {[1,2,3].map(i => (
               <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
             ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Tidak ada artikel ditemukan.</h3>
            <p className="text-muted-foreground">Coba kata kunci lain atau kunjungi lagi nanti.</p>
            {searchQuery && (
               <button 
                 onClick={() => setSearchQuery("")}
                 className="mt-6 text-primary text-sm font-medium hover:underline"
               >
                 Reset Pencarian
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="flex flex-col h-full bg-secondary/10 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-300">
                    
                    {/* Cover Image */}
                    <div className="h-48 sm:h-52 overflow-hidden relative">
                      {post.coverImage ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url('${post.coverImage}')` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                          <BookOpen className="text-white/20" size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      
                      {/* Category Badge over Image (Optional) */}
                      {post.tags?.[0] && (
                        <div className="absolute top-4 left-4">
                           <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                             {post.tags[0]}
                           </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </span>
                      </div>

                      <h2 className="text-lg md:text-xl font-bold font-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform mt-auto">
                        Baca Selengkapnya <ArrowRight size={16} className="ml-2" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}