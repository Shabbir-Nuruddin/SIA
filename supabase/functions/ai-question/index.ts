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
    name: "create_exam_question",
    description: "Create an original exam question in the exact style of an Edexcel A-Level past paper.",
    parameters: {
      type: "object",
      properties: {
        question_text: { type: "string", description: "The full question, formatted like an Edexcel paper. Use bold command words at the start (e.g. **Calculate**, **Explain**, **Evaluate**). Include any data/scenario needed." },
        marks: { type: "integer", description: "Mark allocation appropriate for the difficulty and question type." },
        mark_scheme: { type: "string", description: "Concise Edexcel-style mark scheme: bullet points listing each mark-awarding point with M1/A1/B1 style codes where appropriate." },
        options: { type: "array", items: { type: "string" }, description: "Only for Multiple Choice: 4 plausible answer options." },
      },
      required: ["question_text", "marks", "mark_scheme"],
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
      const { subject, topic, difficulty, questionType } = body;
      const system = `You are a senior Edexcel A-Level examiner specialising in ${subject}. You write original exam questions in the EXACT style, structure, mark allocation, and command-word patterns of real Edexcel A-Level past papers — but the scenarios, values, and content are fully original. NEVER reproduce a real past paper question verbatim. Match the cognitive demand and question structure precisely. Use UK English. Use Edexcel command words: Calculate, State, Explain, Describe, Evaluate, Compare, Suggest, Determine, Show that.`;
      const user = `Generate ONE ${difficulty} difficulty ${questionType} question on the topic "${topic}" for Edexcel A-Level ${subject}. Mark allocation should be realistic for the type:
- Multiple Choice: 1 mark
- Short Answer: 2-4 marks
- Extended Response: 5-9 marks
- Calculation: 3-6 marks
For Multiple Choice, include 4 plausible options.`;
      messages = [{ role: "system", content: system }, { role: "user", content: user }];
      tools = [generateTool];
      toolName = "create_exam_question";
    } else if (action === "mark") {
      const { subject, topic, questionText, markScheme, totalMarks, studentAnswer } = body;
      const system = `You are a strict but fair Edexcel A-Level ${subject} examiner. You mark answers against the official mark scheme rubric, awarding marks point-by-point.`;
      const user = `Question (worth ${totalMarks} marks):
${questionText}

Mark scheme:
${markScheme}

Student answer:
${studentAnswer}

Mark this answer. Be fair: award marks for any valid alternative wording. Be strict: don't award marks for missing key terms or incorrect calculations. Provide examiner feedback that helps the student improve.`;
      messages = [{ role: "system", content: system }, { role: "user", content: user }];
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

    return new Response(JSON.stringify(args), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("ai-question error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
