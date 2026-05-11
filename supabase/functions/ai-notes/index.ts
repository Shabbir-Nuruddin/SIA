import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { callAITool, deepStripLatex } from "../_shared/ai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const paragraphiseOverview = (s: string) =>
  String(s || "")
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n\n");

const enoughOverview = (s: string) => paragraphiseOverview(s).split(/\n\s*\n+/).filter(Boolean).length >= 5;

const normaliseNotes = (args: any) => deepStripLatex({
  ...args,
  overview: paragraphiseOverview(args?.overview || ""),
});


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
            "8 to 10 separate paragraphs of flowing prose, with a blank line between paragraphs. Each paragraph must be 4 to 6 sentences. Written like a Save My Exams revision summary. Teach the a[...]
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
                'Either: (a) an inline <svg>...</svg> illustration with viewBox="0 0 400 240" using stroke="currentColor" so it themes correctly, OR (b) a simple HTML <table>... markup, OR (c) AS[...]
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
  if (!Deno.env.get("GEMINI_API_KEY") && !Deno.env.get("GROQ_API_KEY")) {
    return new Response(JSON.stringify({ error: "AI service not configured (need GEMINI_API_KEY or GROQ_API_KEY)" }), {
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

ABSOLUTE FORMATTING RULES — PLAIN UNICODE ONLY:
- DO NOT use LaTeX. DO NOT use \\(, \\), \\[, \\], $, $$, or backslash commands of any kind.
- Write all mathematical expressions in plain Unicode:
  • Use ² ³ ⁴ ⁻¹ ⁰ ⁺ for superscripts (NOT ^2 or ^{2}).
  • Use ₀ ₁ ₂ ₃ for subscripts (NOT _2 or _{2}). Example: H₂O, CO₂, x₁.
  • Use → for arrows (NOT \\rightarrow or ->), ⇌ for equilibrium, ⇒ for implies.
  • Use ≤ ≥ ≠ ≈ ± × · ÷ √ ∑ ∫ ∞ Δ δ α β γ θ π μ ρ σ ω λ φ ε ° directly.
  • Fractions: write "(a)/(b)" or "a/b" inline, never \\frac{}{}.
  • Square roots: use √x or √(x+1), never \\sqrt{}.
- Outside math, use UK English and standard mark-scheme phrasing for ${boardLabel}.
- Do NOT use ## headers or markdown bullets in any field — return structured data via the tool.
- OVERVIEW LENGTH: overview must contain 5 to 8 real paragraphs separated by blank lines. Each paragraph must be 4 to 6 sentences and teach exam-relevant content directly so a student reading only the overview understands the entire topic.`;

    const isMaths = subject === "mathematics" || subject === "math" || subject === "maths";
    const mathsBoost = isMaths
      ? `

CRITICAL — THIS IS MATHEMATICS:
- For EVERY core_content item, the worked_example MUST be a fully-worked numerical or algebraic solution showing each step on its own line, in plain Unicode (e.g. "x² + 5x + 6 = 0", "Let u = x + 1", "(x+2)(x+3) = 0", "x = -2 or x = -3"). NEVER use LaTeX.
- Include AT LEAST 6 core_content items per topic, each demonstrating a different worked-example pattern.
- Each worked_example should be at least 6 lines: a clear "Given → Method → Working → Answer" structure.
- For equations, every worked_substitution must show the full numeric chain in plain Unicode.
- For key_definitions, set "plain_english" to an empty string "" — maths notes show the formal definition only.
- For overview, prioritise worked examples over prose.

CRITICAL — VISUAL SUMMARY FOR MATHS:
- Set visual_summary.kind to "table" and visual_summary.content to a clean HTML <table> (no LaTeX inside).`
      : "";

    const user = `Generate comprehensive revision notes for the topic: ${topic}, ${unit_name} (Unit ${unit_number}) for ${boardLabel} ${levelLabel} ${subject} (${specCode}).

${syllabus_context ? `Official syllabus content (your scope is limited to this):\n${syllabus_context}\n` : ""}
${mathsBoost}

Produce notes in this exact structure via the tool. REMEMBER: PLAIN UNICODE ONLY — NO LATEX.
1. overview — 5 to 8 substantial paragraphs separated by blank lines. Each paragraph 4 to 6 sentences. Teach the actual content so a student reading only the overview understands the topic.
2. KEY DEFINITIONS — minimum 8. Each: term + mark-scheme definition + plain English + one common mistake.
3. CORE CONTENT — every syllabus point. Each: statement + worked example + most common wrong approach + typical marks. ${isMaths ? "FOR MATHS: at least 6 items, each a fully-worked solution." : ""}
4. EQUATIONS — every equation in plain Unicode. Each variable with meaning + unit. One worked substitution.
5. VISUAL SUMMARY — ${isMaths ? 'MUST be an HTML <table> (kind="table").' : 'one diagram. Prefer inline SVG (viewBox="0 0 400 240") with stroke="currentColor", or HTML <table>.'}
6. EXAMINER TIPS — minimum 5, each tied to a specific ${boardLabel} command word.
7. FLASHCARDS — exactly 10.`;

    let args: any;
    try {
      args = await callAITool({
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [notesTool],
        toolName: "create_topic_notes",
        temperature: 0.25,
        maxTokens: 8000,
      });
      args = normaliseNotes(args);
      if (!enoughOverview(args.overview)) {
        args = normaliseNotes(await callAITool({
          messages: [
            { role: "system", content: system },
            { role: "user", content: `${user}\n\nThe previous attempt was rejected because overview was too short. Return a new complete version with overview = 5 to 8 substantial paragraphs separated by blank lines.` },
          ],
          tools: [notesTool],
          toolName: "create_topic_notes",
          temperature: 0.2,
          maxTokens: 8000,
        }));
      }
    } catch (err: any) {
      console.error("ai-notes generation failed", {
        status: err?.status,
        message: err?.message,
        body: typeof err?.body === "string" ? err.body.slice(0, 1000) : err?.body,
      });
      return new Response(JSON.stringify({ error: "AI is taking a short break — please try again in 30 seconds" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    }

    // Save to shared cache so future requests skip the AI call entirely.
    try {
      await admin
        .from("cached_topic_notes")
        .upsert(
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
