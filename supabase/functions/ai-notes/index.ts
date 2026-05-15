import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { callAITool, deepStripLatex } from "../_shared/ai.ts";

// --- BOARD-SPECIFIC SYLLABUS IMPORTS ---
// These imports link the AI to the specific files you've moved to the _shared folder.
import {
  buildSystemPrompt as buildEdexcelIAL,
  buildImagePrompt as buildEdexcelIALImage,
  validateGeneratedNotes as validateEdexcelIAL,
  EDEXCEL_IAL_SYLLABUS
} from "../_shared/edexcelial.ts";

import {
  buildSystemPrompt as buildEdexcelIGCSE,
  buildImagePrompt as buildEdexcelIGCSEImage,
  validateGeneratedNotes as validateEdexcelIGCSE
} from "../_shared/edexceligcse.ts";

// Fallback for CIE boards until their specific files are ready in _shared.
import {
  buildSystemPrompt as buildCIEGeneric,
  buildImagePrompt as buildCIEImage,
  findForbiddenKeywords as findCIEForbidden,
} from "../_shared/syllabus-boundaries.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- ENVIRONMENT VARIABLES ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// --- HELPER UTILITIES ---
const paragraphiseOverview = (s: string) =>
  String(s || "").split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean).join("\n\n");

const enoughOverview = (s: string) =>
  paragraphiseOverview(s).split(/\n\s*\n+/).filter(Boolean).length >= 5;

const normaliseNotes = (args: any) =>
  deepStripLatex({ ...args, overview: paragraphiseOverview(args?.overview || "") });

// --- STRUCTURED OUTPUT SCHEMA (THE UI THEME) ---
// This is the largest part of the code; I have expanded it fully to ensure quality.
const notesTool = {
  type: "function",
  function: {
    name: "create_topic_notes",
    description: "Generate comprehensive structured revision notes for one topic.",
    parameters: {
      type: "object",
      properties: {
        overview: { 
          type: "string", 
          description: "5-8 paragraphs separated by blank lines, 4-6 sentences each." 
        },
        key_definitions: {
          type: "array", 
          minItems: 8,
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
          type: "array", 
          minItems: 5,
          items: {
            type: "object",
            properties: { 
              command_word: { type: "string" }, 
              tip: { type: "string" } 
            },
            required: ["command_word", "tip"],
            additionalProperties: false,
          },
        },
        flashcards: {
          type: "array", 
          minItems: 10, 
          maxItems: 10,
          items: {
            type: "object",
            properties: { 
              q: { type: "string" }, 
              a: { type: "string" } 
            },
            required: ["q", "a"],
            additionalProperties: false,
          },
        },
        image_prompt: {
          type: "string",
          description: "Crucial: Create an extremely detailed, textbook-quality prompt for a scientific illustration for Nano Banana. Specify spatial layout to avoid overlap.",
        },
      },
      required: [
        "overview", "key_definitions", "core_content", "equations", 
        "visual_summary", "examiner_tips", "flashcards", "image_prompt"
      ],
      additionalProperties: false,
    },
  },
};

// --- LOGGING AND IMAGE FUNCTIONS ---
async function logGeneration(row: any) {
  try { 
    await admin.from("notes_generation_log").insert(row); 
  } catch (e) { 
    console.error("Database log failed:", e); 
  }
}

async function generateImage(prompt: string): Promise<string | null> {
  if (!LOVABLE_API_KEY) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${LOVABLE_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) {
      console.error("Nano Banana failed:", res.status);
      return null;
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
  } catch (e) { 
    console.error("Image generation error:", e); 
    return null; 
  }
}

// --- MAIN EDGE FUNCTION HANDLER ---
serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  
  if (!Deno.env.get("GEMINI_API_KEY")) {
    return new Response(JSON.stringify({ error: "API Key missing" }), { 
      status: 500, headers: corsHeaders 
    });
  }

  try {
    const body = await req.json();
    const { subject, unit_number, unit_name, topic, syllabus_context, board, trigger } = body;
    const triggerKind = trigger === "cache_clear" ? "cache_clear" : "initial";

    // --- BOARD ROUTING ENGINE ---
    // This is the 'If Command' logic that connects the user's choice to your files.
    let systemPrompt = "";
    let imagePromptBuilder = null;
    let validator = null;
    const unitKey = `unit${unit_number}`;

    if (board === "edexcel-ial") {
      systemPrompt = buildEdexcelIAL(subject, unitKey);
      imagePromptBuilder = buildEdexcelIALImage;
      validator = validateEdexcelIAL;
    } 
    else if (board === "edexcel-igcse") {
      systemPrompt = buildEdexcelIGCSE(subject, unitKey);
      imagePromptBuilder = buildEdexcelIGCSEImage;
      validator = validateEdexcelIGCSE;
    } 
    else {
      // CIE Fallback Routing
      const builtCIE = buildCIEGeneric({ 
        qualification: board, 
        subject, 
        unit: unit_number, 
        unitName: unit_name 
      });
      systemPrompt = builtCIE.systemPrompt;
      imagePromptBuilder = (subj: any, unit: any, top: any) => 
        buildCIEImage({ qualification: board, subject: subj, unitName: unit_name, topic: top });
      validator = (notes: string) => {
        const hits = findCIEForbidden(JSON.parse(notes), builtCIE.forbiddenList);
        return { passed: hits.length === 0, forbiddenFound: hits };
      };
    }

    // --- CACHE LOOKUP / INVALIDATION ---
    const cacheBoard = board.includes("cie") ? "cie" : "edexcel";
    if (triggerKind === "cache_clear") {
      // Hard-delete the cached row so the next call is a true regeneration
      // against the latest syllabus rules.
      await admin.from("cached_topic_notes")
        .delete()
        .eq("board", cacheBoard)
        .eq("subject", subject)
        .eq("unit_number", unit_number)
        .eq("topic", topic);
    } else {
      const { data: cached } = await admin.from("cached_topic_notes")
        .select("content")
        .eq("board", cacheBoard)
        .eq("subject", subject)
        .eq("unit_number", unit_number)
        .eq("topic", topic)
        .maybeSingle();
      if (cached?.content) {
        return new Response(JSON.stringify(cached.content), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // --- AI GENERATION ---
    const userPrompt = `Generate comprehensive revision notes for the topic: ${topic}, ${unit_name} for ${board.toUpperCase()} ${subject.toUpperCase()}.
${syllabus_context ? `Official syllabus statements:\n${syllabus_context}\n` : ""}
Follow rules strictly. Ensure diagrams avoid text overlap.`;

    const callOnce = async () =>
      normaliseNotes(await callAITool({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [notesTool],
        toolName: "create_topic_notes",
        temperature: 0.3,
        maxTokens: 8000,
      }));

    let args = await callOnce();
    // Quality check: Ensure overview is substantial
    if (!enoughOverview(args.overview)) args = await callOnce();

    // --- SYLLABUS BOUNDARY VALIDATION ---
    const validation = validator(JSON.stringify(args), subject, unitKey);
    if (!validation.passed) {
      console.warn("Validation failed, retrying for compliance...");
      args = await callOnce();
    }

    // --- IMAGE GENERATION (NANO BANANA) ---
    const finalImagePrompt = (args.image_prompt && String(args.image_prompt).trim()) || 
                             imagePromptBuilder(subject, unitKey, topic);
    
    args.image_url = await generateImage(finalImagePrompt);
    args.image_prompt = finalImagePrompt;

    // --- LOGGING & PERSISTENCE ---
    await logGeneration({
      qualification: board,
      subject,
      unit_topic: unitKey,
      unit_topic_name: unit_name,
      seed: "final_prod",
      trigger: triggerKind,
      validation_passed: validation.passed,
      forbidden_keywords_found: validation.forbiddenFound
    });

    await admin.from("cached_topic_notes").upsert({
      board: cacheBoard,
      subject,
      unit_number,
      topic,
      content: args,
      updated_at: new Date().toISOString()
    });

    return new Response(JSON.stringify(args), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Fatal Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
