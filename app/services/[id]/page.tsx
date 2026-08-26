"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getServiceById, getAllServices } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  Clock, Star, Users, CheckCircle, 
  MessageSquare, ShoppingCart, Share2, Loader2, ShieldCheck, Zap, Timer, Link as LinkIcon, CheckCircle2, Sparkles, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [service, setService] = useState<ServicePackage | null>(null);
  const [recommendations, setRecommendations] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [activePackageIdx, setActivePackageIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (id) {
        try {
          const [data, allData] = await Promise.all([
            getServiceById(id),
            getAllServices()
          ]);
          setService(data);
          
          const liveData = allData.filter(s => !s.isDraft);
          let recs = liveData.filter(s => s.id !== id && s.recommended);
          if (recs.length < 3) {
             const others = liveData.filter(s => s.id !== id && !s.recommended);
             recs = [...recs, ...others];
          }
          setRecommendations(recs.slice(0, 3));
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 font-heading text-white">Layanan Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Layanan yang Anda cari mungkin sudah tidak tersedia atau URL salah.</p>
        <Button onClick={() => router.push("/services")} className="rounded-full">Kembali ke Katalog</Button>
      </div>
    );
  }

  // Handle WhatsApp Link
  const activePackage = service.packages && service.packages.length > 0 ? service.packages[activePackageIdx] : null;
  const isFlashSaleActive = Boolean(service.isFlashSale && service.flashSalePrice);
  
  const currentPrice = isFlashSaleActive 
    ? service.flashSalePrice 
    : (activePackage ? activePackage.price : service.price);
    
  const currentDuration = activePackage ? activePackage.duration : service.duration;
  const featuresList = activePackage ? activePackage.features : service.features;

  const handleOrder = () => {
    const phone = "6285904320201"; 
    const pkgName = activePackage ? ` (Paket ${activePackage.name})` : "";
    const message = `Halo Iky, saya tertarik untuk order layanan: ${service.title}${pkgName} seharga ${currentPrice}. Boleh minta informasi lebih lanjut?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Logic Diskon
  const displayOriginalPrice = isFlashSaleActive 
    ? (activePackage ? activePackage.price : (service.originalPrice || service.price)) 
    : service.originalPrice;
  const hasDiscount = Boolean(displayOriginalPrice && displayOriginalPrice !== "");

  return (
    // INFO: overflow-hidden dihapus agar sticky sidebar bekerja. Diganti dengan overflow-x-hidden jika perlu, tapi overflow-clip di background lebih aman.
    <main className="min-h-screen bg-background text-foreground pb-20 relative selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[10%] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container max-w-7xl mx-auto pt-28 md:pt-36 px-4 sm:px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: TITLE, IMAGE & DESCRIPTION (Col 8) */}
          {/* ======================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* 1. Header (Title & Meta) */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs font-mono uppercase tracking-widest border border-white/10">
                  {service.category}
                </span>
                {service.recommended && (
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/30 flex items-center gap-1.5">
                    <Star size={12} className="fill-primary" /> Pilihan
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight mb-4">
                {service.title}
              </h1>
              <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-3xl">
                {service.shortDesc}
              </p>
            </div>

            {/* 2. Product Image Thumbnail */}
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0d1117] aspect-[16/9] md:aspect-[21/9] relative shadow-2xl group">
              {service.thumbnail ? (
                <img 
                  src={service.thumbnail} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/5">
                  <span className="font-mono text-xl">NO PREVIEW</span>
                </div>
              )}
              {/* Soft Inner Shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
            </div>

            {/* 3. Flash Sale Banner (Jika Aktif) */}
            {service.isFlashSale && (
              <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-red-900/40 to-red-500/5 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg shadow-red-500/5">
                <div className="p-3 bg-red-500 rounded-xl text-white animate-pulse shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-red-100 text-lg md:text-xl font-heading">Sedang Flash Sale!</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-red-300 mt-2">
                    <span className="flex items-center gap-1.5"><Timer size={16} /> Berakhir dalam:</span>
                    {(service as any).flashSaleEndDate && (
                      <DetailCountdown targetDateStr={(service as any).flashSaleEndDate} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Description Section */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold font-heading mb-6 border-b border-white/10 pb-4 text-white">
                Detail Layanan
              </h2>
              
              {/* Render HTML Description */}
              <div 
                className="prose prose-invert prose-gray max-w-none text-gray-300 leading-relaxed
                prose-headings:text-white prose-headings:font-heading prose-a:text-primary 
                prose-strong:text-white prose-ul:list-disc prose-ul:ml-4 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: service.description || service.shortDesc || "Detail tidak tersedia." }}
              />

              {/* Features List */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2 text-white font-heading">
                  <ShieldCheck className="text-green-400" size={24} /> Yang Akan Anda Dapatkan {activePackage && <span className="text-primary text-sm bg-primary/10 px-2 py-1 rounded-md ml-2 border border-primary/20">Paket {activePackage.name}</span>}:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300 leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: STICKY CHECKOUT CARD (Col 4) */}
          {/* ======================================================== */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4 lg:sticky lg:top-32 h-fit flex flex-col gap-6 pb-12"
          >
            {/* Checkout / Pricing Card */}
            <div className={cn(
              "bg-[#0a0a0a] border rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden relative",
              service.isFlashSale ? "border-red-500/30" : "border-white/10"
            )}>
              {/* Background Glow inside card */}
              {service.isFlashSale && (
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 blur-[50px] rounded-full pointer-events-none" />
              )}
              {!service.isFlashSale && (
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
              )}

              <div className="relative z-10">
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                  {(service.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">
                      <Star size={14} fill="currentColor" /> 
                      <span className="font-bold text-yellow-400">{service.rating}</span>
                    </div>
                  )}
                  {(service.sales ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest">
                      <Users size={14} className="text-gray-500" />
                      <span>{service.sales}+ Terjual</span>
                    </div>
                  )}
                </div>

                {/* --- PACKAGE SELECTOR (If Packages Exist) --- */}
                {service.packages && service.packages.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                      <Sparkles size={14} className="text-primary" /> Pilih Paket Layanan
                    </h3>
                    <div className="flex flex-col gap-3">
                      {service.packages.map((pkg, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setActivePackageIdx(idx)}
                          className={cn(
                            "cursor-pointer p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                            activePackageIdx === idx 
                              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                              : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className={cn(
                              "font-bold font-heading uppercase tracking-wider text-sm",
                              activePackageIdx === idx ? "text-primary" : "text-white"
                            )}>{pkg.name}</span>
                            <span className={cn(
                              "font-mono text-sm font-bold tracking-tight",
                              activePackageIdx === idx ? "text-white" : "text-gray-400"
                            )}>{pkg.price}</span>
                          </div>
                          <p className="text-xs text-gray-400 relative z-10 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Display */}
                <div className="mb-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                  {hasDiscount && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500 line-through decoration-red-500/50">
                        {displayOriginalPrice}
                      </span>
                      <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded font-bold border border-red-500/20 uppercase tracking-widest">
                        {isFlashSaleActive ? "FLASH SALE" : service.discountValue}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {service.packages && service.packages.length > 0 && (
                       <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Total Harga Paket {activePackage?.name}:</span>
                    )}
                    <div className={cn("text-3xl md:text-4xl lg:text-5xl font-black font-mono tracking-tighter", hasDiscount ? "text-red-400" : "text-white")}>
                      {currentPrice}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 font-medium bg-black/20 p-3 rounded-xl border border-white/5">
                    <Clock size={16} className="text-primary" /> Estimasi pengerjaan: <span className="text-white font-bold">{currentDuration}</span>
                  </div>
                  {activePackage && activePackage.revisions && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 font-medium bg-black/20 p-3 rounded-xl border border-white/5">
                      <CheckCircle2 size={16} className="text-primary" /> Jatah Revisi: <span className="text-white font-bold">{activePackage.revisions}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    className={cn(
                      "w-full h-14 text-base font-bold shadow-xl active:scale-95 transition-all rounded-xl",
                      service.isFlashSale 
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/25 border border-red-500" 
                        : "bg-white text-black hover:bg-gray-200 shadow-white/10"
                    )}
                    onClick={handleOrder}
                  >
                    <ShoppingCart className="mr-2 w-5 h-5" /> 
                    {service.isFlashSale ? "Ambil Promo Sekarang" : "Pesan Layanan"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-sm border-white/10 hover:bg-white/5 hover:text-white transition-colors active:scale-95 rounded-xl bg-transparent text-gray-300"
                    onClick={() => {
                        const phone = "6285904320201";
                        window.open(`https://wa.me/${phone}?text=Halo, mau konsultasi dulu tentang layanan ${service.title}`, "_blank");
                    }}
                  >
                    <MessageSquare className="mr-2 w-4 h-4" /> Chat & Konsultasi Gratis
                  </Button>
                </div>

                {/* Safe Guarantee */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} className="text-green-400" />
                    </div>
                    <span>Garansi <b>Revisi</b> & Support Teknis.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Users size={16} className="text-blue-400" />
                    </div>
                    <span>Ditangani langsung oleh <b>Developer</b>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Box (Matches Blog Detail Share Box) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-400">Bagikan:</span>
              <div className="flex items-center gap-2">
                <button onClick={handleShare} className="w-auto px-4 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all text-sm font-medium gap-2 text-gray-300 hover:text-white">
                  {isCopied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <LinkIcon size={14} />}
                  {isCopied ? <span className="text-emerald-400">Tersalin</span> : "Copy Link"}
                </button>
              </div>
            </div>

          </motion.div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM SECTION: RECOMMENDATIONS */}
        {/* ======================================================== */}
        
        {/* --- Rekomendasi Layanan Lainnya --- */}
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-20 pt-16 border-t border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
                <Sparkles className="text-primary" size={28} /> Layanan Serupa
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(item => (
                <CompactServiceCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => router.push(`/services/${item.id}`)} 
                />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}

// --- SUB-COMPONENTS FOR BOTTOM SECTIONS ---

function DetailCountdown({ targetDateStr }: { targetDateStr: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!targetDateStr) return;
    const targetDate = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days} Hari ${hours} Jam ${minutes} Menit`); 
      } else {
        const h = hours < 10 ? `0${hours}` : hours;
        const m = minutes < 10 ? `0${minutes}` : minutes;
        const s = seconds < 10 ? `0${seconds}` : seconds;
        setTimeLeft(`${h}:${m}:${s}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!timeLeft || timeLeft === "EXPIRED") return <span className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Berakhir</span>;

  return (
    <span className="font-mono font-bold text-white bg-red-500 px-3 py-1 rounded-md tracking-wider shadow-lg">
      {timeLeft}
    </span>
  );
}

// Card Minimalis untuk Rekomendasi
function CompactServiceCard({ item, onClick }: { item: ServicePackage, onClick: () => void }) {
  const hasDiscount = Boolean(item.originalPrice && item.originalPrice !== "");

  return (
    <div 
      onClick={onClick} 
      className="group flex flex-col rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5"
    >
      <div className="aspect-video relative overflow-hidden bg-[#0d1117] border-b border-white/5">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full text-white/5"><Sparkles size={40} /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <Star size={12} className="fill-yellow-400" /> {item.rating || "New"}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="font-heading font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors text-base">
          {item.title}
        </h4>
        <div className="mt-auto pt-4 flex items-end justify-between border-t border-white/5">
          <div className="flex flex-col">
            {hasDiscount && <span className="text-xs text-gray-500 line-through mb-0.5">{item.originalPrice}</span>}
            <span className="text-lg font-bold font-mono text-white tracking-tight">{item.price}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-white/10 group-hover:border-primary">
            <ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}