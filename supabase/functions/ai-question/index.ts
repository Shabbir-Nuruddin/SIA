import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

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
              question_text: { type: "string", description: "The full question. Use bold command words at the start (e.g. **Calculate**, **Explain**)." },
              marks: { type: "integer", description: "Mark allocation appropriate for difficulty/type." },
              mark_scheme: { type: "string", description: "Concise mark scheme: bullet points with M1/A1/B1 codes where appropriate." },
              options: { type: "array", items: { type: "string" }, description: "Only for Multiple Choice: 4 plausible options." },
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
        feedback: { type: "string", description: "Specific, examiner-style feedback. What earned marks. What was missing. Reference command words. Keep it tight and useful." },
        model_answer: { type: "string", description: "A clean, full-mark model answer the student can compare against." },
      },
      required: ["awarded_marks", "total_marks", "feedback", "model_answer"],
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
    const body = await req.json();
    const { action } = body;

    let messages: any[] = [];
    let tools: any[] = [];
    let toolName = "";

    if (action === "generate") {
      const { subject, topic, difficulty, questionType, syllabus_context, count, board } = body;
      const n = Math.min(15, Math.max(1, Number(count) || 1));
      const boardLabel = board === "cie" ? "Cambridge International (CIE)" : "Edexcel A-Level";
      const system = `You are a senior ${boardLabel} examiner specialising in ${subject}. You write original exam questions in the EXACT style, structure, mark allocation, and command-word patterns of real ${boardLabel} past papers — but the scenarios, values, and content are fully original. NEVER reproduce a real past paper question verbatim. Match the cognitive demand precisely. Use UK English.

FORMATTING: Render ALL mathematical expressions in LaTeX using $...$ for inline (e.g. $x^2 + 5x + 6$, $\\frac{dy}{dx}$, $\\sqrt{x^2+1}$, $\\int_0^1 f(x)\\,dx$, $H_2O$) and $$...$$ for display equations. Use \\frac, \\sqrt, ^{...}, _{...}, \\pi, \\theta, \\Delta, \\rightarrow, \\leq, \\geq, \\pm, \\times, \\cdot. Outside math, use Unicode for standalone symbols (→, ⇌, °C). UK English.${syllabus_context ? `\n\nSCOPE — your questions MUST stay strictly within these specification statements for this topic. Do not invent content beyond the syllabus:\n${syllabus_context}` : ""}`;
      const user = `Generate ${n} DISTINCT ${difficulty} difficulty ${questionType} questions on the topic "${topic}" for ${boardLabel} ${subject}. Each question must test a different sub-skill or angle of the topic — no near-duplicates. Mark allocation should be realistic for the type:
- Multiple Choice: 1 mark
- Short Answer: 2-4 marks
- Extended Response: 5-9 marks
- Calculation: 3-6 marks

CRITICAL RULES ABOUT QUESTION PHRASING:
${questionType === "Multiple Choice"
  ? `- Every question MUST include exactly 4 plausible options in the "options" array. Never omit options.
- Options should be distinct, realistic distractors of similar length.`
  : `- This is a ${questionType} question. DO NOT phrase it as a multiple-choice question.
- FORBIDDEN phrasings: "Which of the following...", "Which one of the following...", "Select the correct statement...", "Identify which statement...", "Choose the option that...", or any wording that implies the student is picking from a list.
- The question must be answerable as free-form written work (calculation, explanation, derivation, description). It must NOT reference unseen options, statements, or choices.
- Do NOT include the "options" field for these questions.`}`;
      messages = [{ role: "system", content: system }, { role: "user", content: user }];
      tools = [generateTool];
      toolName = "create_exam_questions";
    } else if (action === "mark") {
      const { subject, topic, questionText, markScheme, totalMarks, studentAnswer, studentAnswerImage, board } = body;
      const boardLabel = board === "cie" ? "Cambridge International (CIE) A Level" : "Edexcel A-Level";
      const system = `You are a strict but fair ${boardLabel} ${subject} examiner. You mark answers against the official mark scheme rubric, awarding marks point-by-point using ${boardLabel} mark-scheme phrasing. In your model_answer and feedback, render ALL mathematical expressions in LaTeX using $...$ inline (e.g. $x^2$, $\\frac{a}{b}$, $\\sqrt{x+1}$) and $$...$$ for display equations. Use \\frac, \\sqrt, ^{...}, _{...}.${studentAnswerImage ? " The student answer is provided as a photo of handwritten working — read it carefully, transcribe what you can, and mark generously where intent is clear despite handwriting." : ""}`;
      const userText = `Question (worth ${totalMarks} marks):
${questionText}

Mark scheme:
${markScheme}

${studentAnswer ? `Student answer (typed):\n${studentAnswer}\n` : ""}${studentAnswerImage ? "Student answer is in the attached image." : ""}

Mark this answer. Be fair: award marks for any valid alternative wording. Be strict: don't award marks for missing key terms or incorrect calculations. Provide examiner feedback that helps the student improve.`;
      const userContent: any = studentAnswerImage
        ? [{ type: "text", text: userText }, { type: "image_url", image_url: { url: studentAnswerImage } }]
        : userText;
      messages = [{ role: "system", content: system }, { role: "user", content: userContent }];
      tools = [markTool];
      toolName = "mark_student_answer";
    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiRes = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages,
        tools,
        tool_choice: { type: "function", function: { name: toolName } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI gateway error", aiRes.status, txt);
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit hit. Try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await aiRes.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call returned", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI returned no structured output" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const args = JSON.parse(toolCall.function.arguments);

    // Post-filter: for non-MCQ actions, drop questions that look like MCQs without options.
    if (action === "generate" && body.questionType !== "Multiple Choice" && Array.isArray(args?.questions)) {
      const mcqPattern = /\b(which (one )?of the following|select the correct|identify which|choose the (option|statement)|which statement is correct)\b/i;
      args.questions = args.questions.filter((q: any) => {
        const t = String(q?.question_text || "");
        const looksMcq = mcqPattern.test(t);
        const hasOptions = Array.isArray(q?.options) && q.options.length >= 2;
        // Drop if it sounds like MCQ but has no options provided
        if (looksMcq && !hasOptions) return false;
        return true;
      });
    } else if (action === "generate" && body.questionType === "Multiple Choice" && Array.isArray(args?.questions)) {
      // Drop MCQs missing options
      args.questions = args.questions.filter((q: any) => Array.isArray(q?.options) && q.options.length >= 2);
    }

    return new Response(JSON.stringify(args), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("ai-question error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
