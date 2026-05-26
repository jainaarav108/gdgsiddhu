import { create } from "zustand";
import type { GameMode, QnA, Answer, GamePhase, GameStore } from "@/types";
import type { MoodState } from "@/lib/personality";

const initialState = {
  mode: null as GameMode | null,
  qnas: [] as QnA[],
  currentQuestionId: null as string | null,
  currentQuestion: "",
  currentQuip: "",
  currentMood: "curious" as MoodState,
  personalityLine: "",
  confidence: 0,
  ballsUsed: 0,
  gamePhase: "idle" as GamePhase,
  guess: "",
  revealSpeech: "",
  sidhuQuote: "",
  isCorrect: null as boolean | null,
  isLoading: false,
  sessionId: null as string | null,
  error: null as string | null,
  remainingEntities: [] as { name: string; probability: number }[],
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setMode: (mode: GameMode) => set({ mode, gamePhase: "asking" }),

  addAnswer: (answer: Answer, question: string, confidence: number, quip?: string, questionId?: string) =>
    set((state) => ({
      qnas: [...state.qnas, { question, answer, confidence, sidhuQuip: quip, questionId }],
      ballsUsed: state.ballsUsed + 1,
      confidence,
    })),

  setCurrentQuestionId: (id: string | null) => set({ currentQuestionId: id }),

  setCurrentQuestion: (q: string, quip?: string) =>
    set({ currentQuestion: q, currentQuip: quip || "" }),

  setConfidence: (confidence: number) => set({ confidence }),

  setGamePhase: (gamePhase: GamePhase) => set({ gamePhase }),

  setGuess: (guess: string, revealSpeech: string, sidhuQuote: string) =>
    set({ guess, revealSpeech, sidhuQuote, gamePhase: "guessing" }),

  setIsCorrect: (isCorrect: boolean) => set({ isCorrect, gamePhase: "done" }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  setSessionId: (sessionId: string) => set({ sessionId }),

  setError: (error: string | null) => set({ error }),

  setCurrentMood: (currentMood: MoodState) => set({ currentMood }),

  setPersonalityLine: (personalityLine: string) => set({ personalityLine }),

  setRemainingEntities: (remainingEntities: { name: string; probability: number }[]) => set({ remainingEntities }),

  resetGame: () => set(initialState),
}));
