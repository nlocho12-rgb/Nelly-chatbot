import { useState, useEffect, useRef } from "react";

const MODES = [
  { id: "chat", label: "Chat", emoji: "💬", color: "#f472b6", desc: "Just vibe and talk about anything" },
  { id: "study", label: "Study Buddy", emoji: "📚", color: "#60a5fa", desc: "Homework help & explanations" },
  { id: "story", label: "Story Time", emoji: "✨", color: "#a78bfa", desc: "Creative stories & adventures" },
  { id: "quiz", label: "Quiz Me", emoji: "🎯", color: "#34d399", desc: "Fun trivia & brain games" },
  { id: "roast", label: "Roast Mode", emoji: "🔥", color: "#f97316", desc: "Jokes, banter & light roasts" },
  { id: "advice", label: "Advice", emoji: "🧠", color: "#fbbf24", desc: "Life tips & personal guidance" },
  { id: "wyr", label: "Would You Rather", emoji: "🤔", color: "#ec4899", desc: "Wild dilemmas & tough choices" },
  { id: "debate", label: "Debate Me", emoji: "⚔️", color: "#ef4444", desc: "Argue any side of any topic" },
  { id: "vent", label: "Vent Mode", emoji: "🫂", color: "#818cf8", desc: "I'll just listen & support you" },
  { id: "riddle", label: "Riddle Master", emoji: "🧩", color: "#2dd4bf", desc: "Tricky riddles & brain teasers" },
  { id: "conspiracy", label: "Conspiracy Corner", emoji: "🛸", color: "#c084fc", desc: "Wild theories for fun" },
  { id: "hottakes", label: "Hot Takes", emoji: "💅", color: "#fb923c", desc: "Unpopular opinions & reactions" },
  { id: "chef", label: "Chef Mode", emoji: "👨‍🍳", color: "#4ade80", desc: "Recipes & food ideas" },
  { id: "thisorthat", label: "This or That", emoji: "⚡", color: "#facc15", desc: "Quick preference games" },
  { id: "travel", label: "Travel Guide", emoji: "🌍", color: "#38bdf8", desc: "Explore places & plan trips" },
  { id: "myth", label: "Myth Stories", emoji: "🏛️", color: "#e879f9", desc: "Mythology & ancient legends" },
];

const getModePrompt = (modeId) => {
  const prompts = {
    chat: "You are Nelly, a fun, warm and witty AI best friend. Keep responses conversational, engaging, and genuinely helpful. Match the user's energy.",
    study: "You are Nelly in Study Buddy mode. You're a patient, encouraging tutor who explains things clearly with examples. Break down complex topics simply. Always check if the student understood.",
    story: "You are Nelly in Story Time mode. You're a creative storyteller. Craft vivid, engaging stories based on what the user wants. Ask for their input to shape the story as it goes.",
    quiz: "You are Nelly in Quiz Mode. Ask fun trivia questions one at a time, keep score, give encouraging reactions to answers, and celebrate when they get things right. Make it energetic and fun.",
    roast: "You are Nelly in Roast Mode. Give playful, light-hearted roasts and banter. Keep it fun and never mean-spirited. Roast topics, ideas, or situations — always stay friendly.",
    advice: "You are Nelly in Advice Mode. Give thoughtful, genuine life advice. Be empathetic, practical, and encouraging. Ask clarifying questions to give better advice.",
    wyr: "You are Nelly in Would You Rather mode. Present creative, funny, and sometimes challenging 'Would You Rather' dilemmas. React to their choices and explain what their answer reveals about them.",
    debate: "You are Nelly in Debate Mode. Take a strong position on any topic the user gives you and argue it passionately. Be clever, use logic, and challenge the user to defend their side.",
    vent: "You are Nelly in Vent Mode. Your only job is to listen, validate feelings, and offer gentle emotional support. Never lecture or give unsolicited advice. Just be present and empathetic.",
    riddle: "You are Nelly in Riddle Master mode. Present clever riddles one at a time. Give hints if asked. Celebrate when they solve it and explain the answer when they give up. Keep track of how many they've solved.",
    conspiracy: "You are Nelly in Conspiracy Corner mode. Come up with wild, creative, funny conspiracy theories purely for entertainment. Make them elaborate and fun. Always make it clear it's just for laughs.",
    hottakes: "You are Nelly in Hot Takes mode. Share spicy, unpopular opinions and react to the user's takes. Be bold, defend your takes with humor, and react dramatically to theirs.",
    chef: "You are Nelly in Chef Mode. Suggest creative recipes, cooking tips, and food ideas. Ask what ingredients they have or what they're craving. Make cooking sound fun and approachable.",
    thisorthat: "You are Nelly in This or That mode. Present quick 'This or That' choices — fun, random, or thought-provoking. React to their answers and keep the game flowing fast and fun.",
    travel: "You are Nelly in Travel Guide mode. Help the user explore destinations, plan trips, suggest hidden gems, and share interesting facts about places. Make travel sound exciting and adventurous.",
    myth: "You are Nelly in Myth Stories mode. Tell engaging stories from world mythology — Greek, Roman, Norse, African, Asian, and more. Bring the characters to life and make the stories dramatic and vivid.",
  };
  return prompts[modeId] || prompts.chat;
};

// Cute cartoon Nelly character SVG
const NellyCharacter = ({ mood = "happy", size = 80, animate = true }) => {
  const eyeY = mood === "thinking" ? 42 : mood === "excited" ? 40 : 43;
  const mouthPath = mood === "excited"
    ? "M 35 57 Q 42 65 49 57"
    : mood === "thinking"
    ? "M 36 58 Q 42 55 48 58"
    : "M 35 56 Q 42 63 49 56";

  return (
    <svg width={size} height={size} viewBox="0 0 84 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 4px 16px rgba(244,114,182,0.5))", animation: animate ? "nellyFloat 3s ease-in-out infinite" : "none" }}>
      {/* Body */}
      <ellipse cx="42" cy="78" rx="18" ry="14" fill="#fce7f3" />
      {/* Head */}
      <circle cx="42" cy="42" r="28" fill="#fde8ef" />
      {/* Cheeks */}
      <ellipse cx="24" cy="50" rx="6" ry="4" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="60" cy="50" rx="6" ry="4" fill="#fca5a5" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="33" cy={eyeY} rx="5" ry="5.5" fill="#1e1b4b" />
      <ellipse cx="51" cy={eyeY} rx="5" ry="5.5" fill="#1e1b4b" />
      {/* Eye shine */}
      <circle cx="35" cy={eyeY - 2} r="1.5" fill="white" />
      <circle cx="53" cy={eyeY - 2} r="1.5" fill="white" />
      {/* Mouth */}
      <path d={mouthPath} stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Ears */}
      <circle cx="14" cy="38" r="8" fill="#fde8ef" />
      <circle cx="70" cy="38" r="8" fill="#fde8ef" />
      {/* Hair */}
      <path d="M 16 28 Q 20 10 42 12 Q 64 10 68 28" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="28" r="5" fill="#f472b6" />
      <circle cx="68" cy="28" r="5" fill="#f472b6" />
      {/* Star accessory */}
      <text x="56" y="22" fontSize="12" fill="#fbbf24">✦</text>
    </svg>
  );
};

// Waving arm animation for splash
const NellyWaving = () => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <svg width="120" height="140" viewBox="0 0 84 140" fill="none"
      style={{ filter: "drop-shadow(0 8px 32px rgba(244,114,182,0.6))", animation: "nellyFloat 3s ease-in-out infinite" }}>
      {/* Body */}
      <ellipse cx="42" cy="100" rx="20" ry="18" fill="#fce7f3" />
      {/* Left arm static */}
      <path d="M 24 95 Q 10 100 8 112" stroke="#fde8ef" strokeWidth="10" strokeLinecap="round" />
      {/* Right arm waving */}
      <path d="M 60 92 Q 74 80 78 65" stroke="#fde8ef" strokeWidth="10" strokeLinecap="round"
        style={{ transformOrigin: "60px 92px", animation: "wave 0.7s ease-in-out infinite alternate" }} />
      {/* Hand waving */}
      <circle cx="79" cy="63" r="7" fill="#fde8ef" style={{ transformOrigin: "60px 92px", animation: "wave 0.7s ease-in-out infinite alternate" }} />
      {/* Head */}
      <circle cx="42" cy="50" r="28" fill="#fde8ef" />
      {/* Cheeks */}
      <ellipse cx="24" cy="58" rx="6" ry="4" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="60" cy="58" rx="6" ry="4" fill="#fca5a5" opacity="0.5" />
      {/* Eyes happy/excited */}
      <ellipse cx="33" cy="49" rx="5" ry="5.5" fill="#1e1b4b" />
      <ellipse cx="51" cy="49" rx="5" ry="5.5" fill="#1e1b4b" />
      <circle cx="35" cy="47" r="1.5" fill="white" />
      <circle cx="53" cy="47" r="1.5" fill="white" />
      {/* Big smile */}
      <path d="M 33 63 Q 42 72 51 63" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Ears */}
      <circle cx="14" cy="46" r="8" fill="#fde8ef" />
      <circle cx="70" cy="46" r="8" fill="#fde8ef" />
      {/* Hair */}
      <path d="M 16 36 Q 20 18 42 20 Q 64 18 68 36" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="36" r="5" fill="#f472b6" />
      <circle cx="68" cy="36" r="5" fill="#f472b6" />
      <text x="56" y="30" fontSize="12" fill="#fbbf24">✦</text>
    </svg>
  </div>
);

export default function Nelly() {
  const [stage, setStage] = useState("splash"); // splash → home → chat
  const [selectedMode, setSelectedMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nellyMood, setNellyMood] = useState("happy");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (stage === "splash") {
      const t = setTimeout(() => setStage("home"), 3200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const currentMode = MODES.find(m => m.id === selectedMode);
  const filteredModes = MODES.filter(m =>
    m.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setNellyMood("thinking");
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          max_tokens: 1000,
          messages: [
            { role: "system", content: getModePrompt(selectedMode) },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Hmm something went wrong, try again!";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setNellyMood("excited");
      setTimeout(() => setNellyMood("happy"), 2000);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Oops! Something went wrong. Check your connection and try again 💔" }]);
      setNellyMood("happy");
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };
  const openMode = (modeId) => {
    setSelectedMode(modeId);
    setMessages([]);
    setStage("chat");
    setNellyMood("excited");
    setTimeout(() => setNellyMood("happy"), 1500);
  };

  const goHome = () => {
    setStage("home");
    setSelectedMode(null);
    setMessages([]);
    setSearchTerm("");
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      background: "linear-gradient(135deg, #0f0014 0%, #1a0028 50%, #0d0018 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative"
    }}>
      <style>{`
        @keyframes nellyFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes wave { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes splashPulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.05); opacity:0.9; } }
        @keyframes glitter { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.2); } }
        @keyframes bubbleIn { from { opacity:0; transform:translateY(8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes dots { 0%,20% { opacity:0; } 50% { opacity:1; } 80%,100% { opacity:0; } }

        .mode-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor:pointer; }
        .mode-card:hover { transform:translateY(-4px) scale(1.03); }
        .send-btn { transition: all 0.2s; cursor:pointer; }
        .send-btn:hover { transform:scale(1.08); }
        .send-btn:active { transform:scale(0.95); }
        .back-btn { transition:all 0.2s; cursor:pointer; opacity:0.7; }
        .back-btn:hover { opacity:1; transform:translateX(-2px); }
        .search-input { outline:none; }
        .search-input::placeholder { color:rgba(255,255,255,0.3); }
        .msg-input { outline:none; resize:none; }
        .msg-input::placeholder { color:rgba(255,255,255,0.3); }

        /* Scrollbar */
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(244,114,182,0.3); border-radius:4px; }

        /* Stars background */
        .stars {
          position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0;
        }
        .star {
          position:absolute; background:white; border-radius:50%;
          animation:glitter 3s ease-in-out infinite;
        }
      `}</style>

      {/* Stars */}
      <div className="stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="star" style={{
            width: Math.random() * 2 + 1 + "px", height: Math.random() * 2 + 1 + "px",
            top: Math.random() * 100 + "%", left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 3 + "s", animationDuration: (Math.random() * 2 + 2) + "s",
            opacity: Math.random() * 0.5 + 0.1
          }} />
        ))}
      </div>

      {/* ── SPLASH ── */}
      {stage === "splash" && (
        <div style={{ textAlign: "center", zIndex: 10, animation: "fadeInUp 0.8s ease forwards" }}>
          <div style={{ animation: "splashPulse 2s ease-in-out infinite" }}>
            <NellyWaving />
          </div>
          <div style={{ marginTop: 24 }}>
            <h1 style={{
              fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: "-1px",
              background: "linear-gradient(135deg, #f9a8d4, #e879f9, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Nelly's AI</h1>
            <p style={{ color: "#f9a8d4", fontSize: 18, marginTop: 8, animation: "fadeIn 1.5s ease forwards", opacity: 0.9 }}>
              ✨ Welcome! I'm so happy you're here ✨
            </p>
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 6, justifyContent: "center" }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#f472b6",
                animation: "dots 1.2s ease-in-out infinite", animationDelay: d + "s"
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── HOME ── */}
      {stage === "home" && (
        <div style={{
          zIndex: 10, width: "100%", maxWidth: 520, height: "100vh",
          display: "flex", flexDirection: "column", animation: "fadeInUp 0.5s ease forwards"
        }}>
          {/* Header */}
          <div style={{ padding: "28px 20px 16px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <NellyCharacter size={70} mood="happy" />
            </div>
            <h1 style={{
              fontSize: 32, fontWeight: 900, margin: 0,
              background: "linear-gradient(135deg, #f9a8d4, #e879f9)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Nelly's AI</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "4px 0 0" }}>
              Pick a mode and let's get it 🎉
            </p>
          </div>

          {/* Search */}
          <div style={{ padding: "0 16px 12px" }}>
            <div style={{display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.07)", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px"
            }}>
              <span style={{ fontSize: 16 }}>🔍</span>
              <input
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search modes..."
                style={{
                  flex: 1, background: "none", border: "none", color: "#fff",
                  fontSize: 14, fontFamily: "inherit"
                }}
              />
            </div>
          </div>

          {/* Mode grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {filteredModes.map((mode, i) => (
                <div
                  key={mode.id}
                  className="mode-card"
                  onClick={() => openMode(mode.id)}
                  style={{
                    background: `linear-gradient(135deg, ${mode.color}18, ${mode.color}08)`,
                    border: `1px solid ${mode.color}35`,
                    borderRadius: 16, padding: "14px 14px",
                    animation: `fadeInUp 0.4s ease ${i * 0.03}s both`
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{mode.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 3 }}>{mode.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{mode.desc}</div>
                </div>
              ))}
            </div>
            {filteredModes.length === 0 && (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>
                No modes found 😢
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHAT ── */}
      {stage === "chat" && currentMode && (
        <div style={{
          zIndex: 10, width: "100%", maxWidth: 520, height: "100vh",
          display: "flex", flexDirection: "column", animation: "fadeInUp 0.4s ease forwards"
        }}>
          {/* Chat header */}
          <div style={{
            padding: "16px 16px 12px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <button className="back-btn" onClick={goHome} style={{
              background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
              borderRadius: 10, padding: "8px 12px", fontSize: 14, fontFamily: "inherit"
            }}>← Back</button>
            <NellyCharacter size={40} mood={nellyMood} animate={loading} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>{currentMode.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{currentMode.label}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>
                {loading ? "Nelly is typing..." : currentMode.desc}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", animation: "fadeIn 0.6s ease" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{currentMode.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{currentMode.label} mode!</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6 }}>
                  {currentMode.desc}. Say something to get started!
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12, animation: "bubbleIn 0.3s ease forwards"
              }}>
                {msg.role === "assistant" && (
                  <div style={{ marginRight: 8, flexShrink: 0, marginTop: 4 }}>
                    <NellyCharacter size={28} mood="happy" animate={false} />
                  </div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, ${currentMode.color}, ${currentMode.color}cc)`
                    : "rgba(255,255,255,0.08)",
                  border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none",
                  fontSize: 14, lineHeight: 1.6, color: "#fff", whiteSpace: "pre-wrap", wordBreak: "break-word"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, animation: "bubbleIn 0.3s ease" }}>
                <NellyCharacter size={28} mood="thinking" animate={true} />
                <div style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px 20px 20px 4px", padding: "12px 18px", display: "flex", gap: 5, alignItems: "center"
                }}>
                  {[0, 0.15, 0.3].map((d, i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: currentMode.color,
                      animation: "dots 1s ease-in-out infinite", animationDelay: d + "s"
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px 20px",
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                className="msg-input"
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Message Nelly in ${currentMode.label} mode...`}
                rows={1}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.07)",
                  border: `1px solid ${input ? currentMode.color + "60" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 20, padding: "12px 16px", color: "#fff",
                  fontSize: 14, fontFamily: "inherit", lineHeight: 1.5,
                  transition: "border-color 0.2s", maxHeight: 120
                }}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: 46, height: 46, borderRadius: "50%", border: "none",
                  background: input.trim() && !loading
                    ? `linear-gradient(135deg, ${currentMode.color}, ${currentMode.color}aa)`
                    : "rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, opacity: input.trim() && !loading ? 1 : 0.4,
                  transition: "all 0.2s"
                }}
              >
                {loading ? (
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : "↑"}
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
              Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
}