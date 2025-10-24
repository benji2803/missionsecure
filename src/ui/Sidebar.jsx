// src/ui/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../routes/table.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const panelRef = useRef(null);

  // init theme from storage or OS, then apply to <html data-theme="">
  const pickInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };
  const [theme, setTheme] = useState(pickInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  // focus first link/button on open
  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelector("a,button,input,label");
      focusable?.focus();
    }
  }, [open]);

  const menu = routes.filter((r) => r.label);

  return (
    <>
      <div
        className={`backdrop ${open ? "show" : ""}`}
        aria-hidden={!open}
        onClick={onClose}
      />

      <nav
        id="app-sidebar"
        className={`sidebar ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-label="Primary"
        ref={panelRef}
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
                onClick={onClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Cute sun/moon slider */}
        <div className="sidebar-theme">
          <div className="theme-toggle" aria-label="Theme toggle">
            {/* IMPORTANT: input immediately before label for :checked + label selector */}
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
