import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";
import { routes, notFound } from "./routes/table.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <RootLayout>
          <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
            <Routes>
              {routes.map(r => (
                <Route 
                  key={r.path} 
                  path={r.path} 
                  element={
                    <ErrorBoundary>
                      {r.element}
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
