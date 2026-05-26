"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { createSession, completeSession, updateUserAfterGame } from "@/lib/firestore";
import { getPersonalityDialogue, rewriteQuestion, buildGuessReveal } from "@/lib/sidhu-ai";
import { getMoodState } from "@/lib/personality";
import { EntropyEngine } from "@/lib/entropy";
import type { Answer, PersonalityContext } from "@/types";
import { MAX_BALLS } from "@/constants/ipl";

export function useGame(uid: string | null) {
  const store = useGameStore();
  const router = useRouter();
  const isProcessingRef = useRef(false);

  const getCtx = useCallback(
    (overrides?: Partial<PersonalityContext>): PersonalityContext => ({
      confidence: store.confidence,
      ballsUsed: store.ballsUsed,
      mode: store.mode ?? "player",
      lastAnswer: null,
      remainingCount: store.remainingEntities.length,
      ...overrides,
    }),
    [store.confidence, store.ballsUsed, store.mode, store.remainingEntities.length]
  );

  const startGame = useCallback(async () => {
    if (!uid || !store.mode) return;
    store.setIsLoading(true);
    store.setError(null);

    try {
      const sessionId = await createSession(uid, store.mode);
      store.setSessionId(sessionId);

      // Initialize local entropy engine
      const engine = new EntropyEngine(store.mode);
      const bestQResult = engine.selectBestQuestion();

      if (!bestQResult) {
        throw new Error("No candidate questions found.");
      }

      const initialRemaining = engine.getRemainingEntities();
      store.setRemainingEntities(
        initialRemaining.map((r) => ({ name: r.entity.name, probability: r.probability }))
      );

      // First question + opening personality line in parallel
      const initialConfidence = Math.round(engine.getConfidence() * 100);
      const ctx = getCtx({
        confidence: initialConfidence,
        ballsUsed: 0,
        remainingCount: initialRemaining.length,
      });

      const [opening, rewriteResult] = await Promise.all([
        getPersonalityDialogue(ctx),
        rewriteQuestion(bestQResult.question.text, ctx),
      ]);

      const mood = getMoodState(ctx);

      store.setCurrentQuestionId(bestQResult.question.id);
      store.setCurrentQuestion(rewriteResult.styled, rewriteResult.quip);
      store.setConfidence(initialConfidence);
      store.setCurrentMood(mood);
      store.setPersonalityLine(opening);
    } catch (err) {
      store.setError("Oye! Sidhu Paaji is warming up, please restart the game!");
      console.error(err);
    } finally {
      store.setIsLoading(false);
    }
  }, [uid, store, getCtx]);

  const submitAnswer = useCallback(
    async (answer: Answer) => {
      if (isProcessingRef.current || store.isLoading || !store.mode || !store.currentQuestionId) return;
      isProcessingRef.current = true;
      store.setIsLoading(true);

      try {
        const newBallsUsed = store.ballsUsed + 1;

        // Initialize entropy engine and load state from store
        const engine = new EntropyEngine(store.mode);
        const qnasHistory = store.qnas.map((q) => ({
          questionId: q.questionId!,
          answer: q.answer,
        }));
        engine.loadState(qnasHistory);

        // Update probabilities based on new user answer
        engine.updateProbability(store.currentQuestionId, answer);

        const newConfidence = Math.round(engine.getConfidence() * 100);
        const remaining = engine.getRemainingEntities();
        store.setRemainingEntities(
          remaining.map((r) => ({ name: r.entity.name, probability: r.probability }))
        );

        // Add answer to Zustand
        store.addAnswer(answer, store.currentQuestion, newConfidence, store.currentQuip, store.currentQuestionId);

        // Aggressive guessing triggers at 85%, and direct guess allowed before 15 balls at 95% confidence
        const shouldGuess =
          newBallsUsed >= MAX_BALLS ||
          newConfidence >= 95 ||
          (newConfidence >= 85 && remaining[0].probability > 0.85);

        if (shouldGuess) {
          store.setGamePhase("guessing");

          const bestGuessEntity = engine.getBestGuess();
          const guessName = bestGuessEntity.name;

          const ctx = getCtx({
            confidence: newConfidence,
            ballsUsed: newBallsUsed,
            lastAnswer: answer,
            remainingCount: remaining.length,
          });

          const { speech, quote } = await buildGuessReveal(guessName, ctx);

          store.setConfidence(newConfidence);
          store.setGuess(guessName, speech, quote);
          router.push("/result");
        } else {
          store.setGamePhase("thinking");

          const ctx = getCtx({
            confidence: newConfidence,
            ballsUsed: newBallsUsed,
            lastAnswer: answer,
            remainingCount: remaining.length,
          });
          const mood = getMoodState(ctx);
          store.setCurrentMood(mood);

          const nextQResult = engine.selectBestQuestion();

          if (!nextQResult) {
            // Out of questions - force a guess
            const bestGuessEntity = engine.getBestGuess();
            const guessName = bestGuessEntity.name;
            const { speech, quote } = await buildGuessReveal(guessName, ctx);
            store.setConfidence(newConfidence);
            store.setGuess(guessName, speech, quote);
            router.push("/result");
            return;
          }

          // Next question details + tone rewrite in parallel
          const [personalityLine, rewriteResult] = await Promise.all([
            getPersonalityDialogue(ctx),
            rewriteQuestion(nextQResult.question.text, ctx),
          ]);

          store.setCurrentQuestionId(nextQResult.question.id);
          store.setCurrentQuestion(rewriteResult.styled, rewriteResult.quip);
          store.setConfidence(newConfidence);
          store.setPersonalityLine(personalityLine);
          store.setGamePhase("asking");
        }
      } catch (err) {
        store.setError("Oye! The pitch got wet. Let's try that again!");
        console.error(err);
        store.setGamePhase("asking");
      } finally {
        store.setIsLoading(false);
        isProcessingRef.current = false;
      }
    },
    [store, router, getCtx]
  );

  const confirmResult = useCallback(
    async (isCorrect: boolean) => {
      if (!uid || !store.sessionId) return;
      store.setIsCorrect(isCorrect);

      const mood = isCorrect ? "win" : "loss";
      store.setCurrentMood(mood);
      getPersonalityDialogue(
        getCtx({ isCorrect, confidence: store.confidence })
      ).then((line) => store.setPersonalityLine(line));

      try {
        await completeSession(store.sessionId, store.qnas, store.guess, isCorrect, store.ballsUsed);
        await updateUserAfterGame(uid, isCorrect, store.ballsUsed);
      } catch (err) {
        console.error(err);
      }
    },
    [uid, store, getCtx]
  );

  return { startGame, submitAnswer, confirmResult };
}
