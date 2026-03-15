"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Definisi varian style tombol (Di-upgrade untuk Dark Theme Premium)
const variants = {
  primary: "bg-primary text-white hover:brightness-110 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] border border-primary/50",
  secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-sm",
  outline: "border border-white/10 bg-transparent hover:bg-white/5 hover:text-white text-gray-300 backdrop-blur-sm",
  ghost: "hover:bg-white/5 hover:text-white text-gray-400 transition-colors",
  link: "text-primary underline-offset-4 hover:underline",
  destructive: "bg-red-500/90 text-white hover:bg-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
};

const sizes = {
  default: "h-10 px-5 py-2 min-h-[44px]", 
  sm: "h-9 rounded-lg px-4 min-h-[36px]",
  lg: "h-12 rounded-xl px-8 text-base min-h-[48px]",
  icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }} // Feedback visual saat ditekan (lebih smooth)
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:pointer-events-none disabled:opacity-50 select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };