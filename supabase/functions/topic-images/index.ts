// Educational image retrieval — Wikimedia Commons + Openverse fallback.
// Returns up to 3 syllabus-relevant diagrams. Cached server-side per
// (board, subject, unit_number, topic).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

interface ImageHit {
  title: string;
  url: string; // direct image URL
  thumb: string;
  source: "wikimedia" | "openverse";
  source_page: string;
  attribution: string;
  license: string;
  width?: number;
  height?: number;
  is_svg: boolean;
}

const SUBJECT_HINTS: Record<string, string> = {
  mathematics: "graph function diagram",
  physics: "diagram physics",
  chemistry: "diagram chemistry",
  biology: "labeled diagram biology",
};

// Words that indicate a stock photo / decorative result we want to avoid.
const BANNED = /\b(stock|portrait|selfie|wallpaper|tattoo|cartoon character|meme|cosplay|movie poster)\b/i;

const isLikelyEducational = (title: string, mime: string) => {
  if (!title) return false;
  if (BANNED.test(title)) return false;
  if (mime && !/^image\//i.test(mime)) return false;
  return true;
};

async function searchWikimedia(topic: string, subject: string): Promise<ImageHit[]> {
  const hint = SUBJECT_HINTS[subject] ?? "diagram";
  const q = encodeURIComponent(`${topic} ${hint}`);
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*` +
    `&generator=search&gsrsearch=${q}+filetype:bitmap|drawing&gsrnamespace=6&gsrlimit=15` +
    `&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=800`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MakeMeRevise/1.0 (educational)" } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    const out: ImageHit[] = [];
    for (const k of Object.keys(pages)) {
      const p = pages[k];
      const ii = p?.imageinfo?.[0];
      if (!ii) continue;
      const mime = ii.mime || "";
      const title = (p.title || "").replace(/^File:/, "");
      if (!isLikelyEducational(title, mime)) continue;
      const meta = ii.extmetadata || {};
      const license = meta.LicenseShortName?.value || meta.License?.value || "Wikimedia Commons";
      const artist = (meta.Artist?.value || "").replace(/<[^>]+>/g, "").trim();
      out.push({
        title,
        url: ii.url,
        thumb: ii.thumburl || ii.url,
        source: "wikimedia",
        source_page: p.canonicalurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
        attribution: artist || "Wikimedia Commons contributors",
        license,
        width: ii.width,
        height: ii.height,
        is_svg: /\.svg$/i.test(ii.url),
      });
    }
    // Prefer SVG / drawings first
    out.sort((a, b) => Number(b.is_svg) - Number(a.is_svg));
    return out.slice(0, 6);
  } catch (e) {
    console.error("wikimedia search error", e);
    return [];
  }
}

async function searchOpenverse(topic: string, subject: string): Promise<ImageHit[]> {
  const hint = SUBJECT_HINTS[subject] ?? "diagram";
  const q = encodeURIComponent(`${topic} ${hint}`);
  const url =
    `https://api.openverse.org/v1/images/?q=${q}&page_size=10&license_type=all-cc&category=illustration`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MakeMeRevise/1.0 (educational)" } });
    if (!res.ok) return [];
    const data = await res.json();
    const out: ImageHit[] = [];
    for (const r of data?.results || []) {
      if (!isLikelyEducational(r.title || "", "image/")) continue;
      out.push({
        title: r.title || topic,
        url: r.url,
        thumb: r.thumbnail || r.url,
        source: "openverse",
        source_page: r.foreign_landing_url || r.url,
        attribution: r.creator || r.source || "Openverse",
        license: r.license ? `${r.license} ${r.license_version || ""}`.trim() : "CC",
        width: r.width,
        height: r.height,
        is_svg: false,
      });
    }
    return out.slice(0, 4);
  } catch (e) {
    console.error("openverse search error", e);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { board, subject, unit_number, topic } = await req.json();
    if (!board || !subject || !topic) {
      return new Response(JSON.stringify({ error: "missing parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const cacheBoard = board === "cie" ? "cie" : "edexcel";

    // Cache check
    const { data: cached } = await admin
      .from("cached_topic_images")
      .select("images")
      .eq("board", cacheBoard)
      .eq("subject", subject)
      .eq("unit_number", unit_number ?? 0)
      .eq("topic", topic)
      .maybeSingle();
    if (cached?.images) {
      return new Response(JSON.stringify({ images: cached.images, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let hits = await searchWikimedia(topic, subject);
    if (hits.length < 1) hits = hits.concat(await searchOpenverse(topic, subject));
    const top = hits.slice(0, 3);

    if (top.length > 0) {
      try {
        await admin
          .from("cached_topic_images")
          .upsert(
            {
              board: cacheBoard,
              subject,
              unit_number: unit_number ?? 0,
              topic,
              images: top,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "board,subject,unit_number,topic" },
          );
      } catch (e) {
        console.error("cache save failed", e);
      }
    }

    return new Response(JSON.stringify({ images: top, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("topic-images error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
