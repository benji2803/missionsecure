// src/pages/CyberNews.jsx
import { useCallback, useEffect, useMemo, useState } from "react";

export default function CyberNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cybernews", { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = await res.json();
      const articles = Array.isArray(data.articles) ? data.articles : [];

      // de-dupe by URL and sort newest first (fallback: publishedAt)
      const uniq = new Map();
      for (const a of articles) uniq.set(a.url ?? a.title, a);
      const sorted = [...uniq.values()].sort((a, b) => {
        const da = a.publishedAt ? Date.parse(a.publishedAt) : 0;
        const db = b.publishedAt ? Date.parse(b.publishedAt) : 0;
        return db - da;
      });

      setNews(sorted.slice(0, 10)); // keep top 10 in state (we'll render 5 below)
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Unknown error");
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchNews(controller.signal);
    return () => controller.abort();
  }, [fetchNews]);

  const rendered = useMemo(() => news.slice(0, 5), [news]);

  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 1.2rem + 2.5vw, 3rem)", margin: 0 }}>
            📰 Latest Cybersecurity News
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Fresh headlines from around the web
          </p>
          <div style={{ marginTop: 12 }}>
            <button
              className="btn btn--ghost"
              onClick={() => fetchNews()}
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>

        {loading && (
          <div style={{ padding: "1rem", textAlign: "center" }}>Loading news…</div>
        )}

        {error && (
          <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>
            Error: {error}
          </div>
        )}

        {!loading && !error && rendered.length === 0 && (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            No recent articles found.
          </div>
        )}

        {!loading && !error && rendered.length > 0 && (
          <ul className="news-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {rendered.map((item) => (
              <li
                key={item.url || item.publishedAt || item.title}
                style={{
                  marginBottom: "1.25rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    textDecoration: "underline",
                    color: "hsl(240, 100%, 70%)",
                    display: "block",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.title}
                </a>

                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {item.source?.name || "Unknown source"} —{" "}
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString()
                    : "Unknown date"}
                </div>

                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text)",
                    opacity: 0.85,
                    lineHeight: 1.45,
                  }}
                >
                  {item.description
                    ? item.description.length > 160
                      ? item.description.slice(0, 160) + "…"
                      : item.description
                    : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
