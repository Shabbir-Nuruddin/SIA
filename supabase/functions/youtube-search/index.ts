// Edge function: returns a YouTube video ID for a topic, preferring trusted
// revision channels. Uses an HTML scrape of YouTube search results (no API key).
//
// Why channel preference: the old version returned the literal top search result,
// which is often an ad, a Short, or a low-quality re-upload. Students get far more
// value from a known good channel (ExamSolutions for Edexcel maths, Cognito for
// science, etc.), so we bias the query toward those channels and only fall back to
// a generic search if none of them have a matching video.
import { requireUser } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const cache = new Map<string, { id: string; at: number }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

// Trusted revision channels per subject and qualification tier. Ordered best-first.
// These are large, well-known UK exam-revision channels whose videos have embedding
// enabled and map cleanly onto the Edexcel/CIE specs. A-level tier covers IAL.
const CHANNELS: Record<string, { alevel: string[]; igcse: string[] }> = {
  mathematics: {
    alevel: ["ExamSolutions", "TLMaths", "Maths Genie"],
    igcse: ["Maths Genie", "Cognito", "ExamSolutions"],
  },
  chemistry: {
    alevel: ["Eliot Rintoul", "MaChemGuy", "Allery Chemistry"],
    igcse: ["Cognito", "Free Science Lessons", "MaChemGuy"],
  },
  biology: {
    alevel: ["Cognito", "Mr Exham Biology", "Free Science Lessons"],
    igcse: ["Cognito", "Free Science Lessons"],
  },
  physics: {
    alevel: ["Physics Online", "Cognito", "Science Shorts"],
    igcse: ["Cognito", "Free Science Lessons", "Physics Online"],
  },
};

function subjectKey(subject: string): keyof typeof CHANNELS | null {
  const s = (subject || "").toLowerCase();
  if (s.includes("math")) return "mathematics";
  if (s.includes("chem")) return "chemistry";
  if (s.includes("bio")) return "biology";
  if (s.includes("phys")) return "physics";
  return null;
}

function channelsFor(subject: string, level: string): string[] {
  const key = subjectKey(subject);
  if (!key) return [];
  const tier = /igcse/i.test(level || "") ? "igcse" : "alevel";
  return CHANNELS[key][tier] ?? [];
}

async function scrapeVideoId(query: string): Promise<string | null> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en&sp=EgIQAQ%253D%253D`;
  // sp=EgIQAQ%3D%3D restricts to type:video (skips channels/playlists/Shorts shelves).
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const html = await res.text();
  const m1 = html.match(/"videoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})"/);
  if (m1) return m1[1];
  const m2 = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
  return m2 ? m2[1] : null;
}

/**
 * Resolve a video id, trying trusted channels first.
 * `topic`+`subject` produce tight channel-scoped queries; `fallbackQuery` is the
 * caller's full query used when no trusted channel has a match.
 */
async function resolveVideoId(opts: {
  topic: string;
  subject: string;
  level: string;
  fallbackQuery: string;
}): Promise<{ id: string | null; source: string }> {
  const channels = channelsFor(opts.subject, opts.level);
  const base = (opts.topic || opts.fallbackQuery).trim();

  for (const channel of channels) {
    const id = await scrapeVideoId(`${base} ${opts.subject} ${channel}`);
    if (id) return { id, source: channel };
  }
  // Fall back to the caller's generic query (board + subject + unit + topic).
  const id = await scrapeVideoId(opts.fallbackQuery);
  return { id, source: "search" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q") || "";
    let subject = searchParams.get("subject") || "";
    let level = searchParams.get("level") || "";
    let topic = searchParams.get("topic") || "";
    if (req.method === "POST") {
      try {
        const body = await req.json();
        query = body?.q ?? query;
        subject = body?.subject ?? subject;
        level = body?.level ?? level;
        topic = body?.topic ?? topic;
      } catch { /* ignore */ }
    }
    query = String(query).slice(0, 200).trim();
    subject = String(subject).slice(0, 40).trim();
    level = String(level).slice(0, 40).trim();
    topic = String(topic).slice(0, 120).trim();

    if (!query && !topic) {
      return new Response(JSON.stringify({ error: "Missing q" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cache key includes subject/level so different qualifications don't collide.
    const key = `${subject}|${level}|${topic || query}`.toLowerCase();
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return new Response(JSON.stringify({ videoId: hit.id, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { id, source } = await resolveVideoId({ topic, subject, level, fallbackQuery: query });
    if (!id) {
      return new Response(JSON.stringify({ videoId: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    cache.set(key, { id, at: Date.now() });
    return new Response(JSON.stringify({ videoId: id, source }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
