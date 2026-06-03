import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAITool, getGeminiKeys } from "../_shared/ai.ts";
import { requireUser } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generates a short, personalised SIA learning target for a student, framed in the
// school's High Performance Learning (HPL) language, grounded in the student's
// actual analytics. The teacher reviews/edits before it's saved + shared to parents.
const targetTool = {
  type: "function",
  function: {
    name: "write_student_target",
    description: "Write a concise, parent-readable HPL learning target for a student.",
    parameters: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description:
            "Markdown. A 1-line headline, then 2-3 specific, measurable targets for the period (each tagged with the HPL ACP or VAA it builds), then one encouraging line. ~120 words, warm and clear, no heavy jargon.",
        },
      },
      required: ["target"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;
  if (getGeminiKeys().length === 0 && !Deno.env.get("GROQ_API_KEY")) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { studentName, period, metrics, subjects } = await req.json();
    const m = metrics || {};
    const subjLine = Array.isArray(subjects) && subjects.length
      ? subjects.map((s: any) => `${s.subject} (now ${s.current_grade} → target ${s.target_grade})`).join(", ")
      : "not set";

    const system = `You are an experienced teacher at Scholars International Academy (SIA) writing a short, personalised learning target for a student, using the school's High Performance Learning (HPL) framework.

HPL Advanced Cognitive Performance characteristics (ACPs): Meta-thinking, Linking, Analysing, Creating, Realising.
HPL Values, Attitudes & Attributes (VAAs): Empathetic, Agile, Hard-working (incl. enquiring, open-minded, risk-taking, collaborative, confident, practice, perseverance, resilience).

Write targets that are specific, measurable and achievable in the stated period, each explicitly building ONE named HPL ACP or VAA (e.g. "builds Meta-thinking", "builds Hard-working: perseverance"). Ground every target in the student's real data. Keep the language warm and clear so a parent can read it without a meeting. Do NOT invent data that wasn't given.`;

    const user = `Write a learning target for the next "${period || "week"}" for ${studentName || "the student"}.

Their recent activity (SIA analytics):
- Subjects & grades: ${subjLine}
- Study time this week: ${m.weekMinutes ?? 0} min
- Roadmap completion: ${m.roadmapPct ?? "—"}%
- Topic mastery average: ${m.avgScore ?? "—"}%
- Mock paper average: ${m.mockAvgPct ?? "—"}%
- Questions attempted: ${m.questionsAttempted ?? 0} (correct: ${m.questionsCorrect ?? 0})
- Weak topics flagged: ${m.weakTopics ?? 0}
- Current streak: ${m.currentStreak ?? 0} days

Focus the targets where the data shows the biggest opportunity (e.g. weak topics, low mock average, low study time, incomplete roadmap). Output via the tool.`;

    const args = await callAITool({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      tools: [targetTool],
      toolName: "write_student_target",
      temperature: 0.5,
      maxTokens: 800,
    });

    return new Response(JSON.stringify({ target: args?.target || "" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
