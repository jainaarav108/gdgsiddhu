"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import StadiumBackground from "@/components/game/StadiumBackground";
import SidhuAvatar from "@/components/game/SidhuAvatar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { GAME_MODE_CONFIG } from "@/constants/ipl";
import { Trophy, RotateCcw, Share2, ChevronDown, ChevronUp, Home } from "lucide-react";

// ─── Confetti ──────────────────────────────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: ["#FFD700", "#FF073A", "#39FF14", "#00FFFF", "#BF5FFF", "#FFA500"][
      Math.floor(Math.random() * 6)
    ],
    size: 6 + Math.random() * 10,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            rotate: p.rotate,
          }}
          animate={{
            y: ["0vh", "105vh"],
            rotate: [p.rotate, p.rotate + 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Result Page ───────────────────────────────────────────────────────────────

export default function ResultPage() {
  const router = useRouter();
  const store = useGameStore();
  const { user } = useAuth();
  const { confirmResult } = useGame(user?.uid ?? null);
  const [showHistory, setShowHistory] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [startTime] = useState(Date.now());
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (!store.guess) {
      router.replace("/");
      return;
    }
    // Trigger reveal animation
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, [store.guess, router]);

  const handleConfirm = async (correct: boolean) => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;
    await confirmResult(correct);
  };

  if (!store.guess || !store.mode) return null;

  const modeConfig = GAME_MODE_CONFIG[store.mode];
  const isCorrect = store.isCorrect;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StadiumBackground />
      {isCorrect === true && <Confetti />}

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => { store.resetGame(); router.push("/"); }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </button>
        <span className="text-white/60 text-sm">
          🏏 {modeConfig.label} Mode
        </span>
        <button
          onClick={() => {
            navigator.share?.({
              title: "SidhuPredict – IPL Oracle",
              text: `Sidhu Paaji ${isCorrect ? "correctly guessed" : "couldn't guess"} my IPL ${store.mode} in ${store.ballsUsed} balls! 🏏`,
              url: window.location.origin,
            }).catch(() => {});
          }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8 flex flex-col items-center gap-8">

        {/* Avatar with phase */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <SidhuAvatar phase="done" confidence={store.confidence} />
        </motion.div>

        {/* Main Reveal Card */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="w-full text-center"
            >
              {/* Reveal Speech */}
              <div
                className="p-6 md:p-8 rounded-3xl border mb-6"
                style={{
                  background: "linear-gradient(135deg, rgba(26,39,68,0.95), rgba(13,21,48,0.98))",
                  borderColor: "rgba(255,215,0,0.3)",
                  boxShadow: "0 0 60px rgba(255,215,0,0.15), inset 0 1px 0 rgba(255,215,0,0.1)",
                }}
              >
                <p className="text-2xl mb-2">🎤</p>
                <p className="text-white text-base md:text-lg italic leading-relaxed">
                  "{store.revealSpeech}"
                </p>
              </div>

              {/* THE GUESS */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-6"
              >
                <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
                  Sidhu Paaji guesses...
                </p>
                <div
                  className="inline-block px-8 py-4 rounded-2xl border-2"
                  style={{
                    borderColor: "#FFD700",
                    background: "rgba(255,215,0,0.1)",
                    boxShadow: "0 0 40px rgba(255,215,0,0.3)",
                  }}
                >
                  <p
                    className="text-3xl md:text-4xl font-black text-neon-yellow"
                    style={{ textShadow: "0 0 30px rgba(255,215,0,0.8)" }}
                  >
                    {store.guess}
                  </p>
                </div>
              </motion.div>

              {/* Was I right? */}
              {isCorrect === null ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  <p className="text-white font-semibold text-lg">
                    Was Sidhu Paaji right? 🤔
                  </p>
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirm(true)}
                      className="flex-1 max-w-[160px] py-4 rounded-2xl font-bold text-lg bg-gradient-to-br from-emerald-600 to-green-500 text-white border border-emerald-500/40 shadow-neon-green hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all"
                    >
                      ✅ YES!
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirm(false)}
                      className="flex-1 max-w-[160px] py-4 rounded-2xl font-bold text-lg bg-gradient-to-br from-red-700 to-rose-600 text-white border border-red-500/40 shadow-neon-red hover:shadow-[0_0_30px_rgba(255,7,58,0.5)] transition-all"
                    >
                      ❌ NOPE
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                  className="space-y-4"
                >
                  {isCorrect ? (
                    <div className="text-center space-y-2">
                      <p className="text-5xl">🎉</p>
                      <p className="text-3xl font-black text-neon-yellow text-glow-yellow">
                        CAUGHT!
                      </p>
                      <p className="text-white/70">
                        Sidhu Paaji is the ultimate IPL Oracle!
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-5xl">😅</p>
                      <p className="text-2xl font-black text-white">
                        Oye! You fooled Sidhu Paaji!
                      </p>
                      <p className="text-white/70">
                        You&apos;re a true IPL mastermind! 🏆
                      </p>
                    </div>
                  )}

                  {/* Sidhu Quote */}
                  {store.sidhuQuote && (
                    <div className="p-4 rounded-xl bg-neon-yellow/5 border border-neon-yellow/20">
                      <p className="text-neon-yellow text-sm italic">
                        💬 "{store.sidhuQuote}"
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 w-full"
          >
            {[
              { label: "Balls Used", value: `${store.ballsUsed}/15`, icon: "🔴" },
              { label: "Confidence", value: `${Math.round(store.confidence)}%`, icon: "⚡" },
              { label: "Mode", value: modeConfig.label, icon: modeConfig.emoji },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex-1 text-center p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-lg font-black text-white">{icon} {value}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Session History toggle */}
        {store.qnas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm mx-auto transition-colors"
            >
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showHistory ? "Hide" : "Show"} all {store.qnas.length} questions
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-2 overflow-hidden"
                >
                  {store.qnas.map((qna, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white/80 text-sm">{qna.question}</p>
                        {qna.sidhuQuip && (
                          <p className="text-neon-yellow/60 text-xs mt-0.5 italic">💬 {qna.sidhuQuip}</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          qna.answer === "yes" ? "success" :
                          qna.answer === "no" ? "danger" :
                          qna.answer === "maybe" ? "warning" : "default"
                        }
                      >
                        {qna.answer.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <Button
            variant="neon"
            size="lg"
            onClick={() => { store.resetGame(); router.push("/"); }}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/leaderboard")}
            className="flex-1"
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
