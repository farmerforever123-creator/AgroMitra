import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, lang } = req.body;

    // ✅ Validation
    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    console.log("👤 User:", message);
    console.log("🌐 Lang:", lang);

    // 🔥 Detect explicit override from user (optional)
    const wantsHindi =
      /[\u0900-\u097F]/.test(message) ||
      message.toLowerCase().includes("hindi");

    const wantsEnglish =
      message.toLowerCase().includes("english");

    // 🎯 FINAL LANGUAGE DECISION
    let finalLang = "en";

    if (wantsHindi) finalLang = "hi";
    else if (wantsEnglish) finalLang = "en";
    else if (lang === "hi") finalLang = "hi";
    else finalLang = "en";

    // 🧠 SYSTEM PROMPT (STRICT + CONTROLLED)
    const systemPrompt =
      finalLang === "hi"
        ? `
आप AgroMitra AI हैं, एक स्मार्ट कृषि सहायक।

नियम:
- केवल हिंदी में उत्तर दें
- उत्तर छोटा, स्पष्ट और उपयोगी रखें
- बुलेट पॉइंट्स में जवाब दें (जहाँ ज़रूरी हो)
- कठिन शब्दों से बचें
- केवल किसान से संबंधित व्यावहारिक सलाह दें
`
        : `
You are AgroMitra AI, a smart farming assistant.

Rules:
- Reply ONLY in English
- Keep answers short and practical
- Use bullet points when helpful
- Avoid complex words
- Focus on real farming solutions
`;

    // 🚀 API CALL
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.5 // more stable answers
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // ✅ SAFE RESPONSE PARSE
    const reply =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      "No response from AI";

    console.log("🤖 AI:", reply);

    return res.json({ reply });

  } catch (err) {
    console.error("❌ FULL ERROR:", err.message);
    console.error("❌ RESPONSE:", err.response?.data);

    return res.status(500).json({
      reply: "⚠️ Server error. Please try again."
    });
  }
});

export default router;