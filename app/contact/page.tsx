"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { getAllSocials, SocialLink } from "@/lib/socials-service";
import { 
  Github, Linkedin, Twitter, Facebook, Instagram, Youtube, 
  Music, PenTool, Globe, Mail, ArrowUpRight, Code,
  CheckCircle2, BookOpen, Users, MapPin, Building, Calendar, 
  Send, Loader2
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
  if (p.includes("medium") || p.includes("tumblr")) return <PenTool {...props} />;
  if (p.includes("qwiklabs")) return <Code {...props} />;
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
      setSocials(socialsData);
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
    
    // Simulasi pengiriman form
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const categories = {
    professional: socials.filter(s => s.category === "professional"),
    creative: socials.filter(s => s.category === "creative"),
    social: socials.filter(s => s.category === "social" || s.category === "other"),
  };

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

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 pt-32 relative z-10 flex flex-col gap-20">
        
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
              className="group block relative rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-visible transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_50px_-15px_rgba(99,102,241,0.3)]"
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  
                  {/* Floating Avatar */}
                  <div className="relative -mt-16 md:-mt-20 shrink-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-[#0a0a0a] shadow-2xl bg-[#0d1117] relative z-10">
                      <img src={githubData.avatar_url} alt={githubData.login} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    {/* Glow behind avatar */}
                    <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full -z-10 group-hover:bg-primary/60 transition-colors duration-500" />
                  </div>

                  {/* Core Identity */}
                  <div className="flex-1 mt-2 md:mt-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {githubData.name || githubData.login}
                    </h1>
                    <p className="text-primary/80 font-mono text-sm md:text-base mb-4">@{githubData.login}</p>
                    
                    {githubData.bio && (
                      <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
                        {githubData.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-gray-400 font-medium">
                      {githubData.location && (
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" /> {githubData.location}</div>
                      )}
                      {githubData.company && (
                        <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-500" /> {githubData.company}</div>
                      )}
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> Joined {joinDate}</div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-3xl font-bold text-white mb-1">{githubData.public_repos}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5"/> REPOSITORIES</div>
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-3xl font-bold text-white mb-1">{githubData.followers}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> FOLLOWERS</div>
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-3xl font-bold text-white mb-1">{githubData.following}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5"/> FOLLOWING</div>
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-3xl font-bold text-white mb-1">{githubData.public_gists}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-1.5"><Code className="w-3.5 h-3.5"/> GISTS</div>
                  </div>
                </div>
              </div>
            </a>
          ) : (
            // Loading State for Banner
            <div className="w-full h-[400px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
          )}
        </motion.div>

        {/* --- 2. THE DIRECTORY (SLEEK LIST LAYOUT) --- */}
        <section className="w-full max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-mono text-gray-500 mb-6 uppercase tracking-widest px-2">
                Social Directory
              </h2>
              
              <div className="flex flex-col">
                {socials.map((item, index) => (
                  <a 
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group flex items-center justify-between py-5 px-4 md:px-6 
                      transition-all duration-300 hover:bg-white/[0.03] rounded-xl
                      ${index !== socials.length - 1 ? 'border-b border-white/5 hover:border-white/10' : 'border-b border-transparent'}
                    `}
                  >
                    {/* Left: Icon + Name */}
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="text-gray-400 group-hover:text-primary transition-colors duration-300">
                        {getIcon(item.platform)}
                      </div>
                      <span className="font-semibold text-lg text-gray-200 group-hover:text-white transition-colors truncate">
                        {item.platform}
                      </span>
                    </div>

                    {/* Right: URL + Arrow */}
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <span className="hidden sm:block text-sm font-mono text-gray-500 group-hover:text-gray-300 transition-colors max-w-[200px] md:max-w-xs truncate">
                        {item.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        {/* --- 3. CONTACT FORM (SPLIT PREMIUM LAYOUT) --- */}
        <section className="w-full max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-mono text-gray-500 mb-6 uppercase tracking-widest px-2">
              Direct Message
            </h2>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 transition-colors hover:border-white/20 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
                
                {/* Kolom Kiri: Copywriting & Context */}
                <div className="md:w-5/12 flex flex-col">
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    Got an idea? <br/>
                    <span className="text-gray-500">Let's build it.</span>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang kolaborasi. Pesan Anda akan langsung masuk ke <i className="text-gray-200 font-medium not-italic">inbox</i> pribadi saya.
                  </p>
                  
                  {/* Contact Info Detail */}
                  <div className="mt-auto flex flex-col gap-5">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="truncate">{myEmail}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-gray-300" />
                      </div>
                      <span>Indonesia (IDN)</span>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: The Form Inputs */}
                <div className="md:w-7/12">
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Name</label>
                        <input 
                          id="name"
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 px-0 py-2.5 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-700 text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Email</label>
                        <input 
                          id="email"
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-transparent border-b border-white/10 px-0 py-2.5 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-700 text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Message</label>
                      <textarea 
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-white/10 px-0 py-2.5 text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-700 text-sm"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <div className="pt-6">
                      <AnimatePresence mode="wait">
                        {isSuccess ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-medium"
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
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-semibold py-3.5 px-8 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
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