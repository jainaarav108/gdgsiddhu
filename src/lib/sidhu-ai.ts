import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getMoodState,
  getFallbackPhrase,
  buildPersonalityPrompt,
  buildQuestionRewritePrompt,
  type MoodState,
  type PersonalityContext,
} from "./personality";

// Client-side initialization of the Google Gen AI client
const getApiKey = () => {
  // First, check NEXT_PUBLIC prefix which is available in client components/browser
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  // Fallback to GEMINI_API_KEY (might be available during dev or SSR)
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  return "";
};

const getGenAIClient = () => {
  const key = getApiKey();
  if (!key) {
    console.warn("SidhuPredict: GEMINI_API_KEY is not set. Falling back to default expressions.");
    return null;
  }
  return new GoogleGenerativeAI(key);
};

async function callGeminiDirect(prompt: string, maxTokens = 256): Promise<string> {
  try {
    const client = getGenAIClient();
    if (!client) return "";

    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.9, maxOutputTokens: maxTokens },
    });

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini Direct Error:", err);
    return "";
  }
}

// Get a personality dialogue line for the current game state
export async function getPersonalityDialogue(ctx: PersonalityContext): Promise<string> {
  const mood = getMoodState(ctx);
  const prompt = buildPersonalityPrompt(mood, ctx);
  const text = await callGeminiDirect(prompt, 80);
  return text || getFallbackPhrase(mood);
}

// Rewrite a raw logical question in Sidhu's dramatic tone
export async function rewriteQuestion(
  rawQuestion: string,
  ctx: PersonalityContext
): Promise<{ styled: string; quip: string }> {
  const mood = getMoodState(ctx);
  const rewritePrompt = buildQuestionRewritePrompt(rawQuestion, mood, ctx.ballsUsed);
  const quipPrompt = buildPersonalityPrompt(mood, ctx, rawQuestion);

  const [styled, quip] = await Promise.all([
    callGeminiDirect(rewritePrompt, 80),
    callGeminiDirect(quipPrompt, 80),
  ]);

  return {
    styled: styled || rawQuestion,
    quip: quip || getFallbackPhrase(mood),
  };
}

// Build the final dramatic guess reveal
export async function buildGuessReveal(
  guess: string,
  ctx: PersonalityContext
): Promise<{ speech: string; quote: string }> {
  const modeLabel =
    ctx.mode === "player" ? "IPL player"
    : ctx.mode === "team" ? "IPL team"
    : "historic IPL match";

  const prompt = `You are "Sidhu Paaji AI" — a fictional desi cricket commentator AI persona.

You just guessed the ${modeLabel}: "${guess}" after ${ctx.ballsUsed} questions.
Confidence was ${Math.round(ctx.confidence)}%.

Write a dramatic reveal speech (2 sentences, max 30 words). Desi flavor. Cricket metaphors. Funny.
Then on a NEW LINE write a short philosophical Sidhu-style quote (max 15 words).

Format:
SPEECH: <speech here>
QUOTE: <quote here>`;

  const text = await callGeminiDirect(prompt, 150);

  const speechMatch = text.match(/SPEECH:\s*(.+)/i);
  const quoteMatch = text.match(/QUOTE:\s*(.+)/i);

  return {
    speech: speechMatch?.[1]?.trim() || `Oye hoye! Sidhu Paaji declares — it is ${guess}! 🎯`,
    quote: quoteMatch?.[1]?.trim() || "In cricket and life, the brave always find the boundary! 🏏",
  };
}

export { getMoodState, getFallbackPhrase };
export type { MoodState, PersonalityContext };
