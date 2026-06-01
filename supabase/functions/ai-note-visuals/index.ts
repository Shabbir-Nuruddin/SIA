import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { requireUser } from "../_shared/auth.ts";
import { getGeminiKeys } from "../_shared/ai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// Gemini 2.5 Flash Image ("nano banana") via generateContent — uses the same
// API keys as text generation and has a genuine free tier (unlike Imagen, which
// is effectively paid-only). Better instruction-following and can render clean,
// correctly-spelled labels, which makes the diagrams actually useful for revision.
const IMAGE_MODEL = "gemini-2.5-flash-image";
const IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`;

const MAX_IMAGES_PER_TOPIC = 3; // overview + up to 2 concept images
const GLOBAL_BUDGET_MS = 55_000;
const IMAGE_TIMEOUT_MS = 20_000;

type ConceptInput = {
  index: number;
  term: string;
  meaning?: string;
  isOverview?: boolean; // true = this is the topic-level overview image
};

type GeneratedVisual = {
  index: number;
  id: string;
  title: string;
  imageUrl: string;
  isOverview?: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clean = (value: string) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/[^a-z0-9\s\-(),.'/]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

// Build a highly specific prompt that avoids text overlays and cross-topic contamination
const buildImagePrompt = (params: {
  board: string;
  subject: string;
  unitCode: string;
  topic: string;
  term: string;
  meaning: string;
  isOverview: boolean;
}): string => {
  const board = clean(params.board).toUpperCase();
  const subject = clean(params.subject);
  const unitCode = clean(params.unitCode);
  const topic = clean(params.topic);
  const term = clean(params.term);
  const meaning = clean(params.meaning).slice(0, 120);

  if (params.isOverview) {
    return [
      `A clean, exam-accurate labelled diagram for ${board} ${subject} (${unitCode}) — topic: ${topic}.`,
      `Show the single key process or structure a student must understand for THIS exact topic, in textbook / Save My Exams style.`,
      `Style: flat 2D scientific diagram, plain white background, clear colour-coding.`,
      `Add concise, CORRECTLY-SPELLED labels for the key parts only (short words/arrows) — labels must be scientifically accurate; if unsure, omit a label rather than guess.`,
      `NO watermarks, NO decorative borders, NO photorealism, NO long sentences, NO equations as image text.`,
      `Must be accurate to the ${board} ${subject} specification for ${topic} — not generic clip-art.`,
    ].join(" ");
  }

  return [
    `A clean, exam-accurate labelled scientific diagram for ${board} ${subject} (${unitCode}): ${topic}.`,
    `Illustrate specifically: ${term}.`,
    meaning ? `Focus on: ${meaning}.` : "",
    `Style: flat 2D textbook diagram, plain white background, clear colour-coding.`,
    `Include concise, CORRECTLY-SPELLED labels/arrows for the key parts only — every label must be scientifically accurate; omit a label rather than guess.`,
    `NO watermarks, NO decorative frames, NO long sentences, NO photorealism.`,
    `Show only content relevant to ${topic}.`,
  ]
    .filter(Boolean)
    .join(" ");
};

// Generate an image with Gemini 2.5 Flash Image (generateContent → inlineData).
const generateWithGeminiImage = async (prompt: string, apiKey: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);
  try {
    const res = await fetch(`${IMAGE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 0.4 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gemini image ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find((p: any) => p?.inlineData?.data);
    const imageBytes = imgPart?.inlineData?.data;
    const mime = imgPart?.inlineData?.mimeType || "image/png";
    if (!imageBytes) throw new Error("No image bytes in Gemini image response");
    return `data:${mime};base64,${imageBytes}`;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

// Upload base64 data URL to Supabase Storage and return public URL
const uploadImageToStorage = async (
  dataUrl: string,
  path: string,
): Promise<string> => {
  const matches = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!matches) return dataUrl; // Already a URL, return as-is
  const mimeType = matches[1];
  const base64 = matches[2];
  const ext = mimeType.split("/")[1] || "png";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const storagePath = `${path}.${ext}`;

  // Ensure bucket exists (silently ignore if already exists)
  await admin.storage.createBucket("topic-images", { public: true }).catch(() => {});

  const { error } = await admin.storage
    .from("topic-images")
    .upload(storagePath, bytes, { contentType: mimeType, upsert: true });
  if (error) {
    console.warn("Storage upload failed, returning data URL:", error.message);
    return dataUrl; // Fall back to data URL if storage fails
  }
  const { data: { publicUrl } } = admin.storage.from("topic-images").getPublicUrl(storagePath);
  return publicUrl;
};

// Generate an image, rotating through Gemini keys; throws if all fail.
const generateImage = async (
  prompt: string,
  geminiKeys: { value: string }[],
  storagePath: string,
): Promise<string> => {
  for (const { value: apiKey } of geminiKeys) {
    try {
      const dataUrl = await generateWithGeminiImage(prompt, apiKey);
      return await uploadImageToStorage(dataUrl, storagePath);
    } catch (err) {
      console.warn("Gemini image key failed:", (err as Error).message?.slice(0, 100));
    }
  }
  throw new Error("All Gemini image keys exhausted — no image generated");
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;

  try {
    const payload = await req.json();
    const startedAt = Date.now();
    const board = clean(payload?.board || "");
    const subject = clean(payload?.subject || "");
    const topic = clean(payload?.topic || "");
    const unitCode = clean(payload?.unit_code || payload?.board || "");
    const unitNumber = Number(payload?.unit_number);
    const definitions = (Array.isArray(payload?.definitions) ? payload.definitions : []) as ConceptInput[];
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

    const geminiKeys = getGeminiKeys();

    // Build concept list: overview image first, then up to 2 definition images
    const concepts: ConceptInput[] = [
      { index: -1, term: topic, meaning: "", isOverview: true }, // overview image
      ...definitions
        .filter((d) => d.term && d.term.length >= 3)
        .slice(0, MAX_IMAGES_PER_TOPIC - 1)
        .map((d, idx) => ({ ...d, index: idx, isOverview: false })),
    ];

    const generated: GeneratedVisual[] = [];

    for (const concept of concepts) {
      if (Date.now() - startedAt > GLOBAL_BUDGET_MS) {
        console.warn("ai-note-visuals global budget reached");
        break;
      }

      try {
        const prompt = buildImagePrompt({
          board,
          subject,
          unitCode,
          topic,
          term: concept.isOverview ? topic : concept.term,
          meaning: concept.meaning || "",
          isOverview: concept.isOverview ?? false,
        });

        const safeTopicPath = topic.replace(/[^a-z0-9]/gi, "_").slice(0, 60);
        const safeTerm = concept.term.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
        const storagePath = `${board}/${subject}/unit${unitNumber}/${safeTopicPath}/${safeTerm}`;

        const imageUrl = await generateImage(prompt, geminiKeys, storagePath);
        generated.push({
          index: concept.index,
          id: `${topic}-${concept.index}`,
          title: concept.term,
          imageUrl,
          isOverview: concept.isOverview,
        });
      } catch (err) {
        console.error("ai-note-visuals item failed", {
          term: concept.term,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const responseBody = { definitions: generated };
    console.log("ai-note-visuals completed", {
      generatedCount: generated.length,
      elapsedMs: Date.now() - startedAt,
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
