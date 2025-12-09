"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { BlogPost, getPublishedPosts } from "@/lib/blog-service";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPublishedPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-32 pb-20 relative z-10">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Insights & <span className="text-gradient-primary">Thoughts.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Berbagi pengalaman, tutorial teknis, dan pemikiran seputar pengembangan software dan teknologi terkini.
          </p>
        </motion.div>

        {/* BLOG GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[1,2,3,4].map(i => (
               <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
             ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold">Belum ada artikel.</h3>
            <p className="text-muted-foreground">Kunjungi lagi nanti ya!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="flex flex-col h-full bg-secondary/10 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-300">
                    
                    {/* Cover Image */}
                    <div className="h-48 overflow-hidden relative">
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
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </span>
                        {post.tags?.[0] && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold font-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
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