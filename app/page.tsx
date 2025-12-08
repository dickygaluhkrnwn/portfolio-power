"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Gradient Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />
        
        {/* Noise Texture (Optional: Bisa pakai image noise transparan jika ada) */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex flex-col justify-center min-h-screen container-width pt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-8"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium tracking-wide text-primary-foreground/80">
              AVAILABLE FOR NEW PROJECTS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            Building Digital <br />
            <span className="text-gradient-primary">Masterpieces.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Saya seorang Full-Stack Developer yang tidak hanya menulis kode, tapi menciptakan solusi. 
            Mengubah ide kompleks menjadi pengalaman digital yang cepat, skalabel, dan memukau.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="rounded-full text-base group">
              Lihat Karya Saya 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="rounded-full text-base">
              Hubungi Saya
            </Button>
          </div>

          {/* Social Proof / Links */}
          <div className="pt-8 flex items-center gap-6 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Mail size={24} />
            </a>
            <div className="h-px w-12 bg-border"></div>
            <span className="text-sm font-mono">BASED IN INDONESIA</span>
          </div>

        </motion.div>
      </section>
    </main>
  );
}