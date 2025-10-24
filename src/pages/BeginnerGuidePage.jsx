// src/pages/BeginnerGuidePage.jsx
import { useNavigate } from "react-router-dom";

export default function BeginnerGuidePage() {
  const navigate = useNavigate();

  return (
    <main className="page page-top">
      <section className="container" style={{ paddingTop: 0 }}>
        {/* Intro */}
        <header className="text-center" style={{ marginBottom: "1.25rem" }}>
          <h1 className="home-title" style={{ margin: 0 }}>
            🎯 <span>Cybersecurity</span> for Beginners
          </h1>
          <p className="muted" style={{ maxWidth: 720, margin: "8px auto 0" }}>
            The essentials to keep you and your org safe online — no deep tech required. 🛡️
          </p>
        </header>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <section style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 .5rem 0" }}>🚨 What is Cybersecurity?</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Think locks, alarms, and guards for your digital life. It protects:
            </p>
            <ul className="about-list">
              <li><strong>Personal Info:</strong> photos, emails, bank details, passwords</li>
              <li><strong>Business Data:</strong> customer info, financial records, IP</li>
              <li><strong>Devices:</strong> computers, phones, tablets from malware & hackers</li>
            </ul>
          </section>

          <section style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 .5rem 0" }}>🎯 Common Threats</h3>
            <ul className="about-list">
              <li>
                <strong>Phishing emails:</strong> look legit, steal creds
                <br /><em className="muted">Watch for: urgency, weird links, asking for passwords</em>
              </li>
              <li>
                <strong>Malware/viruses:</strong> steal data or damage devices
                <br /><em className="muted">Avoid shady downloads; keep AV updated</em>
              </li>
              <li>
                <strong>Weak passwords:</strong> “password123”
                <br /><em className="muted">Use long, unique passphrases in a manager</em>
              </li>
              <li>
                <strong>Public Wi-Fi risks:</strong> snooping on open networks
                <br /><em className="muted">Skip banking/shopping on public Wi-Fi</em>
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 .75rem 0" }}>✅ Quick Wins</h3>
            <div
              style={{
                background: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
              }}
            >
              <h4 style={{ margin: "0 0 .5rem 0", color: "var(--success-text)" }}>
                5-Minute Security Checkup
              </h4>
              <ol style={{ margin: 0, paddingLeft: "1.2rem" }}>
                <li>Turn on automatic updates (phone & computer)</li>
                <li>Use a password manager (Bitwarden is a great free option)</li>
                <li>Enable 2-factor auth on email & critical accounts</li>
                <li>Review social media privacy settings</li>
                <li>Confirm antivirus is installed/active</li>
              </ol>
            </div>
          </section>

          <section style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 .5rem 0" }}>🛠️ Essential Tools</h3>
            <ul className="about-list">
              <li>
                <strong>Password managers:</strong>
                <br />• <a href="https://bitwarden.com" target="_blank" rel="noopener noreferrer">Bitwarden</a>
                <br />• <a href="https://1password.com" target="_blank" rel="noopener noreferrer">1Password</a>
              </li>
              <li>
                <strong>Antivirus:</strong>
                <br />• Windows Defender (built-in) • <a href="https://www.malwarebytes.com" target="_blank" rel="noopener noreferrer">Malwarebytes</a>
              </li>
              <li>
                <strong>2FA apps:</strong>
                <br />• <a href="https://support.google.com/accounts/answer/1066447" target="_blank" rel="noopener noreferrer">Google Authenticator</a>
                <br />• <a href="https://authy.com" target="_blank" rel="noopener noreferrer">Authy</a>
              </li>
            </ul>
          </section>

          <section>
            <h3 style={{ margin: "0 0 .5rem 0" }}>🧠 Golden Rules</h3>
            <ul className="about-list">
              <li><strong>Think before you click</strong> links/attachments</li>
              <li><strong>Update everything</strong> to patch holes</li>
              <li><strong>Unique passwords</strong> for every account</li>
              <li><strong>Trust your gut</strong> if it feels off</li>
              <li><strong>Back up</strong> important files</li>
            </ul>
          </section>

          {/* CTA */}
          <aside
            style={{
              marginTop: "1.5rem",
              padding: "1.5rem",
              background: "var(--panel)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              boxShadow: "0 8px 22px var(--glow-soft)",
            }}
          >
            <h3 style={{ margin: "0 0 .5rem 0", color: "var(--primary)" }}>
              Ready to test your knowledge?
            </h3>
            <p className="muted" style={{ margin: "0 0 1rem 0" }}>
              Take our assessment to see how well you’re protected.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/quiz")}>
              Take Assessment
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
