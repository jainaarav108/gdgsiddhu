"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import StadiumBackground from "@/components/game/StadiumBackground";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Trophy, Crown, Flame, Target, ArrowLeft, Loader2 } from "lucide-react";

const RANK_STYLES = [
  { bg: "from-yellow-500 to-amber-400", text: "text-stadium-black", icon: "🥇", glow: "rgba(255,215,0,0.4)" },
  { bg: "from-slate-300 to-gray-400", text: "text-stadium-black", icon: "🥈", glow: "rgba(200,200,200,0.3)" },
  { bg: "from-amber-700 to-orange-600", text: "text-white", icon: "🥉", glow: "rgba(180,100,40,0.3)" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const row: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 200 } },
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { entries, loading } = useLeaderboard();
  const { user, userStats } = useAuth();

  const myEntry = entries.find((e) => e.uid === user?.uid);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StadiumBackground />

      {/* Nav */}
      <nav className="relative z-20 flex items-center gap-4 px-4 py-4 border-b border-white/5 backdrop-blur-sm bg-stadium-black/40">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-white font-black text-xl flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-neon-yellow" />
            Hall of Legends
          </h1>
        </div>
        <div className="w-16" />
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* My Stats Card */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border border-neon-yellow/30 bg-neon-yellow/5"
            style={{ boxShadow: "0 0 30px rgba(255,215,0,0.1)" }}
          >
            <p className="text-neon-yellow text-xs uppercase tracking-widest mb-3 font-semibold">
              Your Stats
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-yellow to-neon-gold flex items-center justify-center text-xl font-black text-stadium-black">
                {myEntry ? `#${myEntry.rank}` : "?"}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">{userStats.displayName}</p>
                <p className="text-white/50 text-xs">Anonymous Oracle</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-neon-yellow font-black text-xl">{userStats.currentStreak}</p>
                  <p className="text-white/40 text-xs flex items-center gap-1 justify-center">
                    <Flame className="w-3 h-3" />Streak
                  </p>
                </div>
                <div>
                  <p className="text-white font-black text-xl">{userStats.wins}</p>
                  <p className="text-white/40 text-xs flex items-center gap-1 justify-center">
                    <Crown className="w-3 h-3" />Wins
                  </p>
                </div>
                <div>
                  <p className="text-white font-black text-xl">{userStats.avgQuestionsToSolve || "-"}</p>
                  <p className="text-white/40 text-xs flex items-center gap-1 justify-center">
                    <Target className="w-3 h-3" />Avg Q
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Top Oracles</h2>
          <Badge variant="gold">🔴 Live</Badge>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-neon-yellow animate-spin" />
            <p className="text-white/40 text-sm">Loading leaderboard...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏏</p>
            <p className="text-white/60 font-semibold">No entries yet!</p>
            <p className="text-white/30 text-sm mt-1">Be the first IPL Oracle!</p>
            <Button
              variant="neon"
              size="md"
              onClick={() => router.push("/")}
              className="mt-4"
            >
              Play Now
            </Button>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {entries.map((entry, i) => {
              const rankStyle = RANK_STYLES[i] || null;
              const isMe = entry.uid === user?.uid;

              return (
                <motion.div
                  key={entry.uid}
                  variants={row}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    isMe
                      ? "border-neon-yellow/40 bg-neon-yellow/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                      : "border-white/8 bg-white/3 hover:bg-white/5"
                  }`}
                  style={
                    rankStyle
                      ? { boxShadow: `0 0 20px ${rankStyle.glow}` }
                      : undefined
                  }
                >
                  {/* Rank */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                      rankStyle
                        ? `bg-gradient-to-br ${rankStyle.bg} ${rankStyle.text}`
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {rankStyle ? rankStyle.icon : `#${entry.rank}`}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">
                        {entry.displayName}
                      </p>
                      {isMe && (
                        <Badge variant="gold" className="text-[10px] px-1.5 py-0.5">
                          YOU
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/40 text-xs">
                      {entry.totalWins} wins · {entry.avgQuestions || "-"} avg Q
                    </p>
                  </div>

                  {/* Streak */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Flame
                        className={`w-4 h-4 ${
                          entry.bestStreak >= 5
                            ? "text-neon-red"
                            : entry.bestStreak >= 3
                            ? "text-neon-gold"
                            : "text-white/40"
                        }`}
                      />
                      <span className="text-white font-black text-lg">
                        {entry.bestStreak}
                      </span>
                    </div>
                    <p className="text-white/30 text-xs">best streak</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Play CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-4"
        >
          <Button
            variant="neon"
            size="lg"
            onClick={() => router.push("/")}
            glow
            className="px-10"
          >
            ⚡ Challenge Sidhu Paaji
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
