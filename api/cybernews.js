// api/cybernews.js
export default async function handler(req, res) {
  const apiKey = process.env.NEWSAPI_KEY; // set in Vercel env
  if (!apiKey) {
    return res.status(500).json({ error: "Missing NEWSAPI_KEY env var" });
  }

  const q = "cybersecurity";
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "5");

  try {
    const upstream = await fetch(url.toString(), {
      headers: { "X-Api-Key": apiKey },
    });
    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Upstream error ${upstream.status}` });
    }
    const data = await upstream.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60"); // cache at the edge
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Fetch failed" });
  }
}
