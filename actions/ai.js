"use server";

import { GoogleGenAI } from "@google/genai";

// Make sure this env var exists in .env.local
// GOOGLE_GEMINI_KEY=sk-xxxx
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

export async function runAi(prompt) {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("runAi(prompt) requires a non-empty string");
  }

  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  // Be defensive about SDK response shapes across versions
  const text =
    res.output_text ??
    res.candidates?.[0]?.content?.parts?.[0]?.text ??
    res.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
    res.output?.[0]?.content?.[0]?.text ??
    "";

  if (!text) {
    console.error("Gemini raw response (no text found):", JSON.stringify(res, null, 2));
    throw new Error("No text returned from Gemini");
  }

  return text;
}

