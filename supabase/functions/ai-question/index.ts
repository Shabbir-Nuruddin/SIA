import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAITool, getGeminiKeys } from "../_shared/ai.ts";
import { callGroqTool } from "../_shared/groq.ts";
import { requireUser } from "../_shared/auth.ts";
import { getCachedSet, saveSet } from "../_shared/questionBank.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GROQ_KEY = Deno.env.get("GROQ_API_KEY");

const onePointPerMark = (q: any) => {
  const marks = Math.max(1, Number(q?.marks) || 1);
  const lines = String(q?.mark_scheme || "")
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
    .map((l, i) => (/(\(1\)|\[1\])\s*$/.test(l) ? l : `MP${i + 1} — ${l.replace(/\s*\(\d+\)\s*$/, "")} (1)`));
  q.mark_scheme = lines.slice(0, marks).join("\n");
  return q;
};

const generateTool = {
  type: "function",
  function: {
    name: "create_exam_questions",
    description: "Create a set of original exam questions in the exact style of past papers.",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              question_text: {
                type: "string",
                description:
                  "The full question. Use bold command words at the start (e.g. **Calculate**, **Explain**).",
              },
              marks: { type: "integer", description: "Mark allocation appropriate for difficulty/type." },
              mark_scheme: {
                type: "string",
                description:
                  "Official-examiner-style marking scheme. Exactly one line per mark. Each line ends with (1). Use MP1/MP2 or M1/A1/B1 where appropriate, include required keywords and acceptable alternatives. The number of lines must equal marks.",
              },
              options: {
                type: "array",
                items: { type: "string" },
                description: "Only for Multiple Choice: 4 plausible options.",
              },
            },
            required: ["question_text", "marks", "mark_scheme"],
            additionalProperties: false,
          },
        },
      },
      required: ["questions"],
      additionalProperties: false,
    },
  },
};

const markTool = {
  type: "function",
  function: {
    name: "mark_student_answer",
    description: "Mark a student's exam answer against the mark scheme.",
    parameters: {
      type: "object",
      properties: {
        awarded_marks: { type: "integer" },
        total_marks: { type: "integer" },
        feedback: {
          type: "string",
          description:
            "Specific examiner-style feedback. State which exact marking points earned marks and which keywords/steps were missing. Keep it tight and useful.",
        },
        model_answer: {
          type: "string",
          description: "A clean, full-mark model answer the student can compare against.",
        },
      },
      required: ["awarded_marks", "total_marks", "feedback", "model_answer"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;
  const userId = auth.userId;
  if (getGeminiKeys().length === 0 && !Deno.env.get("GROQ_API_KEY")) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { action } = body;

    let messages: any[] = [];
    let tools: any[] = [];
    let toolName = "";
    // Set in the generate branch so we can save the result to the reuse pool after marking-safe post-processing.
    let bankCtx: { kind: "topical"; board: string; subject: string; signature: string; userId: string } | null = null;

    if (action === "generate") {
      const { subject, topic, difficulty, questionType, syllabus_context, count, board } = body;
      const n = Math.min(15, Math.max(1, Number(count) || 1));

      // Reuse pool: serve a set this user hasn't seen (saves AI credits). ~1 in 3
      // requests still generates fresh. Falls through to generation on any miss.
      const bankBoard = String(board || "edexcel-ial");
      const signature = `${topic}|${difficulty}|${questionType}|${n}`.toLowerCase();
      bankCtx = { kind: "topical", board: bankBoard, subject: String(subject), signature, userId };
      const cachedSet = await getCachedSet(bankCtx);
      if (cachedSet) {
        return new Response(JSON.stringify(cachedSet), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const boardLabel =
        board === "cie"           ? "Cambridge International A Level (CIE)" :
        board === "cie-igcse"     ? "Cambridge IGCSE (CIE)" :
        board === "edexcel-igcse" ? "Edexcel International GCSE (IGCSE)" :
                                    "Edexcel International A-Level (IAL)";
      const system = `You are a senior ${boardLabel} examiner specialising in ${subject}. You write original exam questions in the EXACT style, structure, mark allocation, and command-word patterns of real ${boardLabel} past papers — but the scenarios, values, and content are fully original. NEVER reproduce a real past paper question verbatim. Match the cognitive demand precisely. Use UK English.

EXAM AUTHENTICITY RULES:
- Questions must feel like real recent ${boardLabel} past-paper questions for this exact topic. Do not ask generic textbook questions that never appear in papers.
- Mark allocations must match real exam practice: recall usually 1-2, explain/describe usually 2-4, calculation usually 3-6, extended response only when the actual exam would ask it.
- The mark_scheme must have exactly one marking point per mark, one line per mark, every line ending with (1). Use official language with keywords and allowed alternatives, e.g. "MP1 — collision frequency increases (1)".
- Model answers and marking must show where each line earns 1 mark, like an official mark scheme.

FORMATTING (CRITICAL):
- Render ALL mathematical expressions in LaTeX using $...$ for inline (e.g. $x^2 + 5x + 6$, $\\frac{dy}{dx}$, $\\sqrt{x^2+1}$, $\\int_0^1 f(x)\\,dx$, $H_2O$) and $$...$$ for display equations.
- Use \\frac, \\sqrt, ^{...}, _{...}, \\pi, \\theta, \\Delta, \\rightarrow, \\leq, \\geq, \\pm, \\times, \\cdot.
- NEVER write standalone $$ markers, malformed delimiters, or unclosed math blocks. Every $ must be paired.
- NEVER include LaTeX inside the "options" array — keep options as plain text or simple formulas wrapped properly.
- Outside math, use Unicode for standalone symbols (→, ⇌, °C). UK English.

THIS IS A WEB APP — questions must be answerable by typing. ABSOLUTELY DO NOT generate questions that require the student to draw, sketch, plot a graph, label a diagram, complete a Lewis structure, draw a curly-arrow mechanism, or otherwise produce a hand-drawn visual. If the natural question would require drawing, rephrase it as a description / explanation / calculation instead.${syllabus_context ? `\n\nSCOPE — your questions MUST stay strictly within these specification statements for this topic. Do not invent content beyond the syllabus:\n${syllabus_context}` : ""}`;
      const user = `Generate ${n} DISTINCT ${difficulty} difficulty ${questionType} questions on the topic "${topic}" for ${boardLabel} ${subject}. Each question must test a different sub-skill or angle of the topic — no near-duplicates. Mark allocation should be realistic for the type:
- Multiple Choice: 1 mark
- Short Answer: 2-4 marks
- Extended Response: 5-9 marks
- Calculation: 3-6 marks

For EVERY generated question, its mark_scheme must contain exactly the same number of (1) lines as the marks value. No prose before or after the marking points.

CRITICAL RULES ABOUT QUESTION PHRASING:
- NO drawing/sketching/plotting/labelling/diagram-completion questions. The student is typing in a text box.
- SELF-CONTAINED ONLY: the student sees ONLY your text — there are NO images, diagrams, graphs, figures or tables. NEVER write a question that refers to "the diagram/graph/figure/image/table above/below/shown", "the following diagram", "use the graph", "from the data shown", or any visual that is not fully written out in words. If a graph or diagram would normally be provided, instead give the needed values/equation/description IN THE QUESTION TEXT so it is answerable without seeing anything.
- Do NOT write "which of the following" / "which of these lines/statements/options/graphs" UNLESS every option is written out in the question (and for Multiple Choice, in the options array). Never reference choices the student cannot see.
${
  questionType === "Multiple Choice"
    ? `- Every question MUST include exactly 4 plausible options in the "options" array. Never omit options.
- Options should be distinct, realistic distractors of similar length.`
    : `- This is a ${questionType} question. DO NOT phrase it as a multiple-choice question.
- FORBIDDEN phrasings: "Which of the following...", "Which one of the following...", "Select the correct statement...", "Identify which statement...", "Choose the option that...", or any wording that implies the student is picking from a list.
- The question must be answerable as free-form written work (calculation, explanation, derivation, description). It must NOT reference unseen options, statements, or choices.
- Do NOT include the "options" field for these questions.`
}`;
      messages = [
        { role: "system", content: system },
        { role: "user", content: user },
      ];
      tools = [generateTool];
      toolName = "create_exam_questions";
    } else if (action === "mark") {
      const { subject, topic, questionText, markScheme, totalMarks, studentAnswer, studentAnswerImage, board } = body;
      const boardLabel = board === "cie" ? "Cambridge International (CIE) A Level" : "Edexcel A-Level";
      const system = `You are a strict but fair ${boardLabel} ${subject} examiner. You mark answers against the official mark scheme rubric, awarding marks point-by-point using ${boardLabel} mark-scheme phrasing. In your model_answer and feedback, render ALL mathematical expressions in LaTeX using $...$ inline (e.g. $x^2$, $\\frac{a}{b}$, $\\sqrt{x+1}$) and $$...$$ for display equations. Use \\frac, \\sqrt, ^{...}, _{...}. CRITICAL: NEVER use LaTeX environments like \\begin{itemize}, \\end{itemize}, \\item, \\begin{enumerate}, \\begin{align}, etc. For lists, use plain markdown bullets (- item) on separate lines. Every $ must be paired — never leave dangling $ or $$ markers. Keep math expressions short and self-contained.${studentAnswerImage ? " The student answer is provided as a photo of handwritten working — read it carefully, transcribe what you can, and mark generously where intent is clear despite handwriting." : ""}`;
      const userText = `Question (worth ${totalMarks} marks):
${questionText}

Mark scheme:
${markScheme}

${studentAnswer ? `Student answer (typed):\n${studentAnswer}\n` : ""}${studentAnswerImage ? "Student answer is in the attached image." : ""}

Mark this answer. Be fair: award marks for any valid alternative wording. Be strict: don't award marks for missing key terms or incorrect calculations. Provide examiner feedback that helps the student improve.`;
      const userContent: any = studentAnswerImage
        ? [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: studentAnswerImage } },
          ]
        : userText;
      messages = [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ];
      tools = [markTool];
      toolName = "mark_student_answer";
    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let args: any;
    try {
      // For marking with an image, must use Groq (vision-capable). For all other actions, use Gemini primary.
      if (action === "mark" && body.studentAnswerImage && GROQ_KEY) {
        args = await callGroqTool({
          apiKey: GROQ_KEY,
          messages,
          tools,
          toolName,
          temperature: 0.15,
          maxTokens: 2500,
          vision: true,
        });
      } else {
        args = await callAITool({
          messages,
          tools,
          toolName,
          temperature: action === "generate" ? 0.35 : 0.15,
          maxTokens: action === "generate" ? 6000 : 2500,
        });
      }
    } catch (err: any) {
      console.error("ai-question generation failed", err?.body?.slice?.(0, 700) || err);
      return new Response(JSON.stringify({ error: err?.message || "AI generation failed after trying fallback models." }), {
        status: err?.status || 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Post-filter: drop drawing/sketching questions and clean malformed math.
    const drawPattern =
      /\b(draw|sketch|plot (a|the) graph|label (the|a) diagram|complete the (diagram|structure)|construct (the|a) (diagram|graph)|curly[- ]arrow mechanism)\b/i;
    // Drop questions that reference a visual the student can't see (no images here).
    const visualRefPattern =
      /\b(shown (above|below)|(diagram|graph|figure|image|table|chart) (above|below|shown|opposite)|the (following|above|below) (diagram|graph|figure|image|table)|refer to the (diagram|graph|figure|image|table)|using the (graph|diagram|figure|table)|the (diagram|graph|figure|image) (shows|below|above)|from the (graph|diagram|data shown))\b/i;
    const cleanMath = (s: string) =>
      String(s || "")
        .replace(/\$\$\s*\$\$/g, "") // empty $$$$
        .replace(/(\$\$)\s*,/g, "$1") // stray $$,
        .replace(/\\text\{\s*\}/g, "")
        .trim();

    if (action === "generate" && Array.isArray(args?.questions)) {
      args.questions = args.questions.filter((q: any) => {
        const t = String(q?.question_text || "");
        if (drawPattern.test(t)) return false;
        if (visualRefPattern.test(t)) return false; // references an image/graph the student can't see
        if (body.questionType !== "Multiple Choice") {
          const mcqPattern =
            /\b(which (one )?of the following|select the correct|identify which|choose the (option|statement)|which statement is correct)\b/i;
          const looksMcq = mcqPattern.test(t);
          const hasOptions = Array.isArray(q?.options) && q.options.length >= 2;
          if (looksMcq && !hasOptions) return false;
        } else {
          if (!Array.isArray(q?.options) || q.options.length < 2) return false;
        }
        q.question_text = cleanMath(t);
        if (q.mark_scheme) q.mark_scheme = cleanMath(q.mark_scheme);
        onePointPerMark(q);
        return true;
      });
      // Add the fresh set to the reuse pool (best-effort) so other students can
      // reuse it and this user won't be served it again.
      if (bankCtx && args.questions.length > 0) await saveSet(bankCtx, args);
    }

    if (action === "mark") {
      args.awarded_marks = Math.max(0, Math.min(Number(body.totalMarks) || 0, Number(args.awarded_marks) || 0));
      args.total_marks = Number(body.totalMarks) || Number(args.total_marks) || 0;
    }

    return new Response(JSON.stringify(args), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-question error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
