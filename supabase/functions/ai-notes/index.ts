import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { callAITool, deepStripLatex } from "../_shared/ai.ts";
import {
  buildSystemPrompt,
  findForbiddenKeywords,
  buildImagePrompt,
} from "../_shared/syllabus-boundaries.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const paragraphiseOverview = (s: string) =>
  String(s || "").split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean).join("\n\n");
const enoughOverview = (s: string) =>
  paragraphiseOverview(s).split(/\n\s*\n+/).filter(Boolean).length >= 5;
const normaliseNotes = (args: any) =>
  deepStripLatex({ ...args, overview: paragraphiseOverview(args?.overview || "") });

// Structured 7-section schema (unchanged shape).
const notesTool = {
  type: "function",
  function: {
    name: "create_topic_notes",
    description: "Generate comprehensive structured revision notes for one topic.",
    parameters: {
      type: "object",
      properties: {
        overview: { type: "string", description: "5-8 paragraphs separated by blank lines, 4-6 sentences each, plain Unicode." },
        key_definitions: {
          type: "array", minItems: 8,
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              mark_scheme: { type: "string" },
              plain_english: { type: "string" },
              common_mistake: { type: "string" },
            },
            required: ["term", "mark_scheme", "plain_english", "common_mistake"],
            additionalProperties: false,
          },
        },
        core_content: {
          type: "array",
          items: {
            type: "object",
            properties: {
              statement: { type: "string" },
              worked_example: { type: "string" },
              wrong_approach: { type: "string" },
              typical_marks: { type: "integer" },
            },
            required: ["statement", "worked_example", "wrong_approach", "typical_marks"],
            additionalProperties: false,
          },
        },
        equations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              equation: { type: "string" },
              variables: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    symbol: { type: "string" },
                    meaning: { type: "string" },
                    unit: { type: "string" },
                  },
                  required: ["symbol", "meaning", "unit"],
                  additionalProperties: false,
                },
              },
              worked_substitution: { type: "string" },
            },
            required: ["equation", "variables", "worked_substitution"],
            additionalProperties: false,
          },
        },
        visual_summary: {
          type: "object",
          properties: {
            kind: { type: "string", enum: ["table", "flowchart", "diagram", "svg"] },
            caption: { type: "string" },
            content: { type: "string" },
          },
          required: ["kind", "caption", "content"],
          additionalProperties: false,
        },
        examiner_tips: {
          type: "array", minItems: 5,
          items: {
            type: "object",
            properties: { command_word: { type: "string" }, tip: { type: "string" } },
            required: ["command_word", "tip"],
            additionalProperties: false,
          },
        },
        flashcards: {
          type: "array", minItems: 10, maxItems: 10,
          items: {
            type: "object",
            properties: { q: { type: "string" }, a: { type: "string" } },
            required: ["q", "a"],
            additionalProperties: false,
          },
        },
        image_prompt: {
          type: "string",
          description: "A textbook-quality scientific illustration prompt for Nano Banana — describe must-show and must-not-show elements explicitly.",
        },
      },
      required: ["overview", "key_definitions", "core_content", "equations", "visual_summary", "examiner_tips", "flashcards"],
      additionalProperties: false,
    },
  },
};

async function logGeneration(row: {
  qualification: string; subject: string; unit_topic: string; unit_topic_name: string;
  seed: string; trigger: string; validation_passed: boolean; forbidden_keywords_found: string[];
}) {
  try { await admin.from("notes_generation_log").insert(row); } catch (e) { console.error("log insert failed", e); }
}

/** Generate an image via Lovable AI Gateway / Nano Banana, returns data: URL or null. */
async function generateImage(prompt: string): Promise<string | null> {
  if (!LOVABLE_API_KEY) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) {
      console.error("nano banana failed", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
  } catch (e) {
    console.error("nano banana error", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!Deno.env.get("GEMINI_API_KEY") && !Deno.env.get("GROQ_API_KEY")) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { subject, unit_number, unit_name, topic, syllabus_context, board, level, trigger } = body;
    const triggerKind: "initial" | "cache_clear" | "validation_retry" =
      trigger === "cache_clear" ? "cache_clear" : "initial";

    // Map UI board → boundary qualification key.
    const qualification =
      board === "cie" ? "cie"
      : board === "cie-igcse" ? "cie-igcse"
      : board === "edexcel-igcse" ? "edexcel-igcse"
      : "edexcel-ial";

    const cacheBoard = board === "cie" ? "cie" : "edexcel";

    // Cache lookup — but ONLY when not a fresh-regen request.
    if (triggerKind === "initial") {
      try {
        const { data: cachedRow } = await admin
          .from("cached_topic_notes").select("content")
          .eq("board", cacheBoard).eq("subject", subject)
          .eq("unit_number", unit_number).eq("topic", topic).maybeSingle();
        if (cachedRow?.content) {
          return new Response(JSON.stringify(cachedRow.content), {
            status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch (e) { console.error("cache lookup failed", e); }
    } else {
      // cache_clear path: discard any previous cached row before regenerating.
      try {
        await admin.from("cached_topic_notes").delete()
          .eq("board", cacheBoard).eq("subject", subject)
          .eq("unit_number", unit_number).eq("topic", topic);
      } catch (e) { console.error("cache clear-on-regen failed", e); }
    }

    // Build the system prompt with FRESH timestamp + seed every call.
    const built = buildSystemPrompt({
      qualification, subject, unit: unit_number, unitName: unit_name,
    });
    const userPrompt = `Generate comprehensive revision notes for the topic: ${topic}, ${unit_name} for ${qualification.toUpperCase()} ${subject.toUpperCase()}.

${syllabus_context ? `Official syllabus statements (your scope is LIMITED to these):\n${syllabus_context}\n` : ""}

Produce notes via the create_topic_notes tool with: overview (5-8 paragraphs), >=8 key_definitions, every syllabus point covered in core_content (with worked example, wrong approach, typical marks), all equations (plain Unicode), visual_summary (SVG or HTML table), >=5 examiner_tips tied to command words, exactly 10 flashcards, and a single image_prompt describing the diagram a student would benefit from for this topic — explicit must-show and must-not-show elements.`;

    const callOnce = async () =>
      normaliseNotes(await callAITool({
        messages: [
          { role: "system", content: built.systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [notesTool],
        toolName: "create_topic_notes",
        temperature: 0.3,
        maxTokens: 8000,
      }));

    let args: any;
    try {
      args = await callOnce();
      if (!enoughOverview(args.overview)) args = await callOnce();
    } catch (err: any) {
      console.error("ai-notes generation failed", err?.message || err);
      return new Response(JSON.stringify({ error: "AI is taking a short break — please try again in 30 seconds" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Forbidden-keyword validation.
    let forbiddenHits = findForbiddenKeywords(args, built.forbiddenList);
    let finalTrigger: "initial" | "cache_clear" | "validation_retry" = triggerKind;
    if (forbiddenHits.length) {
      console.warn("forbidden keywords on first pass:", forbiddenHits);
      try {
        const retry = await callOnce();
        const retryHits = findForbiddenKeywords(retry, built.forbiddenList);
        if (!retryHits.length) {
          args = retry;
          forbiddenHits = [];
          finalTrigger = "validation_retry";
        } else {
          // Log failure and refuse to serve.
          await logGeneration({
            qualification, subject, unit_topic: `Unit ${unit_number}`,
            unit_topic_name: unit_name, seed: built.seed, trigger: finalTrigger,
            validation_passed: false, forbidden_keywords_found: retryHits,
          });
          return new Response(JSON.stringify({
            error: "Generated notes contained out-of-syllabus content twice. Flagged for manual review.",
            forbidden_keywords_found: retryHits,
          }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } catch {
        // fall through with original args
      }
    }

    // Image generation via Nano Banana from the AI-built image_prompt
    // (or a templated fallback if the model didn't supply one).
    const imgPrompt = (args.image_prompt && String(args.image_prompt).trim()) || buildImagePrompt({
      qualification, subject, unitName: unit_name, topic,
      mustShow: [], mustNotShow: [],
    });
    const imageDataUrl = await generateImage(imgPrompt);
    args.image_url = imageDataUrl || null;
    args.image_prompt = imgPrompt;

    // Log success.
    await logGeneration({
      qualification, subject, unit_topic: `Unit ${unit_number}`,
      unit_topic_name: unit_name, seed: built.seed, trigger: finalTrigger,
      validation_passed: true, forbidden_keywords_found: [],
    });

    // Save to shared cache.
    try {
      await admin.from("cached_topic_notes").upsert(
        { board: cacheBoard, subject, unit_number, topic, content: args, updated_at: new Date().toISOString() },
        { onConflict: "board,subject,unit_number,topic" },
      );
    } catch (e) { console.error("cache save failed", e); }

    return new Response(JSON.stringify(args), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-notes error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
