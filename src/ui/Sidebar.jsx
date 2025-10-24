import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../routes/table.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelector("a,button");
      focusable?.focus();
    }
  }, [open]);

  const menu = routes.filter(r => r.label);

  return (
    <>
      <div className={`backdrop ${open ? "show" : ""}`} aria-hidden={!open} />
      <nav id="app-sidebar" className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Primary" ref={panelRef}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button className="close-btn" onClick={onClose} aria-label="Close menu">×</button>
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
      </nav>
    </>
  );
}
