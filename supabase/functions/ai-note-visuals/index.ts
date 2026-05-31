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

// Gemini Imagen endpoint (uses same API keys as text generation)
const IMAGEN_MODEL = "imagen-3.0-fast-generate-001";
const IMAGEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:generateImages`;

// Pollinations fallback
const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

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
      `Scientific educational illustration for ${board} ${subject} ${unitCode}.`,
      `Topic: ${topic}.`,
      `Show the key concept or process for this exact topic only.`,
      `Style: clean flat 2D scientific diagram, white background.`,
      `Colour-coded components using pastel shades.`,
      `NO text, NO labels, NO annotations, NO numbers, NO watermarks, NO decorative borders, NO photorealism.`,
      `Educational infographic style. Vector art quality.`,
      `Accurate to ${board} ${subject} specification, not generic.`,
    ].join(" ");
  }

  return [
    `Scientific educational diagram for ${board} ${subject} ${unitCode}: ${topic}.`,
    `Concept to illustrate: ${term}.`,
    meaning ? `Specific aspect: ${meaning}.` : "",
    `Style: clean flat 2D scientific illustration, white background.`,
    `Colour-coded components. Simple accurate shapes.`,
    `NO text, NO labels, NO annotations, NO numbers, NO watermarks, NO decorative frames.`,
    `Vector illustration quality. Educational textbook style.`,
    `Accurate only to ${topic} — do not show unrelated content.`,
  ]
    .filter(Boolean)
    .join(" ");
};

// Generate image using Gemini Imagen 3 Fast
const generateWithImagen = async (prompt: string, apiKey: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);
  try {
    const res = await fetch(`${IMAGEN_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: { text: prompt },
        safetyFilterLevel: "BLOCK_ONLY_HIGH",
        personGeneration: "DONT_ALLOW",
        numberOfImages: 1,
        aspectRatio: "16:9",
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Imagen ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = await res.json();
    const imageBytes = data?.predictions?.[0]?.bytesBase64Encoded
      ?? data?.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) throw new Error("No image bytes in Imagen response");
    return `data:image/png;base64,${imageBytes}`;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

// Fallback: Pollinations (single attempt, clean timeout per call)
const generateWithPollinations = async (prompt: string): Promise<string> => {
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const encoded = encodeURIComponent(prompt);
  const url = `${POLLINATIONS_BASE}/${encoded}?width=1024&height=576&seed=${seed}&nologo=true&model=flux`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Accept: "image/png,image/jpeg,image/webp,*/*" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Pollinations ${res.status}`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.startsWith("image/")) throw new Error("Pollinations returned non-image content");
    return url;
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

// Main image generation: try Imagen → fallback to Pollinations
const generateImage = async (
  prompt: string,
  geminiKeys: { value: string }[],
  storagePath: string,
): Promise<string> => {
  // Try each Gemini key for Imagen
  for (const { value: apiKey } of geminiKeys) {
    try {
      const dataUrl = await generateWithImagen(prompt, apiKey);
      // Upload to storage and return public URL
      const publicUrl = await uploadImageToStorage(dataUrl, storagePath);
      return publicUrl;
    } catch (err) {
      console.warn("Imagen generation failed with key, trying next:", (err as Error).message?.slice(0, 100));
    }
  }
  // Fall back to Pollinations
  console.log("All Imagen keys failed, falling back to Pollinations");
  return await generateWithPollinations(prompt);
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
