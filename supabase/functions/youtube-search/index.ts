// Edge function: returns the first YouTube video ID matching a query.
// Uses an HTML scrape of YouTube search results (no API key required).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const cache = new Map<string, { id: string; at: number }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

async function fetchFirstVideoId(query: string): Promise<string | null> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  // Try to extract from videoRenderer entries first (skips ads/shorts)
  const m1 = html.match(/"videoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})"/);
  if (m1) return m1[1];
  const m2 = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
  return m2 ? m2[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q") || "";
    if (!query && req.method === "POST") {
      try {
        const body = await req.json();
        query = body?.q ?? "";
      } catch { /* ignore */ }
    }
    query = String(query).slice(0, 200).trim();
    if (!query) {
      return new Response(JSON.stringify({ error: "Missing q" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const key = query.toLowerCase();
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return new Response(JSON.stringify({ videoId: hit.id, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const id = await fetchFirstVideoId(query);
    if (!id) {
      return new Response(JSON.stringify({ videoId: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    cache.set(key, { id, at: Date.now() });
    return new Response(JSON.stringify({ videoId: id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
