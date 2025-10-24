// src/routes/table.jsx
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home.jsx"));
const TeamPage = lazy(() => import("../pages/TeamPage.jsx"));                // Who We Are
const BeginnerGuidePage = lazy(() => import("../pages/BeginnerGuidePage.jsx")); // Resources
const CyberNews = lazy(() => import("../pages/CyberNews.jsx"));              // Latest Cyber News
const ContactUs = lazy(() => import("../pages/ContactUs.jsx"));
const Quiz = lazy(() => import("../pages/Quiz.jsx"));

export const routes = [
  { path: "/", label: "Home", element: <Home /> },
  { path: "/who-we-are", label: "Who We Are", element: <TeamPage /> },
  { path: "/resources", label: "Resources", element: <BeginnerGuidePage /> },
  { path: "/news", label: "Latest Cyber News", element: <CyberNews /> },
  { path: "/contact", label: "Contact Us", element: <ContactUs /> },
  { path: "/quiz", label: "Take Assessment", element: <Quiz /> },
];

export const notFound = {
  path: "*",
  element: <div style={{ padding: 16 }}>Page not found</div>,
};
