"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BlogPost, getPostBySlug } from "@/lib/blog-service";
import { Calendar, Clock, ArrowLeft, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <Button onClick={() => router.push("/blog")}>Kembali ke Blog</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 bg-secondary/5 border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
           {post.coverImage && (
             <div className="absolute inset-0 bg-cover bg-center blur-3xl" style={{ backgroundImage: `url('${post.coverImage}')` }} />
           )}
           <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="container-width relative z-10">
          <Button variant="ghost" size="sm" onClick={() => router.push("/blog")} className="mb-8 hover:bg-white/5">
            <ArrowLeft size={16} className="mr-2" /> Kembali
          </Button>

          <div className="flex gap-2 mb-6">
            {post.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/20">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.publishedAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              5 min read
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-width max-w-4xl py-12">
        <article className="prose prose-invert prose-lg max-w-none">
          {/* Render HTML Content */}
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="text-gray-300 leading-relaxed space-y-4"
          />
        </article>

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <p className="text-muted-foreground">Terima kasih sudah membaca!</p>
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
          }}>
            <Share2 size={16} className="mr-2" /> Bagikan
          </Button>
        </div>
      </div>
    </main>
  );
}