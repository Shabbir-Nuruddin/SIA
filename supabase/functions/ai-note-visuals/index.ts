import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const HF_MODEL = "aiyouthalliance/Free-Image-Generation";
const HF_ENDPOINTS = [
  `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
  `https://api-inference.huggingface.co/models/${HF_MODEL}`,
];

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

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const inferMime = (contentType: string | null): string => {
  if (!contentType) return "image/png";
  const mime = contentType.split(";")[0].trim().toLowerCase();
  return mime.startsWith("image/") ? mime : "image/png";
};

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

const generateImageDataUrl = async (apiKey: string, prompt: string): Promise<string> => {
  let lastError = "Unknown Hugging Face error";
  for (const endpoint of HF_ENDPOINTS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 1024,
            height: 768,
            guidance_scale: 6.5,
            num_inference_steps: 28,
            negative_prompt:
              "watermark, logo, blurry, low quality, distorted text, border, photorealistic, noisy background",
          },
        }),
      });

      if (response.ok) {
        const contentType = inferMime(response.headers.get("content-type"));
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length < 50) throw new Error("Image response was empty.");
        return `data:${contentType};base64,${toBase64(bytes)}`;
      }

      const bodyText = await response.text();
      lastError = `HF ${response.status}: ${bodyText.slice(0, 300)}`;

      if (response.status === 503 || response.status === 429) {
        const estimatedDelayMs = parseEstimatedDelayMs(bodyText);
        if (estimatedDelayMs && attempt === 0) {
          await sleep(estimatedDelayMs);
          continue;
        }
      }

      break;
    }
  }

  throw new Error(lastError);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("HUGGINGFACE_API_KEY") || Deno.env.get("HF_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "HUGGINGFACE_API_KEY (or HF_API_KEY) is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
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
      .filter((definition) => definition.term.length >= 3)
      .slice(0, 5);

    const generated: CachedVisual[] = [];
    for (const definition of uniqueDefs) {
      try {
        const prompt = buildPrompt({
          board,
          subject,
          topic,
          term: definition.term,
          meaning: definition.meaning,
        });
        const imageUrl = await generateImageDataUrl(apiKey, prompt);
        generated.push({
          index: definition.index,
          id: `${topic}-${definition.index}`,
          title: definition.term,
          imageUrl,
          pageUrl: `https://huggingface.co/${HF_MODEL}`,
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
