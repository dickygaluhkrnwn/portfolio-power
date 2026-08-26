"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { ChevronLeft, ChevronRight, Loader2, Play } from "lucide-react"; 
import { ProjectCard, Project as ProjectType } from "@/components/ui/project-card";
import { getAllProjects } from "@/lib/projects-service";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectType[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllProjects();
      // Sort newest first
      const sorted = data.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
      setProjects(sorted);
      setLoading(false);
      
      // Initial active index (center of array if we want, or just 0)
      setActiveIndex(0);
    }
    fetchData();
  }, []);

  const handleNext = () => {
    if (activeIndex < projects.length - 1) setActiveIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  const handleCardClick = (idx: number, id: string | number) => {
    if (idx === activeIndex) {
      router.push(`/projects/${id}`);
    } else {
      setActiveIndex(idx);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, projects.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <Navbar />
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-mono tracking-widest uppercase text-sm">Preparing 3D Showcase...</p>
      </main>
    );
  }

  // --- Dynamic Color Glow Logic ---
  const activeProject = projects[activeIndex];
  let glowColor = "rgba(255,255,255,0.05)";
  if (activeProject) {
    const type = (activeProject as any).projectType?.toLowerCase() || "software";
    if (type === "software") glowColor = "rgba(99,102,241,0.4)"; // Indigo/Blue
    else if (type === "marketing") glowColor = "rgba(16,185,129,0.4)"; // Emerald/Green
    else if (type === "design") glowColor = "rgba(236,72,153,0.4)"; // Pink/Purple
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white relative selection:bg-primary/30 overflow-hidden flex flex-col">
      <Navbar />

      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip transition-colors duration-1000">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] mix-blend-screen opacity-30 transition-all duration-1000 ease-in-out"
          style={{ backgroundColor: glowColor.replace('0.4', '0.2') }} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative z-10 w-full pt-28 md:pt-36 px-4 flex flex-col flex-grow">
        
        {/* --- HERO TEXT --- */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 transition-colors duration-700" style={{ borderColor: glowColor.replace('0.4', '0.2') }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: glowColor.replace('rgba', 'rgb').replace(',0.4)', ')') }} />
            <span className="text-xs font-mono text-gray-300 tracking-widest uppercase">
              {activeProject ? (activeProject as any).projectType || 'Software' : 'Portfolio'} Showcase
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter uppercase text-white mb-4">
            Interactive <span className="text-transparent bg-clip-text transition-colors duration-700" style={{ backgroundImage: `linear-gradient(to right, #fff, ${glowColor.replace('rgba', 'rgb').replace(',0.4)', ')')})` }}>Gallery</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-light">
             Gunakan panah kiri/kanan, atau klik kartu di belakang untuk memutar *carousel*. Klik kartu utama untuk melihat detail.
          </p>
        </div>

        {/* --- 3D COVERFLOW CAROUSEL --- */}
        <div className="relative w-full max-w-7xl mx-auto flex-grow flex items-center justify-center perspective-[1200px] h-[500px] sm:h-[600px] md:h-[650px]">
          
          {projects.map((project, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);
            
            // Calculate 3D transforms
            const isActive = offset === 0;
            const isVisible = absOffset <= 3; // Show up to 3 cards on each side
            
            if (!isVisible) return null;

            // Positioning Math
            const direction = offset > 0 ? 1 : -1;
            const translateX = isActive ? 0 : offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 180);
            const rotateY = isActive ? 0 : direction * -35; 
            const scale = isActive ? 1 : 1 - (absOffset * 0.15);
            const zIndex = 100 - absOffset;
            const opacity = isActive ? 1 : 1 - (absOffset * 0.25);

            // Shadow color based on category (only for active card)
            const type = (project as any).projectType?.toLowerCase() || "software";
            let cardGlow = "rgba(255,255,255,0)";
            if (isActive) {
               if (type === "software") cardGlow = "0 20px 50px -10px rgba(99,102,241,0.5)";
               else if (type === "marketing") cardGlow = "0 20px 50px -10px rgba(16,185,129,0.5)";
               else if (type === "design") cardGlow = "0 20px 50px -10px rgba(236,72,153,0.5)";
            }

            return (
              <motion.div
                key={project.id}
                className={cn(
                  "absolute top-0 w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-[450px] sm:h-[500px] md:h-[550px]",
                  isActive ? "cursor-pointer" : "cursor-pointer"
                )}
                style={{ zIndex }}
                initial={false}
                animate={{
                  x: translateX,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  boxShadow: cardGlow,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8
                }}
                onClick={() => handleCardClick(idx, project.id)}
              >
                {/* Click overlay for non-active cards to prevent interacting with buttons inside ProjectCard */}
                {!isActive && (
                  <div className="absolute inset-0 z-50 rounded-3xl" />
                )}
                
                {/* The actual Project Card */}
                <div className="w-full h-full rounded-3xl overflow-hidden pointer-events-none sm:pointer-events-auto">
                   <ProjectCard project={project} />
                </div>
                
                {/* Active Card Indicator / Play Button */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold text-sm shadow-xl pointer-events-none"
                    >
                      <Play size={14} className="fill-black" /> View Details
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* --- NAVIGATION CONTROLS --- */}
        <div className="flex items-center justify-center gap-8 pb-12 pt-6">
          <button 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Progress Dots (Limited to show max 9 dots for UI sanity) */}
          <div className="flex items-center gap-2 overflow-hidden px-2">
            {projects.map((_, idx) => {
               // Only show a sliding window of dots if too many projects
               if (projects.length > 9 && Math.abs(idx - activeIndex) > 4) return null;
               
               return (
                 <div 
                   key={idx}
                   onClick={() => setActiveIndex(idx)}
                   className={cn(
                     "rounded-full transition-all duration-300 cursor-pointer",
                     idx === activeIndex 
                       ? "w-8 h-2 bg-white" 
                       : "w-2 h-2 bg-white/20 hover:bg-white/50"
                   )}
                 />
               )
            })}
          </div>

          <button 
            onClick={handleNext}
            disabled={activeIndex === projects.length - 1}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </main>
  );
}