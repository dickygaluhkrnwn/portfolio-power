"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { ProjectCard } from "@/components/ui/project-card";
import { Filter, Layers, Loader2 } from "lucide-react"; // Tambah Loader icon
import { cn } from "@/lib/utils";

// Import tipe data dan service
import { Project } from "@/app/data/projects";
import { getAllProjects } from "@/lib/projects-service";

const categories = [
  { id: "all", label: "All Works" },
  { id: "fullstack", label: "Full Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]); // State untuk data project
  const [loading, setLoading] = useState(true); // State loading
  const router = useRouter();

  // Fetch data saat halaman dimuat
  useEffect(() => {
    async function fetchData() {
      const data = await getAllProjects();
      setProjects(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProjects = projects.filter(
    (project) => filter === "all" || project.category === filter
  );

  const handleProjectClick = (e: React.MouseEvent, id: number | string) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/projects/${id}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container-width pt-32 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              Selected <span className="text-gradient-primary">Works.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Koleksi {loading ? "..." : projects.length}+ project terbaik yang mendemonstrasikan kemampuan memecahkan masalah kompleks.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2 bg-secondary/30 p-1.5 rounded-full border border-white/5 backdrop-blur-sm"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                  filter === cat.id ? "text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                {filter === cat.id && (
                  <motion.div
                    layoutId="project-filter"
                    className="absolute inset-0 bg-primary shadow-lg shadow-primary/25 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {cat.id === "all" ? <Layers size={14} /> : <Filter size={14} />}
                  {cat.label}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Content Section */}
        {loading ? (
          // Loading Spinner
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id} 
                  onClick={(e) => handleProjectClick(e, project.id)}
                  className="block h-full cursor-pointer"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project as any} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Tidak ada project di kategori ini.</p>
          </div>
        )}

      </div>
    </main>
  );
}