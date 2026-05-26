"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SpeechBubbleProps {
  question: string;
  quip?: string;
  ballsUsed: number;
  isLoading?: boolean;
}

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

export default function SpeechBubble({ question, quip, ballsUsed, isLoading }: SpeechBubbleProps) {
  const { displayed, done } = useTypewriter(question, 25);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ballsUsed}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-full"
      >
        {/* Main bubble */}
        <div
          className="relative rounded-2xl border border-neon-yellow/30 p-5 md:p-7"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,39,68,0.95) 0%, rgba(13,21,48,0.98) 100%)",
            boxShadow:
              "0 0 30px rgba(255,215,0,0.15), inset 0 1px 0 rgba(255,215,0,0.1)",
          }}
        >
          {/* Decorative corner */}
          <div className="absolute top-3 left-4 text-neon-yellow/40 text-lg">"</div>
          <div className="absolute bottom-3 right-4 text-neon-yellow/40 text-lg">"</div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center gap-3 py-2">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-neon-yellow"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm italic">
                Sidhu Paaji is thinking... 🤔
              </span>
            </div>
          ) : (
            <div>
              {/* Question text with typewriter */}
              <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed min-h-[3rem] md:min-h-[4rem]">
                {displayed}
                {!done && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-6 bg-neon-yellow ml-1 align-middle"
                  />
                )}
              </p>

              {/* Sidhu quip */}
              <AnimatePresence>
                {done && quip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <p className="text-neon-yellow/80 text-sm italic flex gap-2">
                      <span className="text-base">💬</span>
                      <span>{quip}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Speech bubble tail */}
        <div
          className="absolute -left-4 top-8 w-0 h-0"
          style={{
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "16px solid rgba(26,39,68,0.95)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
