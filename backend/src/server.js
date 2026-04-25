import dotenv from "dotenv";
import app from "./app.js";
import chatRoute from "./routes/chat.js";

// 🔐 Load env variables
dotenv.config();

// ✅ Test route (important for debugging)
app.get("/", (req, res) => {
  res.send("🚀 AgroMitra AI Backend Running");
});

// ✅ Chat route
app.use("/api/chat", chatRoute);

// ❌ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ❌ Global error handler (important)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});