import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { callAITool, deepStripLatex } from "../_shared/ai.ts";
import { requireUser } from "../_shared/auth.ts";
import { CIE_ALEVEL_SYLLABUS } from "../_shared/cieial.ts";

// --- BOARD-SPECIFIC SYLLABUS IMPORTS ---
// These imports link the AI to the specific files you've moved to the _shared folder.
import {
  buildSystemPrompt as buildEdexcelIAL,
  buildImagePrompt as buildEdexcelIALImage,
  validateGeneratedNotes as validateEdexcelIAL,
  EDEXCEL_IAL_SYLLABUS
} from "../_shared/edexcelial.ts";

import {
  buildSystemPrompt as buildEdexcelIGCSE,
  buildImagePrompt as buildEdexcelIGCSEImage,
  validateGeneratedNotes as validateEdexcelIGCSE
} from "../_shared/edexceligcse.ts";

import {
  buildSystemPrompt as buildCIEIGCSE,
  buildImagePrompt as buildCIEIGCSEImage,
  validateGeneratedNotes as validateCIEIGCSE
} from "../_shared/cieigcse.ts";

// Fallback for CIE boards until their specific files are ready in _shared.
import {
  buildSystemPrompt as buildCIEGeneric,
  buildImagePrompt as buildCIEImage,
  findForbiddenKeywords as findCIEForbidden,
} from "../_shared/syllabus-boundaries.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- ENVIRONMENT VARIABLES ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// --- HELPER UTILITIES ---
const splitParagraphs = (s: string) =>
  String(s || "")
    .split(/\n\s*\n+|(?<=\.)\s+(?=[A-Z][a-z])/g)
    .map((p) => p.trim())
    .filter(Boolean);

const paragraphiseOverview = (s: string) => splitParagraphs(s).slice(0, 7).join("\n\n");

const isMathSubject = (subject: string) => /math/i.test(subject);

const normalizeMarks = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.min(12, Math.round(value)));
  const parsed = Number(String(value ?? "").match(/\d+/)?.[0] ?? 2);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(12, parsed)) : 2;
};

const normaliseNotes = (args: any, subject: string) => {
  const stripped: any = deepStripLatex(args || {});
  const overview = isMathSubject(subject)
    ? splitParagraphs(stripped.overview || "").slice(0, 2).join("\n\n")
    : paragraphiseOverview(stripped.overview || "");

  return {
    overview,
    key_definitions: Array.isArray(stripped.key_definitions) ? stripped.key_definitions : [],
    core_content: Array.isArray(stripped.core_content)
      ? stripped.core_content.map((c: any) => ({ ...c, typical_marks: normalizeMarks(c?.typical_marks) }))
      : [],
    equations: Array.isArray(stripped.equations) ? stripped.equations : [],
    visual_summary: null,
    examiner_tips: Array.isArray(stripped.examiner_tips) ? stripped.examiner_tips : [],
    flashcards: Array.isArray(stripped.flashcards) ? stripped.flashcards.slice(0, 10) : [],
  };
};

const findCieAlevelTopicKey = (subject: string, topicName: string, unitNumber: number): string | null => {
  const topics = CIE_ALEVEL_SYLLABUS[subject] || {};
  const wanted = String(topicName || "").toLowerCase().replace(/[–—]/g, "-");
  const entries = Object.entries(topics);
  const exact = entries.find(([, t]: any) => t.title.toLowerCase().replace(/[–—]/g, "-") === wanted);
  if (exact) return exact[0];
  const contains = entries.find(([, t]: any) => {
    const title = t.title.toLowerCase().replace(/[–—]/g, "-");
    return title.includes(wanted) || wanted.includes(title);
  });
  if (contains) return contains[0];
  const scoped = entries.find(([, t]: any) => (unitNumber >= 4 ? !t.asLevel : t.asLevel));
  return scoped?.[0] ?? null;
};

const buildCieAlevelPrompt = (subject: string, topicKey: string, specificTopic: string) => {
  const t = CIE_ALEVEL_SYLLABUS[subject]?.[topicKey];
  if (!t) throw new Error(`Critical Error: No CIE A Level syllabus data found for ${subject} > ${topicKey}`);
  const timestamp = new Date().toISOString();
  const seed = Math.floor(10000000 + Math.random() * 90000000).toString();
  const isMaths = /math/i.test(subject);
  const overviewRule = isMaths
    ? `OVERVIEW RULE (MATHS):
- Write the "overview" field as ONE OR TWO short sentences only — a quick description of what the topic is about. No theory paragraphs.
- Move all depth into "core_content": at least 8 worked examples covering different question types. For each: "statement" = the question, "worked_example" = full step-by-step solution (every algebraic step, use \\n between steps), "wrong_approach" = a specific student mistake.
- Include at least 4 entries in "equations" with full variable definitions and a numerical "worked_substitution".`
    : `OVERVIEW RULE (SCIENCE):
- Write the "overview" field as 5 to 7 paragraphs (blank-line separated) of student-friendly theory in the style of Save My Exams or Physics & Maths Tutor.
- Each paragraph: covers exactly ONE concept or mechanism; 4–6 sentences; define every technical term on first use.
- Tone: explain the WHY behind concepts; link cause and effect; use clear analogies where they genuinely aid understanding.
- Do NOT simply rephrase the ALLOWED TOPICS list — synthesise into explanation a student can read, understand and remember.
- Do NOT write essay-style flowing prose — each paragraph is a focused, structured conceptual block.`;
  return `You are a world-class Cambridge Assessment International Education (CAIE) Subject Expert and Examiner.
Your task is to generate high-fidelity study notes for CIE A LEVEL ${subject.toUpperCase()} — ${t.title} (${t.code}).
You must ONLY generate content about: ${specificTopic}

GENERATION TIMESTAMP: ${timestamp}
GENERATION SEED: ${seed}

### STERN RULES FOR CONTENT GENERATION:
1. Strict Scope: ONLY discuss topics listed in the ALLOWED TOPICS below.
2. Silent Exclusion: If a concept appears in FORBIDDEN TOPICS, act as if it does not exist. Do NOT mention you are skipping it.
3. No Cross-Contamination: Do not introduce content from other topics or qualifications.
4. Keyword Integration: Naturally integrate all REQUIRED KEYWORDS into your explanations.

### ${overviewRule}

### ALLOWED TOPICS (STRICT SCOPE):
${t.allowedTopics.map((x: string, i: number) => `${i + 1}. ${x}`).join("\n")}

### FORBIDDEN TOPICS (HARD BOUNDARY — DO NOT MENTION):
${(t.forbiddenTopics || []).map((x: string, i: number) => `${i + 1}. ${x}`).join("\n")}

### REQUIRED KEYWORDS:
${(t.requiredKeywords || []).join(", ")}

### CRITICAL EXAMINER BOUNDARY NOTES:
${(t.boundaryNotes || []).join("\n")}

${t.practicalNotes && t.practicalNotes.length > 0 ? `### PRACTICAL NOTES (Paper 3/5 context):\n${(t.practicalNotes as string[]).join("\n")}` : ""}

BOUNDARY RULES:
- If a concept appears in both this topic and another at different depths, only include the version for this topic.
- Every formula, definition and diagram description must trace directly to the ALLOWED TOPICS list.
- Structure: Overview → Definitions → Core Content → Equations → Examiner Tips → Flashcards`;
};

const validateCieAlevel = (notes: string, subject: string, topicKey: string) => {
  const t = CIE_ALEVEL_SYLLABUS[subject]?.[topicKey];
  if (!t) return { passed: false, forbiddenFound: ["Topic not found in syllabus database"] };
  const haystack = notes.toLowerCase();
  const hits = (t.forbiddenTopics || []).filter((f: string) => {
    const terms = f.match(/[A-Za-z][A-Za-z-]{7,}/g) || [];
    return terms.some((term: string) => haystack.includes(term.toLowerCase()));
  });
  return { passed: hits.length === 0, forbiddenFound: hits };
};

// --- STRUCTURED OUTPUT SCHEMA (THE UI THEME) ---
// This is the largest part of the code; I have expanded it fully to ensure quality.
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
          description: "5-8 paragraphs separated by blank lines, 4-6 sentences each." 
        },
        key_definitions: {
          type: "array", 
          minItems: 8,
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              mark_scheme: { type: "string" },
              plain_english: { type: "string" },
              common_mistake: { type: "string" },
            },
            required: ["term", "mark_scheme", "plain_english", "common_mistake"],
            additionalProperties: false,
          },
        },
        core_content: {
          type: "array",
          items: {
            type: "object",
            properties: {
              statement: { type: "string" },
              worked_example: { type: "string" },
              wrong_approach: { type: "string" },
              typical_marks: { type: "integer" },
            },
            required: ["statement", "worked_example", "wrong_approach", "typical_marks"],
            additionalProperties: false,
          },
        },
        equations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              equation: { type: "string" },
              variables: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    symbol: { type: "string" },
                    meaning: { type: "string" },
                    unit: { type: "string" },
                  },
                  required: ["symbol", "meaning", "unit"],
                  additionalProperties: false,
                },
              },
              worked_substitution: { type: "string" },
            },
            required: ["equation", "variables", "worked_substitution"],
            additionalProperties: false,
          },
        },
        examiner_tips: {
          type: "array", 
          minItems: 5,
          items: {
            type: "object",
            properties: { 
              command_word: { type: "string" }, 
              tip: { type: "string" } 
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
              a: { type: "string" } 
            },
            required: ["q", "a"],
            additionalProperties: false,
          },
        },
      },
      required: [
        "overview", "key_definitions", "core_content", "equations", 
        "examiner_tips", "flashcards"
      ],
      additionalProperties: false,
    },
  },
};

// --- LOGGING AND IMAGE FUNCTIONS ---
async function logGeneration(row: any) {
  try { 
    await admin.from("notes_generation_log").insert(row); 
  } catch (e) { 
    console.error("Database log failed:", e); 
  }
}

// --- MAIN EDGE FUNCTION HANDLER ---
serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json();
    const { subject, unit_number, unit_name, topic, syllabus_context, board, trigger } = body;
    const triggerKind = trigger === "cache_clear" ? "cache_clear" : "initial";

    // --- BOARD ROUTING ENGINE ---
    let systemPrompt = "";
    let validator: ((notes: string, subject: string, key: string) => { passed: boolean; forbiddenFound: string[] }) | null = null;
    let promptKey = `unit${unit_number}`;

    // Normalise subject keys coming from the client (e.g. "mathematics" -> "maths")
    const normalizedSubject = String(subject || "").toLowerCase() === "mathematics"
      ? "maths"
      : String(subject || "").toLowerCase();

    if (board === "edexcel-ial") {
      systemPrompt = buildEdexcelIAL(normalizedSubject, promptKey);
      validator = validateEdexcelIAL;
    } else if (board === "edexcel-igcse") {
      promptKey = `topic${unit_number}`;
      systemPrompt = buildEdexcelIGCSE(normalizedSubject, promptKey);
      validator = validateEdexcelIGCSE;
    } else if (board === "cie-igcse") {
      promptKey = `topic${unit_number}`;
      systemPrompt = buildCIEIGCSE(normalizedSubject, promptKey);
      validator = validateCIEIGCSE;
    } else if (board === "cie") {
      promptKey = findCieAlevelTopicKey(normalizedSubject, topic, Number(unit_number)) || `topic${unit_number}`;
      systemPrompt = buildCieAlevelPrompt(normalizedSubject, promptKey, topic);
      validator = validateCieAlevel;
    } else {
      const builtCIE = buildCIEGeneric({ qualification: board, subject, unit: unit_number, unitName: unit_name });
      systemPrompt = builtCIE.systemPrompt;
      validator = (notes: string) => {
        const hits = findCIEForbidden(JSON.parse(notes), builtCIE.forbiddenList);
        return { passed: hits.length === 0, forbiddenFound: hits };
      };
    }

    systemPrompt += `

OUTPUT STYLE RULES (non-negotiable — apply to every field):
- Overview: each paragraph covers exactly ONE concept or mechanism. 4–6 sentences. No flowing essay prose.
- Core content "statement": one complete testable fact per item. Use "→" for sequences (e.g. "Glucose → pyruvate → acetyl-CoA"). Use "Step 1: ... Step 2: ..." for mechanisms.
- Core content "worked_example": show reasoning step-by-step, with \\n between steps. Do NOT repeat the statement — show how to answer a real exam question.
- Core content "wrong_approach": name the specific misconception a student would have, and correct it.
- Definitions "mark_scheme": write as an examiner's mark scheme (credit-worthy phrases, not a textbook sentence).
- Examiner tips: each tip must map to ONE command word or one specific mark-scheme expectation — not generic study advice.
- For equations: use plain LaTeX inside $...$ delimiters only where needed. Do not escape backslashes incorrectly.
- Do not output HTML, SVG, Mermaid, markdown tables, or visual summaries.`;

    // --- CACHE LOOKUP / INVALIDATION ---
    const cacheBoard = String(board || "edexcel-ial");
    if (triggerKind === "cache_clear") {
      // Hard-delete the cached row so the next call is a true regeneration
      // against the latest syllabus rules.
      await admin.from("cached_topic_notes")
        .delete()
        .eq("board", cacheBoard)
        .eq("subject", subject)
        .eq("unit_number", unit_number)
        .eq("topic", topic);
    } else {
      const { data: cached } = await admin.from("cached_topic_notes")
        .select("content")
        .eq("board", cacheBoard)
        .eq("subject", subject)
        .eq("unit_number", unit_number)
        .eq("topic", topic)
        .maybeSingle();
      if (cached?.content) {
        return new Response(JSON.stringify(cached.content), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // --- AI GENERATION ---
    const userPrompt = `Generate comprehensive revision notes for the topic: ${topic}, ${unit_name} for ${board.toUpperCase()} ${subject.toUpperCase()}.
${syllabus_context ? `Official syllabus statements:\n${syllabus_context}\n` : ""}
Follow rules strictly. Generate readable revision notes only; do not generate diagrams, SVG, HTML, or visual summaries.`;

    const callOnce = async () =>
      normaliseNotes(await callAITool({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [notesTool],
        toolName: "create_topic_notes",
        temperature: 0.3,
        maxTokens: 8000,
      }), subject);

    let args = await callOnce();

    const validation = validator ? validator(JSON.stringify(args), normalizedSubject, promptKey) : { passed: true, forbiddenFound: [] };
    if (!validation.passed) {
      console.warn("Validation failed, retrying for compliance...", validation.forbiddenFound);
      args = await callOnce();
    }

    // --- LOGGING & PERSISTENCE ---
    await logGeneration({
      qualification: board,
      subject,
      unit_topic: promptKey,
      unit_topic_name: unit_name,
      seed: Math.floor(10000000 + Math.random() * 90000000).toString(),
      trigger: triggerKind,
      validation_passed: validation.passed,
      forbidden_keywords_found: validation.forbiddenFound
    });

    await admin.from("cached_topic_notes").upsert({
      board: cacheBoard,
      subject,
      unit_number,
      topic,
      content: args,
      updated_at: new Date().toISOString()
    });

    return new Response(JSON.stringify(args), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Fatal Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
