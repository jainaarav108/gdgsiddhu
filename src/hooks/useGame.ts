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

  const confirmResult = useCallback(
    async (isCorrect: boolean) => {
      const currentState = useGameStore.getState();
      if (!uid || !currentState.sessionId) return;
      currentState.setIsCorrect(isCorrect);

      const mood = isCorrect ? "win" : "loss";
      currentState.setCurrentMood(mood);
      getPersonalityDialogue(
        getCtx({ isCorrect, confidence: currentState.confidence })
      ).then((line) => currentState.setPersonalityLine(line));

      try {
        await completeSession(currentState.sessionId, currentState.qnas, currentState.guess, isCorrect, currentState.ballsUsed);
        await updateUserAfterGame(uid, isCorrect, currentState.ballsUsed);
      } catch (err) {
        console.error(err);
      }
    },
    [uid, getCtx]
  );

  const submitAnswer = useCallback(
    async (answer: Answer) => {
      const currentState = useGameStore.getState();
      if (isProcessingRef.current || currentState.isLoading || !currentState.mode || !currentState.currentQuestionId) return;
      isProcessingRef.current = true;
      currentState.setIsLoading(true);

      try {
        const newBallsUsed = currentState.ballsUsed + 1;

        // Initialize entropy engine and load state from store
        const engine = new EntropyEngine(currentState.mode);
        const qnasHistory = currentState.qnas.map((q) => ({
          questionId: q.questionId!,
          answer: q.answer,
        }));
        engine.loadState(qnasHistory);

        // Update probabilities based on new user answer
        engine.updateProbability(currentState.currentQuestionId, answer);

        const newConfidence = Math.round(engine.getConfidence() * 100);
        const remaining = engine.getRemainingEntities();
        currentState.setRemainingEntities(
          remaining.map((r) => ({ name: r.entity.name, probability: r.probability }))
        );

        // If the question was a confirmation question and user said "yes", we won!
        const isConfirmation = currentState.currentQuestionId.startsWith("confirm_");
        if (isConfirmation && answer === "yes") {
          const guessName = currentState.currentQuestionId.substring("confirm_".length);
          currentState.addAnswer(answer, currentState.currentQuestion, 100, currentState.currentQuip, currentState.currentQuestionId);

          const ctx = getCtx({
            confidence: 100,
            ballsUsed: newBallsUsed,
            lastAnswer: answer,
            remainingCount: remaining.length,
          });

          const { speech, quote } = await buildGuessReveal(guessName, ctx);

          currentState.setConfidence(100);
          currentState.setGuess(guessName, speech, quote);
          await confirmResult(true);
          router.push("/result");
          return;
        }

        // Add answer to Zustand (either normal question or a rejected confirmation question)
        currentState.addAnswer(answer, currentState.currentQuestion, newConfidence, currentState.currentQuip, currentState.currentQuestionId);

        // Check if we should guess (which only happens if we are at MAX_BALLS)
        const isAtMaxBalls = newBallsUsed >= MAX_BALLS;

        if (isAtMaxBalls) {
          currentState.setGamePhase("guessing");

          const bestGuessEntity = engine.getBestGuess();
          const guessName = bestGuessEntity.name;

          const ctx = getCtx({
            confidence: newConfidence,
            ballsUsed: newBallsUsed,
            lastAnswer: answer,
            remainingCount: remaining.length,
          });

          const { speech, quote } = await buildGuessReveal(guessName, ctx);

          currentState.setConfidence(newConfidence);
          currentState.setGuess(guessName, speech, quote);
          router.push("/result");
        } else {
          // Determine if we should ask a confirmation question
          const topEntity = remaining[0];
          const shouldConfirm = topEntity && topEntity.probability > 0.80;

          if (shouldConfirm) {
            currentState.setGamePhase("thinking");
            const guessName = topEntity.entity.name;
            const rawConfirmQuestion = `Is your ${
              currentState.mode === "player" ? "player" : currentState.mode === "team" ? "team" : "match"
            } ${guessName}?`;
            const nextQuestionId = `confirm_${guessName}`;

            const ctx = getCtx({
              confidence: newConfidence,
              ballsUsed: newBallsUsed,
              lastAnswer: answer,
              remainingCount: remaining.length,
            });
            const mood = getMoodState(ctx);
            currentState.setCurrentMood(mood);

            const [personalityLine, rewriteResult] = await Promise.all([
              getPersonalityDialogue(ctx),
              rewriteQuestion(rawConfirmQuestion, ctx),
            ]);

            currentState.setCurrentQuestionId(nextQuestionId);
            currentState.setCurrentQuestion(rewriteResult.styled, rewriteResult.quip);
            currentState.setConfidence(newConfidence);
            currentState.setPersonalityLine(personalityLine);
            currentState.setGamePhase("asking");
          } else {
            // Ask normal question
            currentState.setGamePhase("thinking");

            const ctx = getCtx({
              confidence: newConfidence,
              ballsUsed: newBallsUsed,
              lastAnswer: answer,
              remainingCount: remaining.length,
            });
            const mood = getMoodState(ctx);
            currentState.setCurrentMood(mood);

            const nextQResult = engine.selectBestQuestion();

            if (!nextQResult) {
              // Out of questions - force a guess
              const bestGuessEntity = engine.getBestGuess();
              const guessName = bestGuessEntity.name;
              const { speech, quote } = await buildGuessReveal(guessName, ctx);
              currentState.setConfidence(newConfidence);
              currentState.setGuess(guessName, speech, quote);
              router.push("/result");
              return;
            }

            // Next question details + tone rewrite in parallel
            const [personalityLine, rewriteResult] = await Promise.all([
              getPersonalityDialogue(ctx),
              rewriteQuestion(nextQResult.question.text, ctx),
            ]);

            currentState.setCurrentQuestionId(nextQResult.question.id);
            currentState.setCurrentQuestion(rewriteResult.styled, rewriteResult.quip);
            currentState.setConfidence(newConfidence);
            currentState.setPersonalityLine(personalityLine);
            currentState.setGamePhase("asking");
          }
        }
      } catch (err) {
        currentState.setError("Oye! The pitch got wet. Let's try that again!");
        console.error(err);
        currentState.setGamePhase("asking");
      } finally {
        currentState.setIsLoading(false);
        isProcessingRef.current = false;
      }
    },
    [router, getCtx, confirmResult]
  );

  return { startGame, submitAnswer, confirmResult };
}
