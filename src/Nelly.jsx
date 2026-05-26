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
  // New modes
  { id: "poetry", label: "Poetry Corner", emoji: "📝", color: "#c026d3", desc: "Write poems together" },
  { id: "dream", label: "Dream Interpreter", emoji: "🌙", color: "#6366f1", desc: "Analyze your dreams" },
  { id: "fitness", label: "Fitness Coach", emoji: "💪", color: "#22c55e", desc: "Workouts & motivation" },
  { id: "affirm", label: "Daily Affirmations", emoji: "🌟", color: "#eab308", desc: "Positive self-love" },
];

const getModePrompt = (modeId, profile) => {
  const prompts = {
    chat: "You are Nelly, a fun, warm, witty and emotionally aware best friend.",
    vent: "You are Nelly in Vent Mode. Listen, validate, empathize. Never give advice unless asked.",
    // ... add all your original prompts here
    poetry: "You are Nelly in Poetry Corner. Create beautiful emotional poetry.",
    dream: "You are Nelly, a gentle dream interpreter.",
    fitness: "You are Nelly, an encouraging fitness coach.",
    affirm: "You are Nelly spreading positivity and self-love.",
  };

  let base = prompts[modeId] || prompts.chat;
  base += ` User name: ${profile.name}. Interaction style: ${profile.style}.`;
  return base;
};

const NellyCharacter = ({ mood = "happy", hairColor = "#f472b6", size = 90 }) => {
  const exp = {
    happy: { eyeY: 43, mouth: "M 35 56 Q 42 63 49 56" },
    excited: { eyeY: 39, mouth: "M 34 55 Q 42 68 50 54" },
    thinking: { eyeY: 42, mouth: "M 36 58 Q 42 53 48 58" },
    sad: { eyeY: 46, mouth: "M 36 61 Q 42 55 48 61" },
    loving: { eyeY: 42, mouth: "M 35 57 Q 42 65 49 57" },
  }[mood] || { eyeY: 43, mouth: "M 35 56 Q 42 63 49 56" };

  return (
    <svg width={size} height={size} viewBox="0 0 84 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="42" cy="42" r="28" fill="#fde8ef" />
      <ellipse cx="33" cy={exp.eyeY} rx="5" ry="6" fill="#1e1b4b" />
      <ellipse cx="51" cy={exp.eyeY} rx="5" ry="6" fill="#1e1b4b" />
      <path d={exp.mouth} stroke="#e11d48" strokeWidth="3" fill="none" />
      {/* Hair with custom color */}
      <path d="M16 28 Q20 10 42 12 Q64 10 68 28" stroke={hairColor} strokeWidth="8" fill="none" />
      <circle cx="42" cy="18" r="12" fill={hairColor} />
    </svg>
  );
};

export default function Nelly() {
  const [stage, setStage] = useState("splash");
  const [selectedMode, setSelectedMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nellyMood, setNellyMood] = useState("happy");
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [accentColor, setAccentColor] = useState("#f472b6");
  const [hairColor, setHairColor] = useState("#f472b6");
  const [userProfile, setUserProfile] = useState({
    name: "Bestie",
    style: "balanced",
    streak: 0,
    lastVisit: new Date().toDateString(),
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentMode = MODES.find(m => m.id === selectedMode);

  // Daily streak
  useEffect(() => {
    const today = new Date().toDateString();
    if (userProfile.lastVisit !== today) {
      setUserProfile(p => ({ ...p, streak: p.streak + 1, lastVisit: today }));
    }
  }, []);

  // Load chat
  useEffect(() => {
    if (selectedMode) {
      const saved = localStorage.getItem(`nelly_${selectedMode}`);
      if (saved) setMessages(JSON.parse(saved));
    }
  }, [selectedMode]);

  useEffect(() => {
    if (selectedMode && messages.length) {
      localStorage.setItem(`nelly_${selectedMode}`, JSON.stringify(messages));
    }
  }, [messages, selectedMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("home"), 2400);
    }
  }, [stage]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.1;
    utterance.rate = 1.05;
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async (regenerate = false) => {
    let text = input.trim();
    if (regenerate && messages.length > 0) text = messages[messages.length - 1].content;
    if (!text || loading) return;

    const newMessages = regenerate ? messages.slice(0, -1) : [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    if (!regenerate) setInput("");
    setLoading(true);
    setNellyMood("thinking");

    let reply = "";

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          stream: true,
          temperature: 0.85,
          messages: [
            { role: "system", content: getModePrompt(selectedMode, userProfile) },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            const parsed = JSON.parse(line.slice(6));
            const delta = parsed.choices[0]?.delta?.content || "";
            reply += delta;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return [...prev.slice(0, -1), { role: "assistant", content: reply }];
              }
              return [...prev, { role: "assistant", content: reply }];
            });
          }
        }
      }

      setNellyMood("excited");
      setTimeout(() => setNellyMood("happy"), 1800);
      speak(reply);

    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry bestie, connection issue 💔 Try again!" }]);
      setNellyMood("sad");
    }
    setLoading(false);
  };

  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice input not supported");
    const rec = new SR();
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.start();
    setIsListening(true);
  };

  const exportChat = () => {
    const text = messages.map(m => `${m.role}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nelly-chat-${currentMode.id}.txt`;
    a.click();
  };

  const regenerate = () => sendMessage(true);
  const copyMessage = (text) => navigator.clipboard.writeText(text);

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      background: `linear-gradient(135deg, #0f0014, #1a0028, #0d0018)`,
      color: "#fff", fontFamily: "system-ui, sans-serif", position: "relative"
    }}>
      {/* All your keyframes here */}

      {stage === "splash" && (
        <div style={{ textAlign: "center", paddingTop: "25vh" }}>
          <NellyCharacter mood="excited" hairColor={hairColor} size={120} />
          <h1 style={{ fontSize: 52, fontWeight: 900, background: `linear-gradient(135deg, ${accentColor}, #e879f9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Nelly's AI
          </h1>
          <p>Your bubbly forever bestie is here ✨</p>
        </div>
      )}

      {stage === "home" && (
        <div style={{ maxWidth: 560, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 20, textAlign: "center" }}>
            <NellyCharacter mood="happy" hairColor={hairColor} size={80} />
            <h1>Nelly's AI</h1>
          </div>

          {/* Accent & Avatar Customizer */}
          <div style={{ padding: "0 20px", display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div>
              <label>Accent Color</label>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
            </div>
            <div>
              <label>Hair Color</label>
              <input type="color" value={hairColor} onChange={(e) => setHairColor(e.target.value)} />
            </div>
          </div>

          {/* Mode Grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              {MODES.filter(m => m.label.toLowerCase().includes(searchTerm.toLowerCase()) || m.desc.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(mode => (
                  <div key={mode.id} onClick={() => { setSelectedMode(mode.id); setStage("chat"); }}
                    style={{ background: `linear-gradient(135deg, ${mode.color}15, transparent)`, border: `1px solid ${mode.color}40`, padding: 16, borderRadius: 16 }}>
                    <div style={{ fontSize: 36 }}>{mode.emoji}</div>
                    <div style={{ fontWeight: 700 }}>{mode.label}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {stage === "chat" && currentMode && (
        <div style={{ maxWidth: 560, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 16, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStage("home")}>← Back</button>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{currentMode.emoji}</span>
              <div>
                <strong>{currentMode.label}</strong>
                <div>Streak: {userProfile.streak} 🔥</div>
              </div>
            </div>
            <button onClick={exportChat}>Export</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{ padding: "14px 18px", borderRadius: 18, background: msg.role === "user" ? accentColor : "rgba(255,255,255,0.1)" }}>
                  {msg.content}
                </div>
                {msg.role === "assistant" && (
                  <div style={{ marginTop: 6, display: "flex", gap: 12 }}>
                    <button onClick={() => speak(msg.content)}>🔊 Speak</button>
                    <button onClick={() => copyMessage(msg.content)}>Copy</button>
                    <button onClick={regenerate}>Regenerate</button>
                  </div>
                )}
              </div>
            ))}

            {loading && <div>Nelly is typing<span style={{ animation: "dots 1.4s infinite" }}>...</span></div>}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={startVoiceInput} style={{ width: 52, height: 52, borderRadius: "50%" }}>🎤</button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Message Nelly..."
                style={{ flex: 1, maxHeight: 120, borderRadius: 20, padding: "14px 18px"borderRadius: 18, background: msg.role === "user" ? accentColor : "rgba(255,255,255,0.1)" }}>
                  {msg.content}
                </div>
                {msg.role === "assistant" && (
                  <div style={{ marginTop: 6, display: "flex", gap: 12 }}>
                    <button onClick={() => speak(msg.content)}>🔊 Speak</button>
                    <button onClick={() => copyMessage(msg.content)}>Copy</button>
                    <button onClick={regenerate}>Regenerate</button>
                  </div>
                )}
              </div>
            ))}

            {loading && <div>Nelly is typing<span style={{ animation: "dots 1.4s infinite" }}>...</span></div>}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={startVoiceInput} style={{ width: 52, height: 52, borderRadius: "50%" }}>🎤</button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Message Nelly..."
                style={{ flex: 1, maxHeight: 120, borderRadius: 20, padding: "14px 18px" }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{ width: 52, height: 52, borderRadius: "50%", background: accentColor }}>
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
              