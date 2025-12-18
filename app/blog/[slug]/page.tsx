"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BlogPost, getPostBySlug } from "@/lib/blog-service";
import { Calendar, Clock, ArrowLeft, Share2, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (slug) {
        const data = await getPostBySlug(slug);
        setPost(data);
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-6">Artikel yang Anda cari mungkin sudah dihapus atau URL salah.</p>
        <Button onClick={() => router.push("/blog")}>Kembali ke Blog</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 relative overflow-hidden">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-secondary/5 border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
           {post.coverImage && (
             <div className="absolute inset-0 bg-cover bg-center blur-3xl scale-110" style={{ backgroundImage: `url('${post.coverImage}')` }} />
           )}
           <div className="absolute inset-0 bg-background/90" />
        </div>

        <div className="container-width relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="ghost" size="sm" onClick={() => router.push("/blog")} className="mb-6 md:mb-8 hover:bg-white/5 pl-0 hover:pl-2 transition-all">
              <ArrowLeft size={16} className="mr-2" /> Kembali
            </Button>

            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {post.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground text-sm">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.publishedAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                5 min read
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container-width max-w-3xl py-8 md:py-12 px-4 sm:px-6"
      >
        <article className="prose prose-invert prose-base md:prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl">
          {/* Render HTML Content with dangerouslySetInnerHTML */}
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="text-gray-300 leading-relaxed space-y-6"
          />
        </article>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center sm:text-left">
            Terima kasih sudah membaca! Jika bermanfaat, jangan lupa bagikan.
          </p>
          <Button variant="outline" size="sm" className="min-h-[40px]" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            // Anda bisa mengganti alert dengan toast notification yang lebih cantik nanti
            alert("Link artikel berhasil disalin!");
          }}>
            <Share2 size={16} className="mr-2" /> Bagikan Artikel
          </Button>
        </div>
      </motion.div>
    </main>
  );
}