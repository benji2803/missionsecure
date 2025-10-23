// src/routes/table.jsx
import { lazy } from "react";

// Map routes → actual files in src/pages
const WhoWeAre        = lazy(() => import("../pages/TeamPage.jsx"));           // "Who We Are"
const Resources       = lazy(() => import("../pages/BeginnerGuidePage.jsx"));  // "Resources" (for now)
const LatestCyberNews = lazy(() => import("../pages/CyberNews.jsx"));          // "Latest Cyber News"

export const routes = [
  { path: "/who-we-are", label: "Who We Are", element: <WhoWeAre /> },
  { path: "/resources",  label: "Resources",  element: <Resources /> },
  { path: "/news",       label: "Latest Cyber News", element: <LatestCyberNews /> },
];

export const notFound = {
  path: "*",
  element: <div style={{ padding: 16 }}>Page not found</div>,
};
