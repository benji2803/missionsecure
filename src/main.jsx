import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layout/RootLayout.jsx";
import { routes } from "./routes/table.jsx";

// Add touch event polyfill for mobile
if (window.matchMedia("(pointer: coarse)").matches) {
  document.addEventListener('touchstart', {}, true);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout>
        <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </RootLayout>
    </BrowserRouter>
  </StrictMode>
);
