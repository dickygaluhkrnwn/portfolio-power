"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import { getAllSocials, SocialLink } from "@/lib/socials-service";
import { 
  Github, Linkedin, Twitter, Facebook, Instagram, Youtube, 
  Music, PenTool, Globe, Mail, ArrowUpRight, Code,
  CheckCircle2, BookOpen, Users, MapPin, Building, Calendar, 
  Send, Loader2, Briefcase, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- INTERFACES ---
interface GithubData {
  login: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  avatar_url: string;
  html_url: string;
  location: string;
  company: string;
  created_at: string;
}

// Helper untuk memilih icon
const getIcon = (platform: string, className?: string) => {
  const p = platform.toLowerCase();
  const props = { className: className || "w-5 h-5" };
  
  if (p.includes("github")) return <Github {...props} />;
  if (p.includes("linkedin")) return <Linkedin {...props} />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter {...props} />;
  if (p.includes("facebook")) return <Facebook {...props} />;
  if (p.includes("instagram")) return <Instagram {...props} />;
  if (p.includes("youtube")) return <Youtube {...props} />;
  if (p.includes("soundcloud") || p.includes("myspace")) return <Music {...props} />;
  if (p.includes("medium") || p.includes("tumblr") || p.includes("dribbble") || p.includes("behance")) return <PenTool {...props} />;
  if (p.includes("qwiklabs") || p.includes("leetcode") || p.includes("hackerrank")) return <Code {...props} />;
  return <Globe {...props} />;
};

// Animasi Config
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const popItem: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export default function ContactPage() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState<GithubData | null>(null);
  const [activeCategory, setActiveCategory] = useState("Professional");
  
  // Parallax ref
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const githubUsername = "dickygaluhkrnwn";
  const myEmail = "dicky.galuh.kurniawan1@gmail.com";

  useEffect(() => {
    // 1. Fetch Socials
    getAllSocials()
      .then(socialsData => {
        setSocials(socialsData.filter(s => s.active !== false));
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data Socials:", error);
        setLoading(false);
      });

    // 2. Fetch GitHub (berjalan paralel, tidak menunggu Socials selesai)
    fetch(`https://api.github.com/users/${githubUsername}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("GitHub API Error");
      })
      .then(data => setGithubData(data))
      .catch(error => console.error("Gagal mengambil data GitHub:", error));
  }, [githubUsername]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman form (Nanti bisa diganti API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const groupedSocials = [
    { 
      title: "Professional", 
      icon: <Briefcase className="w-4 h-4 text-blue-400" />, 
      items: socials.filter(s => s.category === "professional") 
    },
    { 
      title: "Creative", 
      icon: <PenTool className="w-4 h-4 text-purple-400" />, 
      items: socials.filter(s => s.category === "creative") 
    },
    { 
      title: "Social & Others", 
      icon: <Globe className="w-4 h-4 text-rose-400" />, 
      items: socials.filter(s => s.category === "social" || s.category === "other" || !s.category) 
    },
  ];

  const joinDate = githubData?.created_at 
    ? new Date(githubData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30 selection:text-white pb-24">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ y: yParallax }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_70%,transparent_100%)]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" 
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-32 relative z-10 flex flex-col gap-24">
        
        {/* --- 1. HERO: GITHUB LIVE BANNER --- */}
        <div className="w-full relative">
          {/* Badge Absolute di atas banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs font-mono text-gray-200"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </span>
            LIVE DEVELOPER METRICS
          </motion.div>

          <AnimatePresence mode="wait">
            {githubData ? (
              <motion.a 
                key="github-card"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1, delayChildren: 0.1 }
                  }
                }}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                href={githubData.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block relative rounded-3xl md:rounded-[2.5rem] bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_80px_-20px_rgba(99,102,241,0.4)] shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-[80px] pointer-events-none group-hover:from-primary/20 transition-colors duration-700" />
                
                <div className="p-8 md:p-12 relative z-10">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    
                    {/* Floating Avatar */}
                    <motion.div 
                      variants={popItem}
                      className="relative shrink-0"
                    >
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117] relative z-10 p-1 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-500">
                        <img src={githubData.avatar_url} alt={githubData.login} className="w-full h-full object-cover rounded-[1.75rem] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700" />
                      </div>
                      {/* Glow behind avatar */}
                      <div className="absolute inset-0 bg-primary/40 blur-3xl rounded-full -z-10 group-hover:bg-primary/60 animate-pulse transition-colors duration-500" />
                    </motion.div>

                    {/* Core Identity */}
                    <div className="flex-1 mt-2 md:mt-0">
                      <motion.h1 variants={slideUp} className="text-3xl md:text-5xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 font-heading tracking-tight flex items-center justify-center md:justify-start gap-3">
                        {githubData.name || githubData.login}
                        <Sparkles className="w-6 h-6 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity" />
                      </motion.h1>
                      <motion.p variants={slideUp} className="text-primary/80 font-mono text-sm md:text-base mb-6 flex items-center justify-center md:justify-start gap-2">
                        <Github className="w-4 h-4" /> @{githubData.login}
                      </motion.p>
                      
                      {githubData.bio && (
                        <motion.p variants={slideUp} className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mb-8 font-light">
                          {githubData.bio}
                        </motion.p>
                      )}

                      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-gray-500 font-medium">
                        {githubData.location && (
                          <motion.div variants={popItem} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><MapPin className="w-4 h-4 text-emerald-400" /> {githubData.location}</motion.div>
                        )}
                        {githubData.company && (
                          <motion.div variants={popItem} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><Building className="w-4 h-4 text-blue-400" /> {githubData.company}</motion.div>
                        )}
                        <motion.div variants={popItem} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><Calendar className="w-4 h-4 text-purple-400" /> Joined {joinDate}</motion.div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 md:my-10" />

                  {/* Stats */}
                  <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory -mx-8 px-8 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {[
                      { label: "REPOSITORIES", value: githubData.public_repos, icon: <BookOpen className="w-4 h-4 text-blue-400"/> },
                      { label: "FOLLOWERS", value: githubData.followers, icon: <Users className="w-4 h-4 text-emerald-400"/> },
                      { label: "FOLLOWING", value: githubData.following, icon: <ArrowUpRight className="w-4 h-4 text-purple-400"/> },
                      { label: "GISTS", value: githubData.public_gists, icon: <Code className="w-4 h-4 text-orange-400"/> },
                    ].map((stat, i) => (
                      <motion.div key={i} variants={popItem} whileHover={{ y: -5 }} className="w-[140px] shrink-0 snap-center md:w-auto flex flex-col items-center md:items-start p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 group-hover:border-white/10 group-hover:bg-white/[0.06] transition-all relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity scale-150 text-white">
                          {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-white mb-2 font-heading tracking-tight drop-shadow-md">{stat.value}</div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest flex items-center gap-1.5">{stat.icon} {stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.a>
            ) : (
              // Loading State for Banner
              <motion.div 
                key="loading-banner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[400px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10" 
              />
            )}
          </AnimatePresence>
        </div>

        {/* --- 2. THE DIRECTORY (3-COLUMN GRID CATEGORIZED) --- */}
        <section className="w-full">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <motion.h2 variants={slideUp} className="text-2xl md:text-4xl font-bold font-heading text-white tracking-tight flex items-center gap-3">
                Social Directory
                <div className="h-1 flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4 rounded-full" />
              </motion.h2>
              <motion.span variants={popItem} className="text-sm font-mono text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
                {loading ? "..." : socials.length} Hubs
              </motion.span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="w-full h-[300px] bg-white/5 rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <>
                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
                  {groupedSocials.map((group, groupIdx) => (
                    <motion.div 
                      key={group.title} 
                      variants={slideUp}
                      whileHover={{ y: -5 }}
                      className="flex flex-col bg-gradient-to-b from-[#0a0a0a] to-black rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden group/card"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none group-hover/card:bg-white/10 transition-colors" />
                      
                      {/* Category Header */}
                      <h3 className="text-sm font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-white/5 relative z-10">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                          {group.icon}
                        </div>
                        <span className="uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">{group.title}</span>
                      </h3>

                      {/* Category Links */}
                      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" className="flex flex-col gap-3 relative z-10">
                        {group.items.length === 0 ? (
                          <p className="text-sm text-gray-600 italic text-center py-8">Belum ada tautan.</p>
                        ) : (
                          group.items.map((item) => (
                            <motion.a 
                              variants={popItem}
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] rounded-2xl transition-all duration-300"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                  {getIcon(item.platform, "w-4 h-4")}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors truncate">
                                    {item.platform}
                                  </span>
                                  <span className="text-[10px] font-mono text-gray-500 truncate group-hover:text-gray-400 mt-0.5">
                                    {item.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                  </span>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                              </div>
                            </motion.a>
                          ))
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* --- MOBILE LAYOUT: APP STORE STYLE ROWS --- */}
                <div className="md:hidden flex flex-col gap-10">
                  {groupedSocials.map((group) => (
                    <div key={group.title} className="flex flex-col gap-4">
                      {/* Section Header */}
                      <div className="flex items-center gap-3 px-1">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner text-white">
                          {group.icon}
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{group.title}</h3>
                      </div>
                      
                      {/* Swipeable Horizontal Cards */}
                      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {group.items.length === 0 ? (
                          <div className="w-[70vw] shrink-0 snap-center p-6 border border-dashed border-white/10 rounded-3xl flex items-center justify-center bg-white/[0.01]">
                            <span className="text-xs text-gray-600 italic">Belum ada tautan.</span>
                          </div>
                        ) : (
                          group.items.map((item) => (
                            <a 
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex flex-col w-[60vw] sm:w-[45vw] shrink-0 snap-center p-5 bg-gradient-to-b from-[#111] to-black border border-white/10 hover:border-white/20 rounded-[1.5rem] active:scale-95 transition-all shadow-xl relative overflow-hidden"
                            >
                              {/* Abstract Glow */}
                              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full pointer-events-none transition-colors group-hover:bg-primary/20" />
                              
                              <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="w-12 h-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 shadow-inner">
                                  {getIcon(item.platform, "w-6 h-6")}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                                  <ArrowUpRight className="w-4 h-4 group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                              
                              <div className="flex flex-col mt-auto relative z-10">
                                <span className="font-bold text-base text-gray-200 group-hover:text-white truncate mb-1 transition-colors">
                                  {item.platform}
                                </span>
                                <span className="text-[10px] text-gray-500 truncate font-mono">
                                  {item.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </span>
                              </div>
                            </a>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </section>

        {/* --- 3. CONTACT FORM (SPLIT PREMIUM LAYOUT) --- */}
        <section className="w-full mb-10">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={slideUp} className="text-2xl md:text-4xl font-bold font-heading text-white tracking-tight px-2 mb-8 text-center md:text-left flex items-center gap-3">
              Direct Message
              <div className="h-1 flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4 rounded-full hidden md:block" />
            </motion.h2>

            <motion.div variants={slideUp} className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-[2.5rem] p-8 md:p-12 transition-colors shadow-2xl relative overflow-hidden group/form">
              {/* Abstract bg in form */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover/form:bg-primary/20 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

              <div className="flex flex-col md:flex-row gap-12 lg:gap-16 relative z-10">
                
                {/* Kolom Kiri: Copywriting & Context */}
                <div className="md:w-5/12 flex flex-col">
                  <motion.h3 variants={slideUp} className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
                    Got an idea? <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Let's build it.</span>
                  </motion.h3>
                  <motion.p variants={slideUp} className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-light">
                    Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang kolaborasi. Pesan Anda akan langsung masuk ke <i className="text-primary/80 font-medium not-italic">inbox</i> pribadi saya.
                  </motion.p>
                  
                  {/* Contact Info Detail */}
                  <motion.div variants={popItem} className="mt-auto flex flex-col gap-5 bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-inner">
                    <div className="flex items-center gap-4 text-sm text-gray-300 font-medium group cursor-pointer hover:text-white transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all shadow-inner">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <span className="truncate">{myEmail}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300 font-medium group cursor-pointer hover:text-white transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all shadow-inner">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span>Indonesia (IDN)</span>
                    </div>
                  </motion.div>
                </div>

                {/* Kolom Kanan: The Form Inputs */}
                <div className="md:w-7/12 flex flex-col gap-4">
                  
                  {/* MOBILE NATIVE: Giant WhatsApp Button */}
                  <div className="md:hidden w-full mb-2">
                    <a 
                      href="https://wa.me/6285904320201?text=Halo%20Dicky,%20saya%20tertarik%20untuk%20diskusi%20project..." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-5 rounded-[1.5rem] shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 transition-transform"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      Chat via WhatsApp
                    </a>
                    
                    <div className="flex items-center gap-4 my-6 opacity-60">
                      <div className="h-px bg-white/20 flex-1" />
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Atau via Email</span>
                      <div className="h-px bg-white/20 flex-1" />
                    </div>
                  </div>

                  <motion.form variants={staggerContainer} initial="hidden" animate="show" onSubmit={handleFormSubmit} className="flex flex-col gap-4 md:gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <motion.div variants={slideUp} className="space-y-2 group">
                        <label htmlFor="name" className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-primary transition-colors">Name</label>
                        <input 
                          id="name"
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 px-4 md:px-5 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-white focus:outline-none focus:border-primary focus:bg-white/5 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all placeholder:text-gray-700 text-sm shadow-inner"
                          placeholder="John Doe"
                        />
                      </motion.div>
                      <motion.div variants={slideUp} className="space-y-2 group">
                        <label htmlFor="email" className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-primary transition-colors">Email</label>
                        <input 
                          id="email"
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 px-4 md:px-5 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-white focus:outline-none focus:border-primary focus:bg-white/5 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all placeholder:text-gray-700 text-sm shadow-inner"
                          placeholder="john@example.com"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div variants={slideUp} className="space-y-2 group">
                      <label htmlFor="message" className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-primary transition-colors">Message</label>
                      <textarea 
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 px-4 md:px-5 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-white focus:outline-none focus:border-primary focus:bg-white/5 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all resize-none placeholder:text-gray-700 text-sm shadow-inner"
                        placeholder="Tell me about your project or idea..."
                      />
                    </motion.div>

                    <motion.div variants={popItem} className="pt-2 md:pt-4 flex justify-end">
                      <AnimatePresence mode="wait">
                        {isSuccess ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full md:w-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-6 md:px-8 flex items-center justify-center gap-3 text-xs md:text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          >
                            <CheckCircle2 className="w-5 h-5" /> Message Sent Successfully
                          </motion.div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 md:py-4 px-8 md:px-10 rounded-xl md:rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed text-xs md:text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] uppercase tracking-widest overflow-hidden relative group/btn"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> Authorizing...
                              </>
                            ) : (
                              <>
                                Transmit <Send className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              </>
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.form>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}