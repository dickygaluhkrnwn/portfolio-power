"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button"; 
import { 
  Code2, Database, Globe, Layout, Server, Cpu, Terminal, 
  ArrowRight, Target, Lightbulb, Briefcase, Loader2, GraduationCap, 
  Award, CheckCircle2, Quote, Zap, Box, Star, FileBadge, Link2, Clock,
  ChevronRight, ExternalLink, Building2
} from "lucide-react";
import { getAllProjects } from "@/lib/projects-service"; 
import { Project } from "@/app/data/projects"; 
import { getAllJourneyItems, JourneyItem } from "@/lib/journey-service"; 
import { getAllSkills, SkillItem } from "@/lib/skills-service";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

function SkillProjectsList({ linkedProjects, router }: { linkedProjects: Project[], router: any }) {
  const [expanded, setExpanded] = useState(false);
  const displayedProjects = expanded ? linkedProjects : linkedProjects.slice(0, 2);
  
  return (
    <div className="mt-auto pt-6 border-t border-white/10 space-y-3 relative z-10">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest">
          <Link2 size={12} /> Applied In Case Studies
        </div>
        {linkedProjects.length > 2 && (
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider">
            {expanded ? "Tutup" : `+${linkedProjects.length - 2} Lainnya`}
          </button>
        )}
      </div>
      {displayedProjects.map((proj, idx) => (
        <div key={idx} onClick={() => router.push(`/projects/${proj.id}`)} className="flex gap-3 p-3 rounded-2xl bg-[#050505] border border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)] cursor-pointer transition-all group/miniproj">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 group-hover/miniproj:border-primary/30 transition-colors">
            <img src={proj.image} className="w-full h-full object-cover" alt={proj.title} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h5 className="text-sm font-bold text-white group-hover/miniproj:text-primary transition-colors truncate">{proj.title}</h5>
            <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5" title={proj.desc}>{proj.desc}</p>
          </div>
          <div className="flex items-center justify-center shrink-0 pr-1">
            <ChevronRight size={16} className="text-gray-600 group-hover/miniproj:text-primary group-hover/miniproj:translate-x-1 transition-all" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]); 
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Skills Tab
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>("All");

  useEffect(() => {
    async function loadData() {
      const [projectsData, journeyData, skillsData] = await Promise.all([
        getAllProjects(),
        getAllJourneyItems(),
        getAllSkills()
      ]);
      setProjects(projectsData);
      
      // Sort Journey Items (Newest First by parsing the year)
      const sortedJourney = journeyData.sort((a, b) => {
        const yearA = parseInt(a.year.match(/\d{4}/)?.[0] || "0", 10);
        const yearB = parseInt(b.year.match(/\d{4}/)?.[0] || "0", 10);
        return yearB - yearA;
      });
      setJourneyItems(sortedJourney);
      
      setSkills(skillsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const getProjectDetails = (projectId: string | number) => {
    return projects.find(p => String(p.id) === String(projectId));
  };

  const skillCategories = useMemo(() => {
    if (!skills.length) return ["All"];
    const cats = new Set(skills.map(s => s.category || "Uncategorized"));
    return ["All", ...Array.from(cats)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (activeSkillCategory === "All") return skills;
    return skills.filter(s => (s.category || "Uncategorized") === activeSkillCategory);
  }, [skills, activeSkillCategory]);

  const getJourneyIcon = (type: string) => {
    if (type === "work") return <Briefcase size={20} className="text-blue-400" />;
    if (type === "education") return <GraduationCap size={20} className="text-purple-400" />;
    return <Award size={20} className="text-yellow-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
         <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute top-[0%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container max-w-7xl mx-auto pt-24 pb-16 md:pt-32 px-4 sm:px-6 relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-24 md:mb-32">
          <motion.div 
            initial="hidden" animate="visible" variants={STAGGER_CONTAINER}
            className="text-left max-w-2xl mx-auto lg:mx-0"
          >
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-6">
              <Terminal size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                System.Profile_Loaded
              </span>
            </motion.div>
            
            <motion.h1 variants={FADE_UP} className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              Building Systems. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary/80 animate-gradient bg-300%">
                Scaling Excellence.
              </span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Saya adalah seorang <span className="font-bold text-white">developer</span> dan <span className="font-bold text-white">marketer</span> yang memadukan logika teknis tingkat tinggi dengan intuisi bisnis. Saya tidak hanya menulis kode; saya membangun solusi digital yang mendominasi pasar.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={() => router.push("/services")} size="lg" className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 h-14 px-8 w-full sm:w-auto text-base">
                Lihat Layanan <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button onClick={() => window.location.href='mailto:hello@dickygaluh.com'} variant="outline" size="lg" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-300 font-bold h-14 px-8 w-full sm:w-auto text-base">
                Hubungi Saya
              </Button>
            </motion.div>
          </motion.div>

          {/* Interactive Code Editor Animation */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Background glow behind editor */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl rounded-full" />
            
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[500px] ml-auto rounded-2xl bg-[#09090b]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Window Header */}
              <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="mx-auto flex items-center gap-2">
                  <Code2 size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-400 font-mono">Developer.tsx</span>
                </div>
              </div>
              
              {/* Code Content */}
              <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto text-left">
                <div className="text-pink-400">const <span className="text-blue-400">Profile</span> <span className="text-white">=</span> <span className="text-yellow-300">()</span> <span className="text-pink-400">=&gt;</span> <span className="text-yellow-300">{'{'}</span></div>
                <div className="pl-6 mt-2">
                  <div className="text-gray-400">const <span className="text-white">stats</span> <span className="text-pink-400">=</span> <span className="text-purple-300">{'{'}</span></div>
                  <div className="pl-6"><span className="text-blue-300">projectsBuilt</span>: <span className="text-orange-400">100</span>,</div>
                  <div className="pl-6"><span className="text-blue-300">cupsOfCoffee</span>: <span className="text-green-300">"∞"</span>,</div>
                  <div className="pl-6"><span className="text-blue-300">bugsFixed</span>: <span className="text-orange-400">999</span></div>
                  <div className="text-purple-300">{'}'}</div>
                  <br/>
                  <div className="text-pink-400">return <span className="text-purple-300">(</span></div>
                  <div className="pl-6 text-gray-300">
                    <span className="text-gray-400">&lt;</span><span className="text-green-400">Developer</span><br/>
                    <span className="pl-6 text-blue-300">role</span><span className="text-pink-400">=</span><span className="text-orange-300">"Full Stack Ninja"</span><br/>
                    <span className="pl-6 text-blue-300">passion</span><span className="text-pink-400">=</span><span className="text-orange-300">"Building Scalable UI/UX"</span><br/>
                    <span className="text-gray-400">/&gt;</span>
                  </div>
                  <div className="text-purple-300">)</div>
                </div>
                <div className="text-yellow-300 mt-2">{'}'}</div>
              </div>
            </motion.div>
            
            {/* Floating Elements / Tech Badges */}
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-[#0a0a0a] border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2 size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Clean Code</p>
                <p className="text-sm font-bold text-white">Architecture</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -top-8 -right-4 bg-[#0a0a0a] border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Target size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Marketing</p>
                <p className="text-sm font-bold text-white">Conversion</p>
              </div>
            </motion.div>
          </motion.div>
        </div>


        {/* ================= SKILLS BENTO GRID ================= */}
        <div className="mb-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP} className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">The <span className="text-primary">Power</span> Arsenal</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Koleksi teknologi, API, dan strategi yang saya kuasai untuk membangun mahakarya digital.</p>
          </motion.div>

          <div className="space-y-20 mt-8">
            {skillCategories.filter(cat => cat !== "All").map(cat => {
              const categorySkills = skills.filter(s => (s.category || "Uncategorized") === cat);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={cat} className="relative">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">{cat}</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                  </div>
                  
                  {/* Category Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative group hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 shadow-xl flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                        
                        <div className="flex items-start justify-between mb-5 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
                              {skill.icon ? (
                                 <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                              ) : (
                                 <Box size={24} />
                              )}
                            </div>
                            {skill.isFeatured && (
                              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                                <Star size={10} className="fill-amber-400" /> Featured
                              </div>
                            )}
                          </div>
                          
                          {skill.hasCertificate && (
                            skill.certificateUrl ? (
                              <a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:bg-yellow-500/20 transition-colors cursor-pointer z-20 relative">
                                <FileBadge size={14} /> Certified <ExternalLink size={10} className="ml-0.5" />
                              </a>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.15)] relative z-10">
                                <FileBadge size={14} /> Certified
                              </div>
                            )
                          )}
                        </div>

                        <h4 className="text-2xl font-bold text-white mb-2 relative z-10">{skill.name}</h4>
                        
                        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                          {skill.experienceYears ? (
                            <span className="text-[10px] font-bold bg-white/5 text-gray-300 px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                              {skill.experienceYears} thn Pengalaman
                            </span>
                          ) : null}
                          {skill.proficiency && (
                            <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-500/20 uppercase tracking-wider">
                              {skill.proficiency}
                            </span>
                          )}
                        </div>

                        {skill.description && (
                          <p className="text-sm text-gray-400 mb-6 relative z-10 leading-relaxed line-clamp-3">
                            {skill.description}
                          </p>
                        )}
                        
                        {skill.proficiency && (
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-auto mb-6 relative z-10">
                            <div className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              skill.proficiency === "Advanced" || skill.proficiency === "Professional" || skill.proficiency === "Expert" ? "w-[90%] bg-primary" : 
                              skill.proficiency === "Intermediate" ? "w-[65%] bg-blue-400" : "w-[40%] bg-purple-400"
                            )} />
                          </div>
                        )}

                        {/* Connected Projects (Mini Embedded) */}
                        {(() => {
                          const linkedProjects = projects.filter(p => p.techStack?.some(t => String(t.skillId) === String(skill.id)));
                          if (linkedProjects.length === 0) return null;
                          return <SkillProjectsList linkedProjects={linkedProjects} router={router} />;
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* ================= JOURNEY TIMELINE ================= */}
        <div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP} className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Journey & <span className="text-primary">Milestones</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Perjalanan teknis dan manajerial dari awal karir hingga sekarang.</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* The Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent transform md:-translate-x-1/2" />

            {journeyItems.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={item.id} 
                  className={cn(
                    "relative flex flex-col md:flex-row gap-8 mb-16",
                    isEven ? "md:flex-row-reverse" : ""
                  )}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 md:left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border-2 border-primary/30 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      {getJourneyIcon(item.type)}
                    </div>
                  </div>

                  {/* Empty space for desktop alignment */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content Card */}
                  <div className={cn(
                    "ml-16 md:ml-0 md:w-1/2 relative group",
                    isEven ? "md:pr-12" : "md:pl-12"
                  )}>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                       
                       <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold mb-2">
                         <Clock size={14} /> {item.year}
                       </div>
                       
                       <h3 className="text-2xl font-bold text-white mb-1">{item.role}</h3>
                       <p className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                         <Building2 size={16} /> {item.company}
                       </p>
                       
                       <p className="text-gray-400 text-sm leading-relaxed mb-6">
                         {item.desc}
                       </p>

                       {/* Embedded Case Studies / Projects */}
                       {item.relatedProjects && item.relatedProjects.length > 0 && (
                         <div className="space-y-3 bg-black/20 rounded-2xl p-4 border border-white/5 mt-6">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                             <Link2 size={12} /> Linked Case Studies
                           </div>
                           {item.relatedProjects.map((projId, pIdx) => {
                             const proj = getProjectDetails(projId);
                             if (!proj) return null;
                             return (
                               <div key={pIdx} onClick={() => router.push(`/projects/${proj.id}`)} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-transparent hover:border-primary/30 transition-all group/proj shadow-lg">
                                 <div className="flex items-center gap-3 w-full">
                                   <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover/proj:border-primary/30 transition-colors">
                                     <img src={proj.image} className="w-full h-full object-cover" alt={proj.title} />
                                   </div>
                                   <div className="flex-1 min-w-0 pr-2">
                                     <p className="text-sm font-bold text-white group-hover/proj:text-primary transition-colors truncate">{proj.title}</p>
                                     <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5" title={proj.desc}>{proj.desc}</p>
                                   </div>
                                 </div>
                                 <ExternalLink size={16} className="text-gray-500 group-hover/proj:text-primary shrink-0" />
                               </div>
                             );
                           })}
                         </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}