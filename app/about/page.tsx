"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { TechBadge } from "@/components/ui/tech-badge";
import { Button } from "@/components/ui/button"; 
import { 
  Code2, Database, Globe, Layout, Server, Cpu, Terminal, 
  ArrowRight, Target, Lightbulb, Briefcase, Loader2, GraduationCap, Award 
} from "lucide-react";
import { getAllProjects } from "@/lib/projects-service"; 
import { Project } from "@/app/data/projects"; 
import { getAllJourneyItems, JourneyItem } from "@/lib/journey-service"; // Import service Journey
import { useRouter } from "next/navigation";

// Data Tech Stack Utama
const baseTechStack = [
  { name: "Next.js", icon: <Globe size={16} />, color: "#000000" },
  { name: "React", icon: <Code2 size={16} />, color: "#61DAFB" },
  { name: "TypeScript", icon: <Terminal size={16} />, color: "#3178C6" },
  { name: "Tailwind CSS", icon: <Layout size={16} />, color: "#38B2AC" },
  { name: "Node.js", icon: <Server size={16} />, color: "#339933" },
  { name: "PostgreSQL", icon: <Database size={16} />, color: "#336791" },
  { name: "Framer Motion", icon: <Cpu size={16} />, color: "#E902B5" },
];

export default function AboutPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]); // State untuk Journey
  const [loading, setLoading] = useState(true);

  // Fetch data project dan journey
  useEffect(() => {
    async function loadData() {
      const [projectsData, journeyData] = await Promise.all([
        getAllProjects(),
        getAllJourneyItems()
      ]);
      setProjects(projectsData);
      setJourneyItems(journeyData);
      setLoading(false);
    }
    loadData();
  }, []);

  const featuredProjects = projects.filter(p => p.featured);

  const getProjectCountByTech = (techName: string) => {
    return projects.filter(p => 
      p.techStack.some(t => t.name.toLowerCase().includes(techName.toLowerCase()))
    ).length;
  };

  // Helper untuk icon Journey
  const getJourneyIcon = (type: string) => {
    if (type === "work") return <Briefcase size={18} />;
    if (type === "education") return <GraduationCap size={18} />;
    return <Award size={18} />;
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

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
          className="max-w-3xl mb-20"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            More Than Just <br /> <span className="text-gradient-primary">Code.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Perjalanan saya bukan hanya tentang mempelajari bahasa pemrograman baru, tapi tentang 
            <span className="text-white font-medium"> memecahkan masalah nyata</span>. 
            Dari baris kode pertama hingga arsitektur sistem yang kompleks, saya selalu mencari cara untuk membuat teknologi bekerja lebih keras untuk manusia.
          </p>
        </motion.div>

        {/* --- PROVEN TRACK RECORD --- */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-3">
              <Briefcase className="text-accent" /> Proven Track Record
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Saya tidak sekadar "bisa" coding. Berikut adalah bukti bagaimana saya menggunakan teknologi untuk mengatasi tantangan bisnis yang nyata.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center h-40 bg-white/5 rounded-xl">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-secondary/10 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-primary tracking-widest uppercase">Case Study</span>
                        <h3 className="text-2xl font-heading font-bold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.role}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5">
                            {t.name}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        View Full Case Study <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                      <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-red-400">
                          <Target size={16} /> The Challenge
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {project.challenge || "Menghadapi kompleksitas kebutuhan bisnis dan skalabilitas sistem yang membutuhkan solusi presisi."}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-green-400">
                          <Lightbulb size={16} /> The Solution
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {project.solution || "Menerapkan arsitektur modern dan optimasi performa untuk memberikan hasil yang maksimal."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* --- TECH STACK GRID --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
            <Cpu className="text-primary" /> Technical Arsenal
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {baseTechStack.map((tech, idx) => {
              const count = getProjectCountByTech(tech.name);
              return (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20 border border-white/5 hover:bg-secondary/40 transition-all cursor-default group"
                >
                  <div className="p-2 rounded-lg bg-black/40 text-foreground/80 group-hover:text-primary group-hover:scale-110 transition-all">
                    {tech.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground/90">{tech.name}</div>
                    {!loading && count > 0 && (
                      <div className="text-[10px] text-muted-foreground">
                        Used in <span className="text-primary font-bold">{count}</span> projects
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* --- EXPERIENCE TIMELINE (Enhanced) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl font-bold mb-12 flex items-center gap-3">
            <Terminal className="text-accent" /> Professional Journey
          </h2>

          <div className="space-y-10 border-l-2 border-white/5 ml-4 sm:ml-6 pl-8 sm:pl-10 relative">
            {journeyItems.length === 0 && !loading && (
              <p className="text-muted-foreground italic">Belum ada data journey. Tambahkan di Admin Dashboard.</p>
            )}
            
            {journeyItems.map((item, idx) => (
              <div key={item.id} className="relative group">
                {/* Timeline Icon Marker */}
                <div className="absolute -left-[54px] sm:-left-[62px] top-0 flex items-center justify-center w-10 h-10 rounded-full bg-background border border-white/10 group-hover:border-primary group-hover:text-primary transition-all shadow-xl z-10">
                  {getJourneyIcon(item.type)}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.role}</h3>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground font-medium">{item.company}</span>
                </div>
                
                <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-xs text-primary font-mono mb-4">
                  {item.year}
                </div>

                <p className="text-muted-foreground/80 max-w-2xl leading-relaxed text-sm sm:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}