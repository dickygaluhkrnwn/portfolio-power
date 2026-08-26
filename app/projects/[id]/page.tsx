"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { TechBadge } from "@/components/ui/tech-badge";
import { ProjectCard } from "@/components/ui/project-card";
import { 
  Github, ExternalLink, Calendar, Users, Layers, 
  MonitorPlay, Loader2, Sparkles, ArrowLeft, Target, Lightbulb, Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/app/data/projects";
import { getProjectById, getAllProjects } from "@/lib/projects-service";

// Simple Animated Counter Component for Marketing Metrics
const AnimatedCounter = ({ value, label }: { value: string, label: string }) => {
  // Extract number and suffix (e.g. "150%" -> 150, "%")
  const numMatch = value.match(/[\d\.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;
  const suffix = value.replace(/[\d\.]+/, "");

  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = num;
    if (start === end) return;
    
    let totalDuration = 2000;
    let incrementTime = (totalDuration / end) * 2;
    if (incrementTime > 50) incrementTime = 50; // Max tick speed
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [num]);

  return (
    <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-white/10 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-current/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 relative z-10">
        {num > 0 ? count : ""}{suffix || value}
      </span>
      <span className="text-xs md:text-sm font-bold uppercase tracking-widest relative z-10 text-gray-400 group-hover:text-current transition-colors">
        {label}
      </span>
    </div>
  );
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [recommendations, setRecommendations] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (projectId) {
        try {
          const [data, allData] = await Promise.all([
            getProjectById(projectId),
            getAllProjects()
          ]);
          setProject(data);

          const recs = allData.filter(p => String(p.id) !== projectId)
                             .sort((a, b) => Number(b.year || 0) - Number(a.year || 0))
                             .slice(0, 3);
          setRecommendations(recs);
        } catch (error) {
          console.error("Error loading project:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProject();
  }, [projectId]);

  const handleProjectClick = (e: React.MouseEvent, id: number | string) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(`/projects/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-4 text-center">
        <h1 className="text-5xl font-heading font-black mb-4">404</h1>
        <p className="text-gray-400 mb-8 max-w-md">The masterpiece you are looking for does not exist.</p>
        <button onClick={() => router.push("/projects")} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all">Back to Gallery</button>
      </div>
    );
  }

  // --- Dynamic Color Theme ---
  const type = project.projectType?.toLowerCase() || "software";
  let themeColor = "rgba(255,255,255,0.1)";
  let accentClass = "text-gray-400";
  
  if (type === "software") { themeColor = "rgba(99,102,241,0.5)"; accentClass = "text-indigo-400"; }
  else if (type === "marketing") { themeColor = "rgba(16,185,129,0.5)"; accentClass = "text-emerald-400"; }
  else if (type === "design") { themeColor = "rgba(236,72,153,0.5)"; accentClass = "text-pink-400"; }

  return (
    <main 
      className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden selection:bg-white/30 selection:text-white pb-32"
      style={{ color: accentClass === 'text-gray-400' ? 'inherit' : undefined }} // Pass base color implicitly via parent if needed, but we'll use classes
    >
      <Navbar />

      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip transition-colors duration-1000">
        <div 
          className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[150px] mix-blend-screen opacity-40"
          style={{ backgroundColor: themeColor.replace('0.5', '0.2') }} 
        />
        <div 
          className="absolute bottom-[20%] right-[5%] w-[800px] h-[800px] rounded-full blur-[200px] mix-blend-screen opacity-20"
          style={{ backgroundColor: themeColor.replace('0.5', '0.1') }} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="container max-w-7xl mx-auto pt-32 md:pt-48 px-4 sm:px-6 relative z-10">

        {/* --- 1. HERO SECTION (Immersive & Editorial) --- */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-20 lg:mb-32">
          
          {/* Title & Desc */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-3/5"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor.replace('rgba', 'rgb').replace(',0.5)', ')') }} />
              <span className={cn("text-xs font-mono tracking-widest uppercase font-bold", accentClass)}>
                {project.projectType || 'Software'} Project
              </span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter uppercase text-white mix-blend-difference">
              {project.title}
            </h1>
            
            {project.subtitle && (
              <p className="text-xl md:text-3xl text-gray-300 font-light mb-8 italic">
                {project.subtitle}
              </p>
            )}
            
            <div 
              className="prose prose-invert prose-lg text-gray-400 font-light leading-relaxed mb-10 max-w-none"
              dangerouslySetInnerHTML={{ __html: project.desc }}
            />

            {/* Quick Actions (Moved up for immediate access, but Demo is also below) */}
            <div className="flex flex-wrap gap-4">
              {project.repoLink && project.repoLink !== "#" && (
                <button 
                  onClick={() => window.open(project.repoLink, "_blank")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold uppercase tracking-wider transition-all"
                >
                  <Github size={16} /> Source Code
                </button>
              )}
            </div>
          </motion.div>

          {/* Meta Details Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="md:w-2/5 flex flex-col gap-8"
          >
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-8">
              
              <div className="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Users size={12} /> Role
                  </h3>
                  <p className="text-white font-medium text-lg">{project.role || 'Full Stack Developer'}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 flex items-center justify-end gap-2">
                    <Calendar size={12} /> Year
                  </h3>
                  <p className="text-white font-medium text-lg">{project.year || new Date().getFullYear()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                  <Layers size={12} /> Core Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech, idx) => (
                    <TechBadge 
                      key={idx} 
                      name={tech.name} 
                      color={tech.color} 
                      icon={tech.icon ? <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" /> : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- 2. EDITORIAL CONTENT (Challenge & Solution) --- */}
        {(project.challenge || project.solution || project.features) && (
          <div className="mb-24 lg:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Challenge & Solution */}
              <div className="lg:col-span-7 flex flex-col gap-12">
                {project.challenge && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="relative pl-6 md:pl-10 border-l border-white/10"
                  >
                    <Target className={cn("absolute -left-3 top-0 w-6 h-6 bg-[#050505]", accentClass)} />
                    <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">The Challenge</h3>
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                      {project.challenge}
                    </p>
                  </motion.div>
                )}
                
                {project.solution && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative pl-6 md:pl-10 border-l"
                    style={{ borderLeftColor: themeColor.replace('rgba', 'rgb').replace(',0.5)', ')') }}
                  >
                    <Lightbulb className={cn("absolute -left-3 top-0 w-6 h-6 bg-[#050505]", accentClass)} />
                    <h3 className={cn("text-sm font-mono uppercase tracking-widest mb-4", accentClass)}>The Solution</h3>
                    <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
                      {project.solution}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <div className="lg:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10"
                  >
                    <h3 className="text-2xl font-bold mb-8 text-white uppercase tracking-tight">Key Features</h3>
                    <ul className="space-y-6">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-gray-400">
                          <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", accentClass)} style={{ backgroundColor: 'currentColor' }} />
                          <span className="text-base md:text-lg font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 3. DYNAMIC SHOWCASE (Moved to Bottom as Requested) --- */}
        
        {/* SOFTWARE: Glassmorphic Browser */}
        {(!project.projectType || project.projectType === "software") && project.demoLink && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 lg:mb-32"
          >
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Live Preview</h2>
               <p className="text-gray-400 font-light">Interact with the application directly below.</p>
            </div>
            
            <div 
              className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black"
              style={{ boxShadow: `0 30px 100px -20px ${themeColor}` }}
            >
              {/* Premium Glassmorphic Browser Bar */}
              <div className="h-12 md:h-14 bg-white/[0.05] backdrop-blur-xl border-b border-white/10 flex items-center px-4 gap-4 relative z-10">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                   <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                   <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
                </div>
                <div className="flex-1 flex justify-center mx-4">
                  <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg py-1.5 px-3 md:px-6 w-full max-w-md">
                     <span className="text-[10px] font-mono text-gray-500">https://</span>
                     <span className="text-xs md:text-sm text-gray-300 font-mono truncate">
                       {project.demoLink.replace(/^https?:\/\//, '')}
                     </span>
                  </div>
                </div>
                {/* Launch External Button */}
                <button 
                  onClick={() => window.open(project.demoLink, "_blank")}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/20 transition-colors text-white"
                >
                  <ExternalLink size={14} />
                </button>
              </div>

              {/* Iframe Container */}
              <div className="relative w-full h-[400px] md:h-[600px] lg:h-[800px] bg-[#050505]">
                 <div className={cn(
                   "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 flex flex-col items-center justify-center backdrop-blur-md",
                   iframeLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
                 )}
                 style={{ backgroundImage: `url('${project.image}')` }}
                 >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <MonitorPlay size={64} className={cn("mb-6 animate-pulse relative z-10", accentClass)} />
                    <p className="text-white font-mono text-sm uppercase tracking-widest relative z-10">Initializing Environment...</p>
                 </div>

                 {project.demoLink && (
                   <iframe
                     src={project.demoLink}
                     className="w-full h-full border-0 relative z-0"
                     onLoad={() => setIframeLoaded(true)}
                     title={`${project.title} Preview`}
                     sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                   />
                 )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MARKETING: Animated Metrics */}
        {project.projectType === "marketing" && project.metrics && project.metrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={cn("mb-24 lg:mb-32", accentClass)}
          >
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Campaign Results</h2>
               <p className="text-gray-400 font-light">Data-driven success metrics.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.metrics.map((metric, idx) => (
                <AnimatedCounter key={idx} value={metric.value} label={metric.label} />
              ))}
            </div>
          </motion.div>
        )}

        {/* DESIGN: Masonry Gallery */}
        {project.projectType === "design" && project.gallery && project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 lg:mb-32"
          >
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Visual Gallery</h2>
               <p className="text-gray-400 font-light">Explore the creative direction.</p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="break-inside-avoid relative rounded-3xl overflow-hidden border border-white/10 group bg-white/5 cursor-pointer">
                  <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <Sparkles className="text-white w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}


        {/* --- 4. RECOMMENDATIONS --- */}
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-16 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
                  Next Masterpieces
                </h2>
                <p className="text-gray-400 font-light">Continue exploring the portfolio.</p>
              </div>
              <button 
                onClick={() => router.push('/projects')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold uppercase tracking-wider transition-all"
              >
                View All Projects
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(item => (
                <div 
                  key={item.id} 
                  className="cursor-pointer group h-full" 
                  onClick={(e) => handleProjectClick(e, item.id)}
                >
                  <div className="transition-transform duration-500 group-hover:-translate-y-2 h-full">
                    <ProjectCard project={item as any} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}