import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <section style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Welcome to Mission Secure</h2>
      <p>Assess your security readiness in a few minutes.</p>
      <button
        onClick={() => navigate("/quiz")}
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.15)",
          background: "linear-gradient(180deg,#1f2a44,#18233a)",
          color: "white",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Take Assessment
      </button>
    </section>
  );
}
