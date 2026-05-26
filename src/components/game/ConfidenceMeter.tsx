"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getConfidenceColor, cn } from "@/lib/utils";
import { getConfidenceLabel } from "@/constants/ipl";

interface ConfidenceMeterProps {
  confidence: number;
  className?: string;
}

export default function ConfidenceMeter({ confidence, className }: ConfidenceMeterProps) {
  const color = getConfidenceColor(confidence);
  const label = getConfidenceLabel(confidence);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
        Confidence
      </p>

      {/* Vertical bar */}
      <div className="relative w-10 h-48 bg-white/10 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          animate={{
            height: `${confidence}%`,
            backgroundColor: color,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            boxShadow: `0 0 20px ${color}88`,
          }}
        />

        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute left-0 right-0 border-t border-white/20"
            style={{ bottom: `${tick}%` }}
          />
        ))}

        {/* Percentage label on bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={Math.round(confidence / 5)}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-white font-bold text-xs [writing-mode:vertical-rl] rotate-180"
          >
            {Math.round(confidence)}%
          </motion.span>
        </div>
      </div>

      {/* Status label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-center max-w-[100px]"
        >
          <p
            className="text-xs font-semibold leading-tight text-center"
            style={{ color }}
          >
            {label}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Pulsing dot indicator for high confidence */}
      {confidence >= 80 && (
        <motion.div
          className="w-3 h-3 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
      )}
    </div>
  );
}
