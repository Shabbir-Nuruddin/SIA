import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

// Structured 7-section schema. Returned via tool calling for reliability.
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
          description: "3–4 paragraphs of flowing prose explaining what the topic is, why it matters, and how it connects to other topics in the unit. No bullets, no markdown, no LaTeX.",
        },
        key_definitions: {
          type: "array",
          minItems: 8,
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              mark_scheme: { type: "string", description: "Precise mark-scheme-style definition." },
              plain_english: { type: "string", description: "One-sentence plain-English explanation." },
              common_mistake: { type: "string", description: "One specific mistake students make about this term." },
            },
            required: ["term", "mark_scheme", "plain_english", "common_mistake"],
            additionalProperties: false,
          },
        },
        core_content: {
          type: "array",
          description: "Every syllabus point for this topic. One item per syllabus statement.",
          items: {
            type: "object",
            properties: {
              statement: { type: "string", description: "The fact or rule, stated clearly." },
              worked_example: { type: "string", description: "Setup → method → answer with units. Plain text." },
              wrong_approach: { type: "string", description: "The most common wrong method and why it loses marks." },
              typical_marks: { type: "integer", description: "How many marks this typically carries in an exam question." },
            },
            required: ["statement", "worked_example", "wrong_approach", "typical_marks"],
            additionalProperties: false,
          },
        },
        equations: {
          type: "array",
          description: "Every equation needed for this topic. May be empty for non-quantitative topics.",
          items: {
            type: "object",
            properties: {
              equation: { type: "string", description: "Plain text equation. No LaTeX, no $ signs." },
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
              worked_substitution: { type: "string", description: "One worked numerical substitution example." },
            },
            required: ["equation", "variables", "worked_substitution"],
            additionalProperties: false,
          },
        },
        visual_summary: {
          type: "object",
          description: "A diagram, table, or flowchart describing key relationships, rendered as ASCII or HTML table markup.",
          properties: {
            kind: { type: "string", enum: ["table", "flowchart", "diagram"] },
            caption: { type: "string" },
            content: { type: "string", description: "ASCII art, monospace table, or simple HTML <table>... markup." },
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
              command_word: { type: "string", description: "The Edexcel command word this tip applies to (Calculate, Explain, Describe, Evaluate, Compare, Suggest, Determine, State, Deduce, Show that)." },
              tip: { type: "string", description: "Specific, actionable tip referencing the command word." },
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
              a: { type: "string" },
            },
            required: ["q", "a"],
            additionalProperties: false,
          },
        },
      },
      required: ["overview", "key_definitions", "core_content", "equations", "visual_summary", "examiner_tips", "flashcards"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  try {
    const { subject, unit_number, unit_name, topic, syllabus_context, board, level } = await req.json();
    const isCie = board === "cie";
    const boardLabel = isCie ? "Cambridge International (CIE) A Level" : (board || "Edexcel International A-Level");
    const levelLabel = level || "A-Level";
    const specCode = isCie
      ? (subject === "chemistry" ? "9701" : subject === "biology" ? "9700" : subject === "physics" ? "9702" : "9709")
      : "Edexcel IAL";

    const scopeNote = syllabus_context
      ? `You MUST stay strictly within the official ${boardLabel} ${subject} (${specCode}) specification content provided. If a concept is not in the syllabus statements for this topic, do NOT include it.`
      : "";

    const system = `You are an expert ${boardLabel} ${levelLabel} ${subject} examiner and teacher (${specCode}). ${scopeNote}

ABSOLUTE FORMATTING RULES:
- Plain text only. NO LaTeX. NO dollar signs. NO backslashes for math.
- Use Unicode for symbols: Δ, →, ⇌, ×, ², ³, ⁻¹, ½, π, etc.
- Write equations in plain text (e.g., rate = k[A]^m[B]^n).
- Do NOT use ## headers or markdown bullets in any field — return structured data via the tool.
- UK English. Use ${boardLabel} mark scheme phrasing.`;

    const user = `Generate comprehensive revision notes for the topic: ${topic}, ${unit_name} (Unit ${unit_number}) for ${boardLabel} ${levelLabel} ${subject} (${specCode}).

${syllabus_context ? `Official syllabus content (your scope is limited to this):\n${syllabus_context}\n` : ""}

Produce notes in this exact structure via the tool:
1. OVERVIEW — 3–4 paragraphs of flowing prose. Conceptual, like a knowledgeable teacher introducing the topic. No bullets.
2. KEY DEFINITIONS — minimum 8. Each: term + mark-scheme definition + plain English + one common mistake.
3. CORE CONTENT — every syllabus point. Each: statement + worked example (setup → method → answer with units) + most common wrong approach + typical marks.
4. EQUATIONS — every equation needed. Plain text. Each variable with meaning + unit. One worked substitution.
5. VISUAL SUMMARY — one diagram/table/flowchart in ASCII or simple HTML table markup that captures key relationships.
6. EXAMINER TIPS — minimum 5, each tied to a specific ${boardLabel} command word (Calculate, State, Explain, Describe, Evaluate, Compare, Suggest, Determine, Show that, Deduce).
7. FLASHCARDS — exactly 10. Test definitions, equations, and application — not just recall.`;

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        tools: [notesTool],
        tool_choice: { type: "function", function: { name: "create_topic_notes" } },
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("ai-notes gateway error", res.status, txt);
      const status = res.status;
      const error = status === 429 ? "Rate limit hit. Try again in a moment." : status === 402 ? "AI credits exhausted." : "Notes generation failed";
      return new Response(JSON.stringify({ error }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await res.json();
    const tc = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) return new Response(JSON.stringify({ error: "AI returned no structured output" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const args = JSON.parse(tc.function.arguments);
    return new Response(JSON.stringify(args), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("ai-notes error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
