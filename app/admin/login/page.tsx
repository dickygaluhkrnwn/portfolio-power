"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard"); 
    } catch (err: any) {
      setError("Akses Ditolak. Periksa kembali email atau sandi Anda.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-foreground p-4 relative overflow-hidden selection:bg-primary/30 selection:text-white">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-clip">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0a0a0a]/80 p-8 md:p-10 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary mb-6 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] border border-primary/20 relative"
          >
            <ShieldAlert size={28} className="relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md -z-10 animate-pulse" />
          </motion.div>
          
          <h2 className="text-3xl font-heading font-bold mb-2 text-white">System<span className="text-primary font-light">Admin</span></h2>
          <p className="text-gray-400 text-sm font-mono tracking-widest uppercase mt-2">
            Command Center Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Alamat Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-700 text-white font-medium text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dickygaluh.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Kata Sandi</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-700 text-white font-medium text-sm tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="text-red-400 text-xs font-medium text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center justify-center gap-2">
                  <Lock size={14} className="shrink-0" /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 mt-6 group rounded-xl" 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Otorisasi Masuk <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
        
        {/* Footer Text */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 font-mono">
            &copy; {new Date().getFullYear()} IKY.DEV. ALL RIGHTS RESERVED.
          </p>
        </div>
      </motion.div>
    </div>
  );
}