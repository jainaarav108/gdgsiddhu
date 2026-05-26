"use client";

export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useAuth } from "@/hooks/useAuth";
import { getGlobalStats } from "@/lib/firestore";
import { GAME_MODE_CONFIG } from "@/constants/ipl";
import type { GameMode } from "@/types";
import StadiumBackground from "@/components/game/StadiumBackground";
import SidhuAvatar from "@/components/game/SidhuAvatar";
import Button from "@/components/ui/Button";
import { Trophy, Zap, Users } from "lucide-react";

const MODES: { key: GameMode; description: string }[] = [
  {
    key: "player",
    description: "Think of any IPL legend — from MSD to Kohli to Gayle!",
  },
  {
    key: "team",
    description: "Think of any IPL franchise — MI, CSK, RCB, KKR...",
  },
  {
    key: "match",
    description: "Recall a legendary IPL final or iconic moment!",
  },
];

const SIDHU_TAGLINES = [
  "Paaji is READY to read your mind! 🎯",
  "Oye hoye! Think you can fool Sidhu? 😏",
  "15 balls. 1 guess. Infinite drama! ⚡",
  "Your cricketing soul is an open book to Paaji! 📖",
];

export default function LandingPage() {
  const router = useRouter();
  const { setMode, resetGame } = useGameStore();
  const { user, loading: authLoading } = useAuth();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [stats, setStats] = useState<{ totalSessions: number } | null>(null);
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx((i) => (i + 1) % SIDHU_TAGLINES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getGlobalStats().then((s) => s && setStats(s));
  }, []);

  const handleChallenge = () => {
    if (!selectedMode) return;
    setMode(selectedMode);
    router.push("/game");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StadiumBackground />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏏</span>
          <span className="font-black text-xl text-white tracking-tight">
            Sidhu<span className="text-neon-yellow">Predict</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/leaderboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/70 hover:text-white transition-all"
          >
            <Trophy className="w-4 h-4 text-neon-yellow" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
          {stats && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-yellow/10 border border-neon-yellow/20">
              <Users className="w-3.5 h-3.5 text-neon-yellow" />
              <span className="text-xs text-neon-yellow font-semibold">
                {stats.totalSessions.toLocaleString()} games played
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-yellow/30 bg-neon-yellow/10 mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-neon-yellow" />
            <span className="text-neon-yellow text-xs font-semibold tracking-widest uppercase">
              Powered by Gemini AI
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-4">
            Can{" "}
            <span
              className="text-neon-yellow animate-neon-flicker"
              style={{
                textShadow:
                  "0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)",
              }}
            >
              Sidhu Paaji
            </span>
            <br />
            Read Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Cricketing Soul?
            </span>
          </h1>

          <motion.p
            key={taglineIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-white/60 text-base md:text-xl max-w-2xl mx-auto"
          >
            {SIDHU_TAGLINES[taglineIdx]}
          </motion.p>
        </motion.div>

        {/* Avatar + Content Row */}
        <div className="flex flex-col lg:flex-row items-center gap-10 w-full max-w-5xl mx-auto">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="flex-shrink-0"
          >
            <SidhuAvatar phase="idle" confidence={30} />
          </motion.div>

          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="flex-1 w-full"
          >
            <p className="text-white/50 text-sm uppercase tracking-widest mb-4 text-center lg:text-left">
              Choose your challenge
            </p>

            <div className="grid gap-3">
              {MODES.map(({ key, description }, i) => {
                const config = GAME_MODE_CONFIG[key];
                const isSelected = selectedMode === key;

                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode(key)}
                    className={`relative w-full text-left p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "border-neon-yellow/60 bg-neon-yellow/10 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    {/* Gradient bg strip */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${config.color}`}
                    />

                    <div className="flex items-center gap-4 pl-3">
                      <span className="text-3xl">{config.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-base">
                          {config.label}
                        </p>
                        <p className="text-white/50 text-sm">{description}</p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-neon-yellow flex items-center justify-center"
                        >
                          <span className="text-stadium-black text-xs font-bold">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6"
            >
              <Button
                variant="neon"
                size="xl"
                onClick={handleChallenge}
                disabled={!selectedMode || authLoading}
                isLoading={authLoading}
                glow={!!selectedMode}
                className="w-full text-xl font-black tracking-wide rounded-2xl"
              >
                <span>⚡</span>
                Challenge Sidhu Paaji
                <span>🏏</span>
              </Button>

              {!selectedMode && (
                <p className="text-center text-white/30 text-xs mt-2">
                  Select a mode to begin
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/5 w-full max-w-3xl"
        >
          {[
            { label: "Game Modes", value: "3", icon: "🎮" },
            { label: "Questions Max", value: "15", icon: "🎯" },
            { label: "IPL Players", value: "50+", icon: "🏏" },
            { label: "Historic Matches", value: "10+", icon: "⚡" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-neon-yellow">{value}</p>
              <p className="text-white/40 text-xs mt-0.5">
                {icon} {label}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
