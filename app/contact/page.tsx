"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getAllSocials, SocialLink } from "@/lib/socials-service";
import { 
  Github, Linkedin, Twitter, Facebook, Instagram, Youtube, 
  Music, PenTool, Globe, Mail, ArrowUpRight, Code, Layers 
} from "lucide-react";

// Helper untuk memilih icon berdasarkan nama platform
const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Github />;
  if (p.includes("linkedin")) return <Linkedin />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter />;
  if (p.includes("facebook")) return <Facebook />;
  if (p.includes("instagram")) return <Instagram />;
  if (p.includes("youtube")) return <Youtube />;
  if (p.includes("soundcloud")) return <Music />;
  if (p.includes("myspace")) return <Music />;
  if (p.includes("medium") || p.includes("tumblr")) return <PenTool />;
  if (p.includes("qwiklabs")) return <Code />;
  return <Globe />;
};

// Helper warna background card berdasarkan kategori
const getCategoryColor = (category: string) => {
  switch (category) {
    case "professional": return "from-blue-500/20 to-blue-600/5 border-blue-500/20";
    case "creative": return "from-purple-500/20 to-pink-600/5 border-purple-500/20";
    case "social": return "from-green-500/20 to-emerald-600/5 border-green-500/20";
    default: return "from-gray-500/20 to-gray-600/5 border-white/10";
  }
};

export default function ContactPage() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllSocials();
      setSocials(data);
      setLoading(false);
    }
    load();
  }, []);

  // Grouping data
  const categories = {
    professional: socials.filter(s => s.category === "professional"),
    creative: socials.filter(s => s.category === "creative"),
    social: socials.filter(s => s.category === "social" || s.category === "other"),
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container px-4 sm:px-6 pt-24 pb-20 relative z-10 md:pt-32">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Let's <span className="text-gradient-primary">Connect.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Temukan saya di berbagai platform digital. Baik untuk kolaborasi profesional, 
            diskusi teknologi, atau sekadar berteman di sosial media.
          </p>
          
          <div className="mt-8 flex gap-4">
             <Button 
               size="lg" 
               className="rounded-full h-12 px-8 text-base active:scale-95 transition-transform" 
               onClick={() => window.location.href = 'mailto:dicky.galuh.kurniawan1@gmail.com'}
             >
                <Mail className="mr-2 h-5 w-5" /> Kirim Email
             </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1,2,3].map(i => <div key={i} className="w-full h-24 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            
            {/* Professional Section */}
            {categories.professional.length > 0 && (
              <section>
                <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-white/80">
                  <Code size={20} className="text-blue-400"/> Professional & Code
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.professional.map((item) => (
                    <SocialCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* Creative Section */}
            {categories.creative.length > 0 && (
              <section>
                <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-white/80">
                  <Layers size={20} className="text-purple-400"/> Creative & Blog
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.creative.map((item) => (
                    <SocialCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* Social Section */}
            {categories.social.length > 0 && (
              <section>
                <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-white/80">
                  <Globe size={20} className="text-green-400"/> Social Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.social.map((item) => (
                    <SocialCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </main>
  );
}

function SocialCard({ item }: { item: SocialLink }) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center justify-between p-4 md:p-5 rounded-xl border backdrop-blur-sm
        bg-gradient-to-br transition-all duration-300 group min-h-[72px]
        ${getCategoryColor(item.category)}
        hover:border-white/20 hover:shadow-lg cursor-pointer
      `}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-black/20 text-white group-hover:bg-white/10 transition-colors">
          {getIcon(item.platform)}
        </div>
        <span className="font-medium text-lg text-white/90 group-hover:text-white">
          {item.platform}
        </span>
      </div>
      <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" />
    </motion.a>
  );
}