// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="home">
      <div className="home-content">
        <img src="/vite.svg" alt="Mission Secure Logo" className="home-logo" />

        <h1 className="home-title">
          Welcome to <span>Mission Secure</span>
        </h1>
        <p className="home-subtitle">Protect. Assess. Evolve.</p>
        <p className="home-text muted">
          Assess your organization’s cybersecurity readiness in just a few minutes.
        </p>

        <div className="home-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/quiz")}
          >
            🚀 Take Assessment
          </button>
        </div>
      </div>
    </section>
  );
}
