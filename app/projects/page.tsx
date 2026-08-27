"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Play, MoveLeft, MoveRight } from "lucide-react"; 
import { ProjectCard, Project as ProjectType } from "@/components/ui/project-card";
import { getAllProjects } from "@/lib/projects-service";
import { cn } from "@/lib/utils";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectType[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    async function fetchData() {
      const data = await getAllProjects();
      // Sort newest first
      const sorted = data.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
      setProjects(sorted);
      setLoading(false);
      setActiveIndex(0);
    }
    fetchData();

    return () => window.removeEventListener('resize', handleResize);
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
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip transition-colors duration-1000">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full blur-[100px] md:blur-[150px] mix-blend-screen opacity-30 transition-all duration-1000 ease-in-out"
          style={{ backgroundColor: glowColor.replace('0.4', '0.2') }} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative z-10 w-full pt-28 md:pt-36 px-4 flex flex-col flex-grow">
        
        {/* --- HERO TEXT --- */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 md:mb-6 transition-colors duration-700" style={{ borderColor: glowColor.replace('0.4', '0.2') }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: glowColor.replace('rgba', 'rgb').replace(',0.4)', ')') }} />
            <span className="text-[10px] md:text-xs font-mono text-gray-300 tracking-widest uppercase">
              {activeProject ? (activeProject as any).projectType || 'Software' : 'Portfolio'} Showcase
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter uppercase text-white mb-4">
            Interactive <span className="text-transparent bg-clip-text transition-colors duration-700 block md:inline" style={{ backgroundImage: `linear-gradient(to right, #fff, ${glowColor.replace('rgba', 'rgb').replace(',0.4)', ')')})` }}>Gallery</span>
          </h1>
          
          {/* Desktop Hint */}
          <p className="hidden md:block text-gray-400 max-w-xl mx-auto text-sm md:text-base font-light">
             Gunakan panah kiri/kanan, atau klik kartu di belakang untuk memutar *carousel*. Klik kartu utama untuk melihat detail.
          </p>
          
          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center justify-center gap-3 text-gray-400 text-xs font-mono uppercase tracking-widest mt-2 animate-pulse">
            <MoveLeft size={12} /> Geser Kartu <MoveRight size={12} />
          </div>
        </div>

        {/* --- 3D COVERFLOW CAROUSEL --- */}
        <div className="relative w-full max-w-7xl mx-auto flex-grow flex items-center justify-center perspective-[1200px] md:perspective-[1200px] perspective-origin-center h-[450px] sm:h-[600px] md:h-[650px] mt-4 md:mt-0">
          
          {projects.map((project, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);
            
            // Calculate 3D transforms
            const isActive = offset === 0;
            const isVisible = absOffset <= (isMobile ? 2 : 3); // Show fewer cards on mobile for performance
            
            if (!isVisible) return null;

            // Mobile-Optimized Positioning Math
            const direction = offset > 0 ? 1 : -1;
            // On mobile: tightly packed, deeper rotation, stronger scale down
            const translateX = isActive ? 0 : offset * (isMobile ? 65 : 180);
            const rotateY = isActive ? 0 : direction * (isMobile ? -45 : -35); 
            const scale = isActive ? 1 : 1 - (absOffset * (isMobile ? 0.2 : 0.15));
            const zIndex = 100 - absOffset;
            const opacity = isActive ? 1 : 1 - (absOffset * (isMobile ? 0.4 : 0.25));

            // Shadow color based on category (only for active card)
            const type = (project as any).projectType?.toLowerCase() || "software";
            let cardGlow = "rgba(255,255,255,0)";
            if (isActive) {
               if (type === "software") cardGlow = isMobile ? "0 10px 40px -10px rgba(99,102,241,0.5)" : "0 20px 50px -10px rgba(99,102,241,0.5)";
               else if (type === "marketing") cardGlow = isMobile ? "0 10px 40px -10px rgba(16,185,129,0.5)" : "0 20px 50px -10px rgba(16,185,129,0.5)";
               else if (type === "design") cardGlow = isMobile ? "0 10px 40px -10px rgba(236,72,153,0.5)" : "0 20px 50px -10px rgba(236,72,153,0.5)";
            }

            return (
              <motion.div
                key={project.id}
                className={cn(
                  "absolute top-0 w-[270px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-[400px] sm:h-[500px] md:h-[550px]",
                  isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
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
                  stiffness: 250,
                  damping: 30,
                  mass: 0.8
                }}
                
                // Mobile Swiping Logic!
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    handleNext();
                  } else if (swipe > swipeConfidenceThreshold) {
                    handlePrev();
                  }
                }}
                
                onClick={() => {
                  // Only trigger click route if we didn't just drag
                  handleCardClick(idx, project.id);
                }}
              >
                {/* Click overlay for non-active cards to prevent interacting with buttons inside ProjectCard */}
                {!isActive && (
                  <div className="absolute inset-0 z-50 rounded-3xl" />
                )}
                
                {/* The actual Project Card */}
                <div className="w-full h-full rounded-3xl overflow-hidden pointer-events-none sm:pointer-events-auto shadow-2xl">
                   <ProjectCard project={project} />
                </div>
                
                {/* Active Card Indicator / Play Button */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 10 }}
                      className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-white text-black px-5 md:px-6 py-2 rounded-full font-bold text-[10px] md:text-sm shadow-xl pointer-events-none whitespace-nowrap z-50"
                    >
                      <Play size={12} className="fill-black md:w-[14px] md:h-[14px]" /> Klik untuk Detail
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* --- NAVIGATION CONTROLS --- */}
        <div className="flex items-center justify-center gap-6 md:gap-8 pb-12 pt-10 md:pt-6">
          <button 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="hidden md:flex w-12 h-12 rounded-full border border-white/20 bg-white/5 items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Progress Dots (Limited to show max 9 dots for UI sanity) */}
          <div className="flex items-center gap-2 overflow-hidden px-2">
            {projects.map((_, idx) => {
               // Only show a sliding window of dots if too many projects
               if (projects.length > 7 && Math.abs(idx - activeIndex) > (isMobile ? 2 : 3)) return null;
               
               return (
                 <div 
                   key={idx}
                   onClick={() => setActiveIndex(idx)}
                   className={cn(
                     "rounded-full transition-all duration-300 cursor-pointer",
                     idx === activeIndex 
                       ? "w-8 md:w-10 h-1.5 md:h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                       : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/20 hover:bg-white/50"
                   )}
                 />
               )
            })}
          </div>

          <button 
            onClick={handleNext}
            disabled={activeIndex === projects.length - 1}
            className="hidden md:flex w-12 h-12 rounded-full border border-white/20 bg-white/5 items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </main>
  );
}