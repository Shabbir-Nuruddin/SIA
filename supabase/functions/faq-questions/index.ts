// Server-cached topical FAQ exam questions per (board, subject, topic).
// Generates with Groq once, then serves the cache forever.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { callGroqTool } from "../_shared/groq.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GROQ_KEY = Deno.env.get("GROQ_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

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

const tool = {
  type: "function",
  function: {
    name: "create_faq_questions",
    description: "Generate 3 realistic past-paper-style exam questions with mark schemes.",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              question_text: { type: "string" },
              marks: { type: "integer", description: "Realistic mark allocation: 2, 3, 4, 5 or 6 only." },
              mark_scheme: {
                type: "string",
                description:
                  "Mark scheme written EXACTLY like the official mark scheme: each marking point on its own new line, ending with (1). One line per mark. No prose. Example for 4 marks:\nMP1 — definition of activation energy as minimum energy (1)\nMP2 — collisions must have energy ≥ Ea (1)\nMP3 — orientation of collision must be correct (1)\nMP4 — increasing T raises proportion of molecules with E ≥ Ea (1)",
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!GROQ_KEY) {
    return new Response(JSON.stringify({ error: "AI not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { board, subject, topic } = await req.json();
    if (!board || !subject || !topic) {
      return new Response(JSON.stringify({ error: "missing parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cache lookup
    const { data: cached } = await admin
      .from("cached_faq_questions")
      .select("questions")
      .eq("board", board)
      .eq("subject", subject)
      .eq("topic", topic)
      .maybeSingle();
    if (cached?.questions) {
      return new Response(JSON.stringify({ questions: cached.questions, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const boardLabel = board === "cie" ? "Cambridge International (CIE) A Level" : "Edexcel International A-Level";
    const system = `You are a senior ${boardLabel} ${subject} examiner. You write ORIGINAL exam questions in the EXACT style, structure, command words and mark allocations of real ${boardLabel} past papers for the topic. Use UK English and proper mark-scheme phrasing.

ABSOLUTE RULES:
- Every question MUST be plausible as a real past-paper question. If a real exam never asks 6-mark questions on this micro-topic, do not invent one.
- Mark allocations MUST be realistic for the type of question asked. Definition recall: 1–2 marks. Short explain/describe: 3–4 marks. Calculation or extended explain: 4–6 marks.
- Mark schemes MUST be written like the official mark scheme: ONE marking point per line, each line ending with " (1)". No bullet symbols, no introductory prose, no commentary — just the marking points.
- Questions must be answerable as typed text — no drawing, sketching, plotting or labelling.
- Use proper LaTeX inside $...$ for any maths. Double-escape backslashes inside JSON strings (\\\\frac, \\\\rightarrow, \\\\Delta).`;

    const user = `Generate 3 distinct, realistic past-paper-style exam questions for ${boardLabel} ${subject}, topic: ${topic}.
Each question must use a different command word (Explain, Describe, Calculate, Compare, State, Suggest, Determine, Evaluate). Mark allocation must reflect what an actual past paper would award for that exact question. Output via the tool.`;

    const aiRes = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "create_faq_questions" } },
        temperature: 0.4,
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("groq error", aiRes.status, txt.slice(0, 400));
      return new Response(JSON.stringify({ error: aiRes.status === 429 ? "Rate limit hit." : "AI failed" }), {
        status: aiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const tc = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) {
      return new Response(JSON.stringify({ error: "AI returned no questions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let args: any;
    try {
      args = JSON.parse(tc.function.arguments);
    } catch {
      args = JSON.parse(tc.function.arguments.replace(/\\(?!["\\/bfnrtu])/g, "\\\\"));
    }

    // Persist to cache
    try {
      await admin
        .from("cached_faq_questions")
        .upsert(
          { board, subject, topic, questions: args.questions, updated_at: new Date().toISOString() },
          { onConflict: "board,subject,topic" },
        );
    } catch (e) {
      console.error("faq cache save failed", e);
    }

    return new Response(JSON.stringify({ questions: args.questions, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("faq-questions error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
