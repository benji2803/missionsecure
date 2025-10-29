// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import darkLogo from "./assets/mission-secureb.png";
import lightLogo from "./assets/mission-securew.png";
import { v4 as uuidv4 } from "uuid";
import ContactUs from "./ContactUs";
import emailjs from "@emailjs/browser";

const BASE_QUESTIONS = [
  { id: "q1", text: "How does your organization secure user authentication? (Examples: Strong passwords, multi-factor authentication, password managers)", options: [
      { label: "Basic passwords only, no additional security measures", weight: 0, tag: "bad" },
      { label: "Strong password requirements OR multi-factor authentication (but not both)", weight: 0.5, tag: "iffy" },
      { label: "Both strong password policies AND multi-factor authentication enforced", weight: 1, tag: "best" }
    ], noteBad: "Implement both strong password requirements and multi-factor authentication.", noteIffy: "Great start! Add the missing piece - either MFA or stronger password policies." },
  { id: "q2", text: "Does your company enforce procedures that limit access to sensitive data and systems to designated staff with appropriate clearance? (Examples: Role-based access, approval workflows)", options: [
      { label: "No, we don't have any such procedures", weight: 0, tag: "bad" },
      { label: "Some procedures exist but are not enforced", weight: 0.5, tag: "iffy" },
      { label: "Always enforced for all systems", weight: 1, tag: "best" }
    ], noteBad: "Implement access controls based on roles and responsibilities.", noteIffy: "Good start but consider enforcing it across all systems." },
  { id: "q3", text: "Does your organization maintain a written policy that outlines how personal and customer data is collected, used, shared, and protected?", options: [
      { label: "No policy exists", weight: 0, tag: "bad" },
      { label: "Draft exists but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers, and regularly reviewed", weight: 1, tag: "best" }
    ], noteBad: "Create a privacy policy that covers data collection and usage.", noteIffy: "Add scheduled reviews of the policy." },
  { id: "q4", text: "Does your organization have a documented plan detailing how it will respond to a cyberattack or data breach? (Examples: Containment procedures, notification protocols, recovery plans)", options: [
      { label: "No plan exists", weight: 0, tag: "bad" },
      { label: "Draft exists but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers and they are trained regularly", weight: 1, tag: "best" }
    ], noteBad: "Write a simple incident response plan.", noteIffy: "Publish the plan and train staff." },
  { id: "q5", text: "Does your organization have a strategy to maintain operations in the event of a cyber incident? (Examples: Remote work policies, data backups, failover systems)", options: [
      { label: "We are supposed to have one?", weight: 0, tag: "bad" },
      { label: "Kinda we have some stuff", weight: 0.5, tag: "iffy" },
      { label: "Yes we do have a plan and everyone is aware of it and trained on it", weight: 1, tag: "best" }
    ], noteBad: "Create a simple business continuity plan.", noteIffy: "Practice the plan with all staff." },
  { id: "q6", text: "How well are your organization's devices (laptops, phones, tablets) secured and maintained? (Examples: Encryption, antivirus/EDR, automatic updates, remote wipe capability)", options: [
      { label: "Minimal security - basic antivirus only", weight: 0, tag: "bad" },
      { label: "Some security measures but inconsistently applied", weight: 0.5, tag: "iffy" },
      { label: "Comprehensive security: encryption, EDR/antivirus, auto-updates, and device management", weight: 1, tag: "best" }
    ], noteBad: "Implement device encryption, endpoint protection, and automatic updates.", noteIffy: "Ensure all security measures are consistently applied across all devices." },
  { id: "q7", text: "If your organization has an office space, are there safeguards to ensure only authorized personnel can access servers, network equipment, and/or sensitive files?", options: [
      { label: "No physical security measures in place", weight: 0, tag: "bad" },
      { label: "Basic measures like locked doors but no access tracking", weight: 0.5, tag: "iffy" },
      { label: "Comprehensive physical security with controlled access and logging", weight: 1, tag: "best" }
    ], noteBad: "Implement physical access controls for sensitive areas and equipment.", noteIffy: "Add access logging and regular security audits." },
  { id: "q8", text: "Do employees receive regular cybersecurity training (at least annually) on phishing, safe internet use, and handling sensitive information?", options: [
      { label: "No formal cybersecurity training provided", weight: 0, tag: "bad" },
      { label: "Occasional reminders or basic awareness materials", weight: 0.5, tag: "iffy" },
      { label: "Regular annual training plus ongoing phishing simulations and updates", weight: 1, tag: "best" }
    ], noteBad: "Implement annual cybersecurity training covering phishing, data handling, and safe practices.", noteIffy: "Add hands-on phishing simulations and regular security updates." },
  { id: "q9", text: "Is your organization familiar with federal cybersecurity standards and frameworks? (Examples: NIST SP 800-171, CISA guidance, Department of Defense requirements)", options: [
      { label: "No awareness of federal cybersecurity standards", weight: 0, tag: "bad" },
      { label: "Some awareness but no formal compliance efforts", weight: 0.5, tag: "iffy" },
      { label: "Actively following and implementing relevant federal standards", weight: 1, tag: "best" }
    ], noteBad: "Research applicable federal cybersecurity standards for your industry and organization type.", noteIffy: "Develop a formal compliance plan and begin implementation of relevant standards." },
  { id: "q10", text: "How are you feeling today about your organization's cybersecurity posture?", options: [
      { label: "Very concerned - major gaps identified", weight: 0, tag: "bad" },
      { label: "Somewhat concerned - moderate gaps identified", weight: 0.5, tag: "iffy" },
      { label: "Feeling secure - no significant gaps identified", weight: 1, tag: "best" }
    ], noteBad: "Prioritize addressing major gaps in your cybersecurity posture.", noteIffy: "Continue monitoring and improving your cybersecurity measures." }
];

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const pctToHue = (p) => Math.round((Math.max(0, Math.min(100, p)) / 100) * 120);

function confettiCascade(totalMs = 5000, batch = 28, everyMs = 110) {
  const container = document.createElement("div");
  container.className = "confetti";
  container.style.zIndex = "2147483647";
  document.body.appendChild(container);
  const MIN_DUR = 3.8, MAX_DUR = 6.2, MAX_DELAY = 0.9;
  const makePiece = () => {
    const el = document.createElement("i");
    const w = 6 + Math.random() * 8, h = 8 + Math.random() * 12;
    el.style.width = `${w}px`; el.style.height = `${h}px`;
    el.style.left = Math.random() * 100 + "vw"; el.style.opacity = (0.85 + Math.random() * 0.15).toFixed(2);
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    const dur = (MIN_DUR + Math.random() * (MAX_DUR - MIN_DUR)).toFixed(2);
    const delay = (Math.random() * MAX_DELAY).toFixed(2);
    const sway = (1.2 + Math.random() * 1.1).toFixed(2);
    el.style.setProperty("--dur", `${dur}s`); el.style.setProperty("--sway", `${sway}s`);
    el.style.animationDelay = `${delay}s`; el.style.setProperty("--rot", Math.round(Math.random() * 360) + "deg");
    el.style.setProperty("--sx", Math.round(Math.random() * 60 - 30) + "px");
    el.addEventListener("animationend", () => el.remove());
    container.appendChild(el);
  };
  const interval = setInterval(() => { for (let i = 0; i < batch; i++) makePiece(); }, everyMs);
  setTimeout(() => { clearInterval(interval); setTimeout(() => container.remove(), (MAX_DELAY + MAX_DUR) * 1000 + 400); }, totalMs);
}

async function gradeWithAI(answers, percent, localNotes) {
  try {
    const res = await fetch("http://localhost:3001/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, localScore: percent, localNotes })
    });
    return await res.json();
  } catch { return { score: percent, notes: localNotes }; }
}

const QUIZ_ID = "mission-secure-v1";
const getSessionId = () => {
  const key = "ms_session_id";
  let sid = localStorage.getItem(key);
  if (!sid) { sid = uuidv4(); localStorage.setItem(key, sid); }
  return sid;
};

/* Midnight Mode */
let matrixCanvas = null, matrixCtx = null, matrixAnimation = null;
function startMatrixRain() {
  if (matrixCanvas) return;
  matrixCanvas = document.createElement("canvas");
  Object.assign(matrixCanvas.style, { position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "1", opacity: "0.3" });
  document.body.appendChild(matrixCanvas);
  matrixCtx = matrixCanvas.getContext("2d");
  matrixCanvas.width = innerWidth; matrixCanvas.height = innerHeight;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|\\:;\"'<>?/~`", fontSize = 14, columns = matrixCanvas.width / fontSize, drops = Array(Math.floor(columns)).fill(1);
  function drawMatrix() {
    matrixCtx.fillStyle = "rgba(0, 0, 0, 0.05)"; matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCtx.fillStyle = "#00ff41"; matrixCtx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++;
    }
  }
  matrixAnimation = setInterval(drawMatrix, 33);
  addEventListener("resize", () => { if (!matrixCanvas) return; matrixCanvas.width = innerWidth; matrixCanvas.height = innerHeight; });
}
function stopMatrixRain() {
  if (matrixAnimation) clearInterval(matrixAnimation);
  matrixAnimation = null;
  if (matrixCanvas) { document.body.removeChild(matrixCanvas); matrixCanvas = null; matrixCtx = null; }
}

export default function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [view, setView] = useState("landing");
  const [prefetchedNews, setPrefetchedNews] = useState(null);
  const [qs, setQs] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [midnightMode, setMidnightMode] = useState(false);
  const [showMidnightAlert, setShowMidnightAlert] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]);

  useEffect(() => {
    const check = () => {
      const isMidnight = new Date().getHours() === 0;
      if (isMidnight && !midnightMode) { setMidnightMode(true); setShowMidnightAlert(true); document.body.classList.add("midnight-mode"); startMatrixRain(); setTimeout(() => setShowMidnightAlert(false), 5000); }
      else if (!isMidnight && midnightMode) { setMidnightMode(false); document.body.classList.remove("midnight-mode"); stopMatrixRain(); }
    };
    check(); const t = setInterval(check, 60000); return () => clearInterval(t);
  }, [midnightMode]);

  const total = qs?.length || BASE_QUESTIONS.length;
  const q = useMemo(() => (qs ? qs[idx] : BASE_QUESTIONS[0]), [qs, idx]);

  function start() {
    const randomized = shuffle(BASE_QUESTIONS).map((x) => ({ ...x, options: shuffle(x.options) }));
    setQs(randomized); setAnswers({}); setIdx(0); setView("quiz");
  }

  async function choose(option) {
    if (transitioning) return;
    setTransitioning(true);
    const current = qs[idx], nextAnswers = { ...answers, [current.id]: option };
    setAnswers(nextAnswers);
    (async () => {
      try {
        const sessionId = getSessionId();
        const res = await fetch("http://localhost:3001/responses", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, quizId: QUIZ_ID, questionId: current.id, optionLabel: option.label, optionTag: option.tag, weight: Number(option.weight ?? 0) })
        });
        if (!res.ok) console.error("Failed to log response:", await res.json().catch(() => ({})));
      } catch (e) { console.error("❌ Error sending response:", e); }
    })();
    setTimeout(() => { if (idx + 1 < total) setIdx(idx + 1); else finish(nextAnswers); setTransitioning(false); }, 150);
  }

  function localScoreAndNotes(ans) {
    const items = qs || BASE_QUESTIONS;
    const categoryWeights = { foundation: 1.2, advanced: 1.0, culture: 0.8 };
    const categoryScores = { foundation: [], advanced: [], culture: [] };
    items.forEach((item) => {
      const picked = ans[item.id]; if (!picked) return;
      if (["q1", "q3", "q8"].includes(item.id)) categoryScores.foundation.push(picked.weight);
      else if (["q6", "q7", "q9"].includes(item.id)) categoryScores.advanced.push(picked.weight);
      else categoryScores.culture.push(picked.weight);
    });
    let totalScore = 0, totalWeight = 0;
    Object.entries(categoryScores).forEach(([cat, scores]) => {
      if (scores.length) { const avg = scores.reduce((s, v) => s + v, 0) / scores.length; const w = categoryWeights[cat]; totalScore += avg * w * scores.length; totalWeight += w * scores.length; }
    });
    let percent = Math.round((totalScore / totalWeight) * 100);
    const perfect = items.filter((i) => ans[i.id]?.weight === 1).length;
    const maturityBonus = perfect >= 8 ? 5 : perfect >= 6 ? 3 : 0;
    percent = Math.min(100, percent + maturityBonus);

    const suggestions = [];
    const criticalGaps = [], improvements = [];
    const risk = {
      q1:{impact:"HIGH",likelihood:"HIGH",urgency:1,cost:"$100-500"},
      q2:{impact:"MEDIUM",likelihood:"HIGH",urgency:2,cost:"$500-2000"},
      q3:{impact:"HIGH",likelihood:"MEDIUM",urgency:1,cost:"$200-1000"},
      q4:{impact:"MEDIUM",likelihood:"MEDIUM",urgency:3,cost:"$1000-5000"},
      q5:{impact:"HIGH",likelihood:"LOW",urgency:2,cost:"$2000-10000"},
      q6:{impact:"MEDIUM",likelihood:"HIGH",urgency:2,cost:"$500-3000"},
      q7:{impact:"MEDIUM",likelihood:"LOW",urgency:3,cost:"$1000-5000"},
      q8:{impact:"MEDIUM",likelihood:"MEDIUM",urgency:2,cost:"$2000-8000"},
      q9:{impact:"LOW",likelihood:"LOW",urgency:4,cost:"$5000-15000"},
    };
    items.forEach((item) => {
      const picked = ans[item.id]; if (!picked) return;
      const r = risk[item.id] || {impact:"MEDIUM",likelihood:"MEDIUM",urgency:3,cost:"Variable"};
      if (picked.weight === 0) {
        const level = r.impact==="HIGH"&&r.likelihood==="HIGH" ? "CRITICAL" : (r.impact==="HIGH"||r.likelihood==="HIGH" ? "HIGH":"MEDIUM");
        criticalGaps.push({ priority: r.urgency, suggestion: `${item.noteBad} [${level} RISK • ${r.cost} • 30-day target]` });
      } else if (picked.weight === 0.5) {
        improvements.push({ priority: r.urgency + 2, suggestion: `${item.noteIffy} [MEDIUM RISK • ${r.cost} • 60-day target]` });
      }
    });
    criticalGaps.sort((a,b)=>a.priority-b.priority); improvements.sort((a,b)=>a.priority-b.priority);
    const catAvg = (arr)=>arr.length?arr.reduce((s,v)=>s+v,0)/arr.length:0;
    const foundationAvg = catAvg(categoryScores.foundation), advancedAvg = catAvg(categoryScores.advanced);
    if (foundationAvg < 0.7) suggestions.push("🎯 STRATEGIC PRIORITY: Focus on fundamentals—auth, backups, and training. [60–90 days, $2K–8K]");
    if (advancedAvg > foundationAvg + 0.3) suggestions.push("⚖️ BALANCE: Advanced controls outpace fundamentals. Rebalance base practices. [30 days]");
    if ((ans["q9"]?.weight || 0) < 1) suggestions.push("🏛️ COMPLIANCE: Start NIST CSF (Identify/Protect first). [~90 days, $5K–15K]");
    if ((ans["q1"]?.weight || 0) < 1) suggestions.push("🔐 WEEK 1: Enforce MFA (e.g., Microsoft Authenticator).");
    if ((ans["q3"]?.weight || 0) < 1) suggestions.push("💾 30-DAY: 3-2-1 backups (e.g., Veeam + S3 Glacier).");
    const notes = [
      ...criticalGaps.map(g => `🚨 ${g.suggestion}`),
      ...improvements.map(i => `📈 ${i.suggestion}`),
      ...suggestions
    ].slice(0,10);
    return { percent, notes, categoryScores, maturityBonus };
  }

  async function finish(finalAns) {
    const { percent, notes, categoryScores, maturityBonus } = localScoreAndNotes(finalAns);
    const ai = await gradeWithAI(finalAns, percent, notes);
    const finalScore = Math.max(0, Math.min(100, Math.round(ai.score ?? percent)));
    const hue = pctToHue(finalScore);
    let securityLevel = "Developing", badge = "🥉";
    if (finalScore >= 95) { securityLevel = "Platinum - Cybersecurity Excellence"; badge = "💎"; }
    else if (finalScore >= 85) { securityLevel = "Gold - Advanced Security"; badge = "🥇"; }
    else if (finalScore >= 70) { securityLevel = "Silver - Good Security Practices"; badge = "🥈"; }
    else if (finalScore >= 50) { securityLevel = "Bronze - Basic Security Foundation"; badge = "🥉"; }
    if (finalScore >= 85) confettiCascade();
    setResult({ score: finalScore, notes: ai.notes || notes, hue, dateISO: new Date().toISOString(), securityLevel, badge, categoryScores, maturityBonus });
    setView("results"); setTimeout(() => setShowEmailModal(true), 2000);
  }

  const sendThankYouEmail = async () => {
    if (!userEmail || !result) return;
    setEmailSending(true);
    try {
      const serviceId = "service_zp1s8kn", templateId = "template_2qd8uas", publicKey = "dqeHV_5inh7XPvunn";
      const templateParams = {
        user_email: userEmail,
        company_name: companyName?.trim() || "",
        assessment_score: result.score,
        security_level: result.securityLevel,
        assessment_date: new Date(result.dateISO).toLocaleDateString(),
      };
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      alert(`Thank you! We've sent your results to ${userEmail}. Check your inbox!`);
      setShowEmailModal(false); setUserEmail(""); setCompanyName("");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Sorry, there was an issue sending the email. Please try again later.");
    }
    setEmailSending(false);
  };

  const onPrefetchNews = async () => {
    if (prefetchedNews) return;
    try {
      const apiKey = import.meta.env.VITE_NEWSAPI_KEY; if (!apiKey) return;
      const res = await fetch(`https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`);
      if (res.ok) setPrefetchedNews((await res.json()).articles || []);
    } catch (e) { console.error("Failed to prefetch news:", e); }
  };

  const goWhoWeAre = () => navigate("/who-we-are");
  const goResources = () => navigate("/resources");
  const goNews = () => navigate("/news");

  return (
    <div className="page">
      <div className="bg-logo" aria-hidden="true"></div>

      <style jsx>{`
        .midnight-mode { background: #000 !important; }
        .midnight-mode * { text-shadow: 0 0 10px #00ff41; }
        .midnight-mode .topbar { background: linear-gradient(135deg, #000, #1a1a1a) !important; border-bottom: 1px solid #00ff41 !important; }
        .midnight-mode .btn--primary { background: linear-gradient(45deg, #00ff41, #00cc33) !important; color: #000 !important; box-shadow: 0 0 20px #00ff4140 !important; }
        .midnight-mode .btn--ghost { border: 1px solid #00ff41 !important; color: #00ff41 !important; }
        .midnight-mode .btn--ghost:hover { background: #00ff4120 !important; }
        @keyframes matrixGlow { 0% { box-shadow: 0 0 30px #00ff4160, inset 0 0 20px #00ff4120; } 100% { box-shadow: 0 0 50px #00ff4180, inset 0 0 30px #00ff4140; } }
      `}</style>

      <Header
        theme={theme}
        setTheme={setTheme}
        onWhoWeAre={goWhoWeAre}
        onResources={goResources}
        onCyberNews={goNews}
        onPrefetchNews={onPrefetchNews}
        onStart={start}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {mobileMenuOpen && (
        <div className="modal mobile-menu-modal" onClick={() => setMobileMenuOpen(false)}>
          <div className="modal__card mobile-menu-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <h3>Menu</h3>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: "1.5rem", cursor: "pointer", padding: "4px 8px" }}>×</button>
            </div>
            <div className="mobile-menu-items">
              <ContactUs />
              <button className="btn btn--ghost mobile-menu-btn" onClick={() => { goNews(); setMobileMenuOpen(false); }} onMouseEnter={onPrefetchNews} onFocus={onPrefetchNews}>
                <span role="img" aria-label="newspaper">📰</span> Latest Cyber News
              </button>
              <button className="btn btn--ghost mobile-menu-btn" onClick={() => { goWhoWeAre(); setMobileMenuOpen(false); }}>Who We Are</button>
              <button className="btn btn--primary mobile-menu-btn" onClick={() => { start(); setMobileMenuOpen(false); }}>Take assessment</button>
              <button className="btn btn--ghost mobile-menu-btn" onClick={() => { goResources(); setMobileMenuOpen(false); }}>Resources</button>
              <div className="mobile-menu-theme">
                <span style={{ marginRight: "1rem", color: "var(--text)" }}>Theme:</span>
                <div className="theme-toggle" aria-label="Theme toggle">
                  <input id="mobileThemeSwitch" type="checkbox" checked={theme === "light"} onChange={(e) => setTheme(e.target.checked ? "light" : "dark")} />
                  <label htmlFor="mobileThemeSwitch" title="Light / Dark"><span className="sun">☀️</span><span className="moon">🌙</span></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "landing" && (
        <section className="wrap landing">
          <img src={theme === "light" ? lightLogo : darkLogo} alt="Mission Secure" className="landing-logo" />
          <h1 className="title">Quick Cyber Hygiene Check</h1>
          <p className="lead">We are dedicated to helping you improve your cybersecurity posture. We provide a quick assessment to identify key areas for improvement.</p>
          <p className="lead">We are Mission Secure the cybersecurity team of LA Tech and we are here to help you.</p>
          <div className="cta"><button className="btn btn--primary" onClick={start}>Take assessment</button></div>
          {showMidnightAlert && (
            <div style={{
              marginTop: 40, background: "linear-gradient(45deg, #000000, #1a1a1a)", color: "#00ff41",
              padding: "25px 35px", borderRadius: 20, border: "2px solid #00ff41",
              boxShadow: "0 0 40px #00ff4160, inset 0 0 25px #00ff4120", fontSize: 16, fontFamily: "monospace",
              fontWeight: "bold", textAlign: "center", animation: "matrixGlow 2s ease-in-out infinite alternate",
              maxWidth: 600, marginInline: "auto"
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🕛 MIDNIGHT MODE ACTIVATED 🕛</div>
              <div style={{ fontSize: 18, marginBottom: 8 }}>Welcome to the dark side of cybersecurity...</div>
              <div style={{ fontSize: 14, opacity: 0.8, marginTop: 10 }}>Active until 1:00 AM | Matrix rain enabled | You are now in hacker mode</div>
            </div>
          )}
        </section>
      )}

      {view === "quiz" && qs && (
        <section className="wrap">
          <div className="quiz-head">
            <button className="link" onClick={() => setView("landing")}>← Back</button>
            <span className="progress">Question {idx + 1} / {total}</span>
          </div>
          <h2 className="q">{q.text}</h2>
          <div className="options">
            {q.options.map((opt, i) => (
              <button key={i} className="option" onClick={() => choose(opt)} aria-label={`Answer: ${opt.label}`}
                disabled={transitioning} style={{ opacity: transitioning ? 0.6 : 1, cursor: transitioning ? "not-allowed" : "pointer" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {view === "results" && result && (
        <section id="report" className="wrap">
          <header className="print-only report-head">
            <div className="report-brand"><div><h1>Cyber Hygiene Test — Report</h1><p>by Mission Secure • {new Date(result.dateISO).toLocaleString()}</p></div></div>
          </header>

          <h2 className="screen-only" style={{ color: theme === "light" ? "#17181c" : "#e9e9ef" }}>Security Assessment Results</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <BigNumber value={result.score} hue={result.hue} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{result.badge}</div>
              <div style={{ fontSize: 18, fontWeight: "bold", color: `hsl(${result.hue} 85% 55%)` }}>{result.securityLevel}</div>
              {result.maturityBonus > 0 && <div style={{ fontSize: 14, marginTop: 4, color: "#4CAF50" }}>+{result.maturityBonus} Maturity Bonus</div>}
            </div>
          </div>

          <div className="executive-summary" style={{
            background: theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
            padding: 20, borderRadius: 8, marginBottom: 24,
            border: theme === "light" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.12)"
          }}>
            <h3 className="section-title" style={{ marginTop: 0, marginBottom: 16, color: theme === "light" ? "#17181c" : "#e9e9ef" }}>📋 Executive Summary</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <SummaryItem label="Risk Level">
                <span className="value-text risk-level" style={{ fontSize: 18, fontWeight: "bold", color: result.score >= 85 ? "#4CAF50" : result.score >= 70 ? "#FF9800" : "#F44336" }}>
                  {result.score >= 85 ? "Low Risk" : result.score >= 70 ? "Moderate Risk" : "High Risk"}
                </span>
              </SummaryItem>
              <SummaryItem label="Critical Issues">
                <span className="value-text" style={{ fontSize: 18, fontWeight: "bold" }}>
                  {result.notes?.filter((n) => n.includes("🚨")).length || 0}
                </span>
              </SummaryItem>
              <SummaryItem label="Est. Implementation">
                <span className="value-text" style={{ fontSize: 18, fontWeight: "bold" }}>
                  {result.score >= 85 ? "30 days" : result.score >= 70 ? "60 days" : "90 days"}
                </span>
              </SummaryItem>
              <SummaryItem label="Investment Range">
                <span className="value-text" style={{ fontSize: 18, fontWeight: "bold" }}>
                  {result.score >= 85 ? "$500-2K" : result.score >= 70 ? "$2K-8K" : "$8K-20K"}
                </span>
              </SummaryItem>
            </div>
          </div>

          <div className="category-breakdown" style={{
            background: theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
            padding: 20, borderRadius: 8, marginBottom: 24,
            border: theme === "light" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.12)"
          }}>
            <h3 className="section-title" style={{ marginTop: 0, marginBottom: 20, color: theme === "light" ? "#17181c" : "#e9e9ef" }}>📊 Security Category Breakdown</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              {result.categoryScores && Object.entries({
                "Foundation Security": { scores: result.categoryScores.foundation, color: "#4CAF50", icon: "🛡️" },
                "Advanced Controls": { scores: result.categoryScores.advanced, color: "#2196F3", icon: "⚡" },
                "Security Culture": { scores: result.categoryScores.culture, color: "#FF9800", icon: "👥" },
              }).map(([category, data]) => {
                const avg = data.scores.length ? Math.round((data.scores.reduce((s, v) => s + v, 0) / data.scores.length) * 100) : 0;
                return (
                  <div key={category} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{data.icon}</div>
                    <div className="label-text" style={{ fontSize: 14, color: theme === "light" ? "#666" : "#a3a7b3", marginBottom: 8 }}>{category}</div>
                    <div className="category-progress" style={{ width: "100%", height: 8, background: theme === "light" ? "#e0e0e0" : "#333", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                      <div className="category-progress-fill" style={{ width: `${avg}%`, height: "100%", background: `linear-gradient(90deg, ${data.color}AA, ${data.color})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                    </div>
                    <div className="value-text" style={{ fontSize: 18, fontWeight: "bold", color: data.color }}>{avg}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {result.notes?.length ? (
            <>
              <h3 className="section-title mt" style={{ color: theme === "light" ? "#17181c" : "#e9e9ef" }}>🎯 Prioritized Action Plan</h3>
              <div className="action-plan" style={{
                background: theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                padding: 20, borderRadius: 8, border: theme === "light" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.12)"
              }}>
                <ul className="notes" style={{ margin: 0, paddingLeft: 20 }}>
                  {result.notes.map((n, i) => (
                    <li key={i} className="action-item" style={{
                      marginBottom: 12, lineHeight: 1.5, fontWeight: 500,
                      color: n.includes("🚨") ? "#F44336" : n.includes("📈") ? "#FF9800" : (theme === "light" ? "#17181c" : "#e9e9ef")
                    }}>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                marginTop: 20, marginBottom: 24, padding: 16,
                background: theme === "light" ? "rgba(124, 92, 255, 0.1)" : "rgba(124, 92, 255, 0.15)",
                borderRadius: 8, border: theme === "light" ? "1px solid rgba(124, 92, 255, 0.2)" : "1px solid rgba(124, 92, 255, 0.3)"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: theme === "light" ? "#7c5cff" : "#6a8dff" }}>💡 Next Steps</h4>
                <p style={{ margin: 0, fontSize: 14 }}>Focus on addressing HIGH priority items first. Each improvement will significantly boost your security posture. Consider scheduling a follow-up assessment in 30–60 days to track progress.</p>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: "center", padding: 40,
              background: theme === "light" ? "rgba(76, 175, 80, 0.1)" : "rgba(76, 175, 80, 0.15)",
              borderRadius: 8, border: theme === "light" ? "1px solid rgba(76, 175, 80, 0.2)" : "1px solid rgba(76, 175, 80, 0.3)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h3 style={{ color: theme === "light" ? "#2E7D32" : "#4CAF50", marginBottom: 8 }}>Outstanding Security Posture!</h3>
              <p style={{ marginBottom: 0 }}>Your organization demonstrates excellent cybersecurity practices with minimal gaps detected. Continue monitoring and stay updated with emerging threats and best practices.</p>
            </div>
          )}

          <div className="cta screen-only" style={{ marginTop: 32 }}>
            <button className="btn btn--primary" onClick={() => window.print()} style={{ marginRight: 16 }}>Download Report PDF</button>
            <button className="btn btn--ghost" onClick={() => setView("landing")}>Take Assessment Again</button>
          </div>
        </section>
      )}

      {showEmailModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Email Results">
          <div className="modal__card bubble" style={{ maxWidth: 500, padding: "2rem" }}>
            <div className="modal__head">
              <h3 style={{ margin: 0, fontSize: "1.5rem" }}>📧 Get Your Results by Email</h3>
              <button className="link" onClick={() => setShowEmailModal(false)} aria-label="Close">✕</button>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ margin: "0 0 1.5rem", lineHeight: 1.5, color: "var(--text-muted)" }}>Thank you for taking our cybersecurity assessment! We can email you a copy of your results.</p>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: ".5rem", fontWeight: 600 }}>Email Address *</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="your.email@company.com"
                  style={{ width: "100%", padding: ".75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--panel)", color: "var(--text)", fontSize: "1rem" }} required />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: ".5rem", fontWeight: 600 }}>Company Name (Optional)</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Organization"
                  style={{ width: "100%", padding: ".75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--panel)", color: "var(--text)", fontSize: "1rem" }} />
              </div>
              <div style={{ background: "rgba(124, 92, 255, 0.15)", padding: "1rem", borderRadius: 8, marginBottom: "1.5rem", border: "1px solid rgba(124, 92, 255, 0.3)" }}>
                <p style={{ margin: 0, fontSize: ".9rem" }}>🛡️ <strong>Privacy Note:</strong> Your email is used only to send your assessment results.</p>
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button className="btn btn--ghost" onClick={() => setShowEmailModal(false)} disabled={emailSending}>Skip</button>
                <button className="btn btn--primary" onClick={sendThankYouEmail} disabled={!userEmail || emailSending}
                  style={{ opacity: !userEmail || emailSending ? 0.6 : 1, cursor: !userEmail || emailSending ? "not-allowed" : "pointer" }}>
                  {emailSending ? "📧 Sending..." : "📧 Send Results"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <img className="corner-badge" src={theme === "light" ? lightLogo : darkLogo} alt="Mission Secure" aria-hidden="true" />
    </div>
  );
}

/* ---------- Header (with 3 menu openers) ---------- */
function Header({
  theme,
  setTheme,
  onWhoWeAre,
  onResources,
  onCyberNews,
  onPrefetchNews,
  onStart,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const toggleMenu = () => setMobileMenuOpen(v => !v);
  const openMenu = () => setMobileMenuOpen(true);
  const keyOpen = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openMenu(); } };

  return (
    <header className="topbar">
      <div className="rail">
        {/* 1) BRAND button */}
        <div
          className="brand"
          role="button"
          tabIndex={0}
          onClick={toggleMenu}
          onKeyDown={keyOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          style={{ cursor: "pointer" }}
        >
          <img src={theme === "light" ? lightLogo : darkLogo} alt="Mission Secure" className="logo" />
          <h2>Cyber Hygiene Test <span className="by">by Mission Secure</span></h2>
        </div>

        {/* 2) HAMBURGER icon */}
        <button type="button" className="icon-btn" aria-label="Open menu" onClick={openMenu} onKeyDown={keyOpen} style={{ marginLeft: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <ContactUs />

        <button className="btn btn--ghost" onClick={onCyberNews} onMouseEnter={onPrefetchNews} onFocus={onPrefetchNews}>
          <span role="img" aria-label="newspaper">📰</span> Latest Cyber News
        </button>

        <button className="btn btn--ghost" onClick={onWhoWeAre}>Who We Are</button>
        <button className="btn btn--primary" onClick={onStart}>Take assessment</button>
        <button className="btn btn--ghost" onClick={onResources}>Resources</button>

        {/* 3) TEXT MENU button */}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={openMenu}
          onKeyDown={keyOpen}
          aria-haspopup="dialog"
          aria-expanded={mobileMenuOpen ? "true" : "false"}
        >
          ☰ Menu
        </button>

        <div className="theme-toggle" aria-label="Theme toggle">
          <input id="themeSwitch" type="checkbox" checked={theme === "light"} onChange={(e) => setTheme(e.target.checked ? "light" : "dark")} />
          <label htmlFor="themeSwitch" title="Light / Dark">
            <span className="sun">☀️</span><span className="moon">🌙</span>
          </label>
        </div>
      </div>
    </header>
  );
}

function BigNumber({ value, hue }) {
  const color = `hsl(${hue} 85% 55%)`;
  return (
    <div className="score">
      <div className="score__num" style={{ color }}>{value}%</div>
      <div className="score__bar">
        <div className="score__fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, hsl(0 85% 55%), hsl(${hue} 85% 55%))` }} />
      </div>
      <p className="score__legend">0 = red, 50 = orange, 70 = yellow, 85+ = green 🎉</p>
    </div>
  );
}

function SummaryItem({ label, children }) {
  return (
    <div>
      <div className="label-text" style={{ fontSize: 14, color: "var(--text-muted)" }}>{label}</div>
      {children}
    </div>
  );
}
