"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Definisi varian style tombol
const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-primary/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent/50",
  ghost: "hover:bg-accent/10 hover:text-accent",
  link: "text-primary underline-offset-4 hover:underline",
  // Tambahkan varian destructive di sini
  destructive: "bg-red-500 text-white hover:bg-red-600 border border-red-600/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-12 rounded-md px-8 text-lg",
  icon: "h-10 w-10",
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
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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