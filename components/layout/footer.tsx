"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

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

const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="w-full relative overflow-hidden bg-black mt-20 border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-[100%] blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8 md:pb-10 relative z-10"
      >
        
        {/* 1. GIANT CTA AREA */}
        <div className="flex flex-col items-center justify-center text-center mb-20 md:mb-32 group cursor-pointer">
          <Link href="/contact" className="block w-full">
            <motion.div variants={slideUp} className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-6 md:mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs md:text-sm font-mono text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">
                  Available for new opportunities
                </span>
              </div>
              
              {/* Desktop Giant Text */}
              <h2 className="hidden md:block text-[6rem] lg:text-[8rem] leading-[0.9] font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 group-hover:from-primary group-hover:to-indigo-500 transition-all duration-500">
                LET'S WORK
              </h2>
              <h2 className="hidden md:flex items-center justify-center gap-6 text-[6rem] lg:text-[8rem] leading-[0.9] font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 group-hover:from-primary group-hover:to-indigo-500 transition-all duration-500">
                TOGETHER <ArrowUpRight className="w-20 h-20 text-primary group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:rotate-12 transition-all duration-500" />
              </h2>

              {/* Mobile Stacked Text */}
              <div className="md:hidden flex flex-col items-center gap-0">
                <h2 className="text-6xl sm:text-7xl leading-[0.9] font-black font-heading tracking-tighter text-white">
                  HAVE AN
                </h2>
                <h2 className="text-6xl sm:text-7xl leading-[0.9] font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500 flex items-center gap-2">
                  IDEA? <ArrowUpRight className="w-12 h-12 text-primary" />
                </h2>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* 2. DIRECTORY & INFO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Brand Col */}
          <motion.div variants={slideUp} className="md:col-span-5 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <span className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-1">
              IKY<span className="text-primary">.</span>DEV
            </span>
            <p className="text-gray-400 text-sm md:text-base max-w-sm font-light leading-relaxed">
              Crafting premium digital experiences through modern web technologies, thoughtful design, and robust architectures.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://github.com/dickygaluhkrnwn" target="_blank" rel="noreferrer" className="w-12 h-12 md:w-10 md:h-10 rounded-[1rem] md:rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all hover:scale-110 shadow-inner">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/dickygaluhkrnwn" target="_blank" rel="noreferrer" className="w-12 h-12 md:w-10 md:h-10 rounded-[1rem] md:rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all hover:scale-110 shadow-inner">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:dicky.galuh.kurniawan1@gmail.com" className="w-12 h-12 md:w-10 md:h-10 rounded-[1rem] md:rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all hover:scale-110 shadow-inner">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Links Col (Desktop Grid, Mobile List Group) */}
          <motion.div variants={slideUp} className="md:col-span-7 flex flex-col md:flex-row justify-center md:justify-end gap-10 md:gap-20">
            
            {/* Navigation */}
            <div className="flex flex-col items-center md:items-start w-full md:w-auto">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Navigation</h4>
              
              {/* Mobile List Group */}
              <div className="w-full flex flex-col md:hidden bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                {navLinks.map((link, idx) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-colors active:bg-white/10 text-sm font-bold text-gray-300",
                      idx !== navLinks.length - 1 ? "border-b border-white/5" : ""
                    )}
                  >
                    {link.name}
                    <ArrowUpRight className="w-4 h-4 text-gray-600" />
                  </Link>
                ))}
              </div>

              {/* Desktop Grid Links */}
              <div className="hidden md:flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm font-medium group flex items-center gap-2"
                  >
                    <span className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

          </motion.div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
            &copy; {currentYear} Dicky Galuh Kurniawan. 
            <span className="hidden md:inline">All rights reserved.</span>
          </p>
          <p className="text-[10px] text-gray-600 font-mono flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            Built with <span className="text-gray-300 font-bold">Next.js</span> & <span className="text-gray-300 font-bold">Tailwind</span>
          </p>
        </div>

      </motion.div>
    </footer>
  );
}