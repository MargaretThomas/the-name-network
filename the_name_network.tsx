import { useState } from "react";

const CARD_COLORS = [
  { bg: "#EEEDFE", border: "#AFA9EC", text: "#3C3489", badge: "#534AB7", badgeText: "#fff" },
  { bg: "#E1F5EE", border: "#5DCAA5", text: "#085041", badge: "#0F6E56", badgeText: "#fff" },
  { bg: "#FAEEDA", border: "#EF9F27", text: "#633806", badge: "#BA7517", badgeText: "#fff" },
  { bg: "#FAECE7", border: "#F0997B", text: "#4A1B0C", badge: "#993C1D", badgeText: "#fff" },
  { bg: "#E6F1FB", border: "#85B7EB", text: "#0C447C", badge: "#185FA5", badgeText: "#fff" },
  { bg: "#FBEAF0", border: "#ED93B1", text: "#4B1528", badge: "#993556", badgeText: "#fff" },
];

const categoryIcons = { People: "👤", Places: "📍", Things: "✨" };
const categoryLabels = { People: "a person", Places: "a place", Things: "a thing" };

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "3rem 0" }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #e5e7eb",
        borderTopColor: "#7F77DD", borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#888", fontSize: 15, margin: 0 }}>Finding your connections...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ConnectionCard({ item, index }) {
  const c = CARD_COLORS[index % CARD_COLORS.length];
  return (
    <div style={{
      background: c.bg, borderRadius: 16, border: `1.5px solid ${c.border}`,
      padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: 10,
      transition: "transform 0.15s", cursor: "default"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 12, fontWeight: 500, background: c.badge, color: c.badgeText,
          borderRadius: 20, padding: "3px 12px", letterSpacing: "0.03em"
        }}>
          {categoryIcons[item.category]} {item.category}
        </span>
        <span style={{ fontSize: 12, color: c.text, opacity: 0.7 }}>{item.era || ""}</span>
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 500, color: c.text }}>{item.name}</p>
        <p style={{ margin: 0, fontSize: 14, color: c.text, lineHeight: 1.65, opacity: 0.9 }}>{item.story}</p>
      </div>
      {item.connection && (
        <p style={{ margin: 0, fontSize: 13, color: c.badge, fontStyle: "italic", lineHeight: 1.5 }}>
          "{item.connection}"
        </p>
      )}
    </div>
  );
}

export default function NameNetwork() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [extra, setExtra] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputName, setInputName] = useState("");

  async function handleSubmit() {
    if (!name.trim()) { setError("Please enter your first name."); return; }
    setError("");
    setLoading(true);
    setResults(null);
    setInputName(name.trim());

    const namesToSearch = [name.trim()];
    if (city.trim()) namesToSearch.push(city.trim());
    if (extra.trim()) namesToSearch.push(extra.trim());

    const prompt = `You are The Name Network — a warm, humanistic tool that helps people feel connected to the wider world through shared names.

The user has provided these names: ${namesToSearch.map((n, i) => `"${n}" (${i === 0 ? "first name" : i === 1 && city ? "city" : "additional name"})`).join(", ")}.

For EACH name provided, generate 2 connection entries — a mix of People, Places, and Things that share that exact name (or a very close variant). Spread the categories thoughtfully.

Return ONLY a valid JSON array. No preamble, no backticks, no extra text. Each object must have:
- "name": the specific name/title of the person, place, or thing
- "category": one of "People", "Places", or "Things"
- "era": a short time or place context (e.g. "1920s France", "Ancient Rome", "Pacific Ocean") or empty string
- "story": 2–3 warm, human sentences telling something meaningful about this entity — something that makes the user feel a sense of kinship or wonder
- "connection": a single short poetic line (under 15 words) connecting the user's name to this entry, e.g. "You share a name with someone who changed the world quietly."

Make the tone warm, curious, and celebratory. Focus on lesser-known gems alongside famous ones. Real entities only.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResults(parsed);
    } catch (e) {
      setError("Something went wrong finding your connections. Please try again.");
    }
    setLoading(false);
  }

  const grouped = results ? {
    People: results.filter(r => r.category === "People"),
    Places: results.filter(r => r.category === "Places"),
    Things: results.filter(r => r.category === "Things"),
  } : null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem 3rem", fontFamily: "inherit" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🕸️</div>
        <h1 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-primary)" }}>
          The Name Network
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Discover the people, places, and things that share your name — and feel the thread that connects you to the world.
        </p>
      </div>

      <div style={{
        background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 16, padding: "1.5rem", marginBottom: "2rem",
        display: "flex", flexDirection: "column", gap: 14
      }}>
        <div>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
            Your first name <span style={{ color: "#D85A30" }}>*</span>
          </label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Margaret"
            style={{ width: "100%", boxSizing: "border-box" }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
              Your city <span style={{ fontSize: 12, opacity: 0.6 }}>(optional)</span>
            </label>
            <input
              value={city} onChange={e => setCity(e.target.value)}
              placeholder="e.g. Cape Town"
              style={{ width: "100%", boxSizing: "border-box" }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
              Another name <span style={{ fontSize: 12, opacity: 0.6 }}>(surname, nickname…)</span>
            </label>
            <input
              value={extra} onChange={e => setExtra(e.target.value)}
              placeholder="e.g. Thatcher"
              style={{ width: "100%", boxSizing: "border-box" }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        {error && <p style={{ color: "#D85A30", fontSize: 14, margin: 0 }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ alignSelf: "flex-start", padding: "10px 28px", fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Searching…" : "Find my network →"}
        </button>
      </div>

      {loading && <Spinner />}

      {results && !loading && (
        <div>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", marginBottom: "1.5rem", textAlign: "center" }}>
            Here's who and what shares a name with <strong style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{inputName}</strong> — and the rest of your network.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map((item, i) => (
              <ConnectionCard key={i} item={item} index={i} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button onClick={() => { setResults(null); setName(""); setCity(""); setExtra(""); setInputName(""); }}
              style={{ fontSize: 14, color: "var(--color-text-secondary)", padding: "8px 20px" }}>
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
