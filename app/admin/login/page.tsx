"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";

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
      router.push("/admin/dashboard"); // Redirect ke dashboard setelah sukses
    } catch (err: any) {
      setError("Login failed. Check your email/password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-8 bg-secondary/10 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-heading font-bold">Admin Access</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your credentials to manage projects.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}