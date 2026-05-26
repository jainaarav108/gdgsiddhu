import type { GameMode, QnA, GeminiQuestionResponse, GeminiGuessResponse } from "@/types";
import { IPL_PLAYERS, IPL_TEAM_NAMES, IPL_HISTORIC_MATCH_NAMES } from "@/constants/ipl";

function getEntityList(mode: GameMode): string[] {
  if (mode === "player") return IPL_PLAYERS;
  if (mode === "team") return IPL_TEAM_NAMES;
  return IPL_HISTORIC_MATCH_NAMES;
}

function buildQuestionPrompt(
  mode: GameMode,
  qnas: QnA[],
  ballsUsed: number
): string {
  const remaining = 15 - ballsUsed;
  const entities = getEntityList(mode);
  const entityContext =
    mode === "player"
      ? "an IPL cricket player"
      : mode === "team"
      ? "an IPL team/franchise"
      : "a historic IPL match or moment";

  const qnaHistory =
    qnas.length > 0
      ? qnas
          .map(
            (q, i) =>
              `Q${i + 1}: "${q.question}" → Answer: ${q.answer.toUpperCase()}`
          )
          .join("\n")
      : "No questions asked yet.";

  const askedQuestions = qnas.map((q) => q.question);

  return `You are Navjot Singh Sidhu, the legendary, witty, flamboyant Indian cricket commentator. You are playing an Akinator-style guessing game. The user is thinking of ${entityContext}.

GAME RULES:
- You have exactly ${remaining} questions left (out of 15 total "balls")
- You must ask ONE strategic yes/no question to narrow down possibilities
- Questions MUST be answerable with: yes, no, maybe, or don't know
- DO NOT repeat any previously asked question

POSSIBLE ${mode.toUpperCase()}S IN THE GAME:
${entities.join(", ")}

QUESTIONS ALREADY ASKED:
${qnaHistory}

TASK: Generate the SINGLE BEST strategic yes/no question that will maximally eliminate possibilities based on the answers so far. 

SIDHU STYLE RULES:
- Be witty and add Punjabi flavor (Oye!, Paaji, Wah wah!, Shabash!)
- Use cricket metaphors cleverly
- Frame as a dramatic question, not boring/clinical
- Add a short funny "quip" (a Sidhu-style one-liner observation)

Respond ONLY with valid JSON in this exact format:
{
  "question": "The actual yes/no question here",
  "estimatedConfidence": 25,
  "sidhuQuip": "A funny Sidhu-style observation or Punjabi exclamation",
  "reasoning": "Brief internal reasoning about why this question"
}

estimatedConfidence: integer 0-100 representing how confident you are about identifying the answer after these responses.
The question should be fresh, strategic, and entertaining!`;
}

function buildGuessPrompt(mode: GameMode, qnas: QnA[]): string {
  const entityContext =
    mode === "player"
      ? "an IPL cricket player"
      : mode === "team"
      ? "an IPL team/franchise"
      : "a historic IPL match or moment";

  const qnaHistory = qnas
    .map(
      (q, i) =>
        `Q${i + 1}: "${q.question}" → ${q.answer.toUpperCase()}`
    )
    .join("\n");

  const entities = getEntityList(mode);

  return `You are Navjot Singh Sidhu. You've been playing a guessing game. The user is thinking of ${entityContext}.

QUESTIONS AND ANSWERS:
${qnaHistory}

POSSIBLE ${mode.toUpperCase()}S:
${entities.join(", ")}

Based on all the clues, make your BEST GUESS about what the user is thinking of. Be dramatic, confident, and entertaining!

Respond ONLY with valid JSON:
{
  "guess": "Your best guess (exact name from the list if possible)",
  "confidence": 85,
  "revealSpeech": "A dramatic 2-3 sentence Sidhu reveal speech with Punjabi flair and cricket metaphors",
  "sidhuQuote": "One classic Sidhu-style philosophical quote about cricket or life"
}`;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gemini API call failed");
  }

  const data = await response.json();
  return data.text;
}

function parseJSON<T>(text: string): T {
  // Extract JSON from possible markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  // Find JSON object in the string
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!objMatch) throw new Error("No JSON object found in response");

  return JSON.parse(objMatch[0]) as T;
}

export async function generateQuestion(
  mode: GameMode,
  qnas: QnA[],
  ballsUsed: number
): Promise<GeminiQuestionResponse> {
  const prompt = buildQuestionPrompt(mode, qnas, ballsUsed);
  const text = await callGemini(prompt);
  
  try {
    const parsed = parseJSON<GeminiQuestionResponse>(text);
    return {
      question: parsed.question || "Is this entity known for batting?",
      estimatedConfidence: Math.min(100, Math.max(0, parsed.estimatedConfidence || 20)),
      sidhuQuip: parsed.sidhuQuip || "Oye hoye! Let's see paaji!",
      reasoning: parsed.reasoning,
    };
  } catch {
    // Fallback if parsing fails
    return {
      question: text.length < 200 ? text : "Is this entity from the southern part of India?",
      estimatedConfidence: 20 + ballsUsed * 5,
      sidhuQuip: "Oye! Sidhu is thinking deep!",
    };
  }
}

export async function makeGuess(
  mode: GameMode,
  qnas: QnA[]
): Promise<GeminiGuessResponse> {
  const prompt = buildGuessPrompt(mode, qnas);
  const text = await callGemini(prompt);

  try {
    const parsed = parseJSON<GeminiGuessResponse>(text);
    return {
      guess: parsed.guess || "MS Dhoni",
      confidence: Math.min(100, Math.max(0, parsed.confidence || 70)),
      revealSpeech:
        parsed.revealSpeech ||
        "Oye paaji! Sidhu has spoken! The answer has been revealed!",
      sidhuQuote:
        parsed.sidhuQuote ||
        "Cricket is not just a game, it is a way of life!",
    };
  } catch {
    return {
      guess: "MS Dhoni",
      confidence: 70,
      revealSpeech:
        "Oye hoye! After deep contemplation like a wise sage, Sidhu believes the answer is revealed!",
      sidhuQuote: "When in doubt, trust Sidhu Paaji!",
    };
  }
}
