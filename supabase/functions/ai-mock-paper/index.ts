import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAITool, getGeminiKeys } from "../_shared/ai.ts";
import { requireUser } from "../_shared/auth.ts";
import { getCachedSet, saveSet } from "../_shared/questionBank.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

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

// Gemini (multi-key rotation) primary, Groq fallback — same as notes/questions,
// so mock papers work with the configured Gemini keys (previously Groq-only).
async function callAI(messages: any[], tools: any[], toolName: string) {
  return callAITool({ messages, tools, toolName, temperature: 0.3, maxTokens: 6500 });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;
  const userId = auth.userId;
  if (getGeminiKeys().length === 0 && !GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "generate") {
      const { subject, units, topics, questionTypes, totalMarks, difficultyMix, syllabus_context, board } = body;

      // Reuse pool: serve a paper this user hasn't seen before (saves AI credits);
      // other students doing the same config can reuse it. ~1 in 3 generate fresh.
      const bankBoard = String(board || "edexcel-ial");
      const signature = [
        (units || []).slice().sort().join(","),
        (topics || []).slice().sort().join(","),
        difficultyMix,
        totalMarks,
        (questionTypes || []).slice().sort().join(","),
      ].join("|").toLowerCase();
      const bankCtx = { kind: "mock" as const, board: bankBoard, subject: String(subject), signature, userId };
      const cachedPaper = await getCachedSet(bankCtx);
      if (cachedPaper) {
        return new Response(JSON.stringify(cachedPaper), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Board label — determines exam style, command words, and mark-scheme format
      const boardLabel =
        board === "cie"         ? "Cambridge International A Level (CIE)" :
        board === "cie-igcse"   ? "Cambridge IGCSE (CIE)" :
        board === "edexcel-igcse" ? "Edexcel International GCSE (IGCSE)" :
                                   "Edexcel International A-Level (IAL)";
      const isIAL = board === "edexcel-ial" || !board;
      const isCIE = board === "cie" || board === "cie-igcse";

      const unitLevelRule = isIAL
        ? `- Units 1–3 are AS-level (IAS). Units 4–6 are A2-level (IA2). Generate questions ONLY at the correct level for the units specified.
- If units include 4+, do NOT ask AS-level questions on topics that also exist at AS level. Ask the A2 version (e.g. Kinetics Unit 4 = rate equations/Arrhenius, NOT Maxwell-Boltzmann).`
        : isCIE
        ? `- For CIE A Level: questions for Papers 1–3 are AS Level; Papers 4–5 are A2 Level. Match the level of the units specified.
- For CIE IGCSE: Core content applies to all students; Supplement/Extended content is harder and for Extended candidates.`
        : `- For IGCSE: Core content is accessible to all; distinguish higher-tier content where relevant.`;

      const markSchemeStyle = isCIE
        ? "Cambridge mark-scheme style: numbered marking points (1), with 'allow' and 'reject' notes where appropriate. Do not use M1/A1 codes."
        : "Edexcel-style point-by-point mark scheme with M1/A1/B1 codes where appropriate.";

      const system = `You are a senior ${boardLabel} ${subject} examiner. Generate an original mock paper in the EXACT style, structure, mark allocation, and command-word patterns of real ${boardLabel} past papers, but invent fully original scenarios, values, and specific contexts. NEVER reproduce a past paper question verbatim. Match cognitive demand precisely. Use UK English and ${boardLabel} command words: Calculate, State, Explain, Describe, Evaluate, Compare, Suggest, Determine, Show that.

UNIT-LEVEL CRITICAL RULES:
${unitLevelRule}
- For sciences: use real scientific contexts (named reactions, real organisms, real experimental setups) with altered specifics.
- For maths: every calculation question must have full step-by-step mark scheme with method marks and accuracy marks.

MARK-SCHEME FORMAT: ${markSchemeStyle}

FORMATTING RULES:
- Plain text only. NO LaTeX. NO dollar signs. NO backslashes for math. NO markdown headings (#) or bold asterisks (**).
- Use Unicode for symbols: Δ, →, ⇌, ×, ², ³, ⁻¹, ½. Write "x squared" or "x²" — never "x^2". Fractions as a/b.
- Structure with clear paragraph breaks. Numbered/bulleted lists as plain text only.${syllabus_context ? `\n\nSCOPE — every question MUST stay strictly within the official ${boardLabel} specification statements below. Do not invent content beyond the syllabus:\n${syllabus_context}` : ""}`;
      const user = `Build a mock paper for ${boardLabel} ${subject}, covering Units ${units.join(", ")}.
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
      // Save to the reuse pool (best-effort) for other students + dedupe for this user.
      if (Array.isArray(result?.questions) && result.questions.length > 0) await saveSet(bankCtx, result);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "mark") {
      const { subject, questions, board } = body;
      const boardLabel =
        board === "cie"         ? "Cambridge International A Level (CIE)" :
        board === "cie-igcse"   ? "Cambridge IGCSE (CIE)" :
        board === "edexcel-igcse" ? "Edexcel IGCSE" :
                                   "Edexcel International A-Level (IAL)";

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
        const system = `You are a strict but fair ${boardLabel} ${subject} examiner. Mark each answer in the exact ${boardLabel} style: award marks point-by-point, banded marking for 6-mark extended responses (Band 1: 1-2 basic, Band 2: 3-4 good, Band 3: 5-6 comprehensive). Award marks for valid alternative wording. Be honest — do not inflate. CRITICAL: If a student answer is blank, empty, whitespace, or just says "(no answer)", award 0 marks — never award marks for non-answers.`;
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
