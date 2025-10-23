import { lazy } from "react";

// Map labels → actual files you have today
const WhoWeAre       = lazy(() => import("../TeamPage.jsx"));            // “Who We Are”
const Resources      = lazy(() => import("../BeginnerGuidePage.jsx"));   // “Resources” (temp)
const LatestCyberNews= lazy(() => import("../CyberNews.jsx"));           // “Latest Cyber News”

export const routes = [
  { path: "/who-we-are", label: "Who We Are", element: <WhoWeAre /> },
  { path: "/resources",  label: "Resources",  element: <Resources /> },
  { path: "/news",       label: "Latest Cyber News", element: <LatestCyberNews /> },
];

export const notFound = {
  path: "*",
  element: <div style={{ padding: 16 }}>Page not found</div>,
};
