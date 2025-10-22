// src/main.jsx
import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";     // from earlier message
import { routes, notFound } from "./routes/table.js"; // your route table

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout>
        <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
          <Routes>
            {/* Default: send "/" to Who We Are */}
            <Route path="/" element={<Navigate to="/who-we-are" replace />} />
            {routes.map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            <Route path={notFound.path} element={notFound.element} />
          </Routes>
        </Suspense>
      </RootLayout>
    </BrowserRouter>
  </StrictMode>
);
