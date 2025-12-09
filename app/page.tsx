"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Download, Layers, Code, Database, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getAllProjects } from "@/lib/projects-service";
import { Project } from "@/app/data/projects";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [projectCount, setProjectCount] = useState(0);

  // Ambil jumlah project untuk statistik
  useEffect(() => {
    async function loadStats() {
      const data = await getAllProjects();
      setProjectCount(data.length);
    }
    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width relative z-10 pt-24 pb-20 md:pt-32">
        
        {/* --- HERO SECTION (Split Layout) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 order-2 lg:order-1"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-primary-foreground/80 uppercase">
                Available for Hire
              </span>
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-xl md:text-2xl font-medium text-muted-foreground mb-2">
                Hi, I&apos;m <span className="text-foreground font-bold">Iky</span> 👋
              </h2>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Dicky Galuh <br />
                <span className="text-gradient-primary">Kurniawan.</span>
              </h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Seorang <b>Full Stack Developer</b> yang gemar mengubah ide kompleks menjadi aplikasi web yang cepat, responsif, dan mudah digunakan. 
              Fokus pada kualitas kode dan pengalaman pengguna.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="rounded-full text-base group" onClick={() => router.push("/projects")}>
                Explore My Work 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="rounded-full text-base" onClick={() => window.open("/resume.pdf", "_blank")}>
                Download CV <Download className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Social Links */}
            <div className="pt-6 flex items-center gap-6 text-muted-foreground">
              <SocialLink href="https://github.com/dickygaluhkrnwn" icon={<Github size={22} />} />
              <SocialLink href="https://www.linkedin.com/in/dickygaluhkrnwn/" icon={<Linkedin size={22} />} />
              <SocialLink href="mailto:dicky.galuh.kurniawan1@gmail.com" icon={<Mail size={22} />} />
              <div className="h-px w-12 bg-border"></div>
              <span className="text-sm font-mono">IDN</span>
            </div>
          </motion.div>

          {/* Right Column: Photo (Ratio 3:4) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
          >
            {/* Photo Container Frame */}
            <div className="relative w-72 md:w-80 lg:w-96 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white/5 bg-secondary/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Glass Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-30 z-10 mix-blend-overlay pointer-events-none" />
              
              {/* --- TEMPAT FOTO --- */}
              {/* Ganti URL di bawah ini dengan link Imgur foto profilmu */}
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: `url('https://i.imgur.com/VIGw7gw.png')` }} 
              />
              
              {/* Optional: Code Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="space-y-1 font-mono text-[10px] text-gray-400">
                  <p><span className="text-purple-400">const</span> developer = <span className="text-yellow-300">{"{"}</span></p>
                  <p className="pl-2">name: <span className="text-green-300">&quot;Iky&quot;</span>,</p>
                  <p className="pl-2">role: <span className="text-green-300">&quot;FullStack&quot;</span></p>
                  <p><span className="text-yellow-300">{"}"}</span>;</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements behind photo */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-primary/20 rounded-3xl -rotate-6" />
          </motion.div>
        </div>

        {/* --- STATS SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 bg-secondary/5 backdrop-blur-sm rounded-2xl mb-24 px-8"
        >
          <StatItem number="3+" label="Years Experience" />
          <StatItem number={`${projectCount}`} label="Projects Completed" />
          <StatItem number="10+" label="Happy Clients" />
          <StatItem number="24/7" label="Support" />
        </motion.div>

        {/* --- SERVICES / WHAT I DO --- */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">What I Can Do For You</h2>
            <p className="text-muted-foreground">Kombinasi teknis untuk solusi bisnis yang nyata.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard 
              icon={<Globe className="text-blue-400" size={32} />}
              title="Frontend Dev"
              desc="Membangun antarmuka yang indah, responsif, dan interaktif menggunakan React & Next.js."
            />
            <ServiceCard 
              icon={<Database className="text-green-400" size={32} />}
              title="Backend Dev"
              desc="Merancang API yang aman, database yang efisien, dan logika server yang tangguh."
            />
            <ServiceCard 
              icon={<Layers className="text-purple-400" size={32} />}
              title="Full Stack"
              desc="Mengintegrasikan keduanya menjadi aplikasi web utuh yang siap skala produksi."
            />
          </div>
        </div>

      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="p-2 rounded-full bg-secondary/50 hover:bg-white hover:text-black transition-all duration-300 border border-transparent hover:border-white/20"
    >
      {icon}
    </a>
  );
}

function StatItem({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1 font-heading">{number}</div>
      <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-secondary/10 border border-white/5 hover:border-primary/30 hover:bg-secondary/20 transition-all group"
    >
      <div className="mb-4 bg-black/20 w-fit p-3 rounded-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}