"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { ProjectCard } from "@/components/ui/project-card";
import { Filter, Loader2, Search, ArrowDownUp, Sparkles, X } from "lucide-react"; 
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
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(true); 
  
  // --- FEATURES STATE ---
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a">("newest");

  // Fetch data saat halaman dimuat
  useEffect(() => {
    async function fetchData() {
      const data = await getAllProjects();
      setProjects(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- LOGIC PENCARIAN, FILTER & URUTKAN ---
  const processedProjects = useMemo(() => {
    let result = projects.filter((project) => {
      const matchesCategory = activeCategory === "all" || project.category === activeCategory;
      
      const searchLower = searchQuery.toLowerCase();
      // Menggunakan (project as any) untuk menghindari error TS pada description & technologies
      const matchesSearch = project.title.toLowerCase().includes(searchLower) || 
                            ((project as any).description || "").toLowerCase().includes(searchLower) ||
                            (((project as any).technologies || []).join(" ")).toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });

    // Logic Urutkan
    if (sortBy === "a-z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "z-a") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    // Jika "newest", biarkan sesuai urutan dari database (asumsi data default = terbaru)

    return result;
  }, [projects, activeCategory, searchQuery, sortBy]);

  // Handler pergantian urutan
  const toggleSort = () => {
    if (sortBy === "newest") setSortBy("a-z");
    else if (sortBy === "a-z") setSortBy("z-a");
    else setSortBy("newest");
  };

  const handleProjectClick = (e: React.MouseEvent, id: number | string) => {
    const target = e.target as HTMLElement;
    // Mencegah navigasi ganda jika yang diklik adalah tombol di dalam card
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/projects/${id}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[5%] left-[5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
        {/* Grid pattern halus ala studio desain */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full pt-28 md:pt-40">
        
        {/* --- 1. HERO SECTION (DASHBOARD BANNER STYLE) --- */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl"
          >
            {/* Ambient Background & Texture */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
              
              {/* Kiri: Title & Desc */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-medium tracking-wide text-primary-foreground/80 uppercase">
                    Portfolio // {new Date().getFullYear()}
                  </span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-white">
                  Creative <br className="hidden sm:block" />
                  <span className="text-gradient-primary">Masterpieces.</span>
                </h1>
                
                <p className="text-gray-400 text-base md:text-lg max-w-2xl font-light leading-relaxed">
                  Koleksi eksklusif dari {loading ? "..." : projects.length} proyek terbaik. Mewujudkan ide kompleks menjadi eksekusi digital yang brilian dan estetis.
                </p>
              </div>

              {/* Kanan: Latest Project Showcase */}
              <div className="lg:col-span-5 relative w-full">
                {loading ? (
                  <div className="w-full h-[350px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
                ) : projects.length > 0 ? (
                  <div 
                    className="relative group cursor-pointer touch-manipulation" 
                    onClick={(e) => handleProjectClick(e, projects[0].id)}
                  >
                    {/* Badge Terbaru */}
                    <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-20 bg-primary text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full shadow-xl shadow-primary/30 uppercase tracking-widest flex items-center gap-1.5 border border-primary/50">
                      <Sparkles size={14} className="fill-white" /> Project Terbaru
                    </div>

                    {/* Card Container */}
                    <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                      <ProjectCard project={projects[0] as any} />
                    </div>

                    {/* Dekorasi Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[80px] rounded-full -z-10 group-hover:bg-primary/30 transition-colors duration-500" />
                  </div>
                ) : null}
              </div>

            </div>
          </motion.div>
        </div>

        {/* --- 2. STUDIO CONTROL BAR (STATIC/NOT STICKY) --- */}
        <div className="w-full border-y border-white/10 py-4 md:py-5 mb-12">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Category Links (Animated Underline) */}
            <nav className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "relative text-sm md:text-base font-heading uppercase tracking-widest transition-colors whitespace-nowrap py-1",
                    activeCategory === cat.id ? "text-white font-bold" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {cat.label}
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="active-nav-line"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Search & Sort Group */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              
              {/* Minimalist Search */}
              <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari project..." 
                  className="w-full bg-transparent border-b border-white/10 focus:border-primary pl-7 pr-8 py-2 text-sm text-white placeholder:text-gray-600 outline-none transition-colors rounded-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Minimalist Sort */}
              <button 
                onClick={toggleSort}
                className="flex items-center gap-2 text-xs md:text-sm font-mono text-gray-400 hover:text-white uppercase tracking-widest shrink-0 transition-colors"
              >
                <ArrowDownUp className="w-4 h-4" />
                {sortBy === "newest" ? "Terbaru" : sortBy === "a-z" ? "A - Z" : "Z - A"}
              </button>

            </div>
          </div>
        </div>

        {/* --- 3. PROJECT GRID --- */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[450px] bg-white/5 rounded-3xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {processedProjects.map((project, idx) => (
                    <motion.div
                      layout
                      key={project.id} 
                      onClick={(e) => handleProjectClick(e, project.id)}
                      className="block h-full cursor-pointer touch-manipulation group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: idx * 0.05, // Efek muncul berurutan (stagger)
                        type: "spring", 
                        stiffness: 100 
                      }}
                    >
                      <div className="transition-transform duration-500 group-hover:-translate-y-2 h-full">
                        <ProjectCard project={project as any} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State Editorial Style */}
              {!loading && processedProjects.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 border-y border-white/10"
                >
                  <Filter size={40} className="mx-auto text-gray-700 mb-6" />
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 uppercase tracking-wider">
                    No Works Found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base">
                    Tidak ada project yang cocok dengan filter atau kata kunci "{searchQuery}". Silakan sesuaikan pencarian Anda.
                  </p>
                  <button 
                    onClick={() => {setSearchQuery(""); setActiveCategory("all"); setSortBy("newest");}}
                    className="mt-8 text-primary font-mono text-sm uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <X size={14} /> Clear Filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>

      </div>
    </main>
  );
}