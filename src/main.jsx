import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layout/RootLayout.jsx";
import { routes } from "./routes/table.jsx";

/* -------------------------------
   1) Safe touch listener for mobile
   (previous code passed `{}` which throws on iOS/Android)
----------------------------------*/
if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
  const noop = () => {};
  document.addEventListener("touchstart", noop, { passive: true, capture: true });
}

/* -------------------------------
   2) Error Boundary + chunk load recovery
----------------------------------*/
class RootErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("RootErrorBoundary:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 18, color: "#e5e7eb", background: "#0b1020",
          minHeight: "100dvh", display: "grid", placeItems: "center", textAlign: "center"
        }}>
          <div>
            <h2 style={{ margin: "0 0 .5rem" }}>Something went wrong</h2>
            <p style={{ opacity: .8, margin: "0 0 1rem" }}>Try reloading the page.</p>
            <button
              onClick={() => location.reload()}
              style={{
                padding: "10px 14px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,.2)",
                background: "linear-gradient(180deg,#223153,#1a2745)",
                color: "#fff", fontWeight: 700, cursor: "pointer"
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Reload if a lazy chunk fails to load (mobile networks / cache issues)
const chunkErrorRegex = /Loading chunk|ChunkLoadError|import\(\) failed/i;

window.addEventListener("error", (e) => {
  const msg = String(e?.message || "");
  if (chunkErrorRegex.test(msg)) {
    console.warn("Recovering from chunk load error (error):", msg);
    location.reload();
  }
});

window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e?.reason?.message || e?.reason || "");
  if (chunkErrorRegex.test(msg)) {
    console.warn("Recovering from chunk load error (promise):", msg);
    location.reload();
  }
});

/* -------------------------------
   3) dvh fallback var (optional, safe)
----------------------------------*/
const setVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
setVh();
window.addEventListener("resize", setVh, { passive: true });

/* -------------------------------
   4) Mount
----------------------------------*/
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RootErrorBoundary>
        <RootLayout>
          <Suspense
            fallback={
              <div style={{
                minHeight: "100dvh",
                display: "grid", placeItems: "center",
                background: "#0b1020", color: "#e5e7eb"
              }}>
                Loading…
              </div>
            }
          >
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RootLayout>
      </RootErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
