// src/ui/Sidebar.jsx
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ open, onClose, items = [] }) {
  return (
    <>
      {/* Scrim for mobile */}
      <button
        className={`sidebar__scrim ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "is-open" : ""}`} aria-label="Site">
        <div className="sidebar__head">
          <div className="sidebar__brand">
            <span className="sidebar__logo">🛡️</span>
            <span className="sidebar__title">Mission Secure</span>
          </div>
          <button
            className="sidebar__close"
            aria-label="Close menu"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar__nav">
          {items.map((it) => (
            <NavLink
              key={it.path}
              to={it.path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "is-active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar__dot" />
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__foot">
          <p className="sidebar__muted">© {new Date().getFullYear()} Mission Secure</p>
        </div>
      </aside>
    </>
  );
}
