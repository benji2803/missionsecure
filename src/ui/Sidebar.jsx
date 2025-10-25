// src/ui/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { routes } from "../routes/table.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // --- Theme (persist to localStorage) ---
  const pickInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
  };
  const [theme, setTheme] = useState(pickInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Esc closes ---
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // --- Focus a link on open (a11y) ---
  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelector("a,button,input,label");
      focusable?.focus();
    }
  }, [open]);

  const menu = routes.filter((r) => r.label);

  return (
    <>
      {/* Backdrop (tap/click to close) */}
      <div
        className={`backdrop ${open ? "show" : ""}`}
        aria-hidden={!open}
        onClick={onClose}
        onTouchStart={onClose}
      />

      {/* Drawer */}
      <nav
        id="app-sidebar"
        className={`sidebar ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-label="Primary"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button 
            className="close-btn" 
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }} 
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <ul className="navlist">
          {menu.map(({ path, label }) => (
            <li key={path}>
              <button
                className="nav-button"
                onClick={() => {
                  navigate(path);
                  onClose();
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Theme slider */}
        <div className="sidebar-theme">
          <button
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              document.documentElement.dataset.theme = newTheme;
              localStorage.setItem('theme', newTheme);
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="theme-label-mobile">
              {theme === 'light' ? 'Dark' : 'Light'} mode
            </span>
          </button>
          <span className="theme-label">{theme === "light" ? "Light" : "Dark"} mode</span>
        </div>
      </nav>
    </>
  );
}
