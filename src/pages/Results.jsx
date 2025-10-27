// src/pages/Results.jsx
import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams, Link, useNavigate } from "react-router-dom";
import EmailCapture from "../components/EmailCapture";
import "../components/EmailCapture.css";

/**
 * Results page:
 * - Works if you arrived via navigate("/results", { state: { answers, score, total } })
 * - Also works on refresh/deep-link with /results?score=XX&total=YY (no answers breakdown)
 */
export default function Results() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [sp] = useSearchParams();

  // From navigation state (preferred)
  const answers = loc.state?.answers ?? null;
  const scoreState = loc.state?.score ?? null;
  const totalState = loc.state?.total ?? null;

  // From URL (fallback so refresh works)
  const scoreQS = sp.get("score");
  const totalQS = sp.get("total");

  const score = Number(scoreState ?? scoreQS ?? NaN);
  const total = Number(totalState ?? totalQS ?? NaN);

  // Derive percentage + verdict
  const pct = Number.isFinite(score) && Number.isFinite(total) && total > 0
    ? Math.round((score / total) * 100)
    : null;

  const verdict = pct == null
    ? "Getting Started"
    : pct >= 85 ? "Strong"
    : pct >= 70 ? "Good"
    : pct >= 50 ? "Needs Improvement"
    : "At Risk";

  // When we DO have answers, we can show a breakdown by tag
  const breakdown = useMemo(() => {
    if (!answers) return null;
    const best = Object.values(answers).filter(a => a?.tag === "best").length;
    const iffy = Object.values(answers).filter(a => a?.tag === "iffy").length;
    const bad  = Object.values(answers).filter(a => a?.tag === "bad").length;
    return { best, iffy, bad };
  }, [answers]);

  // Fun confetti for high scores
  useEffect(() => {
    if (pct != null && pct >= 85) {
      try {
        simpleConfetti(3000);
      } catch {}
    }
  }, [pct]);

  return (
    <section style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Security Assessment Results</h2>

      {/* Summary header */}
      {pct != null ? (
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
          <BigNumber value={pct} />
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              Overall: {verdict}
            </div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              You scored <strong>{score}</strong> out of <strong>{total}</strong>.
            </div>
          </div>
        </div>
      ) : (
        <p>No results were provided. Please retake the assessment.</p>
      )}

      {/* Executive summary tiles */}
      {pct != null && (
        <div style={{
          background: "var(--panel)",
          border: "1px solid var(--border-color)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>📋 Executive Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <Tile label="Risk Level" value={pct >= 85 ? "Low" : pct >= 70 ? "Moderate" : "High"} />
            <Tile label="Implementation Window" value={pct >= 85 ? "≈30 days" : pct >= 70 ? "≈60 days" : "≈90 days"} />
            <Tile label="Investment Range" value={pct >= 85 ? "$0.5K–2K" : pct >= 70 ? "$2K–8K" : "$8K–20K"} />
            <Tile label="Ranking" value={pct >= 85 ? "Top 10%" : pct >= 67 ? "Above Avg" : "Below Avg"} />
          </div>
        </div>
      )}

      {/* Breakdown (only if we have answers from state) */}
      {answers && breakdown && (
        <div style={{
          background: "var(--panel)",
          border: "1px solid var(--border-color)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>📊 Breakdown</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            <li>🟢 Strong answers: <strong>{breakdown.best}</strong></li>
            <li>🟠 Partial answers: <strong>{breakdown.iffy}</strong></li>
            <li>🔴 Gaps: <strong>{breakdown.bad}</strong></li>
          </ul>
          <p className="muted" style={{ marginTop: 8, fontSize: ".9rem" }}>
            Tip: Tackle 🔴 gaps first, then upgrade 🟠 to 🟢.
          </p>
        </div>
      )}

      {/* Email Capture */}
      {pct != null && (
        <EmailCapture score={score} total={total} />
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
        <button className="navlink" style={btn} onClick={() => window.print()}>
          Download Report PDF
        </button>
        <Link to="/quiz" className="navlink" style={btnSecondary}>
          Retake Assessment
        </Link>
        {/* 👇 keep this exactly as requested */}
        <Link to="/resources" className="navlink" style={btnSecondary}>
          Improve with Resources
        </Link>
      </div>

      {/* Fallback CTA if score missing */}
      {pct == null && (
        <div style={{ marginTop: 16 }}>
          <Link to="/quiz" className="navlink" style={btn}>Start Assessment</Link>
        </div>
      )}
    </section>
  );
}

/* ---------- subcomponents ---------- */
function BigNumber({ value }) {
  const hue = Math.max(0, Math.min(120, Math.round((value / 100) * 120)));
  const color = `hsl(${hue} 85% 55%)`;
  return (
    <div>
      <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color }}>{value}%</div>
      <div style={{
        width: 240,
        height: 10,
        background: "color-mix(in oklab, var(--text-color) 10%, transparent)",
        borderRadius: 999,
        border: "1px solid color-mix(in oklab, var(--text-color) 18%, transparent)",
        overflow: "hidden",
        marginTop: 8
      }}>
        <div style={{
          width: `${value}%`,
          height: "100%",
          background: `linear-gradient(90deg, hsl(0 85% 55%), ${color})`,
          boxShadow: "0 0 12px var(--glow-soft)"
        }}/>
      </div>
      <p style={{ margin: "6px 0 0 0", fontSize: 12, opacity: 0.7 }}>
        0 = red, 50 = orange, 70 = yellow, 85+ = green 🎉
      </p>
    </div>
  );
}

function Tile({ label, value }) {
  return (
    <div style={{
      border: "1px solid var(--border-color)",
      borderRadius: 10,
      padding: 12,
      background: "rgba(255,255,255,0.02)"
    }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const btn = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.15)",
  background: "linear-gradient(180deg,#1f2a44,#18233a)",
  color: "white",
  fontWeight: 600,
  textDecoration: "none",
};

const btnSecondary = {
  ...btn,
  background: "transparent",
  border: "1px solid rgba(255,255,255,.25)",
};

/* ---------- tiny confetti (no deps) ---------- */
function simpleConfetti(ms = 2500) {
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "2147483647",
    overflow: "hidden",
  });
  document.body.appendChild(container);

  const colors = ["#7c5cff", "#5cc8ff", "#ffb02e", "#4caf50", "#ef5350"];
  let raf;
  const pieces = Array.from({ length: 120 }).map(() => {
    const el = document.createElement("i");
    const size = 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size * 1.4}px`,
      left: `${Math.random() * 100}vw`,
      top: `-10px`,
      background: colors[Math.floor(Math.random() * colors.length)],
      transform: `rotate(${Math.random() * 360}deg)`,
      opacity: String(0.7 + Math.random() * 0.3),
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
    });
    container.appendChild(el);
    return {
      el,
      y: -10,
      x: Math.random() * window.innerWidth,
      vy: 2 + Math.random() * 3.5,
      vx: -1 + Math.random() * 2,
      rot: Math.random() * 360,
      vr: -3 + Math.random() * 6,
    };
  });

  const tick = () => {
    pieces.forEach(p => {
      p.vy += 0.02;
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vr;
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
    });
    raf = requestAnimationFrame(tick);
  };
  tick();

  setTimeout(() => {
    cancelAnimationFrame(raf);
    container.remove();
  }, ms);
}
