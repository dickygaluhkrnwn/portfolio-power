"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Trash, Plus, X, Image as ImageIcon, Zap, Percent, Calculator, Clock, Check } from "lucide-react";
import { getServiceById, saveService, deleteService } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";

// Kita extend tipe data ServicePackage untuk mengakomodasi field baru sementara
type ExtendedServicePackage = Partial<ServicePackage> & {
  flashSaleEndDate?: string;
};

// Initial state lengkap untuk mencegah Uncontrolled Input Error
const initialData: ExtendedServicePackage = {
  title: "",
  price: "",
  duration: "",
  shortDesc: "",
  description: "",
  thumbnail: "",
  category: "frontend",
  features: [],
  recommended: false,
  rating: 5.0,
  sales: 0,
  isFlashSale: false,
  originalPrice: "",
  discountValue: 0,
  flashSaleEndDate: "",
};

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<ExtendedServicePackage>(initialData);
  const [featureInput, setFeatureInput] = useState("");
  const [isDiscountActive, setIsDiscountActive] = useState(false); 
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServiceById(id);
      
      if (data) {
        const mergedData = { ...initialData, ...data };
        setFormData(mergedData);
        
        if (mergedData.originalPrice && mergedData.originalPrice !== "") {
          setIsDiscountActive(true);
        }
      } else {
        setError("Layanan tidak ditemukan.");
      }
    } catch (error) {
      console.error("Failed to load service", error);
      setError("Gagal memuat data layanan. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: FORMAT CURRENCY ---
  const formatRupiah = (value: string) => {
    if (!value) return "";
    
    const numberString = value.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return split[1] !== undefined ? "Rp " + rupiah + "," + split[1] : "Rp " + rupiah;
  };

  const parseNumber = (priceString: string) => {
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^0-9]/g, "")) || 0;
  };

  // --- AUTO CALCULATION LOGIC ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatRupiah(rawVal);
    
    setFormData(prev => {
      const newData = { ...prev, price: formatted };
      if (isDiscountActive && prev.originalPrice) {
        const final = parseNumber(formatted);
        const original = parseNumber(prev.originalPrice);
        if (original > 0) {
          const disc = Math.round(((original - final) / original) * 100);
          newData.discountValue = disc > 0 ? disc : 0;
        }
      }
      return newData;
    });
  };

  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatRupiah(rawVal);

    setFormData(prev => {
      const newData = { ...prev, originalPrice: formatted };
      if (prev.price) {
        const final = parseNumber(prev.price);
        const original = parseNumber(formatted);
        if (original > 0) {
          const disc = Math.round(((original - final) / original) * 100);
          newData.discountValue = disc > 0 ? disc : 0;
        }
      }
      return newData;
    });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discVal = parseInt(e.target.value) || 0;
    
    setFormData(prev => {
      const newData = { ...prev, discountValue: discVal };
      if (prev.originalPrice) {
        const original = parseNumber(prev.originalPrice);
        const cut = (original * discVal) / 100;
        const final = original - cut;
        newData.price = formatRupiah(final.toString());
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const dataToSave = { ...formData };
    if (!isDiscountActive) {
      dataToSave.originalPrice = "";
      dataToSave.discountValue = 0;
    }
    if (!dataToSave.isFlashSale) {
      dataToSave.flashSaleEndDate = "";
    }

    try {
      await saveService(dataToSave, isNew ? undefined : id);
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Error saving:", err);
      setError("Gagal menyimpan layanan. Coba lagi nanti.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      setSaving(true);
      try {
        await deleteService(id);
        router.push("/admin/dashboard");
      } catch (err) {
        console.error("Error deleting:", err);
        setError("Gagal menghapus layanan.");
        setSaving(false);
      }
    }
  };

  // Feature List Helpers
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== idx)
    }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center max-w-md">
            <h3 className="text-xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground pb-24 md:pb-20">
        
        {/* Sticky Header */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")} className="hover:bg-white/10">
                <ArrowLeft size={20} />
              </Button>
              <h1 className="font-heading text-lg md:text-xl font-bold truncate">
                {isNew ? "Add Product Service" : "Edit Product Service"}
              </h1>
            </div>
            {!isNew && (
              <div className="hidden md:block">
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin mr-2"/> : <Trash size={16} className="mr-2" />} Delete
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="container-width py-6 md:py-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            
            {/* --- VISUAL & BASIC INFO --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                <ImageIcon size={20} className="text-accent" /> Visual & Info Utama
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Thumbnail URL (Imgur)</label>
                <input 
                  className="input-field" 
                  placeholder="https://i.imgur.com/..."
                  value={formData.thumbnail || ""} 
                  onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                />
                <p className="text-xs text-muted-foreground/80 italic">
                  * Disarankan rasio 1:1 (Square) atau 4:3. Minimal 500x500px agar tajam.
                </p>
                {formData.thumbnail && (
                  <div className="mt-2 relative h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Product Title</label>
                  <input required className="input-field font-bold text-lg" placeholder="e.g. Landing Page UMKM"
                    value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                  <select className="input-field h-12" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </section>

            {/* --- PRICING & PROMOTION --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                <Calculator size={20} className="text-primary" /> Pricing & Promo
              </h3>
              
              {!formData.isFlashSale && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-primary ml-1">Harga Jual (Final Price)</label>
                    <input 
                      required 
                      className="input-field text-lg text-primary font-bold border-primary/30" 
                      placeholder="e.g. Rp 999.000"
                      value={formData.price || ""} 
                      onChange={handlePriceChange} 
                    />
                    <p className="text-xs text-muted-foreground">Harga ini yang akan dibayar klien.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Estimasi Pengerjaan</label>
                    <input required className="input-field" placeholder="e.g. 2-3 Hari Kerja"
                      value={formData.duration || ""} onChange={e => setFormData({...formData, duration: e.target.value})} 
                    />
                  </div>
                </div>
              )}

              {/* 1. Toggle Diskon */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4 transition-all">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="activeDiscount" 
                    className="w-5 h-5 rounded bg-black/20 border-white/10 text-orange-500 focus:ring-orange-500"
                    checked={isDiscountActive}
                    onChange={e => setIsDiscountActive(e.target.checked)}
                  />
                  <label htmlFor="activeDiscount" className="text-sm font-bold text-orange-400 cursor-pointer select-none flex items-center gap-2">
                    <Percent size={16} /> Aktifkan Diskon (Coret Harga)
                  </label>
                </div>

                {isDiscountActive && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 pl-4 border-l-2 border-orange-500/20">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-orange-200 uppercase tracking-wider">Harga Asli (Sebelum Diskon)</label>
                      <input 
                        className="input-field border-orange-500/30 focus:border-orange-500" 
                        placeholder="e.g. Rp 2.000.000"
                        value={formData.originalPrice || ""} 
                        onChange={handleOriginalPriceChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-orange-200 uppercase tracking-wider">Besar Diskon (%)</label>
                      <input 
                        type="number" 
                        min="0" max="100"
                        className="input-field border-orange-500/30 focus:border-orange-500" 
                        placeholder="e.g. 50"
                        value={formData.discountValue || 0} 
                        onChange={handleDiscountChange} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Toggle Flash Sale */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" id="flashSale" 
                    className="w-5 h-5 rounded bg-black/20 border-white/10 text-red-500 focus:ring-red-500"
                    checked={!!formData.isFlashSale}
                    onChange={e => setFormData({...formData, isFlashSale: e.target.checked})}
                  />
                  <label htmlFor="flashSale" className="text-sm font-bold text-red-400 cursor-pointer select-none flex items-center gap-2">
                    <Zap size={16} /> Aktifkan Flash Sale
                  </label>
                </div>

                {formData.isFlashSale && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 pl-4 border-l-2 border-red-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-red-300 uppercase tracking-wider">Harga Flash Sale (IDR)</label>
                        <input 
                          required 
                          className="input-field text-lg text-red-400 font-bold border-red-500/30 focus:border-red-500 bg-red-950/20" 
                          placeholder="e.g. Rp 999.000"
                          value={formData.price || ""} 
                          onChange={handlePriceChange} 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-red-300 uppercase tracking-wider">Berakhir Pada (Durasi)</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 w-4 h-4" />
                          <input 
                            type="datetime-local"
                            className="input-field pl-10 border-red-500/30 focus:border-red-500 text-sm" 
                            value={formData.flashSaleEndDate || ""} 
                            onChange={e => setFormData({...formData, flashSaleEndDate: e.target.value})} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Estimasi Pengerjaan (Flash Sale)</label>
                      <input required className="input-field" placeholder="e.g. 2-3 Hari Kerja"
                        value={formData.duration || ""} onChange={e => setFormData({...formData, duration: e.target.value})} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rating & Sales */}
              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-white/5 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Rating (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" className="input-field" 
                    value={formData.rating || 0} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Total Sales</label>
                  <input type="number" min="0" className="input-field" 
                    value={formData.sales || 0} onChange={e => setFormData({...formData, sales: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
            </section>

            {/* --- DETAILS --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-2">Product Details</h3>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Short Description (For Card)</label>
                <textarea required className="input-field min-h-[100px] leading-relaxed" placeholder="Deskripsi singkat max 2 kalimat..."
                  value={formData.shortDesc || ""} onChange={e => setFormData({...formData, shortDesc: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Description (Rich Text)</label>
                <div className="min-h-[200px]">
                  <TiptapEditor 
                    content={formData.description || ""} 
                    onChange={(html) => setFormData({...formData, description: html})} 
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4 mt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Features List</label>
                <div className="flex gap-2">
                  <input 
                    className="input-field" 
                    placeholder="Add feature..."
                    value={featureInput} 
                    onChange={e => setFeatureInput(e.target.value)} 
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="secondary" className="px-3"><Plus size={18}/></Button>
                </div>
                
                <div className="space-y-2 mt-2">
                  {formData.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 group">
                      <span className="text-sm">{feat}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- STATUS --- */}
            <section className="bg-secondary/5 p-5 md:p-6 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" id="rec" 
                  className="w-5 h-5 rounded bg-black/20 border-white/10 text-primary focus:ring-primary"
                  checked={!!formData.recommended}
                  onChange={e => setFormData({...formData, recommended: e.target.checked})}
                />
                <label htmlFor="rec" className="text-sm font-bold cursor-pointer select-none">Mark as Recommended</label>
              </div>
            </section>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10 z-40 flex gap-3">
              {!isNew && (
                <Button type="button" variant="destructive" size="lg" className="flex-1" onClick={handleDelete}>
                  <Trash size={18} />
                </Button>
              )}
              <Button type="submit" size="lg" className="flex-[3] shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                Save Product
              </Button>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden md:flex justify-end pt-4">
              <Button type="submit" size="lg" className="min-w-[150px] shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                Save Product
              </Button>
            </div>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}