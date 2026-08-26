"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Github, ExternalLink, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Update interface Project agar sesuai dengan data baru
export interface Project {
  id: number | string;
  title: string;
  desc: string;
  category: string;
  techStack: { name: string; color?: string }[]; 
  image: string;
  repoLink?: string;
  demoLink?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layout
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10, scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-[#0a0a0a] rounded-[2rem] border border-white/10 hover:border-primary/50 overflow-hidden flex flex-col h-full shadow-2xl transition-all duration-500"
    >
      {/* GLOW EFFECT MOUSE TRACKING */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* --- IMAGE SECTION --- */}
      <div className="h-56 sm:h-64 bg-[#0d1117] relative overflow-hidden border-b border-white/5 shrink-0">
        {/* Soft Inner Shadow/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent opacity-90 z-10 pointer-events-none group-hover:opacity-70 transition-opacity" />
        
        {/* Image dengan efek super zoom & tilt */}
        {project.image ? (
           <img 
             src={project.image}
             alt={project.title}
             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-1"
           />
        ) : (
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
              <FolderGit2 size={56} className="text-white/10 group-hover:text-primary/40 transition-colors drop-shadow-2xl" />
           </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-5 left-5 z-20 px-4 py-1.5 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-primary/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> SOROTAN
          </div>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20 bg-gradient-to-b from-transparent to-[#050505]">
        
        {/* Category & Title */}
        <div className="mb-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block group-hover:text-gray-400 transition-colors">
            {project.category}
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight drop-shadow-md">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-8 line-clamp-2 flex-grow leading-relaxed font-light group-hover:text-gray-300 transition-colors">
          {project.desc}
        </p>

        {/* Tech Stack Mini Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.slice(0, 3).map((tech, i) => (
            <span 
              key={i} 
              className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-white/5 text-gray-300 border border-white/10 flex items-center gap-2 group-hover:bg-white/10 group-hover:border-white/20 transition-all shadow-inner"
            >
              {tech.color && (
                <span 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                  style={{ backgroundColor: tech.color, boxShadow: `0 0 8px ${tech.color}` }}
                />
              )}
              {tech.name} 
            </span>
          ))}
          {project.techStack.length > 3 && (
             <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-white/[0.02] text-gray-500 border border-white/5 group-hover:text-gray-400 transition-colors">
               +{project.techStack.length - 3}
             </span>
          )}
        </div>

        {/* Action Buttons - Animated */}
        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-white/5 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {project.demoLink && (
            <Button 
              size="sm" 
              className="flex-1 bg-white/10 hover:bg-primary text-white border border-white/10 hover:border-primary min-h-[48px] rounded-xl transition-all font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] group/btn relative overflow-hidden"
              onClick={(e) => {
                e.stopPropagation(); 
                window.open(project.demoLink, "_blank");
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]" />
              <ExternalLink size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" /> Live
            </Button>
          )}
          {project.repoLink && project.repoLink !== "#" && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 min-h-[48px] rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.repoLink, "_blank");
              }}
            >
              <Github size={16} className="mr-2" /> Code
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}