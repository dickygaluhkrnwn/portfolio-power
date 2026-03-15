"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Download, Code, Layers, Globe, Terminal, BookOpen, ShoppingCart, Calendar, ArrowUpRight, Zap, Database } from "lucide-react";
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
import { ProjectCard } from "@/components/ui/project-card";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // States untuk Data Dinamis
  const [projectCount, setProjectCount] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ServicePackage[]>([]);

  // Load Data Paralel
  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, postsData, servicesData] = await Promise.all([
          getAllProjects(),
          getPublishedPosts(),
          getAllServices()
        ]);
        
        setProjectCount(projectsData.length);
        
        // Ambil 4 project unggulan/terbaru
        const topProjects = projectsData.filter(p => p.featured);
        setFeaturedProjects(topProjects.length >= 4 ? topProjects.slice(0, 4) : projectsData.slice(0, 4));
        
        // Ambil 3 blog terbaru
        setLatestPosts(postsData.slice(0, 3));
        
        // Ambil 3 service unggulan (Flash sale atau rekomendasi)
        const topServices = servicesData.filter(s => s.recommended || s.isFlashSale);
        setFeaturedServices(topServices.length >= 3 ? topServices.slice(0, 3) : servicesData.slice(0, 3));
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent/10 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-16 md:pt-32">
        
        {/* --- 1. MOBILE HEADLINE --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="block lg:hidden text-center mb-8"
        >
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Dicky Galuh <br className="hidden sm:block" />
            <span className="text-gradient-primary">Kurniawan.</span>
          </h1>
        </motion.div>

        {/* --- 2. HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 md:mb-24">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-4 md:space-y-6 order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm w-fit mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-mono tracking-widest text-primary-foreground/80 uppercase">
                Available for Hire
              </span>
            </div>

            <h2 className="text-lg md:text-2xl font-medium text-muted-foreground">
              Hi, I&apos;m <span className="text-foreground font-bold">Iky</span> 👋
            </h2>

            {/* Desktop Headline */}
            <div className="hidden lg:block">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Dicky Galuh <br />
                <span className="text-gradient-primary">Kurniawan.</span>
              </h1>
            </div>

            <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed mx-auto lg:mx-0 font-light">
              Seorang <b>Full Stack Developer</b> yang gemar mengubah ide kompleks menjadi aplikasi web yang cepat, responsif, dan mudah digunakan. 
              Fokus pada kualitas kode dan pengalaman pengguna.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <Button size="lg" className="rounded-full text-base font-bold shadow-lg shadow-primary/20 group h-12 px-8" onClick={() => router.push("/projects")}>
                Explore My Work 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="rounded-full text-base h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white" onClick={() => window.open("/resume.pdf", "_blank")}>
                Download CV <Download className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Social Links */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-muted-foreground relative z-20">
              <SocialLink href="https://github.com/dickygaluhkrnwn" icon={<Github size={20} />} />
              <SocialLink href="https://www.linkedin.com/in/dickygaluhkrnwn/" icon={<Linkedin size={20} />} />
              <SocialLink href="mailto:dicky.galuh.kurniawan1@gmail.com" icon={<Mail size={20} />} />
              <div className="h-px w-8 md:w-12 bg-white/10"></div>
              <span className="text-xs font-mono uppercase tracking-widest">IDN</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end relative mb-6 lg:mb-0"
          >
            {/* Photo Container Frame */}
            <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white/5 bg-[#0a0a0a] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-30 z-10 mix-blend-overlay pointer-events-none" />
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: `url('https://i.imgur.com/VIGw7gw.png')` }} 
              />
              {/* Code Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 z-20 hidden sm:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="space-y-1 font-mono text-[10px] text-gray-400">
                  <p><span className="text-purple-400">const</span> developer = <span className="text-yellow-300">{"{"}</span></p>
                  <p className="pl-2">name: <span className="text-green-300">&quot;Iky&quot;</span>,</p>
                  <p className="pl-2">role: <span className="text-green-300">&quot;FullStack&quot;</span></p>
                  <p><span className="text-yellow-300">{"}"}</span>;</p>
                </div>
              </div>
            </div>
            {/* Decorative Elements behind photo */}
            <div className="absolute -z-10 top-6 -right-6 md:top-10 md:-right-10 w-full h-full border-2 border-primary/20 rounded-3xl -rotate-6" />
          </motion.div>
        </div>

        {/* --- 3. STATS SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 md:py-10 border-y border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm rounded-3xl mb-24 md:mb-32 px-4 md:px-8 shadow-xl"
        >
          <StatItem number="3+" label="Years Exp" />
          <StatItem number={`${projectCount}`} label="Projects Done" />
          <StatItem number="10+" label="Happy Clients" />
          <StatItem number="24/7" label="Support" />
        </motion.div>

        {/* --- 4. FEATURED PROJECTS --- */}
        <div className="mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-widest mb-2">
                <Terminal size={14} /> Selected Works
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white" onClick={() => router.push("/projects")}>
              View All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {featuredProjects.map((project) => (
                <div key={project.id} onClick={() => router.push(`/projects/${project.id}`)} className="cursor-pointer group">
                  <div className="transition-transform duration-500 group-hover:-translate-y-2 h-full">
                    <ProjectCard project={project as any} />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button variant="outline" className="w-full md:hidden mt-8 h-12 rounded-xl bg-white/5 border-white/10" onClick={() => router.push("/projects")}>
            View All Projects <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* --- 5. PREMIUM SERVICES --- */}
        <div className="mb-24 md:mb-32 relative">
          {/* Subtle glow behind services */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-widest mb-2">
                <Layers size={14} /> Digital Solutions
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Premium Services</h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white" onClick={() => router.push("/services")}>
              Explore Marketplace <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-[300px] bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {featuredServices.map((service) => (
                <div 
                  key={service.id} 
                  onClick={() => router.push(`/services/${service.id}`)}
                  className="group flex flex-col rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#0d1117] border-b border-white/5 p-6 flex flex-col justify-between">
                    
                    {/* Render Foto Latar Belakang Jika Ada */}
                    {service.thumbnail && (
                      <img 
                        src={service.thumbnail} 
                        alt={service.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0" 
                      />
                    )}
                    
                    {/* Gradient Overlay Biar Teks Tetep Kelihatan Jelas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/10 z-0 opacity-90" />

                    {/* Abstract tech illustration overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] z-10" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full group-hover:bg-primary/40 transition-colors z-10" />
                    
                    <div className="relative z-20 flex justify-between items-start">
                      <div className="p-3 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:bg-primary/40 group-hover:text-white group-hover:border-primary/50 transition-colors text-gray-300">
                         {service.category === "frontend" ? <Code size={24} /> : 
                          service.category === "backend" ? <Database size={24} /> : 
                          <Globe size={24} />}
                      </div>
                      {service.isFlashSale && (
                        <span className="bg-red-500/20 backdrop-blur-md text-red-400 text-[10px] font-bold px-2 py-1 rounded-md border border-red-500/20 flex items-center gap-1 animate-pulse">
                          <Zap size={10} className="fill-red-400" /> FLASH SALE
                        </span>
                      )}
                    </div>
                    <div className="relative z-20 mt-auto">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest drop-shadow-md">{service.category}</span>
                      <h3 className="text-xl font-heading font-bold text-white group-hover:text-primary transition-colors leading-snug mt-1 line-clamp-2 drop-shadow-md">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-6 font-light">
                      {service.shortDesc}
                    </p>
                    <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Mulai Dari</span>
                        <span className="text-lg font-bold font-mono text-white">{service.price}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-white/10 group-hover:border-primary">
                        <ShoppingCart size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full md:hidden mt-8 h-12 rounded-xl bg-white/5 border-white/10" onClick={() => router.push("/services")}>
            Explore Marketplace <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* --- 6. LATEST INSIGHTS (BLOG) --- */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-widest mb-2">
                <BookOpen size={14} /> Thoughts & Tutorials
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Latest Insights</h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white" onClick={() => router.push("/blog")}>
              Read All Articles <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-[300px] bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-[#111] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]">
                    
                    <div className="h-48 overflow-hidden relative border-b border-white/5 shrink-0">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-white/5" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-90" />
                      {post.tags?.[0] && (
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-mono tracking-widest uppercase border border-white/10">
                          {post.tags[0]}
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <h3 className="text-lg font-bold font-heading mb-3 line-clamp-2 text-white group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed font-light">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-widest mt-auto group-hover:text-white transition-colors">
                        Read Article <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>

                  </article>
                </Link>
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full md:hidden mt-8 h-12 rounded-xl bg-white/5 border-white/10" onClick={() => router.push("/blog")}>
            Read All Articles <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  const isMail = href.startsWith("mailto:");
  return (
    <a 
      href={href} 
      target={isMail ? "_self" : "_blank"} 
      rel={isMail ? undefined : "noopener noreferrer"} 
      className="p-3 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 border border-white/10 hover:border-white active:scale-95"
    >
      {icon}
    </a>
  );
}

function StatItem({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center border-r last:border-0 border-white/5 px-2">
      <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-heading tracking-tight">{number}</div>
      <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-mono">{label}</div>
    </div>
  );
}