"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { MoodState } from "@/types";

interface MoodBannerProps {
  line: string;
  mood: MoodState;
  ballsUsed: number;
}

const MOOD_CONFIG: Record<MoodState, {
  bg: string; border: string; emoji: string; label: string; textColor: string;
}> = {
  curious: {
    bg: "from-blue-900/60 to-indigo-900/40",
    border: "border-blue-500/30",
    emoji: "🤔",
    label: "Curious",
    textColor: "text-blue-300",
  },
  excited: {
    bg: "from-amber-900/60 to-yellow-900/40",
    border: "border-amber-500/30",
    emoji: "🔥",
    label: "Excited",
    textColor: "text-amber-300",
  },
  cocky: {
    bg: "from-emerald-900/60 to-green-900/40",
    border: "border-emerald-500/30",
    emoji: "😎",
    label: "Confident",
    textColor: "text-emerald-300",
  },
  panic: {
    bg: "from-red-900/60 to-rose-900/40",
    border: "border-red-500/40",
    emoji: "😰",
    label: "PANIC MODE",
    textColor: "text-red-300",
  },
  win: {
    bg: "from-yellow-900/70 to-amber-900/50",
    border: "border-neon-yellow/50",
    emoji: "🏆",
    label: "Victory!",
    textColor: "text-neon-yellow",
  },
  loss: {
    bg: "from-purple-900/60 to-slate-900/50",
    border: "border-purple-500/30",
    emoji: "💔",
    label: "Heartbroken",
    textColor: "text-purple-300",
  },
};

export default function MoodBanner({ line, mood, ballsUsed }: MoodBannerProps) {
  const config = MOOD_CONFIG[mood];
  const isPanic = mood === "panic";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${mood}-${Math.floor(ballsUsed)}`}
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`
          relative w-full rounded-2xl border px-4 py-3 
          bg-gradient-to-r ${config.bg} ${config.border}
          ${isPanic ? "animate-pulse" : ""}
        `}
      >
        <div className="flex items-start gap-3">
          {/* Mood emoji */}
          <motion.span
            animate={isPanic
              ? { rotate: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.4 } }
              : { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 2 } }
            }
            className="text-2xl flex-shrink-0 mt-0.5"
          >
            {config.emoji}
          </motion.span>

          <div className="flex-1 min-w-0">
            {/* Mood label */}
            <span className={`text-[10px] uppercase tracking-widest font-bold ${config.textColor} opacity-70`}>
              Sidhu Paaji • {config.label}
            </span>

            {/* Personality line */}
            <AnimatePresence mode="wait">
              <motion.p
                key={line}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white text-sm md:text-base font-medium leading-snug mt-0.5"
              >
                {line || "Paaji is thinking… 🤔"}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Panic countdown */}
          {isPanic && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="flex-shrink-0 flex flex-col items-center"
            >
              <span className="text-red-400 font-black text-lg leading-none">
                {15 - ballsUsed}
              </span>
              <span className="text-red-400/60 text-[9px] uppercase tracking-wide">left</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
