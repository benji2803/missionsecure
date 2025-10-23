// src/pages/ContactUs.jsx  (you can also put this in src/ui/ if you prefer)
import React, { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || ""; // empty => same-origin

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef(null);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("✅ Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const err = await res.json().catch(() => ({}));
        setStatus(err?.error || "❌ Failed to send.");
      }
    } catch {
      setStatus("❌ Error sending message.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Esc + focus + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // focus first input
    firstFieldRef.current?.focus();

    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);

    // lock background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger button — place wherever you want (topbar, page, etc.) */}
      <button className="btn btn--ghost" onClick={() => setIsOpen(true)}>
        Contact Us
      </button>

      {isOpen && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contactUsTitle"
          aria-describedby="contactUsDesc"
          onClick={() => setIsOpen(false)}                // backdrop click closes
        >
          <div
            className="modal__card bubble"
            onClick={(e) => e.stopPropagation()}         // don't close when clicking card
          >
            <div className="modal__head">
              <div className="about-brand">
                <h3 id="contactUsTitle">Contact Us</h3>
                <p id="contactUsDesc" style={{ margin: 0, color: "var(--text-muted)" }}>
                  Send us a message and we’ll get back to you.
                </p>
              </div>
              <button
                className="link"
                onClick={() => setIsOpen(false)}
                aria-label="Close Contact Us modal"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="cta"
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                ref={firstFieldRef}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                autoComplete="name"
                style={{
                  borderRadius: "12px",
                  padding: "0.8rem",
                  border: "1px solid var(--border)",
                  background: "var(--panel)",
                  color: "var(--text)",
                }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                autoComplete="email"
                style={{
                  borderRadius: "12px",
                  padding: "0.8rem",
                  border: "1px solid var(--border)",
                  background: "var(--panel)",
                  color: "var(--text)",
                }}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                required
                style={{
                  borderRadius: "12px",
                  padding: "0.8rem",
                  border: "1px solid var(--border)",
                  background: "var(--panel)",
                  color: "var(--text)",
                }}
              />
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? "Sending..." : "Send"}
              </button>
            </form>

            {status && (
              <p style={{ marginTop: "8px", color: "var(--text-muted)" }}>
                {status}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
