import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  UserStats,
  GameSession,
  LeaderboardEntry,
  GameMode,
  QnA,
} from "@/types";
import { generateAnonymousName } from "./utils";

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getOrCreateUser(uid: string): Promise<UserStats> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as UserStats;
  }

  const newUser: UserStats = {
    uid,
    totalGames: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    bestStreak: 0,
    avgQuestionsToSolve: 0,
    lastPlayedAt: Date.now(),
    displayName: generateAnonymousName(),
  };

  await setDoc(userRef, newUser);
  return newUser;
}

export async function updateUserAfterGame(
  uid: string,
  isCorrect: boolean,
  ballsUsed: number
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data() as UserStats;
  const newTotalGames = data.totalGames + 1;
  const newWins = data.wins + (isCorrect ? 1 : 0);
  const newLosses = data.losses + (isCorrect ? 0 : 1);
  const newStreak = isCorrect ? data.currentStreak + 1 : 0;
  const newBestStreak = Math.max(data.bestStreak, newStreak);
  // Weighted avg
  const newAvg =
    newWins > 0
      ? (data.avgQuestionsToSolve * data.wins + (isCorrect ? ballsUsed : 0)) /
        newWins
      : 0;

  await updateDoc(userRef, {
    totalGames: newTotalGames,
    wins: newWins,
    losses: newLosses,
    currentStreak: newStreak,
    bestStreak: newBestStreak,
    avgQuestionsToSolve: Math.round(newAvg * 10) / 10,
    lastPlayedAt: Date.now(),
  });

  // Update leaderboard entry
  await setDoc(
    doc(db, "leaderboard", uid),
    {
      uid,
      displayName: data.displayName,
      streak: newStreak,
      bestStreak: newBestStreak,
      totalWins: newWins,
      avgQuestions: Math.round(newAvg * 10) / 10,
      lastPlayedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function createSession(
  uid: string,
  mode: GameMode
): Promise<string> {
  const sessRef = await addDoc(collection(db, "sessions"), {
    uid,
    mode,
    startedAt: serverTimestamp(),
    qnas: [],
    finalGuess: "",
    isCorrect: null,
    ballsUsed: 0,
    completedAt: null,
  });
  return sessRef.id;
}

export async function completeSession(
  sessionId: string,
  qnas: QnA[],
  finalGuess: string,
  isCorrect: boolean,
  ballsUsed: number
): Promise<void> {
  const sessRef = doc(db, "sessions", sessionId);
  await updateDoc(sessRef, {
    qnas,
    finalGuess,
    isCorrect,
    ballsUsed,
    completedAt: serverTimestamp(),
  });

  // Update analytics
  await updateDoc(doc(db, "analytics", "global"), {
    totalSessions: increment(1),
    completedSessions: increment(1),
  }).catch(async () => {
    // Create if doesn't exist
    await setDoc(doc(db, "analytics", "global"), {
      totalSessions: 1,
      completedSessions: 1,
      mostGuessedEntities: {},
      hardestEntities: [],
      avgQuestionsGlobal: ballsUsed,
    });
  });
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function subscribeToLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void
): () => void {
  const q = query(
    collection(db, "leaderboard"),
    orderBy("bestStreak", "desc"),
    orderBy("totalWins", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snap) => {
    const entries: LeaderboardEntry[] = snap.docs.map((d, i) => ({
      rank: i + 1,
      ...(d.data() as Omit<LeaderboardEntry, "rank">),
    }));
    callback(entries);
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getGlobalStats(): Promise<{
  totalSessions: number;
  todaySessions: number;
} | null> {
  try {
    const snap = await getDoc(doc(db, "analytics", "global"));
    if (!snap.exists()) return { totalSessions: 0, todaySessions: 0 };
    const data = snap.data();
    return {
      totalSessions: data.totalSessions ?? 0,
      todaySessions: data.todaySessions ?? 0,
    };
  } catch {
    return null;
  }
}
