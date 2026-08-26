"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Loader2, Trash2, Plus, X, Image as ImageIcon, 
  Zap, Percent, Calculator, Clock, CheckCircle2, Star,
  LayoutGrid, FileText, MonitorPlay, ShoppingCart, Info, EyeOff, Eye, Tag
} from "lucide-react";
import { getServiceById, saveService, deleteService } from "@/lib/services-service";
import { ServicePackage, PricingTier } from "@/app/data/services";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Extended Type
type ExtendedServicePackage = Partial<ServicePackage> & {
  flashSaleEndDate?: string;
};

// Initial state
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
  discountValue: "",
  flashSaleEndDate: "",
  isDraft: false,
  tags: [],
  packages: [],
};

type TabType = "general" | "pricing" | "content";

// --- Info Tooltip Component ---
function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex items-center justify-center ml-2 cursor-help">
      <Info size={14} className="text-gray-500 hover:text-purple-400 transition-colors" />
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-black/90 text-xs text-white rounded-lg shadow-xl border border-white/10 z-50 pointer-events-none whitespace-normal">
        {text}
        {/* Triangle pointer */}
        <div className="absolute top-full left-4 w-2 h-2 bg-black/90 border-b border-r border-white/10 transform rotate-45 -translate-y-1" />
      </div>
    </div>
  );
}

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<ExtendedServicePackage>(initialData);
  const [featureInput, setFeatureInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [discountType, setDiscountType] = useState<"percent" | "nominal">("percent");
  const [discountInput, setDiscountInput] = useState(""); 
  const [usePackages, setUsePackages] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Package Features Input State (Index -> Input string)
  const [pkgFeatureInputs, setPkgFeatureInputs] = useState<{[key: number]: string}>({});

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
        if (mergedData.packages && mergedData.packages.length > 0) {
          setUsePackages(true);
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

  // Initialize Packages if toggled ON and empty
  useEffect(() => {
    if (usePackages && (!formData.packages || formData.packages.length === 0)) {
      setFormData(prev => ({
        ...prev,
        packages: [
          { name: "Basic", description: "", price: "", duration: "", revisions: "", features: [] },
          { name: "Standard", description: "", price: "", duration: "", revisions: "", features: [] },
          { name: "Premium", description: "", price: "", duration: "", revisions: "", features: [] },
        ]
      }));
    }
  }, [usePackages, formData.packages]);

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

  const handleCalculatePromo = () => {
    const isMulti = usePackages && formData.packages && formData.packages.length > 0;
    const baseStr = isMulti ? formData.packages![0].price : formData.price;
    const basePrice = parseNumber(baseStr || "0");
    
    if (basePrice <= 0) {
      alert("Harga Jual atau Harga Paket Basic belum diisi!");
      return;
    }

    let finalBasePrice = basePrice;
    let label = "";

    if (discountType === "percent") {
      const perc = parseFloat(discountInput) || 0;
      finalBasePrice = basePrice - (basePrice * perc / 100);
      label = `${perc}%`;
    } else {
      const nom = parseNumber(discountInput);
      finalBasePrice = basePrice - nom;
      if (nom >= 1000000) {
        label = `Rp${nom/1000000}JT`;
      } else if (nom >= 1000) {
        label = `Rp${nom/1000}RB`;
      } else {
        label = `Rp${nom}`;
      }
    }
    
    if (finalBasePrice < 0) finalBasePrice = 0;
    
    setFormData(prev => {
      const next = { ...prev };
      
      next.originalPrice = formatRupiah(basePrice.toString());
      next.discountValue = label;
      
      if (isMulti && next.packages) {
         next.packages = next.packages.map(pkg => {
            const pPrice = parseNumber(pkg.price);
            let finalP = pPrice;
            if (discountType === "percent") {
               const perc = parseFloat(discountInput) || 0;
               finalP = pPrice - (pPrice * perc / 100);
            } else {
               const nom = parseNumber(discountInput);
               finalP = pPrice - nom;
            }
            if (finalP < 0) finalP = 0;
            return { ...pkg, price: formatRupiah(finalP.toString()) };
         });
         next.price = next.packages[0].price;
      } else {
         next.price = formatRupiah(finalBasePrice.toString());
      }
      
      return next;
    });
  };

  const handleClearPromo = () => {
    setFormData(prev => ({
      ...prev,
      originalPrice: "",
      discountValue: "",
      isFlashSale: false,
      flashSaleEndDate: ""
    }));
    alert("Promo dihapus. Silakan kembalikan Harga Jual/Paket Anda ke harga normal secara manual jika diperlukan.");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatRupiah(rawVal);
    
    setFormData(prev => {
      const newData = { ...prev, price: formatted };
      if (isDiscountActive && prev.originalPrice) {
         // Auto calc discount if single price mode
      }
      return newData;
    });
  };

  // Generic handler for packages
  const handlePackageChange = (idx: number, field: keyof PricingTier, value: string) => {
    setFormData(prev => {
      const newPkgs = [...(prev.packages || [])];
      if (newPkgs[idx]) {
        if (field === "price") {
           newPkgs[idx] = { ...newPkgs[idx], [field]: formatRupiah(value) };
        } else {
           newPkgs[idx] = { ...newPkgs[idx], [field]: value };
        }
      }
      // If updating Basic price, optionally sync it with the main display price
      let newMainPrice = prev.price;
      if (idx === 0 && field === "price") {
         newMainPrice = formatRupiah(value);
      }
      return { ...prev, packages: newPkgs, price: newMainPrice };
    });
  };

  const addPkgFeature = (idx: number) => {
    const text = pkgFeatureInputs[idx]?.trim();
    if (text) {
      setFormData(prev => {
        const newPkgs = [...(prev.packages || [])];
        if (newPkgs[idx]) {
          newPkgs[idx].features = [...(newPkgs[idx].features || []), text];
        }
        return { ...prev, packages: newPkgs };
      });
      setPkgFeatureInputs(prev => ({ ...prev, [idx]: "" }));
    }
  };

  const removePkgFeature = (pkgIdx: number, featIdx: number) => {
    setFormData(prev => {
      const newPkgs = [...(prev.packages || [])];
      if (newPkgs[pkgIdx]) {
        newPkgs[pkgIdx].features = newPkgs[pkgIdx].features.filter((_, i) => i !== featIdx);
      }
      return { ...prev, packages: newPkgs };
    });
  };

  // Tags logic
  const addTag = (e?: React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== idx)
    }));
  };

  // General Feature List Helpers
  const addFeature = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    
    const dataToSave = { ...formData };
    if (!usePackages) {
       dataToSave.packages = []; // Clear packages if disabled
    }
    if (!dataToSave.title) {
      setError("Judul wajib diisi.");
      setSaving(false);
      return;
    }

    try {
      await saveService(dataToSave, isNew ? undefined : id);
      router.push("/admin/services");
    } catch (err: any) {
      console.error("Error saving:", err);
      setError("Gagal menyimpan layanan. " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini secara permanen?")) {
      setSaving(true);
      try {
        await deleteService(id);
        router.push("/admin/services");
      } catch (err) {
        console.error("Error deleting:", err);
        setError("Gagal menghapus layanan.");
        setSaving(false);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground pb-24 relative selection:bg-purple-500/30 selection:text-white">
        
        {/* Background FX */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-clip fixed">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* --- STICKY HEADER --- */}
        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/services")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div className="flex-1">
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Layanan Baru" : formData.title || "Untitled Service"}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Product" : "Editing Product"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              
              {/* DRAFT TOGGLE */}
              <button 
                onClick={() => setFormData(prev => ({...prev, isDraft: !prev.isDraft}))}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                  formData.isDraft 
                    ? "bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30" 
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30"
                )}
              >
                {formData.isDraft ? <EyeOff size={14} /> : <Eye size={14} />}
                {formData.isDraft ? "Draft" : "Live"}
              </button>

              <Button onClick={() => handleSubmit()} disabled={saving} className="rounded-xl shadow-lg shadow-purple-500/20 bg-purple-600 text-white hover:bg-purple-500 font-bold tracking-wide border border-purple-500/50">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Terbitkan" : "Simpan"}
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
            {/* KOLOM KIRI: EDITOR FORM (Col 8) */}
            {/* ======================================================== */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Premium Tab Navigation */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden shadow-inner sticky top-[88px] z-40 backdrop-blur-xl">
                <TabBtn active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={<LayoutGrid size={14} />} label="Info Utama" />
                <TabBtn active={activeTab === "pricing"} onClick={() => setActiveTab("pricing")} icon={<Calculator size={14} />} label="Harga & Promo" />
                <TabBtn active={activeTab === "content"} onClick={() => setActiveTab("content")} icon={<FileText size={14} />} label="Konten & Fitur" />
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
                  {/* --- TAB: GENERAL INFO --- */}
                  {activeTab === "general" && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Thumbnail Latar Belakang <InfoTooltip text="Link gambar cover layanan Anda. Disarankan menggunakan imgur.com untuk hosting gambar." />
                        </label>
                        <input 
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-white placeholder:text-gray-700 text-sm" 
                          placeholder="https://i.imgur.com/... (Disarankan Abstract/Gradient Tech)"
                          value={formData.thumbnail || ""} 
                          onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div className="space-y-2 md:col-span-2">
                          <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Judul Pekerjaan (Jasa) * <InfoTooltip text="Tulis judul yang menarik, misal: 'Jasa Pembuatan Aplikasi Mobile + AI'." />
                          </label>
                          <input 
                            required 
                            className="w-full px-4 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-white font-bold text-xl md:text-3xl placeholder:text-gray-700" 
                            placeholder="Contoh: Pembuatan Aplikasi Mobile Premium"
                            value={formData.title || ""} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Kategori <InfoTooltip text="Kategori ini menentukan dimana jasa akan difilter di halaman utama." />
                          </label>
                          <select 
                            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-white appearance-none cursor-pointer" 
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value as any})}
                          >
                            <option value="frontend" className="bg-[#111]">Frontend Development</option>
                            <option value="backend" className="bg-[#111]">Backend & API</option>
                            <option value="fullstack" className="bg-[#111]">Fullstack App</option>
                            <option value="mobile" className="bg-[#111]">Mobile App</option>
                            <option value="design" className="bg-[#111]">UI/UX Design</option>
                            <option value="marketing" className="bg-[#111]">Marketing Ads</option>
                            <option value="seo" className="bg-[#111]">SEO Optimization</option>
                            <option value="consulting" className="bg-[#111]">IT Consulting</option>
                            <option value="maintenance" className="bg-[#111]">Maintenance & Support</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Tags / Keywords <InfoTooltip text="Kata kunci untuk pencarian internal/SEO. Ketik lalu Enter." />
                          </label>
                          <div className="relative flex items-center">
                            <Tag className="absolute left-4 w-4 h-4 text-gray-500" />
                            <input 
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-white placeholder:text-gray-700 text-sm" 
                              placeholder="Ketik tag, tekan Enter"
                              value={tagInput} 
                              onChange={e => setTagInput(e.target.value)} 
                              onKeyDown={e => e.key === "Enter" && addTag(e)}
                            />
                          </div>
                          {formData.tags && formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300 flex items-center gap-1">
                                  {tag} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => removeTag(idx)} />
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Deskripsi Singkat <InfoTooltip text="1-2 kalimat pemikat yang muncul di kartu katalog. Buat semenarik mungkin." />
                          </label>
                          <textarea 
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-gray-300 min-h-[100px] resize-none placeholder:text-gray-700 leading-relaxed text-sm" 
                            placeholder="Tuliskan 1-2 kalimat menarik untuk ditampilkan di dalam kartu katalog..."
                            value={formData.shortDesc || ""} 
                            onChange={e => setFormData({...formData, shortDesc: e.target.value})} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: PRICING & PROMO --- */}
                  {activeTab === "pricing" && (
                    <div className="space-y-8">
                      
                      {/* TOGGLE PACKAGE MODE */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                         <div>
                           <h4 className="font-bold text-white flex items-center gap-2">Mode Paket Berjenjang (Tiers) <InfoTooltip text="Aktifkan ini jika jasa Anda punya 3 paket harga (Basic, Standard, Premium) ala Fastwork/Fiverr." /></h4>
                           <p className="text-xs text-gray-400">Gunakan ini jika Anda menjual paket Basic, Standard, Premium.</p>
                         </div>
                         <div 
                          className={cn(
                            "relative flex items-center w-12 h-6 rounded-full p-1 cursor-pointer transition-colors border shrink-0",
                            usePackages ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10"
                          )}
                          onClick={() => setUsePackages(!usePackages)}
                        >
                          <div className={cn(
                            "absolute w-4 h-4 rounded-full transition-transform duration-300 shadow-md",
                            usePackages ? "translate-x-6 bg-purple-400" : "translate-x-0 bg-gray-500"
                          )} />
                        </div>
                      </div>

                      {/* --- MULTI-TIER FORM --- */}
                      {usePackages ? (
                        <div className="space-y-6">
                           <p className="text-sm text-gray-400 border-l-2 border-purple-500 pl-3">Mode Multi-Tier Aktif. Harga "Mulai Dari" akan diambil otomatis dari Paket Basic.</p>
                           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                             {formData.packages?.map((pkg, idx) => (
                               <div key={idx} className="bg-black/30 border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col gap-4">
                                  <div className="border-b border-white/10 pb-3">
                                    <span className={cn(
                                      "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md",
                                      idx === 0 ? "bg-white/10 text-white" : idx === 1 ? "bg-purple-500/20 text-purple-300" : "bg-yellow-500/20 text-yellow-300"
                                    )}>Paket {pkg.name}</span>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Harga (IDR)</label>
                                     <input 
                                       className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-white font-mono text-lg" 
                                       value={pkg.price} onChange={e => handlePackageChange(idx, 'price', e.target.value)}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi Paket</label>
                                     <textarea 
                                       className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 text-gray-300 text-xs min-h-[80px]" 
                                       value={pkg.description} onChange={e => handlePackageChange(idx, 'description', e.target.value)}
                                     />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Durasi</label>
                                      <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs" placeholder="Misal: 5 Hari" value={pkg.duration} onChange={e => handlePackageChange(idx, 'duration', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Revisi</label>
                                      <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs" placeholder="Misal: 2 Kali" value={pkg.revisions} onChange={e => handlePackageChange(idx, 'revisions', e.target.value)} />
                                    </div>
                                  </div>
                                  <div className="space-y-2 mt-2 border-t border-white/5 pt-3">
                                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fitur Spesifik Paket</label>
                                      <div className="flex gap-2">
                                        <input 
                                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" 
                                          placeholder="Tambah fitur..."
                                          value={pkgFeatureInputs[idx] || ""}
                                          onChange={e => setPkgFeatureInputs(prev => ({...prev, [idx]: e.target.value}))}
                                          onKeyDown={e => e.key === "Enter" && addPkgFeature(idx)}
                                        />
                                        <button onClick={() => addPkgFeature(idx)} className="px-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"><Plus size={14}/></button>
                                      </div>
                                      <ul className="space-y-1 mt-2">
                                        {pkg.features?.map((f, fIdx) => (
                                          <li key={fIdx} className="text-[10px] text-gray-300 bg-white/5 px-2 py-1 rounded flex justify-between items-center">
                                            <span>• {f}</span>
                                            <X size={10} className="cursor-pointer hover:text-red-400" onClick={() => removePkgFeature(idx, fIdx)} />
                                          </li>
                                        ))}
                                      </ul>
                                  </div>
                               </div>
                             ))}
                           </div>
                        </div>
                      ) : (
                      /* --- SINGLE PRICE FORM --- */
                        <div className="space-y-6">
                          <div className="p-6 md:p-8 bg-purple-500/5 border border-purple-500/20 rounded-2xl relative overflow-hidden">
                            <div className="space-y-3 relative z-10">
                              <label className="flex items-center text-xs font-bold uppercase tracking-wider text-purple-300 ml-1">
                                Harga Jual / Harga Akhir (IDR) * <InfoTooltip text="Harga tunggal jasa Anda. Jika pakai Flash Sale, diskon akan dihitung otomatis." />
                              </label>
                              <input 
                                required={!usePackages}
                                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-purple-500/30 focus:border-purple-400 outline-none transition-colors text-white font-mono font-bold text-2xl md:text-3xl placeholder:text-gray-700" 
                                placeholder="Rp 0"
                                value={formData.price || ""} 
                                onChange={handlePriceChange} 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                              Estimasi Pengerjaan * <InfoTooltip text="Lama pengerjaan, misalnya: '7-14 Hari Kerja'" />
                            </label>
                            <input 
                               className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white text-sm" 
                               placeholder="Contoh: 2-3 Hari Kerja"
                               value={formData.duration || ""} 
                               onChange={e => setFormData({...formData, duration: e.target.value})} 
                             />
                          </div>
                        </div>
                      )}

                      {/* Other Promo metrics (Flash sale / Discount) could go here but omitted to keep it clean, can re-add if needed. Let's keep Flash sale basic switch */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        {/* Kiri: Setelan Diskon & Harga Coret */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold mb-2 flex items-center gap-2">Kalkulator Promo Pintar</h4>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Harga Asli (Otomatis)</label>
                            <input 
                              readOnly
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm cursor-not-allowed" 
                              placeholder="Dihitung otomatis saat diskon diterapkan"
                              value={formData.originalPrice || ""} 
                            />
                            <p className="text-[10px] text-gray-500 ml-1">Nilai ini otomatis diambil dari harga sebelum Anda klik tombol Hitung Diskon.</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tipe Diskon</label>
                              <select 
                                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white text-sm appearance-none"
                                value={discountType}
                                onChange={e => setDiscountType(e.target.value as any)}
                              >
                                <option value="percent" className="bg-[#111]">Persentase (%)</option>
                                <option value="nominal" className="bg-[#111]">Nominal (Rp)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Nilai Diskon</label>
                              <input 
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-white text-sm" 
                                placeholder={discountType === "percent" ? "Misal: 50" : "Misal: 500.000"}
                                value={discountInput} 
                                onChange={e => setDiscountInput(discountType === "percent" ? e.target.value.replace(/[^0-9]/g, "") : formatRupiah(e.target.value))} 
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button 
                              type="button"
                              onClick={handleCalculatePromo}
                              className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/20"
                            >
                              Potong Harga Saat Ini
                            </button>
                            {(formData.originalPrice || formData.discountValue) && (
                              <button 
                                type="button"
                                onClick={handleClearPromo}
                                className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-colors border border-red-500/20"
                              >
                                Hapus Promo
                              </button>
                            )}
                          </div>

                          <div className="pt-2 border-t border-white/10 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-green-500 ml-1">Label Diskon Aktif</label>
                            <input 
                              className="w-full px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-sm" 
                              placeholder="Label diskon akan muncul di sini"
                              readOnly
                              value={formData.discountValue || ""} 
                            />
                          </div>
                        </div>

                        {/* Kanan: Setelan Flash Sale */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold mb-2 flex items-center gap-2">Pengaturan Flash Sale</h4>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Status Flash Sale</label>
                            <div 
                              className={cn(
                                "relative flex items-center w-14 h-8 rounded-full p-1 cursor-pointer transition-colors border shrink-0",
                                formData.isFlashSale ? "bg-red-500/20 border-red-500/50" : "bg-white/5 border-white/10"
                              )}
                              onClick={() => setFormData({...formData, isFlashSale: !formData.isFlashSale})}
                            >
                              <div className={cn(
                                "absolute w-6 h-6 rounded-full transition-transform duration-300 shadow-md",
                                formData.isFlashSale ? "translate-x-6 bg-red-500" : "translate-x-0 bg-gray-500"
                              )} />
                            </div>
                          </div>
                          
                          {formData.isFlashSale && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Harga Spesial Flash Sale</label>
                                <input 
                                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-colors text-white text-sm" 
                                  placeholder="Misal: Rp 50.000"
                                  value={formData.flashSalePrice || ""} 
                                  onChange={e => setFormData({...formData, flashSalePrice: formatRupiah(e.target.value)})} 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tenggat Waktu Flash Sale</label>
                                <input 
                                  type="datetime-local"
                                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-colors text-white text-sm" 
                                  value={formData.flashSaleEndDate || ""} 
                                  onChange={e => setFormData({...formData, flashSaleEndDate: e.target.value})} 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* --- TAB: CONTENT & FEATURES --- */}
                  {activeTab === "content" && (
                    <div className="space-y-8">
                      
                      <div className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                          <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                            <Star size={16} className="text-yellow-400"/> Highlight sebagai Pilihan Utama
                          </h4>
                          <p className="text-xs text-gray-500">Tandai layanan ini dengan badge "Rekomendasi".</p>
                        </div>
                        <div 
                          className={cn(
                            "relative flex items-center w-14 h-8 rounded-full p-1 cursor-pointer transition-colors border shrink-0",
                            formData.recommended ? "bg-yellow-500/20 border-yellow-500/50" : "bg-white/5 border-white/10"
                          )}
                          onClick={() => setFormData({...formData, recommended: !formData.recommended})}
                        >
                          <div className={cn(
                            "absolute w-6 h-6 rounded-full transition-transform duration-300 shadow-md",
                            formData.recommended ? "translate-x-6 bg-yellow-400" : "translate-x-0 bg-gray-500"
                          )} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Deskripsi Lengkap (Rich Text) <InfoTooltip text="Deskripsi bebas yang tampil di detail jasa. Bisa gunakan format HTML/Rich Text." />
                        </label>
                        <div className="min-h-[300px]">
                          <TiptapEditor 
                            content={formData.description || ""} 
                            onChange={(html) => setFormData({...formData, description: html})} 
                          />
                        </div>
                      </div>

                      {/* Only show General features if NOT using Packages, to avoid confusion */}
                      {!usePackages && (
                        <div className="space-y-4 pt-6 border-t border-white/10">
                          <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400"/> Daftar Fitur General <InfoTooltip text="Poin-poin fitur yang dijanjikan. Tampil di sebelah kiri pada halaman detail jasa." />
                          </label>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-colors text-white text-sm" 
                              placeholder="Contoh: Gratis domain & hosting 1 tahun..."
                              value={featureInput} 
                              onChange={e => setFeatureInput(e.target.value)} 
                              onKeyDown={e => e.key === "Enter" && addFeature(e)}
                            />
                            <Button type="button" onClick={addFeature} className="h-11 sm:h-auto rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 shrink-0">
                              Tambah <Plus size={16} className="ml-1.5"/>
                            </Button>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            {formData.features?.map((feat, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-black/20 px-4 py-3 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                                <span className="text-sm text-gray-300 flex items-center gap-3">
                                  <CheckCircle2 size={16} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" /> {feat}
                                </span>
                                <button type="button" onClick={() => removeFeature(idx)} className="text-red-500/50 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ======================================================== */}
            {/* KOLOM KANAN: LIVE PREVIEW (Col 4) */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 relative hidden sm:block">
              <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MonitorPlay size={16} className="text-purple-400"/> Live Card Preview
                    </h3>
                  </div>

                  {/* UI Render Card Preview (Mirip di Halaman Katalog) */}
                  <div className="pointer-events-none select-none scale-[0.95] origin-top">
                    <div className={cn(
                      "group relative bg-[#0a0a0a] rounded-3xl border overflow-hidden flex flex-col transition-all duration-500 shadow-xl",
                      formData.isFlashSale ? "border-red-500/50 shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]" : 
                      formData.recommended ? "border-yellow-500/50 shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)]" : 
                      "border-white/10"
                    )}>
                      
                      {/* Background Soft Glow */}
                      {(formData.isFlashSale || formData.recommended) && (
                        <div className={cn(
                          "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full",
                          formData.isFlashSale ? "bg-red-500" : "bg-yellow-500"
                        )} />
                      )}

                      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d1117] border-b border-white/5 shrink-0">
                        {formData.thumbnail ? (
                          <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] flex items-center justify-center">
                            <ImageIcon size={48} className="text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-80" />
                        
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                          <div className="flex flex-col gap-2">
                            {formData.recommended && !formData.isFlashSale && (
                              <span className="bg-yellow-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider">
                                <Star size={10} className="fill-white" /> Rekomendasi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow relative z-10">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                            {formData.category || "Kategori"}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-lg text-white mb-2 leading-snug">
                          {formData.title || "Judul Paket Layanan"}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-6 leading-relaxed font-light">
                          {formData.shortDesc || "Deskripsi singkat mengenai layanan yang Anda tawarkan akan muncul di sini."}
                        </p>

                        <div className="mt-auto pt-4 border-t border-white/10 flex items-end justify-between">
                          <div className="flex flex-col">
                            {usePackages ? (
                              <>
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Mulai Dari</span>
                                <span className="text-xl font-bold font-mono tracking-tight text-white">{formData.price || "Rp 0"}</span>
                              </>
                            ) : (
                              <span className="text-xl font-bold font-mono tracking-tight text-white">{formData.price || "Rp 0"}</span>
                            )}
                          </div>
                        </div>
                      </div>
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
      <span className={cn(active ? "text-purple-400" : "opacity-70")}>{icon}</span>
      {label}
    </button>
  );
}