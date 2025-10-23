// src/layout/RootLayout.jsx
import { useState } from "react";
import Sidebar from "../ui/Sidebar.jsx";
import "../ui/Sidebar.css";
import { routes } from "../routes/table.jsx"; // for sidebar items

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Top bar with hamburger */}
      <header className="topbar" style={{ position: "fixed", inset: "0 0 auto 0", zIndex: 28 }}>
        <div className="rail">
          <button
            className="btn btn--ghost"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            style={{ padding: "0.6rem 0.9rem" }}
          >
            ☰
          </button>

          <div className="brand" style={{ marginLeft: 8 }}>
            <h2>
              Cyber Hygiene Test <span className="by">by Mission Secure</span>
            </h2>
          </div>
        </div>
      </header>

      {/* Sidebar (overlay on mobile, docked on desktop) */}
      <Sidebar open={open} onClose={() => setOpen(false)} items={routes} />

      {/* Routed content */}
      <main style={{ paddingTop: 64 }}>
        {children}
      </main>
    </div>
  );
}
