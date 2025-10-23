// src/routes/table.js
import { lazy } from "react";

// Match your real filenames in src/pages/
const WhoWeAre = lazy(() => import("../pages/TeamPage.jsx"));
const Resources = lazy(() => import("../pages/BeginnerGuidePage.jsx"));
const LatestCyberNews = lazy(() => import("../pages/CyberNews.jsx"));

export const routes = [
  { path: "/who-we-are", label: "Who We Are", element: <WhoWeAre /> },
  { path: "/resources", label: "Resources", element: <Resources /> },
  { path: "/news", label: "Latest Cyber News", element: <LatestCyberNews /> },
];

export const notFound = {
  path: "*",
  element: <div style={{ padding: 16 }}>Page not found</div>,
};
