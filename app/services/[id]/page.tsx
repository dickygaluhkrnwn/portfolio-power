"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getServiceById } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  ArrowLeft, Clock, Star, Users, CheckCircle, 
  MessageSquare, ShoppingCart, Share2, Loader2, ShieldCheck, Zap, Timer 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [service, setService] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (id) {
        const data = await getServiceById(id);
        setService(data);
        setLoading(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">Layanan Tidak Ditemukan</h1>
        <Button onClick={() => router.push("/services")}>Kembali ke Katalog</Button>
      </div>
    );
  }

  // Handle WhatsApp Link
  const handleOrder = () => {
    const phone = "6285904320201"; 
    const message = `Halo Iky, saya mau order paket *${service.title}* seharga ${service.price}. Bagaimana prosedurnya?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Logic Diskon
  const hasDiscount = Boolean(service.originalPrice && service.originalPrice !== "");

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      <div className="container-width pt-28 md:pt-32 relative z-10">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-muted-foreground hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali ke Katalog
        </button>

        {/* Flash Sale Banner (Jika Aktif) */}
        {service.isFlashSale && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-900/40 to-red-600/10 border border-red-500/30 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-2 bg-red-500 rounded-lg text-white animate-pulse">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-red-100">Sedang Flash Sale!</h3>
              <div className="flex items-center gap-2 text-sm text-red-300">
                <Timer size={14} />
                <span>Harga spesial ini akan berakhir segera. Amankan slot Anda sekarang.</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN: Images & Details --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Product Image (Thumbnail) */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-secondary/10 aspect-video relative group">
              {service.thumbnail ? (
                <img 
                  src={service.thumbnail} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image Available
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {service.recommended && (
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg w-fit">
                    Recommended
                  </div>
                )}
                {hasDiscount && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg w-fit">
                    Hemat {service.discountValue}%
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Header (Mobile Only) */}
            <div className="block lg:hidden space-y-4">
              <h1 className="text-2xl font-heading font-bold">{service.title}</h1>
              {hasDiscount ? (
                <div>
                  <span className="text-muted-foreground line-through text-sm">{service.originalPrice}</span>
                  <div className="text-2xl font-bold text-red-500">{service.price}</div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-primary">{service.price}</div>
              )}
            </div>

            {/* Description Tab Style */}
            <div className="bg-secondary/5 border border-white/5 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold font-heading mb-6 border-b border-white/10 pb-4">
                Deskripsi Layanan
              </h2>
              
              {/* Render HTML Description */}
              <div 
                className="prose prose-invert prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.description || service.shortDesc }}
              />

              {/* Features List */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-green-400" size={20} /> Apa yang Anda Dapatkan:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                      <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Sticky Action Card --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Main Action Card */}
              <div className={cn(
                "bg-secondary/10 border rounded-2xl p-6 backdrop-blur-md shadow-2xl transition-all",
                service.isFlashSale ? "border-red-500/30 shadow-red-500/5" : "border-white/10"
              )}>
                
                {/* Title & Stats */}
                <div className="mb-6">
                  <h1 className="text-2xl font-heading font-bold mb-2 hidden lg:block">{service.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    {(service.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} fill="currentColor" /> 
                        <span className="font-bold text-foreground">{service.rating}</span>
                      </div>
                    )}
                    {(service.sales ?? 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{service.sales}+ Terjual</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Display */}
                  <div className="mb-1">
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                          {service.originalPrice}
                        </span>
                        <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-bold border border-red-500/20">
                          -{service.discountValue}%
                        </span>
                      </div>
                    )}
                    <div className={cn("text-3xl font-bold", hasDiscount ? "text-red-500" : "text-primary")}>
                      {service.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Clock size={12} /> Estimasi: {service.duration}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button 
                    className={cn(
                      "w-full h-12 text-base font-bold shadow-lg",
                      service.isFlashSale ? "bg-red-600 hover:bg-red-700 shadow-red-500/20 border-red-500" : "shadow-primary/20"
                    )}
                    onClick={handleOrder}
                  >
                    <ShoppingCart className="mr-2 w-5 h-5" /> 
                    {service.isFlashSale ? "Ambil Promo Sekarang" : "Order Sekarang"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                    onClick={() => {
                        const phone = "6285904320201";
                        window.open(`https://wa.me/${phone}?text=Halo, mau tanya detail tentang ${service.title}`, "_blank");
                    }}
                  >
                    <MessageSquare className="mr-2 w-5 h-5" /> Chat Konsultasi
                  </Button>
                </div>

                {/* Safe Guarantee */}
                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-green-400" />
                    <span>Garansi Revisi & Support Teknis</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Users size={14} className="text-blue-400" />
                    <span>Konsultasi Gratis sebelum Deal</span>
                  </div>
                </div>

              </div>

              {/* Share Button */}
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link produk disalin!");
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <Share2 size={16} /> Bagikan Paket Ini
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}