// src/ui/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../routes/table.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const panelRef = useRef(null);

  // --- Theme (persist to localStorage) ---
  const pickInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.matchMedia?.("(prefers-color-scheme: light)")?.matches
      ? "light"
      : "dark";
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

  // Build menu (skip routes with no label)
  const menu = routes.filter((r) => r.label);

  return (
    <>
      {/* Backdrop (tap/click to close) */}
      <div
        className={`backdrop ${open ? "show" : ""}`}
        aria-hidden={!open}
        onClick={onClose}
      />

      {/* Drawer (stop events so taps inside don’t bubble to backdrop) */}
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
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

        <ul className="navlist">
          {menu.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => "navlink" + (isActive ? " active" : "")}
                onClick={onClose} // close after navigating
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Theme slider */}
        <div className="sidebar-theme">
          <div className="theme-toggle" aria-label="Theme toggle">
            <input
              id="sidebarThemeSwitch"
              type="checkbox"
              checked={theme === "light"}
              onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
            />
            <label htmlFor="sidebarThemeSwitch" title="Light / Dark">
              <span className="sun">☀️</span>
              <span className="moon">🌙</span>
            </label>
          </div>
          <span className="theme-label">{theme === "light" ? "Light" : "Dark"} mode</span>
        </div>
      </nav>
    </>
  );
}
