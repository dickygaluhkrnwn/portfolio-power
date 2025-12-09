"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getServiceById } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services";
import { 
  ArrowLeft, CheckCircle2, Clock, MessageSquare, 
  Loader2, Layers, ShieldCheck, Zap 
} from "lucide-react";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [service, setService] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await getServiceById(id);
        setService(data);
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleOrder = () => {
    if (!service) return;
    const phone = "6285904320201";
    const message = `Halo Iky, saya mau order paket *${service.title}* seharga ${service.price}. Bagaimana prosedur selanjutnya?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleNego = () => {
    if (!service) return;
    const phone = "6285904320201";
    const message = `Halo Iky, saya tertarik paket *${service.title}*, tapi ingin diskusi soal harga/fitur. Boleh?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  if (!service) return <div className="min-h-screen flex items-center justify-center bg-background">Service not found</div>;

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      {/* Header / Hero */}
      <div className="relative pt-32 pb-12 bg-secondary/5 border-b border-white/5">
        <div className="container-width relative z-10">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-white">
            <ArrowLeft size={16} className="mr-2" /> Kembali ke Katalog
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">{service.category}</span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2"><Clock size={16}/> {service.duration}</span>
                {service.recommended && <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/20">Recommended</span>}
              </div>
            </div>
            <div className="text-right md:text-right">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{service.price}</div>
              <div className="flex gap-3 justify-start md:justify-end">
                <Button onClick={handleOrder} size="lg" className="shadow-lg shadow-primary/20">Ambil Paket Ini</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-width py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Kolom Kiri: Detail Konten */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Deskripsi */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
              <Zap className="text-yellow-400" /> Tentang Paket Ini
            </h2>
            <div 
              className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: service.longDescription || `<p>${service.description}</p>` }}
            />
          </section>

          {/* Deliverables */}
          <section className="bg-secondary/5 border border-white/5 rounded-2xl p-8">
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-green-400" /> Apa yang Anda Dapatkan?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prioritize deliverables list if exists, else fallback to basic features */}
              {(service.deliverables || service.features).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-sm md:text-base text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow */}
          {service.workflow && service.workflow.length > 0 && (
            <section>
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <Layers className="text-blue-400" /> Alur Pengerjaan
              </h2>
              <div className="space-y-6 relative border-l border-white/10 ml-3 pl-8">
                {service.workflow.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-background border-2 border-muted-foreground" />
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Kolom Kanan: Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Tech Stack */}
            {service.techStack && service.techStack.length > 0 && (
              <div className="bg-secondary/5 border border-white/5 rounded-xl p-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-xs font-mono text-accent">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/5 border border-primary/20 rounded-xl p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Punya Pertanyaan Khusus?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jangan ragu untuk konsultasi atau nego harga jika budget Anda terbatas.
              </p>
              <Button variant="outline" className="w-full" onClick={handleNego}>
                <MessageSquare size={16} className="mr-2" /> Chat WhatsApp
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}