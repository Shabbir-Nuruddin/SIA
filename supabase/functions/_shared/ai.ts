// Unified AI tool-call helper: Gemini (primary, multi-key rotation) -> Groq (fallback).
// On 429 / quota errors, advances to the next GEMINI_API_KEY_N and persists the
// pointer in the public.ai_key_state table so the admin panel can see it.
import { callGroqTool } from "./groq.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

/** Collect every Gemini key from env: GEMINI_API_KEY, GEMINI_API_KEY_2..GEMINI_API_KEY_20 */
export function getGeminiKeys(): { name: string; value: string }[] {
  const out: { name: string; value: string }[] = [];
  const primary = Deno.env.get("GEMINI_API_KEY");
  if (primary) out.push({ name: "GEMINI_API_KEY", value: primary });
  for (let i = 2; i <= 20; i++) {
    const v = Deno.env.get(`GEMINI_API_KEY_${i}`);
    if (v) out.push({ name: `GEMINI_API_KEY_${i}`, value: v });
  }
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

async function callGeminiOnce({
  apiKey, model, messages, tools, toolName, temperature, maxTokens,
}: {
  apiKey: string; model: string; messages: any[]; tools: any[]; toolName: string;
  temperature: number; maxTokens: number;
}): Promise<{ ok: true; parsed: any } | { ok: false; status: number; body: string }> {
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
    if (!res.ok) return { ok: false, status: res.status, body };
    const data = tryParseJson(body);
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = typeof args === "string" ? recoverArgs(args) : null;
    if (parsed) return { ok: true, parsed };
    return { ok: false, status: 502, body: "no parseable tool output: " + body.slice(0, 300) };
  } catch (err) {
    return { ok: false, status: 0, body: err instanceof Error ? err.message : String(err) };
  }
}

async function callGeminiWithRotation(opts: {
  messages: any[]; tools: any[]; toolName: string;
  temperature: number; maxTokens: number;
}) {
  const keys = getGeminiKeys();
  if (keys.length === 0) throw new Error("no gemini keys configured");

  const startIdx = await loadIndex(keys.length);
  let lastErr = "";

  // Try each key exactly once, starting from startIdx, wrapping around.
  // With N keys, attempts go: startIdx, startIdx+1, ..., N-1, 0, 1, ..., startIdx-1.
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const idx = (startIdx + attempt) % keys.length;
    const key = keys[idx];

    for (const model of GEMINI_MODELS) {
      const r = await callGeminiOnce({ apiKey: key.value, model, ...opts });
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
}) {
  const temperature = opts.temperature ?? 0.3;
  const maxTokens = opts.maxTokens ?? 8000;

  if (getGeminiKeys().length > 0) {
    try {
      return await callGeminiWithRotation({ ...opts, temperature, maxTokens });
    } catch (e) {
      console.error("[ai] gemini exhausted, falling back to groq:", e);
    }
  }
  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (!groqKey) throw new Error("No AI provider available (all Gemini keys exhausted and no GROQ_API_KEY)");
  console.log("[ai] using groq fallback");
  return await callGroqTool({ apiKey: groqKey, ...opts, temperature, maxTokens });
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
