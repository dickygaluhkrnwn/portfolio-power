"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button"; 
import { 
  Code2, Database, Globe, Layout, Server, Cpu, Terminal, 
  ArrowRight, Target, Lightbulb, Briefcase, Loader2, GraduationCap, Award, CheckCircle2, Quote, Zap 
} from "lucide-react";
import { getAllProjects } from "@/lib/projects-service"; 
import { Project } from "@/app/data/projects"; 
import { getAllJourneyItems, JourneyItem } from "@/lib/journey-service"; 
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Data Tech Stack Utama
const baseTechStack = [
  { name: "Next.js", icon: <Globe size={20} />, color: "#ffffff" },
  { name: "React", icon: <Code2 size={20} />, color: "#61DAFB" },
  { name: "TypeScript", icon: <Terminal size={20} />, color: "#3178C6" },
  { name: "Tailwind CSS", icon: <Layout size={20} />, color: "#38B2AC" },
  { name: "Node.js", icon: <Server size={20} />, color: "#339933" },
  { name: "PostgreSQL", icon: <Database size={20} />, color: "#336791" },
  { name: "Framer Motion", icon: <Cpu size={20} />, color: "#E902B5" },
];

export default function AboutPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]); 
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
    if (type === "work") return <Briefcase size={16} />;
    if (type === "education") return <GraduationCap size={16} />;
    return <Award size={16} />;
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[5%] left-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container max-w-5xl mx-auto pt-24 pb-16 md:pt-32 px-4 sm:px-6 relative z-10">
        
        {/* --- 1. HERO SECTION (Split Layout for Quote) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-16 md:mb-20">
          
          {/* Kolom Kiri: Headline & Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center text-center md:text-left mx-auto md:mx-0 w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6 w-fit">
              <Terminal size={14} className="text-primary" />
              <span className="text-xs font-medium tracking-wide text-primary-foreground/80 uppercase">
                Profile // Who Am I
              </span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              Engineering <br className="hidden sm:block" />
              <span className="text-gradient-primary">Digital Excellence.</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
              Perjalanan saya bukan hanya tentang menguasai bahasa pemrograman baru, tapi tentang 
              <span className="text-foreground font-bold"> memecahkan masalah nyata</span>. 
              Dari baris kode pertama hingga arsitektur sistem yang kompleks, saya membangun teknologi yang bekerja lebih cerdas dan efisien.
            </p>
          </motion.div>

          {/* Kolom Kanan: Tesla Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 w-full flex"
          >
            <div className="relative w-full p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden group transition-all hover:border-white/20 flex flex-col justify-end min-h-[400px] lg:min-h-[500px]">
              
              {/* Tempat Foto / Placeholder (Nanti ganti URL-nya dengan hasil generate AI lu) */}
              <div 
                className="absolute inset-0 bg-cover bg-top opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" 
                style={{ backgroundImage: `url('/images/tesla-portrait.jpg')` }} 
              />
              
              {/* Gradient Overlay biar teks tetep kebaca meskipun backgroundnya terang */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

              {/* Background Glow Khas Tech */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-colors duration-700 pointer-events-none" />
              
              {/* Konten Card */}
              <div className="relative z-10 mt-auto">
                <Quote className="w-8 h-8 text-primary/40 mb-4 group-hover:text-primary transition-colors duration-500" />
                
                <p className="text-base md:text-lg font-heading text-gray-200 leading-relaxed mb-6 font-light">
                  "The present is theirs; the future, for which I really worked, is <span className="text-white font-bold italic">mine</span>."
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 backdrop-blur-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Nikola Tesla</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-wider uppercase mt-0.5">Inventor & Engineer</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* --- 2. STATS SECTION (Sync with Home) --- */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 md:py-10 border-y border-white/5 bg-secondary/5 backdrop-blur-sm rounded-2xl mb-20 md:mb-28 px-4 md:px-8"
          >
            <StatItem number={`${projects.length}+`} label="Proyek Selesai" />
            <StatItem number={`${journeyItems.length}`} label="Milestones" />
            <StatItem number="100%" label="Client Satisfaction" />
            <StatItem number="24/7" label="Commitment" />
          </motion.div>
        )}

        {/* --- 3. PROFESSIONAL JOURNEY --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-white">
            <Briefcase className="text-primary w-6 h-6 md:w-8 md:h-8" /> Professional Journey
          </h2>

          <div className="space-y-10 border-l-2 border-white/5 ml-4 sm:ml-6 pl-8 sm:pl-10 relative">
            {journeyItems.length === 0 && !loading && (
              <p className="text-muted-foreground italic text-sm">Belum ada data journey tercatat.</p>
            )}
            
            {journeyItems.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline Marker */}
                <div className="absolute -left-[42px] sm:-left-[62px] top-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background border border-white/10 group-hover:border-primary group-hover:text-primary transition-all shadow-xl z-10">
                  {getJourneyIcon(item.type)}
                </div>
                
                {/* Content */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.role}</h3>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground font-medium">{item.company}</span>
                </div>
                
                <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-xs text-primary font-mono mb-4">
                  {item.year}
                </div>

                <p className="text-muted-foreground/90 max-w-3xl leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- 4. TECHNICAL ARSENAL --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-white">
            <Cpu className="text-primary w-6 h-6 md:w-8 md:h-8" /> Technical Arsenal
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {baseTechStack.map((tech, idx) => {
              const count = getProjectCountByTech(tech.name);
              return (
                <div 
                  key={idx}
                  className="flex flex-col p-5 md:p-6 rounded-2xl bg-secondary/10 border border-white/5 hover:border-primary/30 hover:bg-secondary/20 transition-all cursor-default group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-black/40 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all shrink-0">
                      {tech.icon}
                    </div>
                    <div className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">{tech.name}</div>
                  </div>
                  {!loading && count > 0 && (
                    <div className="text-xs font-mono text-muted-foreground mt-auto">
                      Deployed on <span className="text-primary font-bold">{count}</span> projects
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* --- 5. PROVEN TRACK RECORD / CASE STUDIES --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-white">
            <Target className="text-primary w-6 h-6 md:w-8 md:h-8" /> Selected Case Studies
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-40 bg-secondary/10 border border-white/5 rounded-2xl">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : featuredProjects.length === 0 ? (
            <p className="text-muted-foreground font-mono text-sm">Belum ada case study yang di-highlight.</p>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-secondary/10 border border-white/5 hover:border-primary/30 rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    
                    {/* Left: Project Info */}
                    <div className="flex-1 space-y-5">
                      <div className="space-y-2">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-primary tracking-widest uppercase">
                          {project.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">{project.role}</p>
                      </div>
                      
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {/* Mengakali TS property description */}
                        {(project as any).description || project.desc || "Case study komprehensif."}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.techStack.slice(0, 4).map((t, i) => (
                          <span key={i} className="text-[10px] md:text-xs font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5 text-muted-foreground">
                            {t.name}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="text-[10px] md:text-xs font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5 text-muted-foreground">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Challenge/Solution Highlights & CTA */}
                    <div className="w-full lg:w-5/12 flex flex-col justify-between shrink-0 space-y-8 lg:border-l lg:border-white/5 lg:pl-10">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-bold text-red-400">
                            <Target size={16} /> Key Challenge
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {project.challenge || "Menghadapi kompleksitas kebutuhan bisnis dan skalabilitas sistem."}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-bold text-green-400">
                            <Lightbulb size={16} /> Key Solution
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {project.solution || "Menerapkan arsitektur modern dan optimasi performa."}
                          </p>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full bg-black/20 border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all h-12 rounded-xl"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        Explore Case Study <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function StatItem({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-4xl font-bold text-white mb-1 font-heading">{number}</div>
      <div className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}