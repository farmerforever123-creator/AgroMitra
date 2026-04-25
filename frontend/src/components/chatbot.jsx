import { useState, useEffect, useRef } from "react";

// define Brand/UX Constants for easy tuning
const COLORS = {
  primary: "linear-gradient(135deg,#2e7d32,#66bb6a)",
  primaryHeader: "linear-gradient(135deg,#1b5e20,#43a047)",
  userBg: "#2e7d32",
  userText: "#ffffff",
  botBg: "#e8f5e9", // Very light green
  botText: "#1f2937",
  quickActionBg: "#f0fdf4",
  glassBg: "rgba(255, 255, 255, 0.88)",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hello from AgroMitra! Ask anything about farming, crops, or mandi prices." }
  ]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const [typing, setTyping] = useState(false);
  const [isIdleBouncing, setIsIdleBouncing] = useState(true);
  const chatEndRef = useRef(null);
  const [jump, setJump] = useState(false);


  useEffect(() => {
  const interval = setInterval(() => {
    setJump(true);

    setTimeout(() => {
      setJump(false);
    }, 200);

  }, 6000);

  return () => clearInterval(interval);
}, []);



  // 1. 🔥 Inject Keyframe Animations dynamically
  useEffect(() => {
    const cssKeyframes = `
      @keyframes agromitra-pulse-glow {
        0% { box-shadow: 0 0 0 0 rgba(76,175,80,0.7); }
        70% { box-shadow: 0 0 10px 20px rgba(76,175,80,0); }
        100% { box-shadow: 0 0 0 0 rgba(76,175,80,0); }
      }
      @keyframes agromitra-idle-bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
        40% { transform: translateY(-20px) scale(1.05); }
        60% { transform: translateY(-10px) scale(1.02); }
      }
      @keyframes agromitra-message-entry {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes agromitra-dot-bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-6px); }
      }
      /* Custom scrollbar for glass effect */
      .agromitra-chat-area::-webkit-scrollbar { width: 5px; }
      .agromitra-chat-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
      .agromitra-chat-area::-webkit-scrollbar-thumb { background: rgba(46,125,50,0.3); border-radius: 10px; }
    `;
    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.innerHTML = cssKeyframes;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  // 2. 🔥 Auto Scroll & Idle Bounce Management
  useEffect(() => {
    // Scroll to bottom whenever messages or typing state changes
    if (visible) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing, visible]);

  useEffect(() => {
    // Disable idle bounce after first interaction or when open
    if (open || messages.length > 1) {
      setIsIdleBouncing(false);
    } else {
      const timer = setTimeout(() => setIsIdleBouncing(true), 20000); // Rebounce after 20s if no interaction
      return () => clearTimeout(timer);
    }
  }, [open, messages]);

  // 3. 🔥 SEND MESSAGE (API Logic - Maintained)
  const sendMessage = async (textParam) => {
    const text = textParam || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      // NOTE: User must run their local server
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang }),
      });

      if (!res.ok) throw new Error("API Network issues");
      const data = await res.json();

      // simulate slightly dynamic response time for animation realism
      const responseDelay = data.reply.length > 50 ? 1500 : 700;
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
        setTyping(false);
      }, responseDelay);

    } catch (error) {
      console.error("AgroMitra Chat Error:", error);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "⚠️ Server error. Please ensure local server is running or try again later." },
        ]);
        setTyping(false);
      }, 1000);
    }
  };

  const quickActions = { weather: "🌤️ Weather", price: "💰 Mandi Price", fertilizer: "🌱 Fertilizer Guide", disease: "🐛 Crop Diseases" };
  const getSuggestionPlaceholder = () => lang === "en" ? "Ask about crops, rain, or prices..." : "फ़सल, बारिश या मंडी भाव पूछें...";

  // UI Structure
  return (
    <>
      {/* 🌿 FLOAT BUTTON (FIXED SIZE + CLEAN) */}
<div
  onClick={() => {
    if (!open) {
      setOpen(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      setTimeout(() => setOpen(false), 300);
    }
  }}

  // 🔥 HOVER START
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow =
      "0 0 30px rgba(76,175,80,0.9), 0 10px 30px rgba(0,0,0,0.3)";
    e.currentTarget.style.transform = "scale(1.1) translateY(-4px)";
  }}

  // 🔥 HOVER END
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = jump
      ? "0 0 25px rgba(76,175,80,0.9)"
      : "0 8px 20px rgba(0,0,0,0.3)";
    e.currentTarget.style.transform = jump
      ? "translateY(-12px)"
      : "translateY(0)";
  }}

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

    // 🔥 BASE STATE
    boxShadow: jump
      ? "0 0 25px rgba(76,175,80,0.9)"
      : "0 8px 20px rgba(0,0,0,0.3)",

    transform: jump ? "translateY(-12px)" : "translateY(0)",
    transition: "all 0.3s ease",
  }}
>
  <span style={{ fontSize: 22 }}>
    {open ? "✕" : "🌿"}
  </span>
</div>

{/* 💬 CHATBOX (FIXED SIZE + NO CUT ISSUE) */}
{open && (
  <div
    style={{
      position: "fixed",
      bottom: 85,            // ✅ FIXED spacing
      right: 20,

      width: 360,            // ✅ FIXED width
      maxWidth: "92vw",

      height: "70vh",        // ✅ RESPONSIVE HEIGHT
      maxHeight: 520,
      minHeight: 420,

      borderRadius: 18,      // slightly reduced (clean look)
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",

      background: "rgba(255,255,255,0.75)",   // 🔥 softer glass
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",

      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.2)",

      zIndex: 998,

      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateY(0) scale(1)"
        : "translateY(20px) scale(0.95)",

      transition: "all 0.3s ease",
    }}
  >
    {/* HEADER */}
    <div
      style={{
        background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
        color: "white",
        padding: "12px 16px",   // ✅ compact
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <span>🤖</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          AgroMitra AI
        </span>
      </div>

      <select
        onChange={(e) => setLang(e.target.value)}
        defaultValue="en"
        style={{
          borderRadius: 6,
          fontSize: 12,
          padding: "2px 6px",
        }}
      >
        <option value="en">EN</option>
        <option value="hi">HI</option>
      </select>
    </div>

    {/* QUICK ACTIONS */}
    <div
      style={{
        padding: "8px 10px",
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
      }}
    >
      {Object.keys(quickActions).map((key) => (
        <button
          key={key}
          onClick={() => sendMessage(quickActions[key])}
          style={{
            padding: "5px 10px",
            borderRadius: 16,
            border: "none",
            background: "#e8f5e9",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {quickActions[key]}
        </button>
      ))}
    </div>

    {/* CHAT AREA */}
    <div
      style={{
        flex: 1,
        padding: "12px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            maxWidth: "70%", // ✅ FIXED
          }}
        >
          <div
            style={{
              background:
                msg.type === "user" ? COLORS.userBg : COLORS.botBg,
              color:
                msg.type === "user" ? COLORS.userText : COLORS.botText,
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius:
                msg.type === "user"
                  ? "12px 12px 4px 12px"
                  : "12px 12px 12px 4px",
              // fontSize: 13.5,
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {typing && <div style={{ fontSize: 12 }}>Typing...</div>}

      <div ref={chatEndRef} />
    </div>

    {/* INPUT */}
    <div
      style={{
        padding: "10px",
        borderTop: "1px solid #eee",
        display: "flex",
        gap: 8,
      }}
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={getSuggestionPlaceholder()}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: 10,
          border: "1px solid #ccc",
          fontSize: 13,
        }}
      />

      <button
        onClick={() => sendMessage()}
        style={{
          background: COLORS.primary,
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
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