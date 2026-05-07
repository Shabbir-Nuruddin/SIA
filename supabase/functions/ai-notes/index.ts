import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("GROQ_API_KEY");
const GATEWAY = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

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
          description:
            "3–4 paragraphs of flowing prose explaining what the topic is, why it matters, and how it connects to other topics in the unit. No bullets, no markdown, no LaTeX.",
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
              typical_marks: {
                type: "integer",
                description: "How many marks this typically carries in an exam question.",
              },
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
              equation: {
                type: "string",
                description:
                  "The equation as a single LaTeX expression wrapped in $$...$$ (display math). Example: '$$\\\\Delta G^{\\\\ominus} = -nFE^{\\\\ominus}_{cell}$$'.",
              },
              variables: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    symbol: {
                      type: "string",
                      description:
                        "Symbol as inline LaTeX wrapped in $...$. Example: '$\\\\Delta G^{\\\\ominus}$' or '$E^{\\\\ominus}_{cell}$'.",
                    },
                    meaning: {
                      type: "string",
                      description:
                        "Plain prose meaning. No LaTeX, no $ signs, no backslashes. Example: 'Standard Gibbs free energy change'.",
                    },
                    unit: {
                      type: "string",
                      description:
                        "Unit as inline LaTeX wrapped in $...$. Example: '$\\\\text{J mol}^{-1}$' or '$\\\\text{kJ mol}^{-1}$'. Use 'dimensionless' if none.",
                    },
                  },
                  required: ["symbol", "meaning", "unit"],
                  additionalProperties: false,
                },
              },
              worked_substitution: {
                type: "string",
                description:
                  "One worked numerical substitution as prose with inline LaTeX (use $...$ for math). Show full numeric chain.",
              },
            },
            required: ["equation", "variables", "worked_substitution"],
            additionalProperties: false,
          },
        },
        visual_summary: {
          type: "object",
          description:
            "A diagram, table, flowchart, or inline SVG illustration that explains key relationships visually.",
          properties: {
            kind: { type: "string", enum: ["table", "flowchart", "diagram", "svg"] },
            caption: { type: "string" },
            content: {
              type: "string",
              description:
                'Either: (a) an inline <svg>...</svg> illustration with viewBox="0 0 400 240" using stroke="currentColor" so it themes correctly, OR (b) a simple HTML <table>... markup, OR (c) ASCII flowchart. Prefer SVG for spatial/process diagrams (energy profiles, electric fields, biological cycles, geometric proofs).',
            },
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
              command_word: {
                type: "string",
                description:
                  "The Edexcel command word this tip applies to (Calculate, Explain, Describe, Evaluate, Compare, Suggest, Determine, State, Deduce, Show that).",
              },
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
      required: [
        "overview",
        "key_definitions",
        "core_content",
        "equations",
        "visual_summary",
        "examiner_tips",
        "flashcards",
      ],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const { subject, unit_number, unit_name, topic, syllabus_context, board, level } = await req.json();

    // Shared cache: if any user already generated notes for this board+subject+unit+topic, reuse them.
    const cacheBoard = board === "cie" ? "cie" : "edexcel";
    try {
      const { data: cachedRow } = await admin
        .from("cached_topic_notes")
        .select("content")
        .eq("board", cacheBoard)
        .eq("subject", subject)
        .eq("unit_number", unit_number)
        .eq("topic", topic)
        .maybeSingle();
      if (cachedRow?.content) {
        return new Response(JSON.stringify(cachedRow.content), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.error("cache lookup failed", e);
    }

    const isCie = board === "cie";
    const boardLabel = isCie ? "Cambridge International (CIE) A Level" : board || "Edexcel International A-Level";
    const levelLabel = level || "A-Level";
    const specCode = isCie
      ? subject === "chemistry"
        ? "9701"
        : subject === "biology"
          ? "9700"
          : subject === "physics"
            ? "9702"
            : "9709"
      : "Edexcel IAL";

    const scopeNote = syllabus_context
      ? `You MUST stay strictly within the official ${boardLabel} ${subject} (${specCode}) specification content provided. If a concept is not in the syllabus statements for this topic, do NOT include it.`
      : "";

    const system = `You are an expert ${boardLabel} ${levelLabel} ${subject} examiner and teacher (${specCode}). ${scopeNote}

ABSOLUTE FORMATTING RULES:
- For ALL mathematical expressions use LaTeX delimited with $...$ (inline) or $$...$$ (display). Examples: $x^2 + 5x + 6$, $\\frac{a}{b}$, $\\sqrt{x+1}$, $\\int_0^1 x\\,dx$, $H_2O$, $\\pi r^2$.
- Use proper LaTeX commands: \\frac, \\sqrt, \\sum, \\int, ^{...}, _{...}, \\pi, \\theta, \\Delta, \\rightarrow, \\leq, \\geq, \\pm, \\times, \\cdot.
- Outside math, use Unicode for stand-alone symbols (→, ⇌, °C) and UK English. Mark-scheme phrasing for ${boardLabel}.
- Do NOT use ## headers or markdown bullets in any field — return structured data via the tool.`;

    const isMaths = subject === "mathematics" || subject === "math" || subject === "maths";
    const mathsBoost = isMaths
      ? `

CRITICAL — THIS IS MATHEMATICS:
- For EVERY core_content item, the worked_example MUST be a fully-worked numerical or algebraic solution showing each step on its own line, written in LaTeX (e.g. "$x^2 + 5x + 6 = 0$", "Let $u = 2x + 1$, then $\\frac{du}{dx} = 2$"). Do NOT skip steps.
- Include AT LEAST 6 core_content items per topic, each demonstrating a different worked-example pattern (standard case, edge case, with substitution, applied/word problem, etc.).
- Each worked_example should be at least 6 lines long: a clear "Given → Method → Working → Answer" structure. Use $$...$$ for any equation that should be centred on its own line.
- For equations, every worked_substitution must show the full numeric chain in LaTeX, not just the final answer.
- Show common algebraic manipulations explicitly (factorising, expanding, completing the square, integration by parts, etc.) using $\\frac{}{}$, $\\sqrt{}$, $^{}$ as appropriate.
- For key_definitions, set "plain_english" to an empty string "" — maths notes show the formal definition only.
- For overview, keep it short and conceptual (1 paragraph max) — students want to see worked examples, not prose.

CRITICAL — VISUAL SUMMARY FOR MATHS:
- DO NOT generate inline SVG graphs for maths. SVG graphs are visually unreliable (curves crossing the x-axis at the wrong number of points, asymptotes drawn incorrectly, etc.) and students rely on these notes for accuracy.
- Set visual_summary.kind to "table" and visual_summary.content to a clean HTML <table> that summarises the key cases, formulae, or conditions for this topic. Example for the discriminant: a 3-row table with columns "Discriminant", "Number of real roots", "Graph behaviour" and rows describing $b^2-4ac>0$ (two real roots, curve crosses x-axis at 2 points), $b^2-4ac=0$ (one repeated root, curve touches x-axis at 1 point), $b^2-4ac<0$ (no real roots, curve does not cross x-axis).
- The HTML table content may use $...$ LaTeX inside cells.`
      : "";

    const user = `Generate comprehensive revision notes for the topic: ${topic}, ${unit_name} (Unit ${unit_number}) for ${boardLabel} ${levelLabel} ${subject} (${specCode}).

${syllabus_context ? `Official syllabus content (your scope is limited to this):\n${syllabus_context}\n` : ""}
${mathsBoost}

Produce notes in this exact structure via the tool:
1. OVERVIEW — 3–4 paragraphs of flowing prose. Conceptual, like a knowledgeable teacher introducing the topic. No bullets.
2. KEY DEFINITIONS — minimum 8. Each: term + mark-scheme definition + plain English + one common mistake.
3. CORE CONTENT — every syllabus point. Each: statement + worked example (setup → method → answer with units) + most common wrong approach + typical marks. ${isMaths ? "FOR MATHS: at least 6 items, each with a fully-worked multi-line solution." : ""}
4. EQUATIONS — every equation needed. Plain text. Each variable with meaning + unit. One worked substitution.
5. VISUAL SUMMARY — ${isMaths ? 'MUST be an HTML <table> (kind="table"). Do NOT use SVG for maths topics — accuracy is critical.' : 'one diagram. Prefer an inline SVG illustration (viewBox="0 0 400 240", stroke="currentColor", fill="none" or fill="currentColor" with low opacity) when the topic is spatial/process-based — e.g. energy profile diagrams, force diagrams, ray diagrams, geometric figures, biological cycles, organic mechanisms. Use a clean HTML <table> for comparisons or summary data. Use ASCII flowchart only as a last resort.'}
6. EXAMINER TIPS — minimum 5, each tied to a specific ${boardLabel} command word (Calculate, State, Explain, Describe, Evaluate, Compare, Suggest, Determine, Show that, Deduce).
7. FLASHCARDS — exactly 10. Test definitions, equations, and application — not just recall.`;

    let args: any = null;
    let lastErrStatus = 500;
    let lastErrBody = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          tools: [notesTool],
          tool_choice: { type: "function", function: { name: "create_topic_notes" } },
          temperature: 0.3,
        }),
      });
      if (!res.ok) {
        lastErrStatus = res.status;
        lastErrBody = await res.text();
        console.error("ai-notes gateway error attempt", attempt, res.status, lastErrBody.slice(0, 500));
        if (res.status === 429 || res.status === 402) break;
        continue;
      }
      const data = await res.json();
      const tc = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!tc) {
        console.error("ai-notes no tool call attempt", attempt);
        continue;
      }
      try {
        args = JSON.parse(tc.function.arguments);
        break;
      } catch (e) {
        console.error("ai-notes JSON parse failed attempt", attempt, e);
        continue;
      }
    }
    if (!args) {
      const error =
        lastErrStatus === 429
          ? "Rate limit hit. Try again in a moment."
          : lastErrStatus === 402
            ? "AI credits exhausted."
            : "Notes generation failed";
      return new Response(JSON.stringify({ error }), {
        status: lastErrStatus,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    // Save to shared cache so future requests skip the AI call entirely.
    try {
      await admin.from("cached_topic_notes").upsert(
        { board: cacheBoard, subject, unit_number, topic, content: args, updated_at: new Date().toISOString() },
        { onConflict: "board,subject,unit_number,topic" },
      );
    } catch (e) {
      console.error("cache save failed", e);
    }

    return new Response(JSON.stringify(args), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-notes error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
