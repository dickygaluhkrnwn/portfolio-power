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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-secondary/20 backdrop-blur-sm rounded-3xl border border-white/5 hover:border-primary/50 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-primary/10 transition-all"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="h-48 sm:h-52 bg-black/50 relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        
        {/* Image dengan fallback */}
        {project.image ? (
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
             style={{ backgroundImage: `url('${project.image}')` }}
           />
        ) : (
           <div className="absolute inset-0 bg-grid-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <FolderGit2 size={48} className="text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
           </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary/90 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg backdrop-blur-md">
            Featured
          </div>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-20">
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
          {project.desc}
        </p>

        {/* Tech Stack Mini Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.slice(0, 4).map((tech, i) => (
            <span 
              key={i} 
              className="text-[10px] font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground border border-white/5 flex items-center gap-1"
            >
              {tech.color && (
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: tech.color }}
                />
              )}
              {tech.name} 
            </span>
          ))}
          {project.techStack.length > 4 && (
             <span className="text-[10px] font-medium px-2 py-1 rounded bg-secondary/50 text-muted-foreground border border-white/5">
                +{project.techStack.length - 4}
             </span>
          )}
        </div>

        {/* Action Buttons - Mobile Friendly (Touch Targets) */}
        <div className="flex items-center gap-3 mt-auto">
          {project.demoLink && (
            <Button 
              size="sm" 
              className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20 min-h-[44px] sm:min-h-[36px] active:scale-95 transition-all"
              onClick={(e) => {
                e.stopPropagation(); 
                window.open(project.demoLink, "_blank");
              }}
            >
              <ExternalLink size={18} className="mr-2" /> Demo
            </Button>
          )}
          {project.repoLink && project.repoLink !== "#" && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full min-h-[44px] sm:min-h-[36px] active:scale-95 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.repoLink, "_blank");
              }}
            >
              <Github size={18} className="mr-2" /> Code
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}