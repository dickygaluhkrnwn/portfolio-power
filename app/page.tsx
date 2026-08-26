"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { 
  ArrowRight, Github, Linkedin, Mail, Download, Code, Layers, 
  Globe, Terminal, BookOpen, ShoppingCart, Calendar, ArrowUpRight, 
  Zap, Database, Sparkles, MoveRight
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Import Services & Types
import { getAllProjects } from "@/lib/projects-service";
import { getPublishedPosts, BlogPost } from "@/lib/blog-service";
import { getAllServices } from "@/lib/services-service";
import { Project } from "@/app/data/projects";
import { ServicePackage } from "@/app/data/services";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // States untuk Data Dinamis
  const [projectCount, setProjectCount] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ServicePackage[]>([]);

  // Expandable Projects State
  const [hoveredProject, setHoveredProject] = useState<number>(0);

  // Floating Blog Image State
  const [hoveredBlogIndex, setHoveredBlogIndex] = useState<number | null>(null);
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  // Services Horizontal Scroll
  const servicesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: servicesScrollY } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"]
  });
  const xServices = useTransform(servicesScrollY, [0, 1], ["20%", "-50%"]);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, postsData, servicesData] = await Promise.all([
          getAllProjects(),
          getPublishedPosts(),
          getAllServices()
        ]);
        
        setProjectCount(projectsData.length);
        
        const topProjects = projectsData.filter(p => p.featured);
        setFeaturedProjects(topProjects.length >= 4 ? topProjects.slice(0, 4) : projectsData.slice(0, 4));
        
        setLatestPosts(postsData.slice(0, 4)); // Get 4 for the list
        
        const topServices = servicesData.filter(s => s.recommended || s.isFlashSale);
        setFeaturedServices(topServices.length >= 3 ? topServices.slice(0, 4) : servicesData.slice(0, 4));
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30 selection:text-white pb-0">
      <Navbar />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* --- FLOATING BLOG IMAGE (Cursor Reveal) --- */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-40 md:w-80 md:h-48 pointer-events-none z-[100] rounded-2xl overflow-hidden shadow-2xl border border-white/20 hidden md:block"
        style={{
          x: useTransform(cursorX, v => v + 20),
          y: useTransform(cursorY, v => v + 20),
          opacity: hoveredBlogIndex !== null ? 1 : 0,
          scale: hoveredBlogIndex !== null ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {hoveredBlogIndex !== null && latestPosts[hoveredBlogIndex] && (
            <motion.img
              key={hoveredBlogIndex}
              src={latestPosts[hoveredBlogIndex].coverImage || "https://i.imgur.com/vHqQJd3.png"}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-16 md:pt-32">
        
        {/* --- 1. HERO SECTION (ULTRA PREMIUM) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-32 md:mb-40">
          <div className="lg:col-span-7 space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md w-fit mx-auto lg:mx-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="text-xs font-mono tracking-widest text-white uppercase">
                Available for New Projects
              </span>
            </div>

            <div>
              <h2 className="text-xl md:text-3xl font-medium text-gray-400 mb-2 flex items-center justify-center lg:justify-start gap-3">
                Hi, I'm <span className="text-white font-bold">Iky</span> <span className="animate-wave origin-bottom-right inline-block">👋</span>
              </h2>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-white drop-shadow-2xl">
                Dicky Galuh <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary animate-gradient-x bg-[length:200%_auto]">
                  Kurniawan.
                </span>
              </h1>
            </div>

            <p className="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-light backdrop-blur-sm">
              Membangun masa depan digital dengan <b className="text-white font-medium">Full Stack Development</b>. Fokus pada performa gila, arsitektur kokoh, dan desain yang memanjakan mata.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Button size="lg" className="rounded-full text-base font-bold shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] group h-14 px-8 relative overflow-hidden transition-all hover:scale-105" onClick={() => router.push("/projects")}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Explore My Work 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 50, damping: 20 }}
            className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end relative z-10"
          >
            <div className="relative w-64 sm:w-80 md:w-96 aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/20 bg-black/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transform-gpu hover:scale-[1.02] hover:-rotate-2 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-purple-500/20 opacity-50 z-10 mix-blend-overlay group-hover:opacity-100 transition-opacity duration-700" />
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale-[50%] group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-700"
                style={{ backgroundImage: `url('https://i.imgur.com/VIGw7gw.png')` }} 
              />
            </div>
            <div className="absolute -z-10 top-6 -right-6 md:top-10 md:-right-10 w-full h-full border border-primary/30 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-700 bg-primary/5 backdrop-blur-3xl" />
          </motion.div>
        </div>

        {/* --- 2. EXPANDABLE PROJECTS ACCORDION --- */}
        <div className="mb-32 md:mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                <span className="text-primary">Featured</span> Works.
              </h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white" onClick={() => router.push("/projects")}>
              View Gallery <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {loading ? (
             <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-[2rem]" />
          ) : (
            <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[500px] gap-2 md:gap-4">
              {featuredProjects.map((project, i) => {
                const isActive = hoveredProject === i;
                return (
                  <motion.div
                    key={project.id}
                    onHoverStart={() => setHoveredProject(i)}
                    onClick={() => router.push(`/projects/${project.id}`)}
                    animate={{ 
                      flex: isActive ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 5) : 1 
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className={cn(
                      "relative rounded-[2rem] overflow-hidden cursor-pointer flex-shrink-0 md:flex-shrink",
                      "border border-white/10 group transition-colors duration-500",
                      isActive ? "bg-black/60 border-primary/30" : "bg-white/5 hover:bg-white/10"
                    )}
                    style={{ minHeight: isActive ? '200px' : '60px' }}
                  >
                    {/* Background Image */}
                    {project.image && (
                      <motion.div 
                        animate={{ opacity: isActive ? 1 : 0.2, scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                    )}
                    {/* Gradient Overlay */}
                    <div className={cn(
                      "absolute inset-0 z-10 transition-opacity duration-500",
                      isActive ? "bg-gradient-to-t from-black via-black/40 to-transparent" : "bg-black/80"
                    )} />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          rotate: isActive ? 0 : -90,
                          transformOrigin: "left bottom",
                          marginBottom: isActive ? 0 : '20px',
                          x: isActive ? 0 : 20,
                          y: isActive ? 0 : -20
                        }}
                        className="flex flex-col gap-2 w-[300px] md:w-auto"
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.span 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="text-primary font-mono text-xs uppercase tracking-widest hidden md:block"
                            >
                              {project.category}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        
                        <h3 className={cn(
                          "font-heading font-bold text-white whitespace-nowrap",
                          isActive ? "text-2xl md:text-4xl whitespace-normal drop-shadow-md" : "text-xl"
                        )}>
                          {project.title}
                        </h3>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden hidden md:block"
                            >
                              <p className="text-gray-300 text-sm mt-4 line-clamp-2 max-w-md">
                                {project.desc}
                              </p>
                              <div className="flex gap-2 mt-4">
                                {project.techStack.slice(0, 3).map((t, idx) => (
                                  <span key={idx} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-white">
                                    {t.name}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- 3. PREMIUM SERVICES (PARALLAX HORIZONTAL SCROLL) --- */}
        <div className="mb-32 md:mb-40" ref={servicesRef}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                Digital <span className="text-emerald-400">Services</span>.
              </h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white" onClick={() => router.push("/services")}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="relative w-full overflow-hidden py-10 -mx-4 px-4 sm:mx-0 sm:px-0">
             <motion.div 
               style={{ x: xServices }}
               className="flex gap-6 md:gap-10 w-[200vw] md:w-[150vw]"
             >
               {featuredServices.map((service, idx) => (
                 <div 
                   key={service.id}
                   onClick={() => router.push(`/services/${service.id}`)}
                   className="w-[280px] md:w-[400px] flex-shrink-0 group cursor-pointer"
                 >
                   {/* 3D Floating Card Effect */}
                   <div className="relative aspect-[4/5] bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-8 flex flex-col justify-between overflow-hidden transition-all duration-700 group-hover:border-emerald-500/50 group-hover:bg-[#111] shadow-2xl">
                      {/* Gradient Blob Background */}
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-700" />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                           {service.category === "frontend" ? <Code size={28} className="text-gray-300 group-hover:text-emerald-400" /> : 
                            service.category === "backend" ? <Database size={28} className="text-gray-300 group-hover:text-emerald-400" /> : 
                            <Globe size={28} className="text-gray-300 group-hover:text-emerald-400" />}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-light line-clamp-3">
                          {service.shortDesc}
                        </p>
                      </div>

                      <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                         <div>
                           <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Starting At</span>
                           <span className="text-xl font-bold text-white">{service.price}</span>
                         </div>
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         </div>
                      </div>
                   </div>
                 </div>
               ))}
             </motion.div>
          </div>
        </div>

        {/* --- 4. LATEST INSIGHTS (MINIMALIST LIST WITH CURSOR REVEAL) --- */}
        <div className="mb-32 md:mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                Latest <span className="text-purple-400">Thoughts</span>.
              </h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white" onClick={() => router.push("/blog")}>
              Read Blog <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="w-full flex flex-col border-t border-white/10">
            {latestPosts.map((post, idx) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                onMouseEnter={() => setHoveredBlogIndex(idx)}
                onMouseLeave={() => setHoveredBlogIndex(null)}
                className="group py-8 md:py-10 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative"
              >
                {/* Background Hover Sweep */}
                <div className="absolute inset-0 bg-white/[0.02] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 -z-10" />

                <div className="flex items-center gap-6 md:w-1/3">
                  <span className="text-sm font-mono text-gray-600 font-bold">0{idx + 1}</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary border border-primary/20 bg-primary/10 px-3 py-1 rounded-full">
                    {post.tags?.[0] || "Article"}
                  </span>
                </div>
                
                <div className="md:w-1/2">
                  <h3 className="text-2xl md:text-4xl font-heading font-bold text-gray-300 group-hover:text-white group-hover:translate-x-4 transition-all duration-500">
                    {post.title}
                  </h3>
                </div>

                <div className="md:w-1/6 flex justify-end">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-purple-400 group-hover:bg-purple-400/10 transition-colors">
                    <ArrowRight size={20} className="text-gray-500 group-hover:text-purple-400 group-hover:-rotate-45 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Button variant="outline" className="w-full md:hidden mt-8 h-14 rounded-2xl bg-white/5 border-white/10 font-bold" onClick={() => router.push("/blog")}>
            Read All Articles <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* --- 5. MASSIVE CTA SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-black border border-white/10 p-10 md:p-24 text-center flex flex-col items-center justify-center shadow-2xl mb-10 group cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => router.push("/contact")}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/10 blur-[150px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
          
          <Sparkles className="w-12 h-12 text-primary mb-8 animate-pulse" />
          <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tighter max-w-4xl drop-shadow-2xl uppercase">
            Let's build something <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 animate-gradient-x">Extraordinary.</span>
          </h2>
          <Button size="lg" className="mt-8 rounded-full text-lg font-bold shadow-[0_0_50px_rgba(99,102,241,0.6)] group-hover:shadow-[0_0_80px_rgba(99,102,241,0.9)] transition-all h-16 px-12 relative overflow-hidden group/btn bg-white text-black hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); router.push("/contact"); }}>
            <span className="relative z-10 flex items-center">Start a Project <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-2 transition-transform" /></span>
          </Button>
        </motion.div>

      </div>
    </main>
  );
}