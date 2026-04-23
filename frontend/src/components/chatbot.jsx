import { useState, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hello! Ask anything about farming." }
  ]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const [typing, setTyping] = useState(false);
  const [jump, setJump] = useState(false);

  // 🔥 AUTO JUMP EVERY 10 SEC
  useEffect(() => {
    const interval = setInterval(() => {
      setJump(true);

      setTimeout(() => {
        setJump(false);
      }, 200);

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🚀 SEND MESSAGE (API CONNECTED)
  const sendMessage = async (textParam) => {
    const text = textParam || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply },
      ]);

    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Server error. Try again later." },
      ]);
    }

    setTyping(false);
  };

  const quickActions = {
    weather: "weather today",
    price: "mandi price",
    fertilizer: "best fertilizer",
    disease: "crop disease"
  };

  return (
    <>
      {/* 🌿 FLOAT BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#2e7d32,#66bb6a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 28,
          cursor: "pointer",
          zIndex: 999,

          /* 🔥 ANIMATION */
          boxShadow: jump
            ? "0 0 25px rgba(76,175,80,0.9)"
            : "0 8px 20px rgba(0,0,0,0.3)",

          transform: jump ? "translateY(-12px)" : "translateY(0)",
          transition: "all 0.5s ease"
        }}

        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.15) translateY(-5px)";
          e.currentTarget.style.boxShadow =
            "0 0 30px rgba(76,175,80,1)";
        }}

        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 8px 20px rgba(0,0,0,0.3)";
        }}
      >
        🌿
      </div>

      {/* 💬 CHATBOX */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 20,
            width: 380,
            maxWidth: "95%",
            height: 520,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            zIndex: 999
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg,#1b5e20,#43a047)",
              color: "white",
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>🤖 Agro Mitra AI</div>

            <select
              onChange={(e) => setLang(e.target.value)}
              style={{ borderRadius: 6 }}
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ padding: 10 }}>
            {Object.keys(quickActions).map((key) => (
              <button
                key={key}
                onClick={() => sendMessage(quickActions[key])}
                style={{
                  margin: 4,
                  padding: "6px 10px",
                  borderRadius: 20,
                  border: "none",
                  background: "#e8f5e9",
                  cursor: "pointer"
                }}
              >
                {key}
              </button>
            ))}
          </div>

          {/* CHAT AREA */}
          <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.type === "user" ? "right" : "left",
                  marginBottom: 10
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background:
                      msg.type === "user" ? "#2e7d32" : "#e8f5e9",
                    color: msg.type === "user" ? "white" : "black",
                    padding: 10,
                    borderRadius: 12,
                    maxWidth: "75%"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && <div>🤖 typing...</div>}
          </div>

          {/* INPUT */}
          <div style={{ display: "flex", padding: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            />

            <button
              onClick={() => sendMessage()}
              style={{
                marginLeft: 8,
                background: "#2e7d32",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: 8
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}