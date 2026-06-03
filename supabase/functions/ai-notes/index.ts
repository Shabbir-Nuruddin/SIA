import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { callAITool, callGeminiGroundedResearch } from "../_shared/ai.ts";
import { getAuthoredBrief } from "../_shared/authoredNotes.ts";
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
// Preserve the structured overview (## sub-topic headings + "- " fact bullets).
// We deliberately do NOT sentence-split here: the old regex shredded the
// heading/bullet structure into fragments, which is exactly what produced the
// vague "this unit contains..." reading. We only tidy whitespace and strip any
// throat-clearing intro line the model emits despite instructions.
const cleanOverview = (s: string) => {
  let text = String(s || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  // Drop a leading essay-style intro paragraph if it appears before the first
  // "## " sub-topic heading (model ignored the no-preamble rule).
  const firstHeading = text.indexOf("## ");
  if (firstHeading > 0) {
    const preamble = text.slice(0, firstHeading);
    if (/^(in this|this (unit|topic|chapter)|here we|we will|overview)/i.test(preamble.trim())) {
      text = text.slice(firstHeading).trim();
    }
  }
  return text;
};

const isMathSubject = (subject: string) => /math/i.test(subject);

const normalizeMarks = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.min(12, Math.round(value)));
  const parsed = Number(String(value ?? "").match(/\d+/)?.[0] ?? 2);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(12, parsed)) : 2;
};

const normaliseNotes = (args: any, subject: string) => {
  // NOTE: we intentionally do NOT strip LaTeX here. The frontend renders math with
  // KaTeX (formatText.ts), so preserving "$...$" / \frac / \sqrt / \ge etc. gives
  // proper fractions, roots and symbols. Stripping previously produced "(1)/(x)",
  // "√{x}" and a literal "ge" instead of ≥.
  const stripped: any = args || {};
  const overview = cleanOverview(stripped.overview || "");

  return {
    overview,
    key_definitions: Array.isArray(stripped.key_definitions) ? stripped.key_definitions : [],
    core_content: Array.isArray(stripped.core_content)
      ? stripped.core_content.slice(0, 12).map((c: any) => ({ ...c, typical_marks: normalizeMarks(c?.typical_marks) }))
      : [],
    reactions: Array.isArray(stripped.reactions)
      ? stripped.reactions
          .filter((r: any) => r && (r.reaction || r.equation))
          .slice(0, 16)
          .map((r: any) => ({
            reaction: String(r.reaction ?? r.equation ?? ""),
            conditions: String(r.conditions ?? ""),
            observation: String(r.observation ?? r.colour_change ?? ""),
            type: String(r.type ?? ""),
          }))
      : [],
    equations: Array.isArray(stripped.equations) ? stripped.equations : [],
    graphs: Array.isArray(stripped.graphs)
      ? stripped.graphs
          .slice(0, 3)
          .map((g: any) => ({
            title: String(g?.title ?? ""),
            x_label: String(g?.x_label ?? ""),
            y_label: String(g?.y_label ?? ""),
            caption: String(g?.caption ?? ""),
            curves: (Array.isArray(g?.curves) ? g.curves : [])
              .map((c: any) => ({
                label: String(c?.label ?? ""),
                points: (Array.isArray(c?.points) ? c.points : [])
                  .map((p: any) => ({ x: Number(p?.x), y: Number(p?.y) }))
                  .filter((p: any) => Number.isFinite(p.x) && Number.isFinite(p.y))
                  .slice(0, 60),
              }))
              .filter((c: any) => c.points.length >= 2),
          }))
          .filter((g: any) => g.curves.length > 0)
      : [],
    visual_summary: null,
    examiner_tips: Array.isArray(stripped.examiner_tips) ? stripped.examiner_tips : [],
    flashcards: Array.isArray(stripped.flashcards) ? stripped.flashcards.slice(0, 8) : [],
    // NOTE: schema caps flashcards at 8; slice mirrors it as a safety net.
    reference_tables: Array.isArray(stripped.reference_tables)
      ? stripped.reference_tables.filter((t: any) => t?.title && Array.isArray(t?.headers) && Array.isArray(t?.rows))
      : [],
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
    ? `OVERVIEW RULE (MATHS) — concise method summary in bullets (NOT one sentence, NOT long theory):
- Structure the "overview" as 3–5 "## Sub-topic" headings, each with 3–6 "- " bullets stating the KEY methods, formulae, rules and results a student must know for this topic (e.g. the laws/identities, the standard technique, conditions, common results). Keep each bullet short and exam-critical — this is a quick-reference, the full worked depth goes in core_content.
- START with the first "## " heading; never open with "This unit covers..." or any preamble sentence.
- Move all worked depth into "core_content": at least 8 worked examples covering different question types. For each: "statement" = the question, "worked_example" = full step-by-step solution (every algebraic step, use \\n between steps), "wrong_approach" = a specific student mistake.
- Include at least 4 entries in "equations" with full variable definitions and a numerical "worked_substitution".`
    : `OVERVIEW RULE (SCIENCE) — ZNotes/Save My Exams/PMT style:
- The overview IS the main revision summary, not an introduction. Structure it as 4–7 sub-topics.
- For EACH sub-topic write a heading line in the EXACT form "## Sub-Topic Name" (markdown H2), then 4–8 fact lines each starting with "- ".
- Each bullet = ONE complete, testable fact with real content (value, rule, mechanism step, the reason WHY). Use → for sequences/observations. Use numbered steps for mechanisms.
- Define key terms in-line on first use. The overview MUST begin with the first "## " heading — NEVER write "This topic covers" or any preamble. NO essay prose, NO padding.
- REACTIONS go in the "reactions" field (balanced equation + conditions + observation), not buried in prose. TECHNIQUES (MS, NMR, IR, titrations) get a worked walkthrough in "core_content".
- Tone: direct, exam-focused, like a PMT or ZNotes revision page.`;
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
          description:
            "The MAIN teaching summary, written like a ZNotes / Save My Exams revision page — NOT an essay and NOT a description of the unit. " +
            "Structure it as 4–7 sub-topics. For EACH sub-topic write a heading line in the exact form '## Sub-topic name', then 4–8 fact lines each starting with '- '. " +
            "Every bullet must be ONE complete, testable fact carrying real content (a value, a rule, a mechanism step, the WHY) — never filler like 'is important' or 'will be covered'. " +
            "Use '→' for sequences and colour/observation changes. Define key terms inline on first use. " +
            "The text MUST begin with the first '## ' heading. NEVER open with 'This unit contains', 'In this topic', 'This chapter', or any preamble.",
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
          minItems: 6,
          maxItems: 12,
          description:
            "The deep, exam-applied layer: 6–12 items, each a HARD spec point that students must be able to DO under exam conditions. " +
            "Prioritise techniques that need a worked walkthrough — e.g. reading a mass spectrum (M⁺ peak = highest m/z = Mr; base peak = tallest), deducing structure from ¹H NMR (n+1 rule, chemical shift, integration), identifying functional groups from IR ranges, calculating from a titration, mechanism steps. Do NOT waste items on facts already covered as bullets in the overview.",
          items: {
            type: "object",
            properties: {
              statement: { type: "string", description: "One complete, testable exam skill or fact for this spec point." },
              worked_example: { type: "string", description: "REQUIRED — NEVER empty. Write a specific exam-style question on this fact, then the full mark-scheme answer step-by-step (use \\n between steps). For science: show how to apply the fact to a real exam question (e.g. 'Q: A compound has M⁺ at m/z 46 and a peak at 31... Answer: Step 1 the molecular ion at 46 = Mr → ...'). For maths: show the full algebraic working." },
              wrong_approach: { type: "string", description: "REQUIRED — NEVER empty. Name the exact misconception students have and correct it in one sentence." },
              typical_marks: { type: "integer" },
            },
            required: ["statement", "worked_example", "wrong_approach", "typical_marks"],
            additionalProperties: false,
          },
        },
        reactions: {
          type: "array",
          description:
            "Reactions students must memorise. REQUIRED and substantial for chemistry topics involving reactions (transition metals, organic, redox, etc.) — aim for every reaction on the spec for this topic. Use an empty array [] only for topics with no reactions (most maths/physics). " +
            "Each entry is a balanced equation plus what is observed. Lay them out like the ZNotes reaction tables: include the reagent/conditions and the colour/precipitate/gas change.",
          items: {
            type: "object",
            properties: {
              reaction: { type: "string", description: "Balanced equation with state symbols where relevant, e.g. '[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O'." },
              conditions: { type: "string", description: "Reagents / catalyst / temperature, e.g. 'excess NH₃(aq)', 'conc HNO₃ + conc H₂SO₄, <55°C'. Empty string if none." },
              observation: { type: "string", description: "What is seen, e.g. 'Blue solution → deep blue solution' or 'white precipitate, soluble in excess'. Empty string if none." },
              type: { type: "string", description: "Reaction type/label, e.g. 'Ligand exchange', 'Redox', 'Deprotonation', 'Nitration (EAS)'." },
            },
            required: ["reaction", "conditions", "observation", "type"],
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
          minItems: 8,
          maxItems: 8,
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
        reference_tables: {
          type: "array",
          description: "Structured reference tables for memorisable data: ion colours, flame tests, ligand reactions, reagent outcomes, standard values, etc. Only include when the topic contains data that students must memorise verbatim for exam questions. Leave empty for pure theory topics.",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Short descriptive title, e.g. 'Transition Metal Ion Colours in Aqueous Solution'" },
              headers: { type: "array", items: { type: "string" }, description: "Column headers" },
              rows: {
                type: "array",
                items: { type: "array", items: { type: "string" } },
                description: "Each inner array is one row; entries must match the number of headers",
              },
              caption: { type: "string", description: "Optional short note about scope or exam relevance" },
            },
            required: ["title", "headers", "rows"],
            additionalProperties: false,
          },
        },
      },
      required: [
        "overview", "key_definitions", "core_content", "reactions", "equations",
        "examiner_tips", "flashcards", "reference_tables"
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
    const { subject, unit_number, unit_name, unit_code, topic, syllabus_context, trigger } = body;
    // Some callers (e.g. the Roadmap workspace) omit `board`. Default it instead of
    // letting `board.toUpperCase()` below throw and 500 the whole request.
    const board: string = body.board || "edexcel-ial";
    const triggerKind = trigger === "cache_clear" ? "cache_clear" : "initial";

    // --- SUBJECT NORMALISATION ---
    // All syllabus files use "maths" as the key; the client sends "mathematics".
    const ns = String(subject || "").toLowerCase() === "mathematics"
      ? "maths"
      : String(subject || "").toLowerCase();
    const isMaths = ns === "maths";

    // For Edexcel IAL maths the syllabus uses paper codes (p1, p2, m1, s1 …)
    // rather than unit1/unit2 …  The client passes unitCode "P1", "P2" etc.
    // For IGCSE maths the syllabus uses topic-name keys (number, algebra …).
    const deriveMathsKey = (): string => {
      // 1. Client-sent unitCode is the most reliable source ("P1" → "p1")
      if (unit_code) return String(unit_code).toLowerCase().replace(/\s+/g, "");
      // 2. Hardcoded fallback for Edexcel IAL maths unit numbers
      //    Covers the case where unit_code was not sent (old clients / cache-clear)
      const ialMathsMap: Record<string, string> = {
        "1":"p1","2":"p2","3":"p3","4":"p4",
        "5":"m1","6":"m2","7":"s1","8":"s2",
      };
      const mapped = ialMathsMap[String(unit_number)];
      if (mapped) return mapped;
      // 3. Derive from unit_name as last resort (works for IGCSE "Number","Algebra"…)
      if (unit_name) return String(unit_name).toLowerCase().replace(/[^a-z]/g, "");
      return `unit${unit_number}`;
    };

    // --- BOARD ROUTING ENGINE ---
    let systemPrompt = "";
    let validator: ((notes: string, subject: string, key: string) => { passed: boolean; forbiddenFound: string[] }) | null = null;
    let promptKey = `unit${unit_number}`;

    if (board === "edexcel-ial") {
      promptKey = isMaths ? deriveMathsKey() : `unit${unit_number}`;
      systemPrompt = buildEdexcelIAL(ns, promptKey);
      // Wrap validator to use normalised subject
      validator = (notes: string, _s: string, key: string) => validateEdexcelIAL(notes, ns, key);
    } else if (board === "edexcel-igcse") {
      promptKey = isMaths ? deriveMathsKey() : `topic${unit_number}`;
      systemPrompt = buildEdexcelIGCSE(ns, promptKey);
      validator = (notes: string, _s: string, key: string) => validateEdexcelIGCSE(notes, ns, key);
    } else if (board === "cie-igcse") {
      promptKey = isMaths ? deriveMathsKey() : `topic${unit_number}`;
      systemPrompt = buildCIEIGCSE(ns, promptKey);
      validator = (notes: string, _s: string, key: string) => validateCIEIGCSE(notes, ns, key);
    } else if (board === "cie") {
      promptKey = findCieAlevelTopicKey(ns, topic, Number(unit_number)) || `topic${unit_number}`;
      systemPrompt = buildCieAlevelPrompt(ns, promptKey, topic);
      validator = (notes: string, _s: string, key: string) => validateCieAlevel(notes, ns, key);
    } else {
      const builtCIE = buildCIEGeneric({ qualification: board, subject: ns, unit: unit_number, unitName: unit_name });
      systemPrompt = builtCIE.systemPrompt;
      validator = (notes: string) => {
        const hits = findCIEForbidden(JSON.parse(notes), builtCIE.forbiddenList);
        return { passed: hits.length === 0, forbiddenFound: hits };
      };
    }

    // For practical/synoptic units, explicitly tell the AI about reference tables
    const isPracticalUnit = /practical|skill|lab|WCH16|WCH13|WBI13|WBI16|WPH13|WPH16/i.test(systemPrompt);
    const hasTransitionMetals = /transition metal|vanadium|chromium|manganese|iron|cobalt|nickel|copper|ligand|complex ion/i.test(systemPrompt);

    const referenceTableInstructions = (isPracticalUnit || hasTransitionMetals)
      ? `
REFERENCE TABLES — REQUIRED for this unit:
- This unit contains data students must memorise verbatim. You MUST populate the "reference_tables" array.
- Generate one table per distinct category of memorisable data.
${hasTransitionMetals ? `- MANDATORY TABLE 1: "Transition Metal Ion Colours" — columns: Ion | Oxidation State | Colour in aqueous solution | Formula/complex. Include all: V²⁺ violet, V³⁺ green, VO²⁺ blue, VO₂⁺ yellow, Cr³⁺ green, Cr₂O₇²⁻ orange, CrO₄²⁻ yellow, Mn²⁺ pale pink, MnO₄⁻ purple, Fe²⁺ pale green, Fe³⁺ yellow-brown, Co²⁺ pink, Ni²⁺ green, Cu²⁺ blue, Zn²⁺ colourless.
- MANDATORY TABLE 2: "Complex Ion Colours with Ligands" — columns: Central Ion | Ligand | Formula | Colour. Include: [Cu(H₂O)₆]²⁺ pale blue; [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue; [CuCl₄]²⁻ yellow-green; [Fe(H₂O)₆]²⁺ pale green; [Fe(H₂O)₆]³⁺ yellow-brown; [Fe(SCN)]²⁺ blood red; [Co(H₂O)₆]²⁺ pink; [CoCl₄]²⁻ blue; [Cr(H₂O)₆]³⁺ green; [Cr(NH₃)₆]³⁺ yellow; [Ti(H₂O)₆]³⁺ purple.
- MANDATORY TABLE 3: "Precipitate Colours with NaOH and NH₃" — columns: Ion | Precipitate with NaOH | Precipitate Colour | With excess NH₃. Include all transition metals.` : ""}
${isPracticalUnit ? `- Generate tables for any other memorisable practical data: indicator colours, reagent colours, test results, solubility rules, flame test colours (Li red, Na yellow, K lilac, Ca brick-red, Sr crimson, Ba pale green, Cu green).` : ""}
- Each row must be complete and exam-accurate. No approximations.`
      : `
REFERENCE TABLES: Only populate "reference_tables" if this topic contains data students must memorise verbatim (colours, specific values, test outcomes). Leave it as an empty array [] if the topic is purely theoretical.`;

    systemPrompt += `

OUTPUT STYLE RULES (non-negotiable — apply to every field):
- Overview: the MAIN revision summary, ZNotes / Save My Exams style — DENSE BULLETS, NEVER paragraphs. STRICT FORMAT: every single line is EITHER a "## Sub-topic name" heading OR a "- " fact bullet. A line of flowing prose = a FAILURE; rewrite it as bullets. Write 4–7 sub-topics, each with 4–8 bullets. Each bullet = ONE complete, testable, exam-critical fact (a value, equation, rule, mechanism step, observation, or the reason WHY). Use "→" for sequences/observations. Define a term inline only the first time it is genuinely new.
- Overview — LEAD WITH WHAT IS NEW AND ASSESSED for THIS exact topic; do NOT pad with assumed prior-unit basics. E.g. for "Entropy" do NOT re-explain exothermic/endothermic or enthalpies of formation/atomisation — go straight to: ΔS_system, ΔS_surroundings = −ΔH/T, ΔS_total = ΔS_system + ΔS_surroundings (spontaneous when ΔS_total > 0), ΔG = ΔH − TΔS, feasibility (ΔG < 0), T = ΔH/ΔS, and ΔG = −RT ln K. For "Kinetics" lead with the Maxwell–Boltzmann curve, Ea, collision theory and the rate factors — not generic definitions.
- Overview — START with the first "## " heading. NEVER open with "This unit focuses on", "You will learn", "In this topic", "This involves" or any preamble.
- Overview — MATCH THIS EXACT FORMAT AND DENSITY (this is the standard; do not deviate):
## Variable Oxidation States
- Lose 4s electrons before 3d → e.g. Fe forms +2 ([Ar]3d⁶) and +3 ([Ar]3d⁵)
- Small 4s/3d energy gap → several stable states (Mn +2,+4,+7; Cr +3,+6; V +2→+5)
## Complex Ions & Colour
- Ligand = species donating a lone pair to the central metal ion (dative bond); coordination number = number of dative bonds
- Colour from d–d transitions: ligand splits the d-orbitals → electron absorbs one wavelength of visible light → complementary colour is seen
- Reactions: for chemistry topics that involve reactions you MUST populate "reactions" thoroughly — give the balanced equation, the conditions/reagents, and the observation (colour change / precipitate / gas), exactly like a ZNotes reaction table. Cover every reaction on the spec for this topic, including each transition metal where relevant. Leave "reactions" empty ONLY for topics with genuinely no reactions.
- Core content "statement": one complete testable skill/fact per item. Prioritise techniques that need a walkthrough (reading a mass spectrum, deducing structure from NMR splitting + integration + chemical shift, identifying functional groups from IR, titration calculations, mechanism steps). Use "→" for sequences. Use "Step 1: ... Step 2: ..." for procedures.
- Core content "worked_example": MANDATORY — NEVER leave empty. Write (1) a specific exam question on this fact, then (2) the full mark-scheme answer with every step on a new line using \\n. Make spectroscopy/technique examples concrete (e.g. "the molecular ion peak is the highest-mass m/z, so Mr = 46; the peak at m/z 31 = CH₂OH⁺ ...").
- Core content "wrong_approach": MANDATORY — NEVER leave empty. Name the exact misconception and correct it concisely.
- Definitions "mark_scheme": write as an examiner's mark scheme (credit-worthy phrases, not a textbook sentence).
- Examiner tips: each tip must map to ONE command word or one specific mark-scheme expectation — not generic study advice.
- MATH FORMATTING (CRITICAL): wrap EVERY mathematical expression, fraction, power, root, subscript and inequality in $...$ LaTeX. Examples: $x + \\frac{1}{x} \\ge 2$, $\\sqrt{x}$, $x^2 - 2x + 1$, $\\frac{dy}{dx}$, $H_2O$, $\\Delta H$. Use $\\ge$ $\\le$ $\\ne$ $\\times$ $\\rightarrow$ — NEVER write the bare words "ge"/"le" or bare backslash commands outside $...$. Every $ must be paired.
- Do not output HTML, SVG, Mermaid, markdown tables, or visual summaries.
${referenceTableInstructions}`;

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
    // Overall wall-clock budget for this invocation (declared early so the grounded
    // research step can size itself against the remaining time).
    const fnStart = Date.now();
    const FN_BUDGET_MS = 135_000;
    const remainingBudget = () => Math.max(20_000, FN_BUDGET_MS - (Date.now() - fnStart));

    // --- STEP 1: SOURCE CONTENT (authored-first) ---
    // Preferred path: an expert-authored, spec-accurate brief for THIS exact topic.
    // When present, the model formats it rather than inventing content — accurate,
    // on-topic, on-level and fast (one call, no web round-trip). Falls back to
    // optional web grounding only when no brief exists AND grounding is enabled.
    const authoredBrief = getAuthoredBrief(board, ns, unit_number, topic);
    // Web grounding is OFF by default: on the free Gemini tier it doubles quota use
    // and latency (a whole extra call) and was a major cause of "notes generate
    // nothing / take ages". Flip to true only if you have paid quota headroom.
    const ENABLE_GROUNDING = false;
    let researchBrief: string | null = null;
    if (authoredBrief) {
      console.log("[ai-notes] using AUTHORED brief", { topic, chars: authoredBrief.length });
    } else if (ENABLE_GROUNDING && remainingBudget() > 95_000) {
      const researchPrompt = `Research exam-board-accurate facts for ${board.toUpperCase()} ${subject.toUpperCase()} — ${unit_name}, topic "${topic}" (Save My Exams, PMT, ZNotes, the spec, past papers). Tight factual bullets only: exact definitions/values, key equations/reactions with conditions and observed changes, worked techniques, common mark-scheme phrasing, common mistakes. Stay strictly within the ${board.toUpperCase()} spec for THIS topic.`;
      researchBrief = await callGeminiGroundedResearch({ prompt: researchPrompt, maxTokens: 1800, budgetMs: 30_000 });
      if (researchBrief) console.log("[ai-notes] grounded research attached", { topic, chars: researchBrief.length });
    }

    const sourceBlock = authoredBrief
      ? `\nAUTHORITATIVE, EXAM-ACCURATE CONTENT FOR THE EXACT TOPIC "${topic}" (written by subject experts to the ${board.toUpperCase()} specification). BUILD THE ENTIRE NOTE ON THIS: format it into the required fields, write the worked examples / flashcards / reactions FROM IT, and keep it exam-specific. You MAY add brief clarifying detail, but DO NOT introduce content outside this brief's scope and DO NOT pull in other topics from this unit:\n${authoredBrief}\n`
      : researchBrief
        ? `\nVERIFIED REFERENCE FACTS (use to keep every field accurate and exam-specific; integrate, do NOT copy verbatim, do NOT add a sources list):\n${researchBrief}\n`
        : "";

    const userPrompt = `Generate comprehensive revision notes for the topic: "${topic}" (${unit_name}) for ${board.toUpperCase()} ${subject.toUpperCase()}.

STRICT SCOPE — generate notes about ONLY the topic "${topic}". This unit contains other topics, but you MUST NOT include them or their content. (For example, if the topic is "Organic Synthesis" do NOT write about electrode potentials or transition-metal ion colours; if the topic is "Kinetics" cover the A2 rate-equation/orders/Arrhenius material for this unit, NOT AS-level collision theory / Maxwell–Boltzmann unless this exact topic requires it.)
${syllabus_context ? `\nOfficial syllabus statements:\n${syllabus_context}\n` : ""}${sourceBlock}
Follow the rules strictly. Generate readable revision notes only; do not generate diagrams, SVG, HTML, or visual summaries.`;

    // callAITool shrinks its own attempt timeouts to fit whatever budget remains
    // (fnStart / FN_BUDGET_MS / remainingBudget declared above, before research).
    const callOnce = async () =>
      normaliseNotes(await callAITool({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [notesTool],
        toolName: "create_topic_notes",
        temperature: 0.3,
        // The notes schema (structured overview, 8+ definitions, up to 12 worked
        // core_content items, a reactions list, equations, 8 flashcards, reference
        // tables) is large; starving it truncates into unparseable JSON. 16k gives
        // ample headroom for a complete payload while capping worst-case latency so
        // a single generation reliably finishes inside the function budget.
        maxTokens: 16000,
        budgetMs: remainingBudget(),
      }), subject);

    let args = await callOnce();

    const check = (a: any) => validator ? validator(JSON.stringify(a), ns, promptKey) : { passed: true, forbiddenFound: [] };
    let validation = check(args);
    if (!validation.passed) {
      // One compliance retry — but ONLY when enough budget remains for a second
      // full generation. Running two long generations back-to-back is exactly what
      // pushed past the 150s idle limit before. If time is short we keep the first
      // (best-effort) result rather than risk a timeout. The retry is re-validated
      // and adopted only if it is actually cleaner.
      if (remainingBudget() > 55_000) {
        console.warn("Validation failed, retrying for compliance...", validation.forbiddenFound);
        const retry = await callOnce();
        const retryValidation = check(retry);
        if (retryValidation.passed || retryValidation.forbiddenFound.length < validation.forbiddenFound.length) {
          args = retry;
          validation = retryValidation;
        }
      } else {
        console.warn("Validation failed but skipping retry — insufficient time budget, returning best-effort notes.", validation.forbiddenFound);
      }
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
