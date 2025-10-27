// src/routes/table.jsx
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home.jsx"));
const TeamPage = lazy(() => import("../pages/TeamPage.jsx"));                // Who We Are
const BeginnerGuidePage = lazy(() => import("../pages/BeginnerGuidePage.jsx")); // Resources
const CyberNews = lazy(() => import("../pages/CyberNews.jsx"));              // Latest Cyber News
const ContactUs = lazy(() => import("../pages/ContactUs.jsx"));
const Quiz = lazy(() => import("../pages/Quiz.jsx"));
const Results = lazy(() => import("../pages/Results.jsx"));

export const routes = [
  { 
    path: "/", 
    label: "Home",
    element: <Home />,
    exact: true
  },
  { 
    path: "/who-we-are", 
    label: "Who We Are", 
    element: <TeamPage />,
    mobileProps: { touchAction: 'manipulation' }
  },
  { 
    path: "/resources", 
    label: "Resources", 
    element: <BeginnerGuidePage />,
    mobileProps: { touchAction: 'manipulation' }
  },
  { 
    path: "/news", 
    label: "Latest Cyber News", 
    element: <CyberNews />,
    mobileProps: { touchAction: 'manipulation' }
  },
  { 
    path: "/contact", 
    label: "Contact Us", 
    element: <ContactUs />,
    mobileProps: { touchAction: 'manipulation' }
  },
  { 
    path: "/quiz", 
    element: <Quiz />,
    mobileProps: { touchAction: 'manipulation' }
  },
  { 
    path: "/results", 
    element: <Results />,
    mobileProps: { touchAction: 'manipulation' }
  }
];

export const notFound = {
  path: "*",
  element: <div style={{ padding: 16 }}>Page not found</div>,
};
