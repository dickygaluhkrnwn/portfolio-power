"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Loader2, Plus, X, Image as ImageIcon, 
  Calendar, Tag, Trash2, FileText, Settings, 
  MonitorPlay, CheckCircle2, Clock, Globe, UploadCloud
} from "lucide-react";
import { getPostById, savePost, deletePost, BlogPost } from "@/lib/blog-service";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialPost: Partial<BlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: [],
  isPublished: true,
  publishedAt: new Date().toISOString(),
};

type TabType = "content" | "meta" | "media";

export default function BlogPostForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<BlogPost>>(initialPost);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced UI State
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [tagInput, setTagInput] = useState("");

  // Cloudinary State
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const data = await getPostById(id);
      if (data) setFormData(data);
      else setError("Artikel tidak ditemukan.");
    } catch (err) {
      setError("Gagal memuat data artikel.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!formData.title || !formData.content) {
        throw new Error("Judul dan Konten Utama wajib diisi.");
      }
      if (!formData.slug) {
        throw new Error("Slug URL wajib diisi.");
      }
      await savePost(formData, isNew ? undefined : id);
      router.push("/admin/blog");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan artikel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini secara permanen?")) {
      setSaving(true);
      await deletePost(id);
      router.push("/admin/blog");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if it's new or empty
      slug: isNew || !prev.slug 
        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        : prev.slug
    }));
  };

  // --- Tags Manager ---
  const addTag = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (tagInput.trim()) {
      const newTag = tagInput.trim().toUpperCase();
      if (!formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  // --- Format Date for Input ---
  const getFormattedDateForInput = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Format YYYY-MM-DDThh:mm
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setFormData(prev => ({ ...prev, publishedAt: date.toISOString() }));
  };

  // --- Cloudinary Upload Handler ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setError("File yang diupload harus berupa gambar.");
      return;
    }

    // Validasi ukuran (misal max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploadingImage(true);
    setError(null);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    // Optional: Tambahkan folder spesifik jika diperlukan
    // data.append("folder", "portfolio_images/blog");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mengunggah gambar ke Cloudinary");
      }

      const fileData = await res.json();
      
      // Update form data dengan URL dari Cloudinary
      // Menggunakan secure_url agar selalu menggunakan HTTPS
      setFormData(prev => ({ ...prev, coverImage: fileData.secure_url }));
      
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError("Gagal mengunggah gambar. Pastikan konfigurasi Cloudinary Anda benar.");
    } finally {
      setUploadingImage(false);
      // Reset input file agar bisa memilih file yang sama lagi jika terjadi error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  if (error && !formData.title && !isNew) {
    return (
       <ProtectedRoute>
         <div className="min-h-screen bg-[#050505] text-foreground flex flex-col items-center justify-center p-4">
           <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md shadow-2xl">
             <h3 className="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
             <p className="text-gray-400 mb-8">{error}</p>
             <Button onClick={() => router.push("/admin/blog")} className="rounded-full bg-red-500 hover:bg-red-600 text-white">
               Kembali ke Blog
             </Button>
           </div>
         </div>
       </ProtectedRoute>
    );
 }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground pb-24 relative selection:bg-primary/30 selection:text-white">
        
        {/* Background FX */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-clip fixed">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* --- STICKY HEADER --- */}
        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/blog")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Artikel Baru" : formData.title || "Untitled Article"}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Mode" : "Editing Mode"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isNew && (
                <Button variant="outline" size="icon" onClick={handleDelete} disabled={saving} className="rounded-xl bg-transparent border-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 hidden md:flex">
                  <Trash2 size={16} />
                </Button>
              )}
              <span className="hidden md:flex text-xs font-mono text-gray-500 mr-2 items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", formData.title ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]")} />
                {formData.title ? "Ready to Publish" : "Pending Title"}
              </span>
              <Button onClick={() => handleSubmit()} disabled={saving} className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Publish Artikel" : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ======================================================== */}
            {/* KOLOM KIRI: EDITOR (Col 8) */}
            {/* ======================================================== */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Premium Tab Navigation */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden shadow-inner sticky top-[88px] z-40 backdrop-blur-xl">
                <TabBtn active={activeTab === "content"} onClick={() => setActiveTab("content")} icon={<FileText size={14} />} label="Konten & Penulisan" />
                <TabBtn active={activeTab === "meta"} onClick={() => setActiveTab("meta")} icon={<Settings size={14} />} label="Meta & SEO" />
                <TabBtn active={activeTab === "media"} onClick={() => setActiveTab("media")} icon={<ImageIcon size={14} />} label="Media Utama" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl min-h-[500px]"
                >
                  {/* --- TAB: CONTENT --- */}
                  {activeTab === "content" && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Judul Artikel *</label>
                        <input 
                          required 
                          className="w-full px-4 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white font-bold text-xl md:text-3xl placeholder:text-gray-700" 
                          value={formData.title} 
                          onChange={handleTitleChange} 
                          placeholder="Ketik judul artikel di sini..." 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex justify-between">
                          <span>Ringkasan (Excerpt)</span>
                          <span className={cn("font-mono text-[10px]", (formData.excerpt?.length || 0) > 160 ? "text-red-400" : "text-gray-600")}>
                            {formData.excerpt?.length || 0}/160
                          </span>
                        </label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-gray-300 min-h-[80px] resize-none placeholder:text-gray-700 leading-relaxed" 
                          value={formData.excerpt} 
                          onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                          placeholder="Ringkasan singkat untuk ditampilkan di kartu artikel (maks. 160 karakter direkomendasikan)."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Konten Lengkap (Rich Text) *</label>
                        <TiptapEditor 
                          content={formData.content || ""} 
                          onChange={(html) => setFormData({...formData, content: html})} 
                        />
                      </div>
                    </div>
                  )}

                  {/* --- TAB: META & SEO --- */}
                  {activeTab === "meta" && (
                    <div className="space-y-8">
                      
                      {/* Publish Toggle */}
                      <div className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                            <Globe size={16} className="text-primary"/> Status Publikasi
                          </h4>
                          <p className="text-xs text-gray-500">Tentukan apakah artikel ini bisa dilihat oleh publik.</p>
                        </div>
                        <div 
                          className={cn(
                            "relative flex items-center w-36 h-10 rounded-full p-1 cursor-pointer transition-colors border",
                            formData.isPublished ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/5 border-white/10"
                          )}
                          onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}
                        >
                          <div className={cn(
                            "absolute flex items-center justify-center w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-full transition-transform duration-300 ease-in-out shadow-sm",
                            formData.isPublished ? "translate-x-full bg-emerald-500 text-white" : "translate-x-0 bg-gray-500 text-white"
                          )}>
                            {formData.isPublished ? <CheckCircle2 size={14} /> : <X size={14} />}
                          </div>
                          <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-emerald-400 z-10">PUB</div>
                          <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 z-10">DRFT</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">URL Slug</label>
                          <input 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-gray-300 font-mono text-sm" 
                            value={formData.slug} 
                            onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                            placeholder="judul-artikel-anda"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tanggal & Waktu</label>
                          <input 
                            type="datetime-local"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-gray-300 font-mono text-sm" 
                            value={getFormattedDateForInput(formData.publishedAt)} 
                            onChange={handleDateChange} 
                          />
                        </div>
                      </div>

                      {/* Tags Manager */}
                      <div className="space-y-3 pt-6 border-t border-white/10">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2">
                          <Tag size={14} /> Kategori & Tags
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input 
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white text-sm" 
                            value={tagInput} 
                            onChange={e => setTagInput(e.target.value)} 
                            placeholder="Ketik tag dan tekan Enter..."
                            onKeyDown={e => e.key === "Enter" && addTag(e)}
                          />
                          <Button type="button" onClick={addTag} className="h-11 sm:h-auto rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6">
                            Tambah
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 min-h-[44px] p-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                          {formData.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center gap-2 border border-primary/20 shadow-sm">
                              {tag}
                              <button type="button" onClick={() => removeTag(idx)} className="hover:text-white hover:bg-primary/50 rounded-full p-0.5 transition-colors"><X size={12}/></button>
                            </span>
                          ))}
                          {(!formData.tags || formData.tags.length === 0) && (
                            <p className="text-sm text-gray-600 italic m-auto">Belum ada tag ditambahkan.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: MEDIA --- */}
                  {activeTab === "media" && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Cover Image URL</label>
                        
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                            value={formData.coverImage} 
                            onChange={e => setFormData({...formData, coverImage: e.target.value})} 
                            placeholder="https://... atau URL gambar lainnya"
                          />
                          
                          {/* Tombol Upload Cloudinary */}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="rounded-xl border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary px-4"
                          >
                            {uploadingImage ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <UploadCloud className="w-5 h-5 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {/* Live Image Preview (Glassmorphism) */}
                        {formData.coverImage && (
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl mt-6 group">
                            <img 
                              src={formData.coverImage} 
                              alt="Cover Preview" 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                              onError={(e) => (e.currentTarget.src = "https://grainy-gradients.vercel.app/noise.svg")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 pointer-events-none">
                              <span className="text-[10px] font-mono text-gray-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Resolusi Disarankan: 16:9</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ======================================================== */}
            {/* KOLOM KANAN: LIVE PREVIEW CARD (Col 4) */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-[112px] flex flex-col gap-6">
                
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MonitorPlay size={16} className="text-primary"/> Live Card Preview
                    </h3>
                  </div>

                  {/* UI Render Card Preview (Mirip di Halaman Blog) */}
                  <div className="pointer-events-none select-none scale-[0.95] origin-top">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-lg flex flex-col transition-all">
                      
                      <div className="h-40 bg-[#0d1117] relative border-b border-white/5 shrink-0">
                        {formData.coverImage ? (
                          <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/5"><ImageIcon size={32} /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded border text-[9px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg",
                            formData.isPublished ? "bg-emerald-500/80 border-emerald-400/50 text-white" : "bg-yellow-500/80 border-yellow-400/50 text-black"
                          )}>
                            {formData.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col">
                        <div className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                          <Clock size={12} /> {new Date(formData.publishedAt || new Date()).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2">
                          {formData.title || "Judul Artikel"}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-light">
                          {formData.excerpt || "Ringkasan artikel akan muncul di sini."}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                          {formData.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-primary border border-primary/20 uppercase">
                              {tag}
                            </span>
                          ))}
                          {(formData.tags?.length || 0) > 2 && (
                             <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-white/[0.02] text-gray-500 border border-white/5">
                               +{(formData.tags?.length || 0) - 2}
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Visibilitas</p>
                      <p className={cn("text-xs font-mono font-medium", formData.isPublished ? "text-emerald-400" : "text-yellow-400")}>
                        {formData.isPublished ? "Publik" : "Pribadi/Draft"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Status Slug</p>
                      <p className={cn("text-xs font-mono font-medium truncate", formData.slug ? "text-gray-300" : "text-red-400")}>
                        {formData.slug ? `/${formData.slug}` : "Slug Kosong!"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// --- SUB-COMPONENTS ---
function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        "relative flex items-center justify-center gap-2 py-2 px-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap outline-none rounded-xl",
        active 
          ? "text-white font-bold bg-white/10" 
          : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      <span className={cn(active ? "text-primary" : "opacity-70")}>{icon}</span>
      {label}
    </button>
  );
}