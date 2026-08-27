"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TechBadge } from "@/components/ui/tech-badge";
import { ProjectCard } from "@/components/ui/project-card";
import { 
  Github, ExternalLink, Calendar, Users, Layers, 
  MonitorPlay, Loader2, Sparkles, ArrowLeft, Target, Lightbulb, Play, Pointer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/app/data/projects";
import { getProjectById, getAllProjects } from "@/lib/projects-service";

// Simple Animated Counter Component for Marketing Metrics
const AnimatedCounter = ({ value, label }: { value: string, label: string }) => {
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
    if (incrementTime > 50) incrementTime = 50; 
    
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
    <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-current/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 relative z-10 drop-shadow-md">
        {num > 0 ? count : ""}{suffix || value}
      </span>
      <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest relative z-10 text-gray-400 group-hover:text-current transition-colors">
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile UX: Prevent iframe from stealing scroll
  const [iframeInteractive, setIframeInteractive] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

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
    
    return () => window.removeEventListener('resize', handleResize);
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
      className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden selection:bg-white/30 selection:text-white pb-24 md:pb-32"
      style={{ color: accentClass === 'text-gray-400' ? 'inherit' : undefined }}
    >
      
      {/* Mobile Sticky Back Button (App-like feel) */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-xl"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip transition-colors duration-1000">
        <div 
          className="absolute top-[5%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] mix-blend-screen opacity-40"
          style={{ backgroundColor: themeColor.replace('0.5', '0.2') }} 
        />
        <div 
          className="absolute bottom-[20%] right-[0%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full blur-[120px] md:blur-[200px] mix-blend-screen opacity-20"
          style={{ backgroundColor: themeColor.replace('0.5', '0.1') }} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="container max-w-7xl mx-auto pt-36 md:pt-48 px-4 sm:px-6 relative z-10">

        {/* --- 1. HERO SECTION (Immersive & Editorial) --- */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-20 mb-16 md:mb-20 lg:mb-32">
          
          {/* Title & Desc */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-3/5"
          >
            <div className="hidden md:inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor.replace('rgba', 'rgb').replace(',0.5)', ')') }} />
              <span className={cn("text-xs font-mono tracking-widest uppercase font-bold", accentClass)}>
                {project.projectType || 'Software'} Project
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 leading-[1] md:leading-[0.9] tracking-tighter uppercase text-white mix-blend-difference break-words">
              {project.title}
            </h1>
            
            {project.subtitle && (
              <p className="text-lg sm:text-xl md:text-3xl text-gray-300 font-light mb-6 md:mb-8 italic leading-snug">
                {project.subtitle}
              </p>
            )}
            
            <div 
              className="prose prose-invert prose-base md:prose-lg text-gray-400 font-light leading-relaxed mb-8 md:mb-10 max-w-none"
              dangerouslySetInnerHTML={{ __html: project.desc }}
            />

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              {project.repoLink && project.repoLink !== "#" && (
                <button 
                  onClick={() => window.open(project.repoLink, "_blank")}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 md:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full md:rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-lg"
                >
                  <Github size={16} /> Source Code
                </button>
              )}
            </div>
          </motion.div>

          {/* Meta Details Panel */}
          <motion.div 
            initial={{ opacity: 0, y: isMobile ? 30 : 0, x: isMobile ? 0 : 30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.8, delay: isMobile ? 0 : 0.2, ease: "easeOut" }}
            className="md:w-2/5 flex flex-col gap-8"
          >
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6 md:gap-8">
              
              <div className="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Users size={12} /> Role
                  </h3>
                  <p className="text-white font-medium text-base md:text-lg">{project.role || 'Full Stack Developer'}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 flex items-center justify-end gap-2">
                    <Calendar size={12} /> Year
                  </h3>
                  <p className="text-white font-medium text-base md:text-lg">{project.year || new Date().getFullYear()}</p>
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
                      icon={tech.icon ? <img src={tech.icon} alt={tech.name} className="w-3 h-3 md:w-4 md:h-4 object-contain" /> : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- 2. EDITORIAL CONTENT (Challenge & Solution) --- */}
        {(project.challenge || project.solution || project.features) && (
          <div className="mb-20 md:mb-24 lg:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20">
              
              {/* Challenge & Solution */}
              <div className="lg:col-span-7 flex flex-col gap-10 md:gap-12">
                {project.challenge && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative pl-5 md:pl-8 lg:pl-10 border-l border-white/10"
                  >
                    <Target className={cn("absolute -left-3 top-0 w-6 h-6 bg-[#050505]", accentClass)} />
                    <h3 className="text-[10px] md:text-sm font-mono uppercase tracking-widest text-gray-500 mb-3 md:mb-4">The Challenge</h3>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed">
                      {project.challenge}
                    </p>
                  </motion.div>
                )}
                
                {project.solution && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                    className="relative pl-5 md:pl-8 lg:pl-10 border-l"
                    style={{ borderLeftColor: themeColor.replace('rgba', 'rgb').replace(',0.5)', ')') }}
                  >
                    <Lightbulb className={cn("absolute -left-3 top-0 w-6 h-6 bg-[#050505]", accentClass)} />
                    <h3 className={cn("text-[10px] md:text-sm font-mono uppercase tracking-widest mb-3 md:mb-4", accentClass)}>The Solution</h3>
                    <p className="text-lg md:text-xl lg:text-2xl text-white font-light leading-relaxed">
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
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/[0.02] rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl"
                  >
                    <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white uppercase tracking-tight">Key Features</h3>
                    <ul className="space-y-4 md:space-y-6">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 md:gap-4 text-gray-400">
                          <span className={cn("mt-1.5 md:mt-2 w-1.5 h-1.5 rounded-full shrink-0", accentClass)} style={{ backgroundColor: 'currentColor' }} />
                          <span className="text-sm md:text-base lg:text-lg font-light leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 3. DYNAMIC SHOWCASE --- */}
        
        {/* SOFTWARE: Glassmorphic Browser */}
        {(!project.projectType || project.projectType === "software") && project.demoLink && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-24 lg:mb-32"
          >
            <div className="text-center mb-8 md:mb-10">
               <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4">Live Preview</h2>
               <p className="text-xs md:text-base text-gray-400 font-light">
                 {isMobile ? "Ketuk layar untuk mulai berinteraksi" : "Interact with the application directly below."}
               </p>
            </div>
            
            <div 
              className={cn(
                "relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black transition-all duration-500",
                isMobile && !iframeInteractive && "ring-2 ring-primary/50" // Highlight ring on mobile to suggest tapping
              )}
              style={{ boxShadow: `0 20px 80px -20px ${themeColor}` }}
              onClick={() => isMobile && setIframeInteractive(true)}
            >
              {/* Premium Glassmorphic Browser Bar */}
              <div className="h-10 md:h-14 bg-white/[0.05] backdrop-blur-xl border-b border-white/10 flex items-center px-3 md:px-4 gap-2 md:gap-4 relative z-10">
                <div className="flex gap-1.5 md:gap-2">
                   <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                   <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                   <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
                </div>
                <div className="flex-1 flex justify-center mx-2 md:mx-4">
                  <div className="flex items-center gap-1.5 md:gap-2 bg-black/40 border border-white/5 rounded-md md:rounded-lg py-1 px-2 md:py-1.5 md:px-6 w-full max-w-md">
                     <span className="text-[8px] md:text-[10px] font-mono text-gray-500">https://</span>
                     <span className="text-[10px] md:text-sm text-gray-300 font-mono truncate">
                       {project.demoLink.replace(/^https?:\/\//, '')}
                     </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); window.open(project.demoLink, "_blank"); }}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/20 transition-colors text-white shrink-0"
                >
                  <ExternalLink size={12} className="md:w-[14px] md:h-[14px]" />
                </button>
              </div>

              {/* Iframe Container */}
              <div className="relative w-full h-[350px] sm:h-[400px] md:h-[600px] lg:h-[800px] bg-[#050505] group/iframe">
                 {/* Mobile Scroll Stealer Protection Overlay */}
                 {isMobile && !iframeInteractive && (
                   <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-opacity">
                      <div className="bg-primary/90 text-white rounded-full p-4 mb-3 shadow-lg shadow-primary/30 animate-bounce">
                        <Pointer size={24} />
                      </div>
                      <span className="text-white font-bold text-sm tracking-widest uppercase">Tap to Interact</span>
                   </div>
                 )}

                 <div className={cn(
                   "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 flex flex-col items-center justify-center backdrop-blur-md z-30",
                   iframeLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
                 )}
                 style={{ backgroundImage: `url('${project.image}')` }}
                 >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <MonitorPlay size={48} className={cn("mb-4 md:mb-6 animate-pulse relative z-10 md:w-[64px] md:h-[64px]", accentClass)} />
                    <p className="text-white font-mono text-xs md:text-sm uppercase tracking-widest relative z-10">Initializing Environment...</p>
                 </div>

                 {project.demoLink && (
                   <iframe
                     src={project.demoLink}
                     className={cn(
                       "w-full h-full border-0 relative z-20",
                       (isMobile && !iframeInteractive) ? "pointer-events-none" : "pointer-events-auto"
                     )}
                     onLoad={() => setIframeLoaded(true)}
                     title={`${project.title} Preview`}
                     sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                   />
                 )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MARKETING: Animated Metrics (2x2 Grid on Mobile) */}
        {project.projectType === "marketing" && project.metrics && project.metrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={cn("mb-20 md:mb-24 lg:mb-32", accentClass)}
          >
            <div className="text-center mb-8 md:mb-10">
               <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4">Campaign Results</h2>
               <p className="text-xs md:text-base text-gray-400 font-light">Data-driven success metrics.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {project.metrics.map((metric, idx) => (
                <AnimatedCounter key={idx} value={metric.value} label={metric.label} />
              ))}
            </div>
          </motion.div>
        )}

        {/* DESIGN: Pinterest-Style Gallery (2 columns on mobile) */}
        {project.projectType === "design" && project.gallery && project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-24 lg:mb-32"
          >
            <div className="text-center mb-8 md:mb-10">
               <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4">Visual Gallery</h2>
               <p className="text-xs md:text-base text-gray-400 font-light">Explore the creative direction.</p>
            </div>
            <div className="columns-2 lg:columns-3 gap-3 md:gap-6 space-y-3 md:space-y-6">
              {project.gallery.map((img, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx} 
                  className="break-inside-avoid relative rounded-xl md:rounded-3xl overflow-hidden border border-white/10 group bg-white/5 cursor-pointer shadow-lg"
                >
                  <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <Sparkles className="text-white w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


        {/* --- 4. RECOMMENDATIONS (Horizontal Swipe on Mobile) --- */}
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-12 md:pt-16 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 md:gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4">
                  Next Masterpieces
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-xs md:text-base text-gray-400 font-light">Continue exploring the portfolio.</p>
                  <span className="md:hidden text-[9px] font-mono text-primary animate-pulse uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-full">Swipe →</span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/projects')}
                className="hidden md:block px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold uppercase tracking-wider transition-all"
              >
                View All Projects
              </button>
            </div>
            
            {/* Horizontal Swipe on Mobile, Grid on Desktop */}
            <div className="flex md:grid flex-row md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar pb-8 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 perspective-[1000px]" style={{ scrollbarWidth: 'none' }}>
              {recommendations.map((item, idx) => (
                <motion.div 
                  initial={isMobile ? { opacity: 0, scale: 0.8, rotateY: 30, x: 50 } : false}
                  whileInView={isMobile ? { opacity: 1, scale: 1, rotateY: 0, x: 0 } : undefined}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, delay: isMobile ? 0 : idx * 0.1 }}
                  key={item.id} 
                  className="w-[75vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center md:flex-shrink md:snap-align-none cursor-pointer group h-full" 
                  onClick={(e) => handleProjectClick(e, item.id)}
                >
                  <div className="transition-transform duration-500 group-hover:-translate-y-2 h-[350px] sm:h-[400px] md:h-full">
                    <ProjectCard project={item as any} />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button 
              onClick={() => router.push('/projects')}
              className="md:hidden w-full mt-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              View All Projects
            </button>
          </motion.div>
        )}

      </div>
    </main>
  );
}