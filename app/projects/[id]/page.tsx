"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/tech-badge";
import { Github, ExternalLink, Calendar, Users, Layers, MonitorPlay, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Import tipe dan service
import { Project } from "@/app/data/projects";
import { getProjectById, getAllProjects } from "@/lib/projects-service";
import { ProjectCard } from "@/components/ui/project-card";

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

          // Ambil 3 project lain sebagai rekomendasi
          const recs = allData.filter(p => String(p.id) !== projectId).slice(0, 3);
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
    // Mencegah navigasi ganda jika yang diklik adalah tombol di dalam card
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/projects/${id}`);
  };

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
        <h1 className="text-3xl font-heading font-bold text-white mb-4">Project Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">Proyek yang Anda cari tidak ditemukan dalam arsip kami.</p>
        <Button onClick={() => router.push("/projects")} className="rounded-full">Back to Projects</Button>
      </div>
    );
  }

  // --- Render konten ---
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="container max-w-7xl mx-auto pt-28 md:pt-40 px-4 sm:px-6 relative z-10">

        {/* Header Grid: Title/Desc (Left) & Meta (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16 items-start">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-lg md:text-xl text-primary font-medium mb-6">
                {project.subtitle}
              </p>
            )}
            
            {/* Rich Text Description */}
            <div 
              className="prose prose-invert prose-base md:prose-lg text-gray-400 font-light leading-relaxed mb-8 max-w-none
              prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-gray-200"
              dangerouslySetInnerHTML={{ __html: project.desc }}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.demoLink && (
                <Button 
                  className="w-full sm:w-auto h-12 px-8 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform" 
                  onClick={() => window.open(project.demoLink, "_blank")}
                >
                  <ExternalLink className="mr-2 w-5 h-5" /> Live Demo
                </Button>
              )}
              {project.repoLink && project.repoLink !== "#" && (
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-8 text-base font-bold rounded-xl border-white/10 hover:bg-white/5 hover:text-white transition-colors bg-white/5"
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
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.role && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Users size={14} /> My Role
                  </h3>
                  <p className="text-white font-medium text-lg">{project.role}</p>
                </div>
              )}
              
              {project.year && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Calendar size={14} /> Year
                  </h3>
                  <p className="text-white font-medium text-lg">{project.year}</p>
                </div>
              )}
              
              <div className="sm:col-span-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
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
          {/* Top Bar Browser */}
          <div className="h-10 md:h-12 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
            <div className="flex gap-1.5 md:gap-2">
               <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center mx-4">
              <div className="text-center text-[10px] md:text-xs text-gray-500 font-mono bg-black/40 border border-white/5 rounded-md py-1.5 px-6 truncate max-w-xs">
                 {project.demoLink || `project-${project.id}.local`}
              </div>
            </div>
            <div className="w-[52px]" /> {/* Spacer */}
          </div>

          {/* Responsive Height: h-64 (mobile) -> h-96 (tablet) -> h-[600px] (desktop) */}
          <div className="relative w-full h-[250px] sm:h-[400px] lg:h-[600px] bg-black">
             <div className={cn(
               "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
               iframeLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
             )}
             style={{ backgroundImage: `url('${project.image}')` }}
             >
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                   <MonitorPlay size={48} className="text-primary/50 mb-4 animate-pulse" />
                   <p className="text-gray-300 font-mono text-sm uppercase tracking-widest">Loading Interactive Preview...</p>
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
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">Key Features</h3>
                <ul className="space-y-3 md:space-y-4">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-400 text-sm md:text-base">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
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
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">The Challenge</h3>
                  <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              )}
              
              {project.solution && (
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white relative z-10">The Solution</h3>
                  <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed relative z-10">
                    {project.solution}
                  </p>
                </div>
              )}
            </motion.div>

          </div>
        )}

        {/* --- RECOMMENDATIONS SECTION --- */}
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24 pt-16 border-t border-white/10"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-4xl font-bold font-heading text-white flex items-center gap-3">
                <Sparkles className="text-primary" size={32} /> Other Masterpieces
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map(item => (
                <div 
                  key={item.id} 
                  className="cursor-pointer group" 
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