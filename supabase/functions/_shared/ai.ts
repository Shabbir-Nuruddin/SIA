// Unified AI tool-call helper: Gemini (primary) -> Groq (fallback).
// Both providers expose OpenAI-compatible chat/completions endpoints with tool calling.
import { callGroqTool } from "./groq.ts";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

const tryParseJson = (s: string) => { try { return JSON.parse(s); } catch { return null; } };

const recoverArgs = (raw: string) => {
  const tryIt = (s: string) => {
    const m = s.match(/\{[\s\S]*\}/);
    if (!m) return null;
    return tryParseJson(m[0])
      || tryParseJson(m[0].replace(/```json|```/g, "").trim())
      || tryParseJson(m[0].replace(/\\(?!["\\\/bfnrtu])/g, "\\\\"))
      || tryParseJson(m[0].replace(/\\(?!["\\\/bfnrtu])/g, "\\\\").replace(/[\u0000-\u001F\u007F]+/g, " "));
  };
  return tryIt(raw);
};

async function callGeminiTool({
  apiKey, messages, tools, toolName, temperature = 0.3, maxTokens = 8000,
}: {
  apiKey: string; messages: any[]; tools: any[]; toolName: string;
  temperature?: number; maxTokens?: number;
}) {
  let lastErr: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model, messages, tools,
          tool_choice: { type: "function", function: { name: toolName } },
          temperature, max_tokens: maxTokens,
        }),
      });
      const body = await res.text();
      if (!res.ok) {
        console.error("gemini error", { model, status: res.status, body: body.slice(0, 500) });
        lastErr = { status: res.status, body };
        continue;
      }
      const data = tryParseJson(body);
      const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      const parsed = typeof args === "string" ? recoverArgs(args) : null;
      if (parsed) {
        console.log("[ai] used gemini", model);
        return parsed;
      }
      console.error("gemini no parseable tool output", { model, body: body.slice(0, 500) });
    } catch (err) {
      console.error("gemini fetch error", err instanceof Error ? err.message : err);
      lastErr = err;
    }
  }
  throw lastErr || new Error("gemini failed");
}

export async function callAITool(opts: {
  messages: any[]; tools: any[]; toolName: string;
  temperature?: number; maxTokens?: number;
}) {
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  const groqKey = Deno.env.get("GROQ_API_KEY");

  if (geminiKey) {
    try {
      return await callGeminiTool({ apiKey: geminiKey, ...opts });
    } catch (e) {
      console.error("[ai] gemini failed, falling back to groq:", e);
    }
  }
  if (!groqKey) throw new Error("No AI provider configured (need GEMINI_API_KEY or GROQ_API_KEY)");
  console.log("[ai] using groq fallback");
  return await callGroqTool({ apiKey: groqKey, ...opts });
}

/** Strip LaTeX delimiters and convert common LaTeX to plain Unicode. */
export function stripLatex(s: string): string {
  if (!s) return s;
  let out = s;
  // Remove $$...$$ and $...$ delimiters but keep the inner content
  out = out.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
  out = out.replace(/\$([^$\n]+?)\$/g, "$1");
  // Remove \( \) and \[ \]
  out = out.replace(/\\\([\s\S]*?\\\)/g, (m) => m.slice(2, -2));
  out = out.replace(/\\\[[\s\S]*?\\\]/g, (m) => m.slice(2, -2));
  // Common LaTeX commands -> Unicode
  const map: [RegExp, string][] = [
    [/\\rightarrow|\\to\b/g, "→"],
    [/\\leftarrow/g, "←"],
    [/\\Rightarrow/g, "⇒"],
    [/\\leftrightarrow|\\rightleftharpoons/g, "⇌"],
    [/\\leq\b/g, "≤"], [/\\geq\b/g, "≥"],
    [/\\neq\b/g, "≠"], [/\\approx\b/g, "≈"],
    [/\\times\b/g, "×"], [/\\cdot\b/g, "·"], [/\\div\b/g, "÷"],
    [/\\pm\b/g, "±"], [/\\infty\b/g, "∞"],
    [/\\Delta\b/g, "Δ"], [/\\delta\b/g, "δ"],
    [/\\alpha\b/g, "α"], [/\\beta\b/g, "β"], [/\\gamma\b/g, "γ"],
    [/\\theta\b/g, "θ"], [/\\pi\b/g, "π"], [/\\mu\b/g, "μ"],
    [/\\rho\b/g, "ρ"], [/\\sigma\b/g, "σ"], [/\\omega\b/g, "ω"],
    [/\\lambda\b/g, "λ"], [/\\phi\b/g, "φ"], [/\\epsilon\b/g, "ε"],
    [/\\ominus\b/g, "⊖"], [/\\circ\b/g, "°"],
    [/\\sum\b/g, "Σ"], [/\\int\b/g, "∫"], [/\\sqrt\b/g, "√"],
    [/\\text\{([^}]*)\}/g, "$1"],
    [/\\mathrm\{([^}]*)\}/g, "$1"],
    [/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)"],
  ];
  for (const [re, rep] of map) out = out.replace(re, rep);
  // Superscripts: ^{...} or ^x  -> Unicode supers when digit/sign, else keep ^
  const sup: Record<string, string> = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻","+":"⁺" };
  out = out.replace(/\^\{([^}]+)\}/g, (_m, g) => [...g].map(c => sup[c] ?? `^${c}`).join(""));
  out = out.replace(/\^(-?\d)/g, (_m, g) => [...g].map(c => sup[c] ?? `^${c}`).join(""));
  // Subscripts
  const sub: Record<string, string> = { "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉" };
  out = out.replace(/_\{([^}]+)\}/g, (_m, g) => [...g].map(c => sub[c] ?? `_${c}`).join(""));
  out = out.replace(/_(\d)/g, (_m, g) => sub[g] ?? `_${g}`);
  // Strip leftover double backslashes -> newline
  out = out.replace(/\\\\/g, "\n");
  // Strip remaining single backslash commands
  out = out.replace(/\\([a-zA-Z]+)\b/g, "$1");
  return out;
}

export function deepStripLatex<T>(value: T): T {
  if (typeof value === "string") return stripLatex(value) as any;
  if (Array.isArray(value)) return value.map(deepStripLatex) as any;
  if (value && typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepStripLatex(v);
    return out;
  }
  return value;
}
