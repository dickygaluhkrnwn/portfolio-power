"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogPost, getPostBySlug, getPublishedPosts, BlogComment } from "@/lib/blog-service";
import { 
  Calendar, Clock, Loader2, Search, Twitter, Linkedin, 
  Facebook, Link as LinkIcon, MessageSquare, Send, 
  ChevronRight, CheckCircle2, BookOpen, Heart, UserCircle, ArrowLeft, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
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

  // --- ENGAGEMENT STATES ---
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false); // Cegah spam like terlalu banyak di UI
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll Progress Bar Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    async function loadData() {
      if (slug) {
        try {
          const [postData, allPostsData] = await Promise.all([
            getPostBySlug(slug),
            getPublishedPosts()
          ]);
          setPost(postData);
          if (postData) {
            setLikes(postData.likesCount || 0);
            fetchComments(postData.id);
          }
          
          // Ambil 4 artikel terbaru selain yang sedang dibaca
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

    return () => window.removeEventListener('resize', handleResize);
  }, [slug]);

  // Fetch Comments via API Route
  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`/api/blog/comments?postId=${postId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  // Handle Like
  const handleLike = async () => {
    if (!post || isLiked) return;
    
    setLikes(prev => prev + 1);
    setIsLiked(true);

    try {
      await fetch('/api/blog/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      });
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim()) return;

    setIsSubmittingComment(true);

    const newComment: BlogComment = {
      id: `temp-${Date.now()}`, 
      postId: post.id,
      authorName: commentName.trim() || "Anonymous",
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText("");

    try {
      await fetch('/api/blog/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: post.id, 
          authorName: newComment.authorName, 
          content: newComment.content 
        })
      });
    } catch (error) {
      console.error("Error submitting comment", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Membersihkan judul ganda dari konten (jika ada h1/h2/h3 atau paragraf awal yang isinya persis judul artikel)
  const cleanContent = React.useMemo(() => {
    if (!post?.content) return "";
    let html = post.content;
    try {
      const escapedTitle = post.title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Regex case-insensitive untuk menghapus heading atau paragraph tunggal yang berisi judul
      // Mendukung tag seperti <h1>, <h2>, <p>, atau <p><strong>
      const titleRegex = new RegExp(`<(h[1-6]|p)[^>]*>\\s*(?:<strong>|<b>|<em>|<i>)?\\s*${escapedTitle}\\s*(?:<\\/strong>|<\\/b>|<\\/em>|<\\/i>)?\\s*<\\/\\1>`, 'i');
      
      // Hapus kejadian pertama saja
      html = html.replace(titleRegex, '');
    } catch (e) {}
    return html;
  }, [post]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-foreground p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 font-heading text-white">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Artikel yang Anda cari mungkin sudah dihapus, dipindahkan, atau URL-nya salah.</p>
        <Button onClick={() => router.push("/blog")} className="rounded-full">Kembali ke Beranda Blog</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground pb-[100px] md:pb-32 relative selection:bg-primary/30 selection:text-white">
      {/* Navbar: Only visible on Desktop or when scrolled past hero on mobile */}
      <div className="hidden md:block">
              </div>

      {/* --- READING PROGRESS BAR --- */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 md:h-2 bg-gradient-to-r from-primary to-pink-500 origin-left z-[100] shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
        style={{ scaleX }} 
      />

      {/* Mobile Back Button (Floating on Hero) */}
      <div className="md:hidden fixed top-4 left-4 z-[90]">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      {/* Mobile Share Button (Floating on Hero) */}
      <div className="md:hidden fixed top-4 right-4 z-[90]">
        <button 
          onClick={() => handleShare('copy')}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          {isCopied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <LinkIcon size={18} />}
        </button>
      </div>

      {/* --- FLOATING ACTION BAR (Gen-Z Style / News Portal App) --- */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="hidden md:flex fixed bottom-10 left-1/2 -translate-x-1/2 w-auto z-[90] items-center justify-center gap-3 p-2.5 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
      >
        <button 
          onClick={handleLike}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3.5 rounded-[1.5rem] font-bold transition-all duration-300 transform active:scale-95",
            isLiked 
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]" 
              : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          <Heart className={cn("w-5 h-5", isLiked ? "fill-white animate-bounce" : "")} />
          <span className="text-sm md:text-base">{likes} <span className="hidden sm:inline">Likes</span></span>
        </button>
        <div className="w-px h-8 bg-white/10 md:hidden" />
        <button 
          onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3.5 rounded-[1.5rem] bg-white/5 md:bg-white/10 hover:bg-white/20 text-white transition-all font-bold transform active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm md:text-base">{comments.length} <span className="hidden sm:inline">Komen</span></span>
        </button>
      </motion.div>

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* --- 1. HERO COVER & TITLE (Magazine Style Full Bleed) --- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] min-h-[450px] md:min-h-[500px]">
        {post.coverImage ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={post.coverImage} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#0d1117] flex items-center justify-center">
            <BookOpen className="w-20 h-20 text-white/5" />
          </div>
        )}
        
        {/* Gradients to blend with background and text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        
        {/* Magazine Style Title at the bottom of the image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-12 pb-8 md:pb-16 z-10">
          <div className="container max-w-7xl mx-auto md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-5">
                {post.tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-1 md:px-3 md:py-1 rounded-full bg-primary/40 text-white text-[9px] md:text-xs font-mono uppercase tracking-widest border border-primary/50 backdrop-blur-md shadow-lg">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight md:leading-[1.1] text-white max-w-4xl drop-shadow-2xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-gray-300 text-xs md:text-sm font-mono font-medium drop-shadow-md">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary"/> {new Date(post.publishedAt).toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary"/> 5 Min Read</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- 3. MAIN CONTENT & SIDEBAR GRID --- */}
      <div className="container max-w-7xl mx-auto px-5 sm:px-6 relative z-10 pt-4 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          
          {/* KONTEN ARTIKEL (Col 8) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-8"
          >
            {/* Rich Text Article with Magazine Dropcap */}
            <article className="prose prose-invert max-w-none 
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
              prose-h1:hidden
              prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors prose-a:underline-offset-4
              prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-8
              prose-code:text-accent prose-code:bg-accent/10 prose-code:py-0.5 prose-code:px-1.5 prose-code:rounded-md
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/5 prose-pre:shadow-xl prose-pre:text-xs md:prose-pre:text-sm
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 md:prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-gray-300
              text-gray-300 text-[15px] md:text-lg leading-relaxed md:leading-[2.2] tracking-wide
              
              [&>p:first-of-type::first-letter]:float-left [&>p:first-of-type::first-letter]:text-6xl md:[&>p:first-of-type::first-letter]:text-7xl [&>p:first-of-type::first-letter]:font-heading [&>p:first-of-type::first-letter]:font-black [&>p:first-of-type::first-letter]:text-primary [&>p:first-of-type::first-letter]:mr-3 [&>p:first-of-type::first-letter]:mt-1 md:[&>p:first-of-type::first-letter]:mt-2 [&>p:first-of-type::first-letter]:line-height-[1]
              "
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            {/* Share Article Section */}
            <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t border-white/10">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg backdrop-blur-sm">
                <div className="text-center sm:text-left">
                  <h4 className="font-heading text-xl font-bold text-white mb-2">Bagikan Artikel Ini</h4>
                  <p className="text-sm text-gray-400">Sebarkan <b>insight</b> ini ke jaringan Anda.</p>
                </div>
                <div className="flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap">
                  <button onClick={() => handleShare('twitter')} className="w-12 h-12 rounded-full bg-black/50 hover:bg-[#1DA1F2] hover:text-white border border-white/10 flex items-center justify-center transition-all text-gray-400 shadow-sm hover:shadow-lg hover:shadow-[#1DA1F2]/20 hover:-translate-y-1" title="Share on X">
                    <Twitter size={18} />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="w-12 h-12 rounded-full bg-black/50 hover:bg-[#0A66C2] hover:text-white border border-white/10 flex items-center justify-center transition-all text-gray-400 shadow-sm hover:shadow-lg hover:shadow-[#0A66C2]/20 hover:-translate-y-1" title="Share on LinkedIn">
                    <Linkedin size={18} />
                  </button>
                  <button onClick={() => handleShare('facebook')} className="w-12 h-12 rounded-full bg-black/50 hover:bg-[#1877F2] hover:text-white border border-white/10 flex items-center justify-center transition-all text-gray-400 shadow-sm hover:shadow-lg hover:shadow-[#1877F2]/20 hover:-translate-y-1" title="Share on Facebook">
                    <Facebook size={18} />
                  </button>
                  <button onClick={() => handleShare('copy')} className="w-auto px-6 h-12 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 flex items-center justify-center transition-all text-sm font-bold gap-2 shadow-sm hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1">
                    {isCopied ? <CheckCircle2 size={16} /> : <LinkIcon size={16} />}
                    {isCopied ? "Tersalin!" : "Salin Tautan"}
                  </button>
                </div>
              </div>
            </div>

            {/* --- GIANT CTA BOX (GEN Z ENGAGEMENT) --- */}
            <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t border-white/10">
              <div className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-[#050505] border border-pink-500/20 text-center relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] -z-10 group-hover:bg-pink-500/30 transition-all duration-700" />
                
                <h3 className="text-2xl md:text-4xl font-bold font-heading text-white mb-3 md:mb-4">Suka dengan tulisan ini? 🔥</h3>
                <p className="text-gray-400 mb-6 md:mb-8 max-w-lg mx-auto text-xs md:text-base leading-relaxed">
                  Bantu artikel ini naik ke posisi <b>Trending</b> agar lebih banyak orang yang terinspirasi. Berikan support kamu!
                </p>
                
                <button 
                  onClick={handleLike}
                  className={cn(
                    "relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-sm md:text-lg transition-all duration-300 transform active:scale-95 shadow-2xl overflow-hidden w-full md:w-auto",
                    isLiked 
                      ? "bg-white text-pink-500 shadow-[0_0_40px_rgba(255,255,255,0.3)]" 
                      : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] hover:-translate-y-1"
                  )}
                >
                  <Heart className={cn("w-5 h-5 md:w-6 md:h-6", isLiked ? "fill-pink-500 animate-bounce" : "fill-white")} />
                  {isLiked ? "Makasih Dukungannya! 💖" : "Kasih API! (Like)"}
                </button>
              </div>
            </div>

            {/* --- SECTION: COMMENTS --- */}
            <div id="comments-section" className="mt-12 md:mt-16 mb-8 pt-8 border-t border-white/10 scroll-mt-24 md:scroll-mt-32">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <h3 className="font-heading text-xl md:text-2xl font-bold text-white">Diskusi <span className="text-gray-500 text-base md:text-lg font-normal">({comments.length})</span></h3>
              </div>

              {/* Form Tambah Komentar */}
              <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 shadow-inner mb-8 md:mb-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] -z-10" />
                <h4 className="font-bold text-white mb-4 text-sm md:text-lg">Ikut Nimbrung! 🚀</h4>
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 md:gap-4 relative z-10">
                  <input
                    type="text"
                    placeholder="Nama / Nickname Kerenmu (opsional)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors text-xs md:text-sm shadow-inner"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                  />
                  <textarea 
                    rows={isMobile ? 3 : 4}
                    placeholder="Tulis pendapatmu di sini... (Support Markdown)"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors resize-y placeholder:text-gray-500 text-xs md:text-sm shadow-inner"
                  />
                  <div className="flex justify-end items-center mt-1 md:mt-2">
                    <Button 
                      type="submit" 
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="rounded-full w-full md:w-auto px-6 md:px-8 py-5 md:py-6 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide disabled:opacity-50 shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 text-xs md:text-sm"
                    >
                      {isSubmittingComment ? "Mengirim..." : "Kirim Komentar"} <Send size={14} className="ml-2" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Daftar Komentar */}
              <div className="flex flex-col gap-4 md:gap-6">
                <AnimatePresence>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                              <UserCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xs md:text-sm">{comment.authorName}</h4>
                              <p className="text-[9px] md:text-[10px] text-gray-500 font-mono mt-0.5">
                                {new Date(comment.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 md:py-16 border border-dashed border-white/10 rounded-2xl md:rounded-3xl bg-white/[0.01]"
                    >
                      <MessageSquare className="w-8 h-8 md:w-12 md:h-12 mx-auto text-gray-700 mb-3 md:mb-4" />
                      <p className="text-gray-300 font-bold text-sm md:text-lg">Belum ada komentar.</p>
                      <p className="text-gray-500 mt-1 md:mt-2 text-xs md:text-sm">Jadilah yang pertama memulai diskusi luar biasa ini!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* SIDEBAR & REKOMENDASI (Col 4) */}
          <div className="lg:col-span-4 relative mt-8 md:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-32 flex flex-col gap-6 md:gap-8 pb-8 h-fit"
            >
              
              {/* Sidebar Search (Hidden on Mobile) */}
              <div className="hidden md:block bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -z-10" />
                <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Cari Artikel</h4>
                <form onSubmit={handleSearch} className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Ketik kata kunci..." 
                    className="w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm text-white placeholder:text-gray-600 shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Sidebar Recommendations */}
              <div className="bg-[#050505] md:bg-[#0a0a0a] md:border border-white/10 rounded-3xl md:p-6 shadow-xl pt-4 md:pt-6 border-t md:border-t-white/10 border-white/10">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h4 className="text-xs md:text-sm font-mono text-gray-500 uppercase tracking-widest">Baca Juga</h4>
                  <div className="md:hidden flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-primary animate-pulse border border-primary/20 px-2 py-0.5 rounded-full w-fit">
                      Swipe <ArrowRight size={10} />
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((recPost) => (
                      <Link key={recPost.id} href={`/blog/${recPost.slug}`} className="group flex flex-col md:flex-row gap-3 md:gap-4 md:items-center w-[65vw] md:w-auto shrink-0 snap-center border border-white/5 md:border-transparent p-3 md:p-0 rounded-2xl md:rounded-none bg-white/[0.02] md:bg-transparent hover:bg-white/[0.05] transition-colors">
                        <div className="w-full md:w-24 h-32 md:h-20 shrink-0 rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 relative shadow-md">
                          {recPost.coverImage ? (
                            <img src={recPost.coverImage} alt={recPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <BookOpen className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="text-[9px] md:text-[10px] font-mono text-primary/80 mb-1 md:mb-1.5 uppercase tracking-wider">
                            {new Date(recPost.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <h5 className="font-bold text-white text-xs md:text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                            {recPost.title}
                          </h5>
                          <div className="text-[10px] md:text-xs text-gray-500 font-medium group-hover:text-gray-300 transition-colors flex items-center mt-auto md:mt-0">
                            Baca <ChevronRight className="w-3 h-3 ml-0.5" />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-white/10 rounded-xl">Belum ada artikel lain.</p>
                  )}
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}