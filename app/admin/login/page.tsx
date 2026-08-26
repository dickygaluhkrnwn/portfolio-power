"use client";

import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, ArrowRight, ShieldAlert, Fingerprint } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Animasi Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  // Mouse tracking for background glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard"); 
    } catch (err: any) {
      setError("Akses Ditolak. Periksa kembali identitas Anda.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-foreground p-4 relative overflow-hidden selection:bg-primary/30 selection:text-white">
      
      {/* --- DYNAMIC BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Mouse Follower Glow (mengikuti kursor user) */}
        <motion.div 
          className="absolute w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] mix-blend-screen hidden md:block"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 1.5 }}
        />
        
        {/* Floating Orbs */}
        <motion.div 
          animate={{ 
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            y: [0, 50, 0],
            x: [0, -30, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen" 
        />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{ perspective: 1000 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 via-purple-500/20 to-blue-500/50 rounded-[2.5rem] blur-xl opacity-20 animate-pulse" />
        
        <div className="bg-[#0a0a0a]/90 p-8 md:p-10 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          {/* Cyberpunk accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="text-center mb-10 relative">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2, duration: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#111] to-[#050505] text-primary mb-6 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] border border-primary/20 relative group overflow-hidden"
            >
              <Fingerprint size={36} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
              
              {/* Scanning effect */}
              <motion.div 
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-primary/50 shadow-[0_0_10px_rgba(99,102,241,1)] z-20"
              />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-heading font-bold mb-2 text-white tracking-tight"
            >
              SYSTEM<span className="text-primary font-light">ACCESS</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-500 text-xs font-mono tracking-[0.3em] uppercase mt-2 flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Restricted Area
            </motion.p>
          </div>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleLogin} 
            className="space-y-5"
          >
            <motion.div variants={itemVariants} className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-primary transition-colors">Identification (Email)</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-primary/5 outline-none transition-all placeholder:text-gray-700 text-white font-medium text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dickygaluh.com"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-primary transition-colors">Passcode</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-primary/5 outline-none transition-all placeholder:text-gray-700 text-white font-medium text-sm tracking-widest shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 text-red-400 text-xs font-medium text-center bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 flex items-center justify-center gap-2">
                    <ShieldAlert size={14} className="shrink-0 animate-pulse" /> {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-14 text-sm tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all group rounded-xl bg-primary hover:bg-primary/90 text-white relative overflow-hidden" 
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <span className="flex items-center gap-2 relative z-10">
                    AUTHORIZE ENTRY <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.form>
          
          {/* Footer Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-6 border-t border-white/5 text-center"
          >
            <p className="text-[9px] text-gray-600 font-mono tracking-widest flex items-center justify-center gap-2">
              <Lock size={10} /> SECURE CONNECTION ESTABLISHED
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}