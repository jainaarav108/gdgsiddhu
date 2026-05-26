"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GamePhase } from "@/types";

interface SidhuAvatarProps {
  phase: GamePhase;
  confidence: number;
}

export default function SidhuAvatar({ phase, confidence }: SidhuAvatarProps) {
  const isThinking = phase === "thinking";
  const isGuessing = phase === "guessing";
  const isDone = phase === "done";
  const isAsking = phase === "asking";

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
          <ellipse cx="100" cy="215" rx="55" ry="8" fill="rgba(255,215,0,0.2)" />
          
          {/* Body / Suit */}
          <rect x="45" y="145" width="110" height="75" rx="12" fill="#1a2744" />
          <rect x="55" y="145" width="38" height="75" rx="4" fill="#0d1530" />
          <rect x="107" y="145" width="38" height="75" rx="4" fill="#0d1530" />
          
          {/* Tie */}
          <path d="M97 148 L103 148 L108 180 L100 190 L92 180 Z" fill="#FFD700" />
          <path d="M97 148 L103 148 L105 158 L100 162 L95 158 Z" fill="#FFA500" />
          
          {/* Collar */}
          <path d="M75 145 L100 165 L125 145" stroke="white" strokeWidth="2" fill="none" />
          
          {/* Neck */}
          <rect x="88" y="125" width="24" height="22" rx="8" fill="#C67C5B" />
          
          {/* Head */}
          <ellipse cx="100" cy="110" rx="40" ry="42" fill="#C67C5B" />
          
          {/* Turban */}
          <ellipse cx="100" cy="75" rx="42" ry="18" fill="#FF8C00" />
          <ellipse cx="100" cy="72" rx="40" ry="16" fill="#FFA500" />
          <ellipse cx="100" cy="69" rx="38" ry="14" fill="#FFB732" />
          <ellipse cx="100" cy="66" rx="35" ry="12" fill="#FF8C00" />
          <ellipse cx="100" cy="63" rx="30" ry="10" fill="#FFA500" />
          
          {/* Turban jewel */}
          <circle cx="100" cy="60" r="5" fill="#FFD700" />
          <circle cx="100" cy="60" r="3" fill="#FFF8DC" />
          
          {/* Turban fold lines */}
          <path d="M62 74 Q100 65 138 74" stroke="rgba(255,140,0,0.5)" strokeWidth="1" fill="none" />
          <path d="M65 79 Q100 70 135 79" stroke="rgba(255,140,0,0.5)" strokeWidth="1" fill="none" />
          
          {/* Eyes */}
          <AnimatePresence>
            {isThinking ? (
              <>
                {/* Squinting eyes (thinking) */}
                <ellipse cx="86" cy="108" rx="7" ry="4" fill="#2D1B08" />
                <ellipse cx="114" cy="108" rx="7" ry="4" fill="#2D1B08" />
              </>
            ) : (
              <>
                <ellipse cx="86" cy="108" rx="7" ry="8" fill="white" />
                <ellipse cx="114" cy="108" rx="7" ry="8" fill="white" />
                <circle cx="87" cy="109" r="4" fill="#2D1B08" />
                <circle cx="115" cy="109" r="4" fill="#2D1B08" />
                <circle cx="88" cy="107" r="1.5" fill="white" />
                <circle cx="116" cy="107" r="1.5" fill="white" />
              </>
            )}
          </AnimatePresence>
          
          {/* Eyebrows */}
          <path d="M79 100 Q86 97 93 100" stroke="#6B3A1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M107 100 Q114 97 121 100" stroke="#6B3A1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Mustache */}
          <path d="M84 120 Q100 128 116 120" stroke="#4A2508" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M84 120 Q92 116 100 120 Q108 116 116 120" fill="#4A2508" />
          
          {/* Mouth */}
          {isDone && confidence >= 80 ? (
            // Big smile on correct guess
            <path d="M88 132 Q100 145 112 132" stroke="#4A2508" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : isThinking ? (
            // Curious mouth
            <path d="M92 134 Q100 138 108 134" stroke="#4A2508" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            // Normal smile
            <path d="M90 133 Q100 140 110 133" stroke="#4A2508" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}
          
          {/* Ears */}
          <ellipse cx="60" cy="112" rx="8" ry="10" fill="#C67C5B" />
          <ellipse cx="140" cy="112" rx="8" ry="10" fill="#C67C5B" />
          
          {/* Mic in hand */}
          <rect x="130" y="155" width="8" height="28" rx="4" fill="#888" />
          <circle cx="134" cy="152" r="9" fill="#333" />
          <circle cx="134" cy="152" r="6" fill="#555" />
          
          {/* Arms */}
          <path d="M45 155 Q30 170 35 185" stroke="#C67C5B" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M155 155 Q170 165 160 185" stroke="#C67C5B" strokeWidth="14" strokeLinecap="round" fill="none" />
          
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

        {/* Phase indicator badge */}
        <AnimatePresence mode="wait">
          {isThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2 bg-neon-yellow text-stadium-black text-xs font-bold px-2 py-1 rounded-full"
            >
              🤔 Thinking...
            </motion.div>
          )}
          {isGuessing && (
            <motion.div
              key="guessing"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2 bg-neon-red text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse"
            >
              ⚡ Guessing!
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
