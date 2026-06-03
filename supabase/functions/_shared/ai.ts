// Unified AI tool-call helper: Gemini (primary, multi-key rotation) -> Groq (fallback).
// On 429 / quota errors, advances to the next GEMINI_API_KEY_N and persists the
// pointer in the public.ai_key_state table so the admin panel can see it.
import { callGroqTool } from "./groq.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

const tryParseJson = (s: string) => { try { return JSON.parse(s); } catch { return null; } };

const slimSchemaForGemini = (value: any): any => {
  if (Array.isArray(value)) return value.map(slimSchemaForGemini);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, any> = {};
  for (const [key, child] of Object.entries(value)) {
    // Gemini rejects large function schemas with verbose text/min-max constraints
    // as "too many states". The system prompt carries the detail; the wire schema
    // only needs shape + required fields.
    if (["description", "minItems", "maxItems"].includes(key)) continue;
    out[key] = slimSchemaForGemini(child);
  }
  return out;
};

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

/** Collect every Gemini key from env: GEMINI_API_KEY, GEMINI_API_KEY_1..GEMINI_API_KEY_20.
 *  Both the suffixless primary AND the numbered keys (starting at _1) are read, so any
 *  naming the admin used in Supabase secrets — GEMINI_API_KEY_1, _2, _3, … — is picked up. */
export function getGeminiKeys(): { name: string; value: string }[] {
  const out: { name: string; value: string }[] = [];
  const seen = new Set<string>();
  const add = (name: string) => {
    const v = Deno.env.get(name);
    if (v && !seen.has(v)) { seen.add(v); out.push({ name, value: v }); }
  };
  add("GEMINI_API_KEY");
  for (let i = 1; i <= 20; i++) add(`GEMINI_API_KEY_${i}`);
  return out;
}

let adminClient: ReturnType<typeof createClient> | null = null;
function getAdminClient() {
  if (adminClient) return adminClient;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  adminClient = createClient(url, key);
  return adminClient;
}

let cachedIndex: number | null = null;
async function loadIndex(total: number): Promise<number> {
  if (cachedIndex !== null) return Math.max(0, cachedIndex) % Math.max(1, total);
  const c = getAdminClient();
  if (!c) return 0;
  try {
    const { data } = await c.from("ai_key_state").select("current_index").eq("provider", "gemini").maybeSingle();
    cachedIndex = (data?.current_index as number) ?? 0;
    return cachedIndex % Math.max(1, total);
  } catch {
    return 0;
  }
}

async function persistState(currentIndex: number, total: number, lastError?: string) {
  cachedIndex = currentIndex;
  const c = getAdminClient();
  if (!c) return;
  try {
    await c.from("ai_key_state").upsert(
      {
        provider: "gemini",
        current_index: currentIndex,
        total_keys: total,
        last_rotated_at: new Date().toISOString(),
        last_error: lastError ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider" },
    );
  } catch (e) {
    console.error("[ai] failed to persist key state", e);
  }
}

const isQuotaError = (status: number, body: string) => {
  if (status === 429) return true;
  if (status === 403 && /quota|rate|limit|exceed/i.test(body)) return true;
  const low = body.toLowerCase();
  return low.includes("quota") || low.includes("rate limit") || low.includes("exceeded");
};

// Per-request wall-clock cap. A single hung upstream call must not stall the
// whole rotation (and trip Supabase's function timeout). The actual abort is
// the SMALLER of this cap and the time left in the caller's overall budget, so
// we never start a 60s attempt with only 10s of budget remaining.
const REQUEST_TIMEOUT_MS = 60_000;

async function callGeminiOnce({
  apiKey, model, messages, tools, toolName, temperature, maxTokens, deadline,
}: {
  apiKey: string; model: string; messages: any[]; tools: any[]; toolName: string;
  temperature: number; maxTokens: number; deadline: number;
}): Promise<{ ok: true; parsed: any } | { ok: false; status: number; body: string }> {
  const remaining = deadline - Date.now();
  if (remaining <= 1500) return { ok: false, status: 504, body: "no time budget remaining" };
  const timeoutMs = Math.min(REQUEST_TIMEOUT_MS, remaining);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model, messages, tools: slimSchemaForGemini(tools),
        tool_choice: { type: "function", function: { name: toolName } },
        temperature, max_tokens: maxTokens,
      }),
      signal: ctrl.signal,
    });
    const body = await res.text();
    if (!res.ok) return { ok: false, status: res.status, body };
    const data = tryParseJson(body);
    const finishReason = data?.choices?.[0]?.finish_reason;
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = typeof args === "string" ? recoverArgs(args) : null;
    if (parsed) return { ok: true, parsed };
    // A "length" finish_reason means the model ran out of output budget and the
    // tool JSON is truncated/unparseable — that is NOT a quota problem, so flag
    // it distinctly (status 502) and let the caller try a different model.
    if (finishReason === "length" || finishReason === "max_tokens") {
      return { ok: false, status: 502, body: `truncated output (finish_reason=${finishReason})` };
    }
    return { ok: false, status: 502, body: "no parseable tool output: " + body.slice(0, 300) };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    return {
      ok: false,
      status: aborted ? 504 : 0,
      body: aborted ? `request timed out after ${timeoutMs}ms` : (err instanceof Error ? err.message : String(err)),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function callGeminiWithRotation(opts: {
  messages: any[]; tools: any[]; toolName: string;
  temperature: number; maxTokens: number; deadline: number;
}) {
  const keys = getGeminiKeys();
  if (keys.length === 0) throw new Error("no gemini keys configured");

  const startIdx = await loadIndex(keys.length);
  let lastErr = "";

  // Try each key exactly once, starting from startIdx, wrapping around.
  // With N keys, attempts go: startIdx, startIdx+1, ..., N-1, 0, 1, ..., startIdx-1.
  for (let attempt = 0; attempt < keys.length; attempt++) {
    // Stop rotating once the overall time budget is spent — better to fall back
    // to Groq (or surface an error) than to keep starting calls we can't finish
    // before Supabase's function timeout fires.
    if (Date.now() >= opts.deadline) { lastErr = lastErr || "gemini time budget exhausted"; break; }
    const idx = (startIdx + attempt) % keys.length;
    const key = keys[idx];

    for (const model of GEMINI_MODELS) {
      if (Date.now() >= opts.deadline) { lastErr = lastErr || "gemini time budget exhausted"; break; }
      const r = await callGeminiOnce({ apiKey: key.value, model, deadline: opts.deadline, ...opts });
      if (r.ok) {
        // Persist the working key so next request starts here.
        await persistState(idx, keys.length);
        console.log(`[ai] used gemini ${model} via ${key.name} (key ${idx + 1}/${keys.length})`);
        return r.parsed;
      }
      lastErr = `[${key.name} ${model}] ${r.status} ${r.body.slice(0, 200)}`;
      console.error("gemini error", lastErr);
      // Quota/rate error: skip remaining models on this key, advance to next.
      if (isQuotaError(r.status, r.body)) break;
      // Non-quota error: try next model on same key.
    }
    // Advance pointer past the failed key so next request doesn't retry it immediately.
    const next = (idx + 1) % keys.length;
    await persistState(next, keys.length, lastErr);
  }

  // All keys exhausted. Advance pointer by one from startIdx so the next
  // request begins from a different key rather than the same one that led
  // the current round-robin to fail first.
  await persistState((startIdx + 1) % keys.length, keys.length, lastErr);
  throw new Error("all gemini keys exhausted: " + lastErr);
}

export async function callAITool(opts: {
  messages: any[]; tools: any[]; toolName: string;
  temperature?: number; maxTokens?: number;
  /** Total wall-clock budget for this whole call (all keys + fallback).
   *  Kept under Supabase's 150s function ceiling by the caller. */
  budgetMs?: number;
}) {
  const temperature = opts.temperature ?? 0.3;
  const maxTokens = opts.maxTokens ?? 8000;
  const startedAt = Date.now();
  const deadline = startedAt + (opts.budgetMs ?? 110_000);

  const groqKey = Deno.env.get("GROQ_API_KEY");
  // If Groq is available, reserve a slice of the budget for it so an exhausted
  // Gemini rotation still leaves enough time for the fallback to actually run.
  const geminiDeadline = groqKey
    ? Math.min(deadline, startedAt + Math.max(35_000, (deadline - startedAt) - 45_000))
    : deadline;

  if (getGeminiKeys().length > 0) {
    try {
      return await callGeminiWithRotation({ ...opts, temperature, maxTokens, deadline: geminiDeadline });
    } catch (e) {
      console.error("[ai] gemini exhausted/over budget, falling back to groq:", e);
    }
  }
  if (!groqKey) throw new Error("No AI provider available (all Gemini keys exhausted and no GROQ_API_KEY)");
  console.log("[ai] using groq fallback");
  return await callGroqTool({ apiKey: groqKey, ...opts, temperature, maxTokens, deadline });
}

// Native Gemini endpoint (the OpenAI-compat endpoint does NOT support the
// google_search grounding tool, so grounding must use generateContent).
const GEMINI_GENERATE_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/**
 * Best-effort grounded research: ask Gemini (with the google_search tool) to pull
 * current, source-backed facts for a topic. Returns plain text, or null if every
 * key is exhausted / the budget runs out. NEVER throws — grounding is an accuracy
 * booster layered before structured generation, so a failure must degrade silently
 * to ungrounded notes rather than break the request.
 */
export async function callGeminiGroundedResearch(opts: {
  prompt: string;
  maxTokens?: number;
  budgetMs?: number;
}): Promise<string | null> {
  const keys = getGeminiKeys();
  if (keys.length === 0) return null;
  const deadline = Date.now() + (opts.budgetMs ?? 35_000);
  const model = "gemini-2.5-flash";
  const startIdx = await loadIndex(keys.length);

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining < 4000) break;
    const key = keys[(startIdx + attempt) % keys.length];
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(REQUEST_TIMEOUT_MS, remaining));
    try {
      const res = await fetch(`${GEMINI_GENERATE_URL(model)}?key=${key.value}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.2, maxOutputTokens: opts.maxTokens ?? 2048 },
        }),
        signal: ctrl.signal,
      });
      const body = await res.text();
      if (!res.ok) {
        console.warn(`[ai] grounded research ${res.status} via ${key.name}: ${body.slice(0, 120)}`);
        continue; // try the next key
      }
      const data = tryParseJson(body);
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = Array.isArray(parts) ? parts.map((p: any) => p?.text || "").join("").trim() : "";
      if (text) return text;
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      console.warn(`[ai] grounded research ${aborted ? "timed out" : "error"} via ${key.name}`);
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

/** Strip LaTeX delimiters and convert common LaTeX to plain Unicode. */
export function stripLatex(s: string): string {
  if (!s) return s;
  let out = s;
  out = out.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
  out = out.replace(/\$([^$\n]+?)\$/g, "$1");
  out = out.replace(/\\\([\s\S]*?\\\)/g, (m) => m.slice(2, -2));
  out = out.replace(/\\\[[\s\S]*?\\\]/g, (m) => m.slice(2, -2));
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
  const sup: Record<string, string> = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻","+":"⁺" };
  out = out.replace(/\^\{([^}]+)\}/g, (_m, g) => [...g].map(c => sup[c] ?? `^${c}`).join(""));
  out = out.replace(/\^(-?\d)/g, (_m, g) => [...g].map(c => sup[c] ?? `^${c}`).join(""));
  const sub: Record<string, string> = { "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉" };
  out = out.replace(/_\{([^}]+)\}/g, (_m, g) => [...g].map(c => sub[c] ?? `_${c}`).join(""));
  out = out.replace(/_(\d)/g, (_m, g) => sub[g] ?? `_${g}`);
  out = out.replace(/\\\\/g, "\n");
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
