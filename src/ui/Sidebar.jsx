// src/ui/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../routes/table.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  // Handle navigation errors and redirects
  useEffect(() => {
    if (location.pathname !== '/' && !routes.some(route => route.path === location.pathname)) {
      navigate('/');
    }
  }, [location, navigate]);

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
              <NavLink
                to={path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={(e) => {
                  onClose();
                }}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Theme slider */}
        <div className="sidebar-theme">
          <div 
            className="nav-link theme-button"
            role="button"
            tabIndex={0}
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              document.documentElement.dataset.theme = newTheme;
              localStorage.setItem('theme', newTheme);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const newTheme = theme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                document.documentElement.dataset.theme = newTheme;
                localStorage.setItem('theme', newTheme);
              }
            }}
          >
            <span className="theme-icon">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} mode
          </div>
        </div>
      </nav>
    </>
  );
}
