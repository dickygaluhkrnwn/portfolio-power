"use client";

import React from "react";
import { motion } from "framer-motion";
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
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
      className="group relative bg-[#0a0a0a] rounded-3xl border border-white/10 hover:border-primary/50 overflow-hidden flex flex-col h-full hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)] hover:bg-[#111] transition-all duration-500"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="h-48 sm:h-56 bg-[#0d1117] relative overflow-hidden border-b border-white/5 shrink-0">
        {/* Soft Inner Shadow/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-80 z-10 pointer-events-none" />
        
        {/* Image dengan fallback */}
        {project.image ? (
           <img 
             src={project.image}
             alt={project.title}
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
        ) : (
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
              <FolderGit2 size={48} className="text-white/10 group-hover:text-primary/30 transition-colors" />
           </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary/90 text-white text-[10px] font-bold rounded-md uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Sorotan
          </div>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20">
        
        {/* Category & Title */}
        <div className="mb-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">
            {project.category}
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-snug">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed font-light">
          {project.desc}
        </p>

        {/* Tech Stack Mini Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.slice(0, 3).map((tech, i) => (
            <span 
              key={i} 
              className="text-[10px] font-mono tracking-wider px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1.5"
            >
              {tech.color && (
                <span 
                  className="w-1.5 h-1.5 rounded-full shadow-sm" 
                  style={{ backgroundColor: tech.color, boxShadow: `0 0 5px ${tech.color}` }}
                />
              )}
              {tech.name} 
            </span>
          ))}
          {project.techStack.length > 3 && (
             <span className="text-[10px] font-mono tracking-wider px-2 py-1 rounded-md bg-white/[0.02] text-gray-500 border border-white/5">
               +{project.techStack.length - 3}
             </span>
          )}
        </div>

        {/* Action Buttons - Mobile Friendly (Touch Targets) */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
          {project.demoLink && (
            <Button 
              size="sm" 
              className="flex-1 bg-white/5 hover:bg-primary text-gray-300 hover:text-white border border-white/10 hover:border-primary min-h-[44px] sm:min-h-[40px] rounded-xl transition-all font-semibold text-xs uppercase tracking-wider"
              onClick={(e) => {
                e.stopPropagation(); 
                window.open(project.demoLink, "_blank");
              }}
            >
              <ExternalLink size={14} className="mr-2" /> Live
            </Button>
          )}
          {project.repoLink && project.repoLink !== "#" && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 min-h-[44px] sm:min-h-[40px] rounded-xl transition-all font-semibold text-xs uppercase tracking-wider"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.repoLink, "_blank");
              }}
            >
              <Github size={14} className="mr-2" /> Code
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}