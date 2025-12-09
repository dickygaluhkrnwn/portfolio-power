"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Trash, Plus, X, Image as ImageIcon, Zap, Percent, Calculator, Clock } from "lucide-react";
import { getServiceById, saveService, deleteService } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";

// Kita extend tipe data ServicePackage untuk mengakomodasi field baru sementara (jika belum ada di interface utama)
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

  useEffect(() => {
    if (!isNew && id) {
      loadData(id);
    }
  }, [id, isNew]);

  const loadData = async (id: string) => {
    try {
      const data = await getServiceById(id);
      if (data) {
        // FIX: Merge dengan initialData agar field baru tidak undefined
        // Ini solusi untuk error "changing an uncontrolled input to be controlled"
        const mergedData = { ...initialData, ...data };
        setFormData(mergedData);
        
        if (mergedData.originalPrice && mergedData.originalPrice !== "") {
          setIsDiscountActive(true);
        }
      }
    } catch (error) {
      console.error("Failed to load service", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: FORMAT CURRENCY ---
  const formatRupiah = (value: string) => {
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
    
    const dataToSave = { ...formData };
    // Bersihkan data jika toggle dimatikan
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
      alert("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this service?")) {
      setSaving(true);
      await deleteService(id);
      router.push("/admin/dashboard");
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin" /></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground pb-20">
        <header className="border-b border-white/10 bg-secondary/5 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft size={20} />
              </Button>
              <h1 className="font-heading text-xl font-bold">
                {isNew ? "Add Product Service" : "Edit Product Service"}
              </h1>
            </div>
            {!isNew && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash size={16} className="mr-2" /> Delete
              </Button>
            )}
          </div>
        </header>

        <main className="container-width py-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* --- VISUAL & BASIC INFO --- */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                <ImageIcon size={18} /> Visual & Info Utama
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail URL (Imgur)</label>
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
                  <div className="mt-2 relative h-48 w-full rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Title</label>
                  <input required className="input-field font-bold" placeholder="e.g. Landing Page UMKM"
                    value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </section>

            {/* --- PRICING & PROMOTION (AUTO CALC) --- */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><Calculator size={18}/> Pricing Calculator</h3>
              </div>
              
              {/* Basic Info (Tampil JIKA Flash Sale MATI) */}
              {!formData.isFlashSale && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary">Harga Jual (Final Price)</label>
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
                    <label className="text-sm font-medium">Estimasi Pengerjaan</label>
                    <input required className="input-field" placeholder="e.g. 2-3 Hari Kerja"
                      value={formData.duration || ""} onChange={e => setFormData({...formData, duration: e.target.value})} 
                    />
                  </div>
                </div>
              )}

              {/* 1. Toggle Diskon */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 mt-4 space-y-4 transition-all">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="activeDiscount" 
                    className="w-4 h-4 rounded bg-black/20 border-white/10 text-orange-500 focus:ring-orange-500"
                    checked={isDiscountActive}
                    onChange={e => setIsDiscountActive(e.target.checked)}
                  />
                  <label htmlFor="activeDiscount" className="text-sm font-bold text-orange-400 cursor-pointer select-none flex items-center gap-1">
                    <Percent size={14} /> Aktifkan Diskon (Coret Harga)
                  </label>
                </div>

                {isDiscountActive && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 pl-6 border-l-2 border-orange-500/20">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-200">Harga Asli (Sebelum Diskon)</label>
                      <input 
                        className="input-field border-orange-500/30 focus:border-orange-500" 
                        placeholder="e.g. Rp 2.000.000"
                        value={formData.originalPrice || ""} 
                        onChange={handleOriginalPriceChange} 
                      />
                      <p className="text-xs text-muted-foreground">Harga dicoret.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-200">Besar Diskon (%)</label>
                      <input 
                        type="number" 
                        min="0" max="100"
                        className="input-field border-orange-500/30 focus:border-orange-500" 
                        placeholder="e.g. 50"
                        value={formData.discountValue || 0} 
                        onChange={handleDiscountChange} 
                      />
                      <p className="text-xs text-muted-foreground">Otomatis hitung harga jual.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Toggle Flash Sale (Tampilan Khusus) */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 mt-2 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" id="flashSale" 
                    className="w-4 h-4 rounded bg-black/20 border-white/10 text-red-500 focus:ring-red-500"
                    checked={!!formData.isFlashSale}
                    onChange={e => setFormData({...formData, isFlashSale: e.target.checked})}
                  />
                  <label htmlFor="flashSale" className="text-sm font-bold text-red-400 cursor-pointer select-none flex items-center gap-1">
                    <Zap size={14} /> Aktifkan Flash Sale
                  </label>
                </div>

                {formData.isFlashSale && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pl-6 border-l-2 border-red-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Input Harga Flash Sale (Pindah ke Sini) */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-red-300">Harga Flash Sale (IDR)</label>
                        <input 
                          required 
                          className="input-field text-lg text-red-400 font-bold border-red-500/30 focus:border-red-500 bg-red-950/20" 
                          placeholder="e.g. Rp 999.000"
                          value={formData.price || ""} 
                          onChange={handlePriceChange} 
                        />
                        <p className="text-xs text-red-300/60">Harga spesial ini yang akan tampil besar.</p>
                      </div>

                      {/* Input Durasi Flash Sale (Baru) */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-red-300">Berakhir Pada (Durasi)</label>
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
                    
                    {/* Input Estimasi Pengerjaan (Pindah ke Sini juga agar form tidak hilang) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estimasi Pengerjaan (Saat Flash Sale)</label>
                      <input required className="input-field" placeholder="e.g. 2-3 Hari Kerja"
                        value={formData.duration || ""} onChange={e => setFormData({...formData, duration: e.target.value})} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rating & Sales */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" className="input-field" 
                    value={formData.rating || 0} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Sales</label>
                  <input type="number" min="0" className="input-field" 
                    value={formData.sales || 0} onChange={e => setFormData({...formData, sales: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
            </section>

            {/* --- DETAILS --- */}
            <section className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Product Details</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description (For Card)</label>
                <textarea required className="input-field min-h-[80px]" placeholder="Deskripsi singkat max 2 kalimat..."
                  value={formData.shortDesc || ""} onChange={e => setFormData({...formData, shortDesc: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description (HTML/Rich Text)</label>
                <textarea required className="input-field min-h-[150px] font-mono text-sm" placeholder="<p>Deskripsi lengkap...</p>"
                  value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} 
                />
                <p className="text-xs text-muted-foreground">Bisa menggunakan tag HTML sederhana.</p>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4 mt-4">
                <label className="text-sm font-medium">Features List (Bullet Points)</label>
                <div className="flex gap-2">
                  <input 
                    className="input-field" 
                    placeholder="Add feature..."
                    value={featureInput} 
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="secondary"><Plus size={18}/></Button>
                </div>
                
                <div className="space-y-2 mt-2">
                  {formData.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-black/20 p-2 rounded px-3 text-sm border border-white/5">
                      <span>{feat}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- STATUS --- */}
            <section className="bg-secondary/5 p-6 rounded-xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" id="rec" 
                  className="w-5 h-5 rounded bg-black/20 border-white/10 text-primary focus:ring-primary"
                  checked={!!formData.recommended}
                  onChange={e => setFormData({...formData, recommended: e.target.checked})}
                />
                <label htmlFor="rec" className="text-sm font-medium cursor-pointer select-none">Mark as Recommended</label>
              </div>

              <Button type="submit" size="lg" className="shadow-xl shadow-primary/20" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                Save Product
              </Button>
            </section>

          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}