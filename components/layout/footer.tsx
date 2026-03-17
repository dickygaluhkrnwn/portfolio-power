import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#050505]/80 backdrop-blur-xl relative z-20 mt-10">
      {/* Max-w-7xl biar rata sama semua konten */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
          
          {/* Brand & Status */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-heading text-2xl font-bold text-white tracking-tight">
              IKY<span className="text-primary">.</span>DEV
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              AVAILABLE FOR HIRE
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          </nav>
          
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          
          {/* Copyright & Tech Stack */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs text-gray-500 font-mono">
              &copy; {currentYear} Dicky Galuh Kurniawan. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
              Built with <span className="text-gray-400">Next.js</span> & <span className="text-gray-400">Tailwind</span>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/dickygaluhkrnwn" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com/in/dickygaluhkrnwn" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="mailto:dicky.galuh.kurniawan1@gmail.com" 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );  
}