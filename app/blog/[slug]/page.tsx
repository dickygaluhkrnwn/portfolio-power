"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BlogPost, getPostBySlug, getPublishedPosts } from "@/lib/blog-service";
import { 
  Calendar, Clock, Share2, Loader2, Tag, 
  Search, Twitter, Linkedin, Facebook, Link as LinkIcon, 
  MessageSquare, Send, ChevronRight, CheckCircle2, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Load post detail and other posts for sidebar recommendations
  useEffect(() => {
    async function loadData() {
      if (slug) {
        try {
          const [postData, allPostsData] = await Promise.all([
            getPostBySlug(slug),
            getPublishedPosts()
          ]);
          setPost(postData);
          
          // Ambil 4 artikel terbaru selain artikel yang sedang dibaca
          const recommendations = allPostsData
            .filter(p => p.slug !== slug)
            .slice(0, 4);
          setRecentPosts(recommendations);
        } catch (error) {
          console.error("Error loading post:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [slug]);

  // Handler for Share Buttons
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || "");

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
  };

  // Handler for Sidebar Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  // Not Found State
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 font-heading text-white">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Artikel yang Anda cari mungkin sudah dihapus, dipindahkan, atau URL-nya salah.</p>
        <Button onClick={() => router.push("/blog")} className="rounded-full">Kembali ke Beranda Blog</Button>
      </div>
    );
  }

  return (
    // INFO: Dihapus overflow-hidden di root agar behavior `sticky` di Sidebar berfungsi
    <main className="min-h-screen bg-background text-foreground pb-20 relative selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* --- BACKGROUND FX (Diberi overflow-clip agar efek orbs tidak bikin horizontal scroll) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* --- 1. HERO HEADER (TITLE) --- */}
      <div className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full text-center"
          >
            {/* Tag / Category Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {post.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white max-w-5xl mx-auto">
              {post.title}
            </h1>

            {/* Meta Data */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-400 text-sm font-mono">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {new Date(post.publishedAt).toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-2">
                <Clock size={14} />
                5 min read
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- 2. COVER IMAGE (SEJAJAR CONTAINER 7XL) --- */}
      {post.coverImage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="container max-w-7xl mx-auto px-4 sm:px-6 -mt-4 relative z-20 mb-12 md:mb-20"
        >
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117]">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}

      {/* --- 3. MAIN CONTENT & SIDEBAR GRID --- */}
      <div className={cn("container max-w-7xl mx-auto px-4 sm:px-6 relative z-10", !post.coverImage && "pt-12")}>
        {/* Grid Container (Tanpa items-start, default merenggang/stretch ke bawah) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ======================================================== */}
          {/* KOLOM KIRI: KONTEN ARTIKEL (Col 8) */}
          {/* ======================================================== */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            {/* The Article */}
            <article className="prose prose-invert prose-gray max-w-none 
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-white 
              prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors
              prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-xl
              prose-code:text-accent prose-code:bg-white/[0.03] prose-code:py-0.5 prose-code:px-1.5 prose-code:rounded-md
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/5
              prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-300
              text-gray-300 text-lg leading-relaxed"
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Share Article Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h4 className="font-heading font-bold text-white mb-1">Bagikan Artikel Ini</h4>
                  <p className="text-sm text-gray-400">Sebarkan <b>insight</b> ini ke jaringan Anda.</p>
                </div>
                <div className="flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap">
                  <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1DA1F2] hover:text-white border border-white/10 flex items-center justify-center transition-all text-gray-400" title="Share on X">
                    <Twitter size={16} />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#0A66C2] hover:text-white border border-white/10 flex items-center justify-center transition-all text-gray-400" title="Share on LinkedIn">
                    <Linkedin size={16} />
                  </button>
                  <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white border border-white/10 flex items-center justify-center transition-all text-gray-400" title="Share on Facebook">
                    <Facebook size={16} />
                  </button>
                  <button onClick={() => handleShare('copy')} className="w-auto px-4 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 flex items-center justify-center transition-all text-sm font-medium gap-2">
                    {isCopied ? <CheckCircle2 size={16} /> : <LinkIcon size={16} />}
                    {isCopied ? "Tersalin!" : "Salin Tautan"}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Mockup Section */}
            <div className="mt-16 mb-8">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="font-heading text-2xl font-bold text-white">Diskusi <span className="text-gray-500 text-lg font-normal">(0)</span></h3>
              </div>

              {/* Add Comment Form */}
              <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-lg mb-8">
                <form className="flex flex-col gap-4">
                  <textarea 
                    rows={3}
                    placeholder="Bagikan pemikiran Anda tentang artikel ini..."
                    className="w-full bg-transparent border-b border-white/10 px-2 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-600 text-sm"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 font-mono">Mendukung format Markdown dasar.</span>
                    <Button className="rounded-full px-6" type="button">
                      Kirim <Send size={14} className="ml-2" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Empty State Comments */}
              <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <MessageSquare className="w-10 h-10 mx-auto text-gray-600 mb-3 opacity-50" />
                <p className="text-gray-400 font-medium">Belum ada komentar.</p>
                <p className="text-gray-500 text-sm mt-1">Jadilah yang pertama memulai diskusi!</p>
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* KOLOM KANAN: SIDEBAR & REKOMENDASI (Col 4) */}
          {/* ======================================================== */}
          {/* Wrapper kolom agar menempati sisa lebar, biarkan dia stretch full height. */}
          <div className="lg:col-span-4 relative">
            
            {/* Di sinilah letak trik Sticky Sempurna: Child yang dibikin sticky! */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-32 flex flex-col gap-8 pb-8 h-fit"
            >
              
              {/* Sidebar Search */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Cari Artikel</h4>
                <form onSubmit={handleSearch} className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Ketik kata kunci..." 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-sm text-white placeholder:text-gray-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Sidebar Recommendations */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6">Baca Juga</h4>
                
                <div className="flex flex-col gap-6">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((recPost) => (
                      <Link key={recPost.id} href={`/blog/${recPost.slug}`} className="group flex gap-4 items-start">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#0d1117] border border-white/5 relative">
                          {recPost.coverImage ? (
                            <img src={recPost.coverImage} alt={recPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <BookOpen className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10" />
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-mono text-gray-500 mb-1.5 uppercase tracking-wider">
                            {new Date(recPost.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <h5 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                            {recPost.title}
                          </h5>
                          <div className="text-xs text-gray-500 font-medium group-hover:text-gray-300 transition-colors flex items-center">
                            Baca <ChevronRight className="w-3 h-3 ml-0.5" />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada artikel rekomendasi.</p>
                  )}
                </div>
              </div>

              {/* Newsletter Mockup (Tech Touch) */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px]" />
                <h4 className="font-heading font-bold text-white text-lg mb-2 relative z-10">Tech Newsletter</h4>
                <p className="text-xs text-gray-400 mb-4 relative z-10">Dapatkan <b>insight</b> terbaru dan tutorial pemrograman langsung di <b>inbox</b> Anda.</p>
                <div className="flex gap-2 relative z-10">
                  <input type="email" placeholder="Email Anda" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary" />
                  <Button size="sm" className="rounded-lg px-4 bg-primary text-white hover:bg-primary/90">Join</Button>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}