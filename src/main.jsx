import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";
import { routes, notFound } from "./routes/table.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Add touch event polyfill for mobile
if (window.matchMedia("(pointer: coarse)").matches) {
  document.addEventListener('touchstart', {}, true);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <RootLayout>
          <Suspense 
            fallback={
              <div style={{ 
                padding: 16, 
                position: 'fixed', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)'
              }}>
                Loading…
              </div>
            }
          >
            <Routes>
              {routes.map(r => (
                <Route 
                  key={r.path} 
                  path={r.path} 
                  element={
                    <ErrorBoundary>
                      <div className="route-container">
                        {r.element}
                      </div>
                    </ErrorBoundary>
                  }
                />
              ))}
              <Route path={notFound.path} element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RootLayout>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
