"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { GamePhase } from "@/types";

interface SidhuAvatarProps {
  phase: GamePhase;
  confidence: number;
}

const THINKING_QUOTES = [
  "Hmm... Oye Guru!",
  "Let me think...",
  "Dimag ki batti...",
  "Zor lagao!",
];

const GUESSING_QUOTES = [
  "Thoko Taali! 👏",
  "Khatak! ⚡",
  "Chak de phatte! 🔥",
  "Guru, yeh le! 🏏",
];

export default function SidhuAvatar({ phase, confidence }: SidhuAvatarProps) {
  const isThinking = phase === "thinking";
  const isGuessing = phase === "guessing";
  const isDone = phase === "done";
  const isAsking = phase === "asking";

  const [quote, setQuote] = useState("...");

  useEffect(() => {
    if (isThinking || isAsking) {
      setQuote(THINKING_QUOTES[Math.floor(Math.random() * THINKING_QUOTES.length)]);
    } else if (isGuessing || isDone) {
      setQuote(GUESSING_QUOTES[Math.floor(Math.random() * GUESSING_QUOTES.length)]);
    }
  }, [phase]);

  // Dynamic colors based on confidence
  const glowColor =
    confidence < 40
      ? "#00FFFF"
      : confidence < 70
      ? "#FFD700"
      : confidence < 90
      ? "#FFA500"
      : "#FF073A";

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      animate={
        isThinking
          ? { y: [0, -10, 0], transition: { repeat: Infinity, duration: 1.2 } }
          : isGuessing
          ? { scale: [1, 1.08, 1], transition: { repeat: 2, duration: 0.5 } }
          : isDone
          ? { rotate: [0, -5, 5, -3, 3, 0], transition: { duration: 0.8 } }
          : { y: [0, -8, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }
      }
    >
      {/* Avatar SVG */}
      <div
        className="relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56"
        style={{
          filter: `drop-shadow(0 0 30px ${glowColor}88) drop-shadow(0 10px 30px rgba(0,0,0,0.8))`,
        }}
      >
        <svg
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Stadium light halo */}
          <ellipse cx="100" cy="215" rx="60" ry="10" fill="rgba(255,215,0,0.15)" />
          
          {/* Suit Jacket Back / Shoulders */}
          <path d="M30 200 Q40 140 70 140 L130 140 Q160 140 170 200 Z" fill="#222" />
          
          {/* White Shirt */}
          <path d="M80 140 L120 140 L100 200 Z" fill="#FFF" />
          
          {/* Orange Tie */}
          <path d="M96 145 L104 145 L108 190 L100 200 L92 190 Z" fill="#FF9800" />
          
          {/* Suit Lapels */}
          <path d="M70 140 L85 170 L70 200 L40 200 Z" fill="#1A1A1A" />
          <path d="M130 140 L115 170 L130 200 L160 200 Z" fill="#1A1A1A" />
          
          {/* Pocket Square */}
          <path d="M135 175 L145 175 L142 165 Z" fill="#FF9800" />
          
          {/* Neck */}
          <rect x="88" y="120" width="24" height="25" rx="8" fill="#D2987D" />
          
          {/* Head */}
          <ellipse cx="100" cy="105" rx="36" ry="42" fill="#D2987D" />
          
          {/* Neat Beard */}
          <path d="M64 105 Q64 150 100 155 Q136 150 136 105 Q125 125 100 125 Q75 125 64 105 Z" fill="#222" />
          <path d="M68 110 Q68 145 100 150 Q132 145 132 110 Q120 120 100 120 Q80 120 68 110 Z" fill="#333" />
          
          {/* Ears */}
          <ellipse cx="62" cy="108" rx="6" ry="10" fill="#D2987D" />
          <ellipse cx="138" cy="108" rx="6" ry="10" fill="#D2987D" />

          {/* Authentic Punjabi Turban (Patiala Shahi Pagg) */}
          {/* Base */}
          <path d="M60 85 Q100 40 140 85 Q135 45 100 35 Q65 45 60 85 Z" fill="#F57C00" />
          {/* Fifty */}
          <path d="M93 84 L100 75 L107 84 Z" fill="#111" />
          {/* Right Folds */}
          <path d="M100 75 Q135 60 140 88 Q120 92 100 84 Z" fill="#FF9800" />
          <path d="M100 65 Q135 50 138 78 Q120 78 100 75 Z" fill="#FFB300" />
          <path d="M100 55 Q130 40 133 68 Q120 63 100 65 Z" fill="#FF9800" />
          <path d="M100 45 Q120 30 126 58 Q115 50 100 55 Z" fill="#FFB300" />
          {/* Left Folds */}
          <path d="M100 75 Q65 60 60 88 Q80 92 100 84 Z" fill="#F57C00" />
          <path d="M100 65 Q65 50 62 78 Q80 78 100 75 Z" fill="#FF9800" />
          <path d="M100 55 Q70 40 67 68 Q80 63 100 65 Z" fill="#F57C00" />
          <path d="M100 45 Q80 30 74 58 Q85 50 100 55 Z" fill="#FF9800" />
          {/* Crown */}
          <path d="M80 50 Q100 25 120 50 Q100 60 80 50 Z" fill="#F57C00" />

          {/* Eyes */}
          <AnimatePresence>
            {isThinking ? (
              <>
                <ellipse cx="86" cy="100" rx="6" ry="3" fill="#2D1B08" />
                <ellipse cx="114" cy="100" rx="6" ry="3" fill="#2D1B08" />
              </>
            ) : (
              <>
                <ellipse cx="86" cy="100" rx="6" ry="5" fill="white" />
                <ellipse cx="114" cy="100" rx="6" ry="5" fill="white" />
                <circle cx="86" cy="100" r="3" fill="#2D1B08" />
                <circle cx="114" cy="100" r="3" fill="#2D1B08" />
                <circle cx="87" cy="99" r="1" fill="white" />
                <circle cx="115" cy="99" r="1" fill="white" />
              </>
            )}
          </AnimatePresence>

          {/* Eyebrows */}
          <path d="M78 95 Q85 92 92 95" stroke="#222" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M108 95 Q115 92 122 95" stroke="#222" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Mustache (Neat, joined to beard) */}
          <path d="M85 125 Q100 120 115 125 Q110 130 100 128 Q90 130 85 125 Z" fill="#222" />
          
          {/* Mouth (Speaking) */}
          {isDone && confidence >= 80 ? (
            <ellipse cx="100" cy="132" rx="8" ry="6" fill="#4A2508" />
          ) : isThinking ? (
            <path d="M92 132 Q100 135 108 132" stroke="#4A2508" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            <>
              <ellipse cx="100" cy="132" rx="8" ry="4" fill="#4A2508" />
              <ellipse cx="100" cy="131" rx="6" ry="2" fill="#FFF" />
            </>
          )}

          {/* Right Hand (Viewer's left) - Pointing */}
          {/* Arm */}
          <path d="M45 160 Q30 140 50 120" stroke="#222" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M45 160 Q30 140 50 120" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Hand/Finger */}
          <circle cx="50" cy="115" r="8" fill="#D2987D" />
          <rect x="47" y="100" width="6" height="15" rx="3" fill="#D2987D" />

          {/* Left Hand (Viewer's right) - Holding Mic */}
          {/* Arm */}
          <path d="M155 160 Q165 150 140 140" stroke="#222" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M155 160 Q165 150 140 140" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Mic */}
          <rect x="135" y="115" width="8" height="30" rx="4" fill="#333" />
          <circle cx="139" cy="115" r="10" fill="#111" />
          <path d="M129 115 A10 10 0 0 0 149 115" stroke="#666" strokeWidth="2" fill="none" />
          {/* Hand */}
          <circle cx="138" cy="140" r="10" fill="#D2987D" />
          
          {/* Confidence glow ring */}
          {confidence > 70 && (
            <motion.circle
              cx="100"
              cy="110"
              r="50"
              fill="none"
              stroke={glowColor}
              strokeWidth="2"
              strokeDasharray="8 4"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "100px 110px" }}
            />
          )}
        </svg>

        {/* Comic Thought Bubble */}
        <AnimatePresence mode="wait">
          {!isDone && (
            <motion.div
              key={quote}
              initial={{ opacity: 0, scale: 0.5, y: 10, x: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 5 }}
              className="absolute -top-6 -right-16 md:-right-24 bg-white text-black font-black italic px-4 py-3 rounded-3xl shadow-xl z-10 border-4 border-black"
              style={{
                filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.5))",
                transformOrigin: "bottom left"
              }}
            >
              <span className="relative z-10 whitespace-nowrap text-sm md:text-base">
                {quote}
              </span>
              {/* Bubble Tail */}
              <div className="absolute -bottom-3 left-6 w-4 h-4 bg-white border-b-4 border-r-4 border-black rounded-br-lg transform rotate-45"></div>
              <div className="absolute -bottom-6 left-2 w-2 h-2 bg-white border-2 border-black rounded-full"></div>
              <div className="absolute -bottom-8 left-0 w-1.5 h-1.5 bg-white border-2 border-black rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Name tag */}
      <div className="text-center">
        <p className="text-neon-yellow font-bold text-lg tracking-wider drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
          Sidhu Paaji
        </p>
        <p className="text-white/50 text-xs">IPL Oracle 🏏</p>
      </div>
    </motion.div>
  );
}
