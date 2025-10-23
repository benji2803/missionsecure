// src/layout/RootLayout.jsx
export default function RootLayout({ children }) {
  // Minimal stub just to unblock you. Replace later with the sidebar layout.
  return <>{children}</>;
}
// src/layout/RootLayout.jsx
import { useState } from "react";
import Sidebar from "../ui/Sidebar.jsx";
import "../ui/Sidebar.css";
import { routes } from "../routes/table.jsx"; // use labels/paths for menu

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Topbar with hamburger */}
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
            <h2>Cyber Hygiene Test <span className="by">by Mission Secure</span></h2>
          </div>
        </div>
      </header>

      {/* Sidebar (mobile overlay + desktop docked) */}
      <Sidebar open={open} onClose={() => setOpen(false)} items={routes} />

      {/* Main routed content */}
      <main style={{ paddingTop: 64 }}>
        {children}
      </main>
    </div>
  );
}
