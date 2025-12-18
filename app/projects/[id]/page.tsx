"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/tech-badge";
import { ArrowLeft, Github, ExternalLink, Calendar, Users, Layers, MonitorPlay, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Import tipe dan service
import { Project } from "@/app/data/projects";
import { getProjectById } from "@/lib/projects-service";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (projectId) {
        const data = await getProjectById(projectId);
        setProject(data);
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  // --- Render konten ---
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-24 pb-16 md:pt-32 md:pb-20 relative z-10">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="pl-0 hover:pl-2 transition-all group min-h-[44px]"
          >
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Projects
          </Button>
        </motion.div>

        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-lg md:text-xl text-primary font-medium mb-6">
                {project.subtitle}
              </p>
            )}
            
            {/* Rich Text Description */}
            <div 
              className="prose prose-invert prose-base md:prose-lg text-muted-foreground leading-relaxed mb-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: project.desc }}
            />

            <div className="flex flex-wrap gap-4">
              {project.demoLink && (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto min-h-[48px] text-base" 
                  onClick={() => window.open(project.demoLink, "_blank")}
                >
                  <ExternalLink className="mr-2 w-5 h-5" /> Live Demo
                </Button>
              )}
              {project.repoLink && project.repoLink !== "#" && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto min-h-[48px] text-base"
                  onClick={() => window.open(project.repoLink, "_blank")}
                >
                  <Github className="mr-2 w-5 h-5" /> Source Code
                </Button>
              )}
            </div>
          </motion.div>

          {/* Project Meta Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary/10 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm h-fit"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.role && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                    <Users size={14} /> Role
                  </h3>
                  <p className="text-base md:text-lg font-medium">{project.role}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar size={14} /> Year
                  </h3>
                  <p className="text-base md:text-lg font-medium">{project.year}</p>
                </div>
              )}
              <div className="sm:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Layers size={14} /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {project.techStack?.map((tech, idx) => (
                    <TechBadge key={idx} name={tech.name} color={tech.color} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Preview (Iframe) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden mb-16 md:mb-20 border border-white/10 shadow-2xl bg-[#111]"
        >
            <div className="h-8 md:h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5 md:gap-2">
                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/20"></div>
                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/20"></div>
                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/20"></div>
              </div>
              <div className="flex-1 text-center text-[10px] md:text-xs text-muted-foreground font-mono bg-black/20 rounded py-1 mx-4 truncate opacity-50">
                 {project.demoLink || "localhost:3000"}
              </div>
            </div>

          {/* Responsive Height: h-64 (mobile) -> h-96 (tablet) -> h-[600px] (desktop) */}
          <div className="relative w-full h-[250px] sm:h-[400px] lg:h-[600px] bg-black">
             <div className={cn(
               "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
               iframeLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
             )}
             style={{ backgroundImage: `url('${project.image}')` }}
             >
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
                   <MonitorPlay size={48} className="text-white/50 mb-4 animate-pulse" />
                   <p className="text-white/80 font-medium text-sm md:text-base">Loading Interactive Preview...</p>
                </div>
             </div>

             {project.demoLink && (
               <iframe
                 src={project.demoLink}
                 className="w-full h-full border-0"
                 onLoad={() => setIframeLoaded(true)}
                 title={`${project.title} Preview`}
                 sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
               />
             )}
          </div>
        </motion.div>

        {/* Features & Challenge */}
        {(project.features || project.challenge) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {project.features && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 text-primary">Key Features</h3>
                <ul className="space-y-3 md:space-y-4">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8 md:space-y-12"
            >
              {project.challenge && (
                <div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 md:mb-4">The Challenge</h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 md:mb-4">The Solution</h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}

      </div>
    </main>
  );
}