import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../ui/Sidebar.jsx";
import "./layout.css";

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const { pathname } = useLocation();

  // Close the sidebar when Esc is pressed
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Persist theme on first load (default to saved theme or dark)
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.dataset.theme = saved;
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          ref={btnRef}
          className="icon-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="app-sidebar"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Vite logo as the toggle icon */}
          <img
            src="/vite.svg"
            alt=""
            width="26"
            height="26"
            className={`logo-toggle ${open ? "is-open" : ""}`}
            draggable="false"
          />
        </button>

        <h1 className="brand">Mission Secure</h1>
      </header>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* When sidebar is open on desktop, push content; also remove top padding on Home */}
      <main
        className={[
          "page",
          open ? "has-sidebar" : "",
          pathname === "/" ? "home-route" : "",
        ].join(" ").trim()}
      >
        {children}
      </main>
    </div>
  );
}
