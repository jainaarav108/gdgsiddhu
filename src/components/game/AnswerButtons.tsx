"use client";

import { motion, type Variants } from "framer-motion";
import type { Answer } from "@/types";
import { cn } from "@/lib/utils";

interface AnswerButtonsProps {
  onAnswer: (answer: Answer) => void;
  disabled?: boolean;
}

const ANSWERS: { key: Answer; label: string; emoji: string; color: string; shadow: string }[] = [
  {
    key: "yes",
    label: "YES",
    emoji: "✅",
    color: "from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 border-emerald-500/40",
    shadow: "shadow-neon-green hover:shadow-[0_0_30px_rgba(57,255,20,0.6)]",
  },
  {
    key: "no",
    label: "NO",
    emoji: "❌",
    color: "from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 border-red-500/40",
    shadow: "shadow-neon-red hover:shadow-[0_0_30px_rgba(255,7,58,0.6)]",
  },
  {
    key: "maybe",
    label: "MAYBE",
    emoji: "🤔",
    color: "from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 border-amber-500/40",
    shadow: "shadow-neon-yellow hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]",
  },
  {
    key: "dont_know",
    label: "DON'T KNOW",
    emoji: "🤷",
    color: "from-slate-600 to-gray-500 hover:from-slate-500 hover:to-gray-400 border-slate-500/40",
    shadow: "shadow-card-glow",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } },
};

export default function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 w-full"
    >
      {ANSWERS.map(({ key, label, emoji, color, shadow }) => (
        <motion.button
          key={key}
          variants={item}
          whileHover={disabled ? {} : { scale: 1.04, y: -2 }}
          whileTap={disabled ? {} : { scale: 0.96 }}
          onClick={() => !disabled && onAnswer(key)}
          disabled={disabled}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl",
            "border bg-gradient-to-br text-white font-bold text-sm md:text-base",
            "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none",
            color,
            shadow
          )}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="tracking-wider">{label}</span>

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            whileHover={{ opacity: 1, x: ["−100%", "100%"] }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
