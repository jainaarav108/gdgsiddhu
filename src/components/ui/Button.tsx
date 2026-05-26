"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "neon";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, glow, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stadium-black disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

    const variants = {
      primary:
        "bg-gradient-to-r from-ipl-primary to-blue-500 text-white hover:from-blue-600 hover:to-blue-400 focus:ring-blue-500 shadow-neon-blue",
      secondary:
        "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm focus:ring-white/30",
      danger:
        "bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-500 hover:to-rose-400 focus:ring-red-500 shadow-neon-red",
      ghost:
        "bg-transparent text-white/70 hover:text-white hover:bg-white/10 focus:ring-white/20",
      neon:
        "bg-gradient-to-r from-neon-yellow to-neon-gold text-stadium-black font-bold hover:from-yellow-300 hover:to-yellow-500 focus:ring-neon-yellow shadow-neon-yellow",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-base gap-2",
      lg: "px-7 py-3.5 text-lg gap-2.5",
      xl: "px-10 py-4 text-xl gap-3",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          glow && "animate-glow-pulse",
          className
        )}
        disabled={disabled || isLoading}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export default Button;
