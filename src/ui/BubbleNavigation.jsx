// src/ui/BubbleNavigation.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routes/table.jsx";
import "./BubbleNavigation.css";

export default function BubbleNavigation({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  const toggleMenu = (e) => {
    if (e) {
      e.stopPropagation();
      e.currentTarget.classList.add('clicked');
      setTimeout(() => e.currentTarget.classList.remove('clicked'), 200);
    }
    onClose(!open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // --- Theme handling ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const menu = routes.filter((r) => r.label);

  return (
    <>
      <div 
        className={`bubble-backdrop ${open ? "show" : ""}`} 
        onClick={() => onClose(false)}
      />

      {/* Toggle Button */}
      <button 
        className={`bubble-toggle ${open ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <img
          src="/vite.svg"
          alt=""
          width="24"
          height="24"
          style={{ opacity: 0.9 }}
        />
      </button>

      {/* Bubble Menu */}
      <nav 
        className={`bubble-menu ${open ? "open" : ""}`}
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="bubble-header">
          <span className="bubble-title">Navigation</span>
          <button 
            className="close-btn" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <img
              src="/vite.svg"
              alt=""
              width="16"
              height="16"
              style={{ opacity: 0.9 }}
            />
          </button>
        </div>

        <ul className="bubble-nav">
          {menu.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                onClick={onClose}
                role="menuitem"
                tabIndex={0}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button 
          className="theme-button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="theme-icon">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </nav>
    </>
  );
}