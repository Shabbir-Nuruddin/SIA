import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAITool } from "../_shared/ai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subjects, weakTopics, availableSlots, hoursPerDay } = await req.json();

    const system = `You are a smart revision planner for A-Level students. 
Generate a realistic weekly study plan in JSON format based on the student's availability and weak topics.
Return ONLY valid JSON — no markdown, no explanation, no code blocks. Just the raw JSON array.`;

    const user = `Create a weekly study plan for an A-Level student.

SUBJECTS: ${(subjects as string[]).join(", ")}
WEAK TOPICS (prioritise these — give them 2x more sessions): ${JSON.stringify(weakTopics)}
AVAILABLE SLOTS THIS WEEK: ${(availableSlots as string[]).join(", ")}
HOURS PER AVAILABLE DAY: ${hoursPerDay}

Return a JSON array of session objects. Each object must have:
- day: one of "Mon","Tue","Wed","Thu","Fri","Sat","Sun"
- slot: one of "morning","afternoon","evening"  
- subject: full subject name (e.g. "Chemistry")
- subjectCode: subject code (e.g. "chemistry","biology","physics","mathematics")
- topic: specific topic name
- sessionType: one of "New Material","Review","Practice","Mock"

Rules:
1. Only use slots from AVAILABLE SLOTS — do not include blocked slots
2. Weak topics must appear at least twice as often as strong topics
3. Vary session types: start with New Material, then Review, then Practice. Mock sessions once per week per subject.
4. Spread subjects across the week — don't cluster the same subject on consecutive slots
5. Generate sessions for ALL available slots

Return ONLY the JSON array, nothing else.`;

    const tool = {
      type: "function",
      function: {
        name: "create_study_plan",
        description: "Creates a weekly study plan",
        parameters: {
          type: "object",
          properties: {
            plan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  slot: { type: "string" },
                  subject: { type: "string" },
                  subjectCode: { type: "string" },
                  topic: { type: "string" },
                  sessionType: { type: "string" },
                },
                required: ["day", "slot", "subject", "subjectCode", "topic", "sessionType"],
              },
            },
          },
          required: ["plan"],
        },
      },
    };

    let args: any;
    try {
      args = await callAITool({
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [tool],
        toolName: "create_study_plan",
        temperature: 0.4,
        maxTokens: 4000,
      });
    } catch (err) {
      console.error("[generate-study-plan] AI error:", err);
      // Return empty so client uses fallback
      return new Response(JSON.stringify({ plan: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ plan: args?.plan ?? null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[generate-study-plan] error:", err?.message ?? err);
    return new Response(JSON.stringify({ error: err?.message ?? "Unknown error", plan: null }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
