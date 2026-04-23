import express from "express";
import OpenAI from "openai";

const router = express.Router();

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // 🧠 Basic validation
    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    console.log("👤 User:", message);

    // 🤖 OpenAI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are AgroMitra AI, a smart farming assistant for Indian farmers.

Your job:
- Give simple, practical farming advice
- Answer in easy language (Hindi or English depending on user)
- Help with crops, fertilizers, pesticides, weather, mandi prices

Rules:
- Keep answers short and useful
- Use bullet points when helpful
- Avoid complex scientific jargon
- Focus on real farmer needs
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

    // ✅ Send response
    res.json({ reply });

  } catch (error) {
    console.error("❌ ERROR:", error.message);

    res.status(500).json({
      reply: "⚠️ Server error. Please try again.",
    });
  }
});

export default router;