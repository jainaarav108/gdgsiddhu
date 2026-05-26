"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MAX_BALLS } from "@/constants/ipl";

interface BallCounterProps {
  ballsUsed: number;
  className?: string;
}

export default function BallCounter({ ballsUsed, className }: BallCounterProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Counter text */}
      <div className="flex items-baseline gap-1">
        <motion.span
          key={ballsUsed}
          initial={{ scale: 1.5, color: "#FFD700" }}
          animate={{ scale: 1, color: "#FFFFFF" }}
          className="text-4xl font-bold text-white"
        >
          {ballsUsed}
        </motion.span>
        <span className="text-white/40 text-xl font-medium">/ {MAX_BALLS}</span>
      </div>
      <p className="text-white/50 text-xs uppercase tracking-widest">Balls Bowled</p>

      {/* Cricket balls row */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px]">
        {Array.from({ length: MAX_BALLS }, (_, i) => (
          <motion.div
            key={i}
            initial={i === ballsUsed - 1 ? { scale: 1.5 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all duration-300",
              i < ballsUsed
                ? "bg-neon-yellow border-neon-yellow text-stadium-black shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                : "bg-transparent border-white/20 text-white/20"
            )}
          >
            {i < ballsUsed ? "🔴" : "○"}
          </motion.div>
        ))}
      </div>

      {/* Urgency indicator */}
      {ballsUsed >= 12 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "text-xs font-bold text-center animate-pulse",
            ballsUsed >= 14 ? "text-neon-red" : "text-neon-gold"
          )}
        >
          {MAX_BALLS - ballsUsed === 1
            ? "⚠️ LAST BALL!"
            : `${MAX_BALLS - ballsUsed} balls left!`}
        </motion.p>
      )}
    </div>
  );
}
