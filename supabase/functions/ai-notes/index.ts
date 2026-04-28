import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

const notesTool = {
  type: "function",
  function: {
    name: "create_topic_notes",
    description: "Generate structured exam-focused revision notes for one Edexcel topic.",
    parameters: {
      type: "object",
      properties: {
        key_definitions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              definition: { type: "string", description: "One-line precise definition. No LaTeX, no markdown. Use plain text and Unicode (Δ, →, x², etc.)" },
            },
            required: ["term", "definition"],
          },
        },
        core_concepts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              cluster: { type: "string", description: "Concept cluster heading" },
              bullets: { type: "array", items: { type: "string" }, description: "Max 5 exam-relevant bullets. Plain text, no markdown asterisks or hashes." },
            },
            required: ["cluster", "bullets"],
          },
        },
        common_mistakes: {
          type: "array",
          items: { type: "string", description: "Format: 'Students often write X — examiners want Y instead'" },
        },
        worked_example: {
          type: "object",
          properties: {
            problem: { type: "string" },
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "string", description: "Step text. Include units at every step for sciences. Plain text only — no LaTeX." },
                  reason: { type: "string", description: "Why this step. One short sentence." },
                },
                required: ["step", "reason"],
              },
            },
            answer: { type: "string" },
          },
          required: ["problem", "steps", "answer"],
        },
        examiner_tips: {
          type: "array",
          items: { type: "string", description: "Second-person: 'Always state the unit when…'" },
        },
      },
      required: ["key_definitions", "core_concepts", "common_mistakes", "worked_example", "examiner_tips"],
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
    const { subject, unit_number, unit_name, topic, syllabus_context } = await req.json();

    const isChem = subject === "chemistry";
    const system = `You are a senior Edexcel A-Level ${subject} examiner writing concise, exam-focused revision notes. ${isChem && syllabus_context ? "You MUST stay strictly within the official Edexcel International A-Level Chemistry specification content provided below. If a concept is not in the syllabus statements for this topic, do NOT include it." : ""}

ABSOLUTE FORMATTING RULES:
- Plain text only. NO LaTeX. NO dollar signs. NO backslashes for math.
- Use Unicode for symbols: Δ, →, ⇌, ×, ², ³, ⁻¹, etc.
- Write "x squared" or use ² superscript — never "x^2".
- Write fractions as a/b or use words.
- No markdown headings (no #), no bold asterisks (**), no list hyphens — return structured data in the tool fields.
- UK English. Use Edexcel mark scheme phrasing.`;

    const user = `Generate revision notes for:
Subject: Edexcel A-Level ${subject}
Unit: Unit ${unit_number} — ${unit_name}
Topic: ${topic}

${syllabus_context ? `Official syllabus content (your scope is limited to this):\n${syllabus_context}\n` : ""}

Produce notes in this exact structure via the tool:
1. KEY DEFINITIONS — only terms that appear in Edexcel mark schemes. Each: bolded term + one-line precise definition.
2. CORE CONCEPTS — bullet points (max 5 per cluster). Every bullet exam-relevant. If a fact has never been tested in Edexcel, exclude it.
3. COMMON EXAM MISTAKES — 2 to 4 specific mistakes, in the format 'Students often write X — examiners want Y instead'.
4. WORKED EXAMPLE — one fully solved example. For sciences include units at every step. For maths show full working with reasons.
5. EXAMINER TIPS — 2 to 3 second-person tips on what gets full marks.`;

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
