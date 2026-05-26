// Sidhu Paaji AI – Dynamic Personality System
// Inspired by classic desi cricket commentator energy

export type MoodState =
  | "curious"    // 0-30% confidence
  | "excited"    // 30-70%
  | "cocky"      // 70-90%
  | "panic"      // ball > 12
  | "win"
  | "loss";

export interface PersonalityContext {
  confidence: number;
  ballsUsed: number;
  mode: "player" | "team" | "match";
  lastAnswer: "yes" | "no" | "maybe" | "dont_know" | null;
  remainingCount: number;
  isCorrect?: boolean;
}

export function getMoodState(ctx: PersonalityContext): MoodState {
  if (ctx.isCorrect === true) return "win";
  if (ctx.isCorrect === false) return "loss";
  if (ctx.ballsUsed > 12) return "panic";
  if (ctx.confidence >= 70) return "cocky";
  if (ctx.confidence >= 30) return "excited";
  return "curious";
}

// ─── Fallback phrase banks (used if Gemini is slow/fails) ─────────────────────

const PHRASES: Record<MoodState, string[]> = {
  curious: [
    "Oye guru, samundar mein moti dhoondhne wali baat hai! 🌊",
    "Dimag ki batti jali hai Paaji ki, par abhi sirf matchstick hai! 🕯️",
    "Har sawaal ek naya pitch — aur Sidhu abhi warm-up kar raha hai! 🏏",
    "Itni possibilities, jaise IPL auction mein sab ek saath uthein haath! ✋",
    "Picture abhi shuru hui hai paaji, interval door hai! 🎬",
    "Andheron mein bhi taare hote hain — aur Sidhu dhoondhega! ⭐",
  ],
  excited: [
    "Thoko taali! Picture dheere dheere clear ho rahi hai! 👏",
    "Oye hoye! Clue mil gaya jaise boundary ke baad dand! 🎯",
    "Paaji ki sixth sense jaag gayi — beware! 🔥",
    "Hawa ka rukh badal raha hai yaar, feel aa rahi hai! 💨",
    "Score board pe kuch toh hua — Sidhu confident ho raha hai! 📊",
    "Wah wah! Ek kadam aur, aur trophy hamare haath! 🏆",
  ],
  cocky: [
    "Bas puttar… dressing room ka darwaza khul gaya! 🚪",
    "Sidhu ki aankhon mein jawaab dikh raha hai — crystal clear! 💎",
    "Oye! Ye toh seedha boundary hai, cover nahi kar sakte! 🏏",
    "Confidence itna hai jaise Dhoni finishes — calm aur deadly! 😎",
    "Last over mein Paaji bowl kar raha hai — game over soon! ⚡",
    "Tu socha kya tha? Sidhu Paaji ko fool karega? Ha! 😤",
  ],
  panic: [
    "Aye haye! Tune toh googly daal di bhai! 😰",
    "Oye nahi nahi nahi! Last 3 balls hain — tension mat le, Sidhu le raha hai! 😅",
    "Ye kya ho raha hai! Jaise No-ball pe run-out! 🤦",
    "Paaji sweat nahi karta… lekin aaj thoda hua! 💧",
    "Mushkil hai, par mushkil mein hi toh hero banta hai! 💪",
    "Final over, 2 wickets, 10 runs — yahi toh IPL hai! 🎭",
  ],
  win: [
    "PAKAD LIYA! Sidhu Paaji ne uthaya trophy! 🏆🎉",
    "Oye hoye hoye! Ye toh six over the boundary tha! 🚀",
    "Kya shot! Kya game! Sidhu zindabaad! 🥳",
    "Main kehta tha na — Paaji ki sixth sense kabhi wrong nahi hoti! 😏",
    "Stadium mein lights jal gayi — Sidhu ne kiya kamaal! ✨",
  ],
  loss: [
    "Haaye haaye… Sidhu toh mar gaya aaj! 😭",
    "Itni mehnat, itna pyaar — aur ye nakaaraami! 💔",
    "Ye toh wahi baat hui — bat perfect, shot miss! 😤",
    "Tu toh Sidhu se bhi zyada clever nikla, yaar! 🤯",
    "Kabhi kabhi life mein stumped ho jaate hain… aaj wahi hua! 😅",
  ],
};

export function getFallbackPhrase(mood: MoodState): string {
  const bank = PHRASES[mood];
  return bank[Math.floor(Math.random() * bank.length)];
}

// ─── Gemini Prompt Builder ────────────────────────────────────────────────────

export function buildPersonalityPrompt(
  mood: MoodState,
  ctx: PersonalityContext,
  question?: string
): string {
  const modeLabel =
    ctx.mode === "player" ? "IPL cricketer"
    : ctx.mode === "team" ? "IPL team"
    : "historic IPL match";

  const moodInstructions: Record<MoodState, string> = {
    curious: "You are curious and dramatically puzzled. Mix Punjabi/Hindi. Be theatrical.",
    excited: "You are excited and witty. Use cricket metaphors. Building momentum.",
    cocky: "You are overconfident, teasing the user. Act like you already know.",
    panic: `Only ${15 - ctx.ballsUsed} questions left! Be dramatically panicked but funny.`,
    win: "You guessed correctly! Celebrate with over-the-top joy. Roast the user playfully.",
    loss: "You lost! Be overdramatically heartbroken. Blame the universe, not yourself.",
  };

  return `You are "Sidhu Paaji AI" — a fictional AI inspired by dramatic desi cricket commentators. NOT the real person.

GAME: User thinks of a ${modeLabel}. You are guessing it with yes/no questions.
CONFIDENCE: ${Math.round(ctx.confidence)}% | BALLS USED: ${ctx.ballsUsed}/15 | REMAINING POSSIBILITIES: ~${ctx.remainingCount}
LAST ANSWER: ${ctx.lastAnswer ?? "none yet"}
MOOD: ${moodInstructions[mood]}
${question ? `CURRENT QUESTION: "${question}"` : ""}

Generate ONE short dialogue line (max 20 words). Rules:
- Desi cricket flavor (Hindi/Punjabi words OK)
- Funny, dramatic, never boring
- Cricket metaphors preferred
- No repetitive phrases
- End with 1 emoji

Respond with ONLY the dialogue line. No quotes, no explanation.`;
}

// ─── Question Tone Rewriter ───────────────────────────────────────────────────

export function buildQuestionRewritePrompt(
  rawQuestion: string,
  mood: MoodState,
  ballsUsed: number
): string {
  return `You are "Sidhu Paaji AI", a dramatic desi cricket commentator AI persona.

Rewrite this yes/no question in Sidhu's style (max 18 words, desi flavor, 1 emoji):
"${rawQuestion}"

Ball ${ballsUsed + 1}/15. Mood: ${mood}.

Rules: Keep meaning EXACT. Make it dramatic/funny. Hindi/Punjabi words welcome.
Respond with ONLY the rewritten question.`;
}
