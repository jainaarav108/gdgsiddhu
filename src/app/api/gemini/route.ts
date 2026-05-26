import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function callGemini(prompt: string, maxTokens = 256): Promise<string> {
  const model = genAI().getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.9, maxOutputTokens: maxTokens },
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, prompt } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "Gemini API key not configured" }, { status: 500 });
    }

    switch (action) {
      // Rewrite a raw logical question in Sidhu's tone
      case "rewrite_question": {
        const text = await callGemini(prompt, 80);
        return NextResponse.json({ text });
      }

      // Generate personality dialogue for a game state
      case "personality_dialogue": {
        const text = await callGemini(prompt, 80);
        return NextResponse.json({ text });
      }

      // Generate the final dramatic guess reveal speech
      case "guess_reveal": {
        const text = await callGemini(prompt, 150);
        return NextResponse.json({ text });
      }

      // Legacy: raw prompt (used during dev)
      case "raw":
      default: {
        const text = await callGemini(prompt, 512);
        return NextResponse.json({ text });
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
