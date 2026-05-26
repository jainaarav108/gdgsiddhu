// ─── Game Types ──────────────────────────────────────────────────────────────

export type GameMode = "player" | "team" | "match";

export type Answer = "yes" | "no" | "maybe" | "dont_know";

export type GamePhase = "idle" | "asking" | "thinking" | "guessing" | "done";

export interface QnA {
  questionId?: string;
  question: string;
  answer: Answer;
  confidence: number; // confidence AFTER this answer
  sidhuQuip?: string;
}

export interface GameSession {
  sessionId: string;
  uid: string;
  mode: GameMode;
  startedAt: number;
  completedAt?: number;
  qnas: QnA[];
  finalGuess: string;
  isCorrect: boolean | null;
  ballsUsed: number;
}

// ─── Gemini AI Types ──────────────────────────────────────────────────────────

export interface GeminiQuestionResponse {
  question: string;
  estimatedConfidence: number;
  sidhuQuip: string;
  reasoning?: string;
}

export interface GeminiGuessResponse {
  guess: string;
  confidence: number;
  revealSpeech: string;
  sidhuQuote: string;
}

// ─── User & Leaderboard Types ─────────────────────────────────────────────────

export interface UserStats {
  uid: string;
  totalGames: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  avgQuestionsToSolve: number;
  lastPlayedAt: number;
  displayName: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  rank: number;
  streak: number;
  bestStreak: number;
  totalWins: number;
  avgQuestions: number;
  lastPlayedAt: number | { seconds: number };
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface GlobalAnalytics {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  mostGuessedEntities: Record<string, number>;
  hardestEntities: string[];
  avgQuestionsGlobal: number;
}

// ─── Zustand Store Types ─────────────────────────────────────────────────────

export type MoodState = "curious" | "excited" | "cocky" | "panic" | "win" | "loss";

export interface PersonalityContext {
  confidence: number;
  ballsUsed: number;
  mode: GameMode;
  lastAnswer: Answer | null;
  remainingCount: number;
  isCorrect?: boolean;
}

export interface GameStore {
  // State
  mode: GameMode | null;
  qnas: QnA[];
  currentQuestionId: string | null;
  currentQuestion: string;
  currentQuip: string;
  currentMood: MoodState;
  personalityLine: string;
  confidence: number;
  ballsUsed: number;
  gamePhase: GamePhase;
  guess: string;
  revealSpeech: string;
  sidhuQuote: string;
  isCorrect: boolean | null;
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
  remainingEntities: { name: string; probability: number }[];

  // Actions
  setMode: (mode: GameMode) => void;
  addAnswer: (answer: Answer, question: string, confidence: number, quip?: string, questionId?: string) => void;
  setCurrentQuestionId: (id: string | null) => void;
  setCurrentQuestion: (q: string, quip?: string) => void;
  setConfidence: (c: number) => void;
  setGamePhase: (phase: GamePhase) => void;
  setGuess: (guess: string, speech: string, quote: string) => void;
  setIsCorrect: (correct: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setSessionId: (id: string) => void;
  setError: (err: string | null) => void;
  setCurrentMood: (mood: MoodState) => void;
  setPersonalityLine: (line: string) => void;
  setRemainingEntities: (entities: { name: string; probability: number }[]) => void;
  resetGame: () => void;
}
