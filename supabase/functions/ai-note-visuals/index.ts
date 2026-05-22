import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";
const MAX_IMAGE_ATTEMPTS = 2; // first try + one short retry
const IMAGE_FETCH_TIMEOUT_MS = 18_000;
const GLOBAL_BUDGET_MS = 55_000;

type DefinitionInput = {
  index: number;
  term: string;
  meaning?: string;
};

type CachedVisual = {
  index: number;
  id: string;
  title: string;
  imageUrl: string;
  pageUrl: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clean = (value: string) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/[^a-z0-9\s\-(),.]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildPrompt = (params: {
  board: string;
  subject: string;
  topic: string;
  term: string;
  meaning: string;
}) => {
  const boardLabel = clean(params.board).toUpperCase();
  const subject = clean(params.subject);
  const topic = clean(params.topic);
  const term = clean(params.term);
  const meaning = clean(params.meaning);
  return [
    `Create a clean educational revision diagram for ${boardLabel} ${subject}.`,
    `Main topic: ${topic}.`,
    `Focus definition: ${term}.`,
    meaning ? `Concept explanation: ${meaning}.` : "",
    "Style: 2D textbook infographic, white background, high contrast labels, concise annotations, exam-friendly.",
    "No watermark, no logo, no decorative frame, no people, no photorealism.",
  ]
    .filter(Boolean)
    .join(" ");
};

const parseEstimatedDelayMs = (text: string): number | null => {
  try {
    const parsed = JSON.parse(text);
    const estimated = Number(parsed?.estimated_time);
    if (Number.isFinite(estimated) && estimated > 0) {
      return Math.min(estimated * 1000, 15000);
    }
  } catch {
    // Not JSON; ignore.
  }
  return null;
};

const generatePollinationsImageUrl = async (prompt: string): Promise<string> => {
  const encoded = encodeURIComponent(prompt);
  let lastError = "Unknown Pollinations error";

  for (let attempt = 0; attempt < MAX_IMAGE_ATTEMPTS; attempt += 1) {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    const url = `${POLLINATIONS_BASE}/${encoded}?width=1024&height=768&seed=${seed}&nologo=true`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("image-timeout"), IMAGE_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "image/png,image/jpeg,image/webp,*/*" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = (response.headers.get("content-type") || "").toLowerCase();
        if (contentType.startsWith("image/")) return url;
        const bodyText = await response.text();
        lastError = `Pollinations returned non-image content: ${bodyText.slice(0, 220)}`;
      } else {
        const bodyText = await response.text();
        lastError = `Pollinations ${response.status}: ${bodyText.slice(0, 220)}`;
        console.warn("ai-note-visuals provider status", { status: response.status, attempt: attempt + 1 });

        if (response.status === 429 || response.status === 503 || response.status === 502 || response.status === 504) {
          const estimatedDelayMs = parseEstimatedDelayMs(bodyText);
          const retryWait = Math.min(estimatedDelayMs ?? 1000, 1500);
          if (attempt + 1 < MAX_IMAGE_ATTEMPTS) await sleep(retryWait);
          continue;
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === "AbortError") {
        lastError = `Pollinations timed out after ${IMAGE_FETCH_TIMEOUT_MS}ms`;
        console.warn("ai-note-visuals image timeout", { timeoutMs: IMAGE_FETCH_TIMEOUT_MS, attempt: attempt + 1 });
      } else {
        lastError = `Pollinations fetch failed: ${error instanceof Error ? error.message : String(error)}`;
      }
    }
  }

  throw new Error(lastError);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const startedAt = Date.now();
    const board = clean(payload?.board || "");
    const subject = clean(payload?.subject || "");
    const topic = clean(payload?.topic || "");
    const unitNumber = Number(payload?.unit_number);
    const definitions = (Array.isArray(payload?.definitions) ? payload.definitions : []) as DefinitionInput[];
    const trigger = payload?.trigger === "cache_clear" ? "cache_clear" : "initial";

    if (!board || !subject || !topic || !Number.isFinite(unitNumber)) {
      return new Response(JSON.stringify({ error: "Missing board, subject, topic, or unit_number." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (trigger === "cache_clear") {
      await admin
        .from("cached_topic_images")
        .delete()
        .eq("board", board)
        .eq("subject", subject)
        .eq("unit_number", unitNumber)
        .eq("topic", topic);
    } else {
      const { data: cached } = await admin
        .from("cached_topic_images")
        .select("images")
        .eq("board", board)
        .eq("subject", subject)
        .eq("unit_number", unitNumber)
        .eq("topic", topic)
        .maybeSingle();
      if (cached?.images) {
        console.log("ai-note-visuals cache hit", { board, subject, topic, unitNumber });
        return new Response(JSON.stringify(cached.images), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const uniqueDefs = definitions
      .map((definition, idx) => ({
        index: Number.isFinite(Number(definition?.index)) ? Number(definition.index) : idx,
        term: clean(definition?.term || ""),
        meaning: clean(definition?.meaning || ""),
      }))
      .filter((definition) => definition.term.length >= 3);

    const generated: CachedVisual[] = [];
    for (const definition of uniqueDefs) {
      if (Date.now() - startedAt > GLOBAL_BUDGET_MS) {
        console.warn("ai-note-visuals global budget reached", {
          elapsedMs: Date.now() - startedAt,
          budgetMs: GLOBAL_BUDGET_MS,
          generatedCount: generated.length,
        });
        break;
      }

      try {
        const prompt = buildPrompt({
          board,
          subject,
          topic,
          term: definition.term,
          meaning: definition.meaning,
        });
        const imageUrl = await generatePollinationsImageUrl(prompt);
        generated.push({
          index: definition.index,
          id: `${topic}-${definition.index}`,
          title: definition.term,
          imageUrl,
          pageUrl: "https://pollinations.ai/",
        });
      } catch (error) {
        console.error("ai-note-visuals item failed", {
          topic,
          definition: definition.term,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const responseBody = { definitions: generated };
    console.log("ai-note-visuals completed", {
      generatedCount: generated.length,
      elapsedMs: Date.now() - startedAt,
      board,
      subject,
      topic,
    });

    try {
      await admin.from("cached_topic_images").upsert(
        {
          board,
          subject,
          unit_number: unitNumber,
          topic,
          images: responseBody,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "board,subject,unit_number,topic" },
      );
    } catch (cacheError) {
      console.error("ai-note-visuals cache write failed", cacheError);
    }

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ai-note-visuals fatal", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown ai-note-visuals error." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
