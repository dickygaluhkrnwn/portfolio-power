"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  icon?: React.ReactNode;
  className?: string;
  color?: string; // Hex color for glow effect
}

export function TechBadge({ name, icon, className, color = "#6366f1" }: TechBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-white/5 cursor-default overflow-hidden group",
        className
      )}
    >
      {/* Background Glow on Hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, ${color}00, ${color})` }}
      />
      
      {/* Icon */}
      {icon && <span className="relative z-10 text-foreground/80 group-hover:text-white transition-colors">{icon}</span>}
      
      {/* Text */}
      <span className="relative z-10 text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
        {name}
      </span>
    </motion.div>
  );
}