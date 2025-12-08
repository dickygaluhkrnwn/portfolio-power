"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { TechBadge } from "@/components/ui/tech-badge";
import { Code2, Database, Globe, Layout, Server, Cpu, Terminal } from "lucide-react";

// Data Tech Stack (Bisa ditambah/dikurangi sesuai keahlianmu)
const techStack = [
  { name: "Next.js", icon: <Globe size={16} />, color: "#000000" },
  { name: "React", icon: <Code2 size={16} />, color: "#61DAFB" },
  { name: "TypeScript", icon: <Terminal size={16} />, color: "#3178C6" },
  { name: "Tailwind CSS", icon: <Layout size={16} />, color: "#38B2AC" },
  { name: "Node.js", icon: <Server size={16} />, color: "#339933" },
  { name: "PostgreSQL", icon: <Database size={16} />, color: "#336791" },
  { name: "Framer Motion", icon: <Cpu size={16} />, color: "#E902B5" },
];

const experiences = [
  {
    year: "2023 - Present",
    role: "Full Stack Developer",
    company: "Freelance / Self-Employed",
    desc: "Membangun solusi web end-to-end untuk klien internasional. Fokus pada performa tinggi dan skalabilitas."
  },
  {
    year: "2021 - 2023",
    role: "Frontend Developer",
    company: "Tech Startup Indonesia",
    desc: "Mengembangkan antarmuka pengguna yang kompleks menggunakan React dan Redux. Meningkatkan kecepatan load website sebesar 40%."
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-32 pb-20 relative z-10">
        
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            More Than Just <br /> <span className="text-gradient-primary">Code.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Perjalanan saya bukan hanya tentang mempelajari bahasa pemrograman baru, tapi tentang memecahkan masalah nyata. 
            Dari baris kode pertama hingga arsitektur sistem yang kompleks, saya selalu mencari cara untuk membuat teknologi bekerja lebih keras untuk manusia.
          </p>
        </motion.div>

        {/* --- TECH STACK GRID --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
            <Cpu className="text-primary" /> Technical Arsenal
          </h2>
          
          <div className="flex flex-wrap gap-4">
            {techStack.map((tech, idx) => (
              <TechBadge 
                key={idx} 
                name={tech.name} 
                icon={tech.icon} 
                color={tech.color} 
              />
            ))}
          </div>
        </motion.div>

        {/* --- EXPERIENCE TIMELINE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
            <Terminal className="text-accent" /> Journey
          </h2>

          <div className="space-y-8 border-l border-white/10 ml-3 pl-8 relative">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                
                <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="text-primary font-medium">{exp.company}</span>
                  <span>•</span>
                  <span>{exp.year}</span>
                </div>
                <p className="text-muted-foreground/80 max-w-2xl">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}