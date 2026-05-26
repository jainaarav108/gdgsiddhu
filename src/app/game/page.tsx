"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { GAME_MODE_CONFIG } from "@/constants/ipl";
import StadiumBackground from "@/components/game/StadiumBackground";
import SidhuAvatar from "@/components/game/SidhuAvatar";
import SpeechBubble from "@/components/game/SpeechBubble";
import BallCounter from "@/components/game/BallCounter";
import ConfidenceMeter from "@/components/game/ConfidenceMeter";
import AnswerButtons from "@/components/game/AnswerButtons";
import MoodBanner from "@/components/game/MoodBanner";
import type { Answer } from "@/types";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";

export default function GamePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const store = useGameStore();
  const { startGame, submitAnswer } = useGame(user?.uid ?? null);

  // Redirect if no mode selected
  useEffect(() => {
    if (!store.mode) {
      router.replace("/");
    }
  }, [store.mode, router]);

  // Start game once auth is ready
  useEffect(() => {
    if (!authLoading && user && store.mode && store.ballsUsed === 0 && !store.currentQuestion && !store.isLoading) {
      startGame();
    }
  }, [authLoading, user, store.mode, store.ballsUsed, store.currentQuestion, store.isLoading, startGame]);

  if (!store.mode) return null;

  const modeConfig = GAME_MODE_CONFIG[store.mode];
  const isGameActive = store.gamePhase === "asking" || store.gamePhase === "thinking";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StadiumBackground />

      {/* Top Nav Bar */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-sm bg-stadium-black/40">
        <button
          onClick={() => {
            store.resetGame();
            router.push("/");
          }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Home</span>
        </button>

        {/* Mode badge */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${modeConfig.color} bg-opacity-20 border border-white/10`}>
          <span className="text-lg">{modeConfig.emoji}</span>
          <span className="text-white font-semibold text-sm">{modeConfig.label} Mode</span>
        </div>

        <button
          onClick={() => {
            store.resetGame();
            router.push("/");
          }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Restart</span>
        </button>
      </nav>

      {/* Error Banner */}
      <AnimatePresence>
        {store.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 flex items-center gap-3 px-6 py-3 bg-red-900/50 border-b border-red-500/30 text-red-300"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{store.error}</p>
            <button
              onClick={() => store.setError(null)}
              className="ml-auto text-red-400 hover:text-red-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Layout */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">

        {/* LEFT: Sidhu Avatar + Ball Counter */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center gap-6 lg:w-56 flex-shrink-0"
        >
          <SidhuAvatar phase={store.gamePhase} confidence={store.confidence} />
          <div className="hidden lg:block">
            <BallCounter ballsUsed={store.ballsUsed} />
          </div>
        </motion.div>

        {/* CENTER: Question + Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col justify-center gap-5"
        >
          {/* Mobile Ball Counter */}
          <div className="lg:hidden flex justify-center">
            <BallCounter ballsUsed={store.ballsUsed} />
          </div>

          {/* Question hint */}
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Think of {modeConfig.hint} 💭
            </p>
          </div>

          {/* Speech Bubble */}
          <div className="relative pl-4 lg:pl-8">
            <SpeechBubble
              question={store.currentQuestion || (authLoading ? "Connecting to Sidhu Paaji..." : "Preparing first question...")}
              quip={store.currentQuip}
              ballsUsed={store.ballsUsed}
              isLoading={store.isLoading && store.ballsUsed === 0}
            />
          </div>

          {/* Q&A History (mini scroll) */}
          {store.qnas.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-h-28 overflow-y-auto space-y-1 px-1"
            >
              {store.qnas.slice().reverse().map((qna, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 text-xs py-1.5 px-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <span className={`font-bold flex-shrink-0 ${
                    qna.answer === "yes" ? "text-emerald-400" :
                    qna.answer === "no" ? "text-red-400" :
                    qna.answer === "maybe" ? "text-amber-400" : "text-gray-400"
                  }`}>
                    {qna.answer.toUpperCase().replace("_", " ")}
                  </span>
                  <span className="text-white/50 line-clamp-1">{qna.question}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Mood Banner – Sidhu Paaji AI Personality */}
          <MoodBanner
            line={store.personalityLine}
            mood={store.currentMood}
            ballsUsed={store.ballsUsed}
          />

          {/* Answer Buttons */}
          <AnswerButtons
            onAnswer={(answer: Answer) => submitAnswer(answer)}
            disabled={store.isLoading || !isGameActive}
          />

          {/* Loading hint */}
          {store.isLoading && store.ballsUsed > 0 && (
            <p className="text-center text-white/40 text-xs animate-pulse">
              ⚡ Sidhu Paaji is calculating his next move...
            </p>
          )}
        </motion.div>

        {/* RIGHT: Confidence Meter */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:flex flex-col items-center justify-center lg:w-32"
        >
          <ConfidenceMeter confidence={store.confidence} />
        </motion.div>

        {/* Mobile confidence (bottom strip) */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-white/50 text-xs">Confidence:</span>
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-neon-yellow"
              animate={{ width: `${store.confidence}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <span className="text-neon-yellow font-bold text-sm">{Math.round(store.confidence)}%</span>
        </div>
      </main>
    </div>
  );
}
