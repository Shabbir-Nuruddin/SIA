import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("GROQ_API_KEY");
const GATEWAY = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const generatePaperTool = {
  type: "function",
  function: {
    name: "create_mock_paper",
    description:
      "Generate an original Edexcel-style A-Level mock paper. Each question must be original (no verbatim past-paper reproduction) but identical in cognitive demand, command words, and mark allocation to real Edexcel questions for the topic.",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              topic: { type: "string" },
              question_type: { type: "string" },
              command_word: {
                type: "string",
                description: "e.g. Calculate, Describe, Explain, Evaluate, Show that, State",
              },
              question_text: {
                type: "string",
                description:
                  "Full question, command word in **bold** at start. Use real scientific contexts but altered specifics.",
              },
              marks: { type: "integer" },
              options: {
                type: "array",
                items: { type: "string" },
                description: "For Multiple Choice only: 4 plausible options.",
              },
              model_answer: { type: "string", description: "A clean full-mark model answer." },
              mark_scheme: {
                type: "string",
                description: "Edexcel-style point-by-point mark scheme with M1/A1/B1 codes where appropriate.",
              },
            },
            required: [
              "topic",
              "question_type",
              "command_word",
              "question_text",
              "marks",
              "model_answer",
              "mark_scheme",
            ],
          },
        },
      },
      required: ["questions"],
      additionalProperties: false,
    },
  },
};

const markPaperTool = {
  type: "function",
  function: {
    name: "mark_mock_paper",
    description: "Mark every question of a student's mock paper Edexcel-style.",
    parameters: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question_index: { type: "integer" },
              awarded_marks: { type: "integer" },
              feedback: { type: "string", description: "1-2 sentences. What earned marks, what was missing." },
            },
            required: ["question_index", "awarded_marks", "feedback"],
          },
        },
      },
      required: ["results"],
      additionalProperties: false,
    },
  },
};

async function callAI(messages: any[], tools: any[], toolName: string) {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools,
      tool_choice: { type: "function", function: { name: toolName } },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("AI gateway error", res.status, txt);
    throw {
      status: res.status,
      message:
        res.status === 429
          ? "Rate limit hit. Try again in a moment."
          : res.status === 402
            ? "AI credits exhausted. Add funds in workspace settings."
            : "AI generation failed",
    };
  }
  const data = await res.json();
  const tc = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) throw { status: 500, message: "AI returned no structured output" };
  return JSON.parse(tc.function.arguments);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "generate") {
      const { subject, units, topics, questionTypes, totalMarks, difficultyMix, syllabus_context } = body;
      const system = `You are a senior Edexcel A-Level ${subject} examiner. Generate an original mock paper in the EXACT style, structure, mark allocation, and command-word patterns of real Edexcel papers, but invent fully original scenarios, values, and specific contexts. NEVER reproduce a past paper question verbatim. Match cognitive demand precisely. Use UK English and Edexcel command words: Calculate, State, Explain, Describe, Evaluate, Compare, Suggest, Determine, Show that. For sciences use real scientific contexts (named reactions, real organisms, real experimental setups) with altered specifics.

ABSOLUTE FORMATTING RULES:
- Plain text only. NO LaTeX. NO dollar signs. NO backslashes for math. NO markdown headings (#) or bold asterisks (**).
- Use Unicode for symbols: Δ, →, ⇌, ×, ², ³, ⁻¹, ½. Write "x squared" or "x²" — never "x^2". Fractions as a/b.
- Structure with clear paragraph breaks. Numbered/bulleted lists as plain text only.${syllabus_context ? `\n\nSCOPE — every question MUST stay strictly within the official Edexcel specification statements below. Do not invent content beyond the syllabus:\n${syllabus_context}` : ""}`;
      const user = `Build a mock paper for Edexcel A-Level ${subject}, covering Units ${units.join(", ")}.
Topics to draw from: ${topics.join("; ")}.
Allowed question types: ${questionTypes.join(", ")}.
Target total marks: ${totalMarks} (±5). Vary marks per question realistically (MCQ 1, short 2-4, calc 3-6, describe/explain 4-6, extended 6).
Difficulty mix: ${difficultyMix} (foundation = easier, mixed = balanced, challenge = harder).
Number questions sequentially starting at 1. Output via the tool.`;
      const result = await callAI(
        [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        [generatePaperTool],
        "create_mock_paper",
      );
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "mark") {
      const { subject, questions } = body;

      // Pre-mark: any blank answer is automatically 0. Don't even send to AI.
      const blanks: { question_index: number; awarded_marks: number; feedback: string }[] = [];
      const toMark: any[] = [];
      for (const q of questions) {
        const ans = (q.student_answer ?? "").toString().trim();
        if (!ans) {
          blanks.push({
            question_index: q.question_index,
            awarded_marks: 0,
            feedback:
              "No answer provided. 0 marks awarded. Always attempt every question — even partial working can earn method marks.",
          });
        } else {
          toMark.push(q);
        }
      }

      let aiResults: { question_index: number; awarded_marks: number; feedback: string }[] = [];
      if (toMark.length > 0) {
        const system = `You are a strict but fair Edexcel A-Level ${subject} examiner. Mark each answer Edexcel-style: method marks for working, accuracy marks for correct values, banded marking for 6-mark extended responses (Band 1: 1-2 basic, Band 2: 3-4 good, Band 3: 5-6 comprehensive). Award marks for valid alternative wording. Be honest — do not inflate. CRITICAL: If a student answer is blank, empty, whitespace, or just says "(no answer)", award 0 marks — never award marks for non-answers.`;
        const user = `Mark these questions. Return one result per question with awarded_marks (integer, 0..marks) and 1-2 sentence feedback.

${toMark
  .map(
    (q: any) => `Q${q.question_index + 1} [${q.marks} marks] (${q.question_type}):
${q.question_text}

Mark scheme:
${q.mark_scheme}

Model answer:
${q.model_answer}

Student answer:
${q.student_answer}
`,
  )
  .join("\n---\n")}`;
        const result = await callAI(
          [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          [markPaperTool],
          "mark_mock_paper",
        );
        aiResults = result.results || [];
      }

      const merged = [...blanks, ...aiResults].sort((a, b) => a.question_index - b.question_index);
      return new Response(JSON.stringify({ results: merged }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("ai-mock-paper error", err);
    const status = err?.status || 500;
    const message = err?.message || (err instanceof Error ? err.message : "Unknown error");
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
