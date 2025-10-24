import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";
import { routes, notFound } from "./routes/table.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout>
        <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
          <Routes>
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
