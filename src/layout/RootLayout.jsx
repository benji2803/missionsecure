import { useEffect, useRef, useState } from "react";
import Sidebar from "../ui/Sidebar.jsx";
import "./layout.css";

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          ref={btnRef}
          className="icon-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="app-sidebar"
          onClick={() => setOpen(v => !v)}
        >
          <svg className={`hamburger ${open ? "is-open" : ""}`} viewBox="0 0 24 24" width="28" height="28" role="img" aria-hidden="true">
            <path className="line top" d="M4 7h16" strokeWidth="2" stroke="currentColor" />
            <path className="line mid" d="M4 12h16" strokeWidth="2" stroke="currentColor" />
            <path className="line bot" d="M4 17h16" strokeWidth="2" stroke="currentColor" />
          </svg>
        </button>
        <h1 className="brand">Mission Secure</h1>
      </header>

      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className={`page ${open ? "no-scroll" : ""}`}>{children}</main>
    </div>
  );
}
