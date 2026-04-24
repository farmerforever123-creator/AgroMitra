import express from "express";
import OpenAI from "openai";

const router = express.Router();

// ✅ Lazy initialization
let openai;

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing in .env");
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openai;
};

// ✅ POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // 🧠 Validation
    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    console.log("👤 User:", message);

    // ✅ Get OpenAI instance safely
    const openai = getOpenAI();

    // 🤖 AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are AgroMitra AI, a smart farming assistant for Indian farmers.

Your job:
- Give simple, practical farming advice
- Answer in Hindi or simple English
- Help with crops, fertilizers, pesticides, weather, mandi prices

Rules:
- Keep answers short
- Use bullet points
- Avoid complex terms
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    console.log("🤖 AI:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("❌ ERROR:", error.message);

    // ✅ Better error handling
    if (error.message.includes("OPENAI_API_KEY")) {
      return res.status(500).json({
        reply: "⚠️ AI service not configured properly.",
      });
    }

    res.status(500).json({
      reply: "⚠️ Server error. Please try again.",
    });
  }
});

export default router;
