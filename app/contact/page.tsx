"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { getAllSocials, SocialLink } from "@/lib/socials-service";
import { 
  Github, Linkedin, Twitter, Facebook, Instagram, Youtube, 
  Music, PenTool, Globe, Mail, ArrowUpRight, Code,
  CheckCircle2, BookOpen, Users, MapPin, Building, Calendar, 
  Send, Loader2, Briefcase
} from "lucide-react";

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

export default function ContactPage() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState<GithubData | null>(null);
  
  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const githubUsername = "dickygaluhkrnwn";
  const myEmail = "dicky.galuh.kurniawan1@gmail.com";

  useEffect(() => {
    async function loadData() {
      const socialsData = await getAllSocials();
      // Hanya tampilkan yang status active-nya true di halaman publik
      setSocials(socialsData.filter(s => s.active !== false));
      setLoading(false);

      try {
        const res = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (res.ok) {
          const data = await res.json();
          setGithubData(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data GitHub:", error);
      }
    }
    loadData();
  }, [githubUsername]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman form (Nanti bisa lu ganti dengan integrasi EmailJS / API beneran)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    
    setTimeout(() => setIsSuccess(false), 5000);
  };

  // Mengkategorikan data untuk Grid Layout
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
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* Diubah menjadi max-w-7xl agar seragam dengan Projects & Services */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-32 relative z-10 flex flex-col gap-24">
        
        {/* --- 1. HERO: GITHUB LIVE BANNER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full relative"
        >
          {/* Badge Absolute di atas banner */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-xl text-xs font-mono text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE DEVELOPER METRICS
          </div>

          {githubData ? (
            <a 
              href={githubData.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block relative rounded-3xl bg-[#0a0a0a] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_50px_-15px_rgba(99,102,241,0.3)] shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
              
              <div className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  
                  {/* Floating Avatar */}
                  <div className="relative shrink-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117] relative z-10 p-1">
                      <img src={githubData.avatar_url} alt={githubData.login} className="w-full h-full object-cover rounded-[1.75rem] group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    {/* Glow behind avatar */}
                    <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full -z-10 group-hover:bg-primary/60 transition-colors duration-500" />
                  </div>

                  {/* Core Identity */}
                  <div className="flex-1 mt-2 md:mt-0">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 font-heading tracking-tight">
                      {githubData.name || githubData.login}
                    </h1>
                    <p className="text-primary/80 font-mono text-sm md:text-base mb-6">@{githubData.login}</p>
                    
                    {githubData.bio && (
                      <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mb-8 font-light">
                        {githubData.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-gray-500 font-medium">
                      {githubData.location && (
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-600" /> {githubData.location}</div>
                      )}
                      {githubData.company && (
                        <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-600" /> {githubData.company}</div>
                      )}
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-600" /> Joined {joinDate}</div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 my-8 md:my-10" />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                    <div className="text-3xl font-bold text-white mb-1 font-heading">{githubData.public_repos}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5"/> REPOSITORIES</div>
                  </div>
                  <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                    <div className="text-3xl font-bold text-white mb-1 font-heading">{githubData.followers}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> FOLLOWERS</div>
                  </div>
                  <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                    <div className="text-3xl font-bold text-white mb-1 font-heading">{githubData.following}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5"/> FOLLOWING</div>
                  </div>
                  <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                    <div className="text-3xl font-bold text-white mb-1 font-heading">{githubData.public_gists}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><Code className="w-3.5 h-3.5"/> GISTS</div>
                  </div>
                </div>
              </div>
            </a>
          ) : (
            // Loading State for Banner
            <div className="w-full h-[400px] bg-white/5 rounded-[2rem] animate-pulse border border-white/10" />
          )}
        </motion.div>

        {/* --- 2. THE DIRECTORY (3-COLUMN GRID CATEGORIZED) --- */}
        <section className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
                Social Directory
              </h2>
              <span className="text-sm font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                {loading ? "..." : socials.length} Hubs
              </span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="w-full h-[300px] bg-white/5 rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {groupedSocials.map((group) => (
                  <div key={group.title} className="flex flex-col bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 shadow-xl">
                    {/* Category Header */}
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        {group.icon}
                      </div>
                      <span className="uppercase tracking-widest">{group.title}</span>
                    </h3>

                    {/* Category Links */}
                    <div className="flex flex-col gap-3">
                      {group.items.length === 0 ? (
                        <p className="text-sm text-gray-600 italic text-center py-8">Belum ada tautan.</p>
                      ) : (
                        group.items.map((item) => (
                          <a 
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] rounded-2xl transition-all duration-300"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all shrink-0 shadow-inner">
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
                            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        {/* --- 3. CONTACT FORM (SPLIT PREMIUM LAYOUT) --- */}
        <section className="w-full mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight px-2 mb-8 text-center md:text-left">
              Send a Direct Message
            </h2>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 transition-colors hover:border-white/20 shadow-2xl relative overflow-hidden">
              {/* Abstract bg in form */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

              <div className="flex flex-col md:flex-row gap-12 lg:gap-16 relative z-10">
                
                {/* Kolom Kiri: Copywriting & Context */}
                <div className="md:w-5/12 flex flex-col">
                  <h3 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    Got an idea? <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">Let's build it.</span>
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-light">
                    Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang kolaborasi. Pesan Anda akan langsung masuk ke <i className="text-gray-200 font-medium not-italic">inbox</i> pribadi saya.
                  </p>
                  
                  {/* Contact Info Detail */}
                  <div className="mt-auto flex flex-col gap-5 bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <span className="truncate">{myEmail}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span>Indonesia (IDN)</span>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: The Form Inputs */}
                <div className="md:w-7/12">
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-[11px] font-mono text-gray-500 uppercase tracking-widest pl-1">Name</label>
                        <input 
                          id="name"
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-primary focus:bg-white/5 transition-all placeholder:text-gray-700 text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-[11px] font-mono text-gray-500 uppercase tracking-widest pl-1">Email</label>
                        <input 
                          id="email"
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-primary focus:bg-white/5 transition-all placeholder:text-gray-700 text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-[11px] font-mono text-gray-500 uppercase tracking-widest pl-1">Message</label>
                      <textarea 
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-primary focus:bg-white/5 transition-all resize-none placeholder:text-gray-700 text-sm"
                        placeholder="Tell me about your project or idea..."
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <AnimatePresence mode="wait">
                        {isSuccess ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full md:w-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl py-3.5 px-8 flex items-center justify-center gap-2 text-sm font-bold tracking-wide"
                          >
                            <CheckCircle2 className="w-5 h-5" /> Message Sent Successfully
                          </motion.div>
                        ) : (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 px-10 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-xl shadow-white/5"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                              </>
                            ) : (
                              <>
                                Send Message <Send className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}