// src/Model.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🧠 Init Gemini model
const genAI = new GoogleGenerativeAI("AIzaSyBR58b5y2UJLqHwy_5xeXxvHOkE7SVSpXk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyze user input using Gemini AI to extract summary + keywords.
 * @param {string} userInput
 * @returns {Promise<{summary: string, keywords: string[]}>}
 */
export const analyzeUserInput = async (userInput) => {
  const prompt = `
You are a helpful assistant.

Strictly return ONLY valid JSON in this format:
{
  "summary": "A short personalized summary of the user's input",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Do NOT include markdown, explanations, or extra text.
User Input: "${userInput}"
`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Clean any markdown backticks or json tags
    const cleaned = raw.replace(/```json|```/g, "").trim();
    console.log("🧠 Raw Gemini Output:\n", cleaned);

    const parsed = JSON.parse(cleaned);

    if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
      console.warn(
        "⚠️ Missing or invalid keywords array. Defaulting to empty."
      );
      parsed.keywords = [];
    }

    return parsed;
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    return {
      summary: "I couldn't analyze your input.",
      keywords: [],
    };
  }
};

// === 🔬 Test the function directly ===
const testPrompt =
  "I feel burnt out lately. I want to recharge and find more joy in daily life.";

analyzeUserInput(testPrompt).then((result) => {
  console.log("✅ Final Parsed Result:");
  console.log("Summary:", result.summary);
  console.log("Keywords:", result.keywords);
});
