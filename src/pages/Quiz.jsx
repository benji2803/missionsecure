// src/pages/Quiz.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* --------------------------------------------
   Quiz content (same as your app)
   -------------------------------------------- */
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

/* --------------------------------------------
   Tiny helpers
   -------------------------------------------- */
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function QuizPage() {
  const navigate = useNavigate();
  const [qs, setQs] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transitioning, setTransitioning] = useState(false);

  // initialize/shuffle on mount
  useEffect(() => {
    const randomized = shuffle(BASE_QUESTIONS).map(q => ({ ...q, options: shuffle(q.options) }));
    setQs(randomized);
    setIdx(0);
    setAnswers({});
  }, []);

  // 1/2/3 hotkeys for options
  useEffect(() => {
    const handler = (e) => {
      if (!qs) return;
      if (["1","2","3"].includes(e.key)) {
        const n = Number(e.key) - 1;
        const opt = qs[idx]?.options?.[n];
        if (opt) choose(opt);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [qs, idx]);

  if (!qs) {
    return (
      <main className="page page-top">
        <section className="container">
          <p className="muted">Loading…</p>
        </section>
      </main>
    );
  }

  const total = qs.length;
  const q = qs[idx];

  const choose = (opt) => {
    if (transitioning) return;
    setTransitioning(true);

    const next = { ...answers, [q.id]: opt };
    setAnswers(next);

    setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(idx + 1);
        setTransitioning(false);
      } else {
        // compute score and navigate with BOTH query params and state
        const score = Object.values(next).reduce((sum, o) => sum + (Number(o?.weight) || 0), 0);
        navigate(`/results?score=${score}&total=${total}`, {
          state: { answers: next, score, total }
        });
      }
    }, 140);
  };

  return (
    <main className="page page-top">
      <section className="container" style={{ paddingTop: 0 }}>
        {/* Header */}
        <header className="quiz-head" style={{ gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Quick Cyber Hygiene Check</h2>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <ProgressBar value={idx + 1} max={total} />
            <span className="progress">{idx + 1} / {total}</span>
          </div>
        </header>

        {/* Question card */}
        <article
          style={{
            marginTop: 12,
            padding: "18px 18px 16px",
            borderRadius: 14,
            background: "var(--panel)",
            border: "1px solid var(--border-color)",
            boxShadow: "0 8px 22px var(--glow-soft)",
          }}
        >
          <h3 className="q" style={{ marginTop: 0 }}>
            {q.text}
          </h3>

          <div className="options" style={{ marginTop: 14 }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                className="option"
                onClick={() => choose(opt)}
                disabled={transitioning}
                aria-label={`Answer: ${opt.label}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
                  {opt.tag === "best" ? "" : opt.tag === "iffy" ? "" : ""}
                </span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Hint row */}
          <div className="muted" style={{ marginTop: 12, fontSize: ".9rem" }}>
            Please Be Truthful For Best Results 🙃
          </div>
        </article>

        {/* Footer actions */}
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <span className="muted">Mission Secure • LA Tech</span>
          <span className="muted">Secure choices beat lucky guesses 😉</span>
        </div>
      </section>
    </main>
  );
}

/* --------------------------------------------
   Progress bar (matches glow aesthetic)
   -------------------------------------------- */
function ProgressBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      style={{
        width: 160,
        height: 8,
        background: "color-mix(in oklab, var(--text-color) 10%, transparent)",
        borderRadius: 999,
        overflow: "hidden",
        border: "1px solid color-mix(in oklab, var(--text-color) 18%, transparent)",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg, var(--primary), var(--primary-2))",
          boxShadow: "0 0 16px var(--glow-soft)",
        }}
      />
    </div>
  );
}
