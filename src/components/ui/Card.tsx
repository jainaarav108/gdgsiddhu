"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  glow,
  glowColor = "rgba(255,215,0,0.15)",
  onClick,
  hover = false,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-card-glass backdrop-blur-md shadow-card-glow",
        glow && "animate-glow-pulse",
        onClick && "cursor-pointer",
        className
      )}
      style={
        glow
          ? {
              boxShadow: `0 0 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
