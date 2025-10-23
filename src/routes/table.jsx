import { lazy } from "react";

const WhoWeAre = lazy(() => import("../pages/WhoWeAre.jsx"));
const Resources = lazy(() => import("../pages/Resources.jsx"));
const LatestCyberNews = lazy(() => import("../pages/CyberNews.jsx")); // make sure filename matches

export const routes = [
  { path: "/who-we-are", label: "Who We Are", element: <WhoWeAre /> },
  { path: "/resources", label: "Resources", element: <Resources /> },
  { path: "/news", label: "Latest Cyber News", element: <LatestCyberNews /> },
];

export const notFound = {
  path: "*",
  element: <div style={{ padding: 16 }}>Page not found</div>,
};
