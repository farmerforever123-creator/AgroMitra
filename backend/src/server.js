import dotenv from "dotenv";
import axios from "axios";
import app from "./app.js";
import chatRoute from "./routes/chat.js";

// 🔐 Load env
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Test route
// ✅ Test route (important for debugging)
app.get("/", (req, res) => {
  res.send("🚀 AgroMitra AI Backend Running");
});


// =====================================================
// ✅ PRIMARY CHAT ROUTE (MODULAR - BEST PRACTICE)
// =====================================================
app.use("/api/chat", chatRoute);


// =====================================================
// ⚡ FALLBACK CHAT ROUTE (DIRECT API CALL)
// =====================================================
// Only works if route file fails or not used

app.post("/api/chat-direct", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔥 OpenRouter API call (replace placeholder)
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are AgroMitra AI, a smart farming assistant.

Rules:
- Answer in bullet points
- Keep answers short and practical
- Hindi or English based on user
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error("❌ Chatbot Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Chatbot failed" });
  }
});


// =====================================================
// ❌ 404 HANDLER
// =====================================================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// =====================================================
// ❌ GLOBAL ERROR HANDLER
// =====================================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});


// =====================================================
// 🚀 START SERVER
// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});