// routes/recommend.js
import express from "express";
import { analyzeUserInput } from "../gemini/model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const result = await analyzeUserInput(prompt);
    return res.json(result); // ✅ should be { summary, keywords }
  } catch (err) {
    console.error("❌ Error in /recommend route:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate recommendation." });
  }
});

export default router;
