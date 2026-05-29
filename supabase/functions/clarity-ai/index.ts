// Proxies Groq AI requests for the ClarityCompass quiz + roadmap.
// Replaces direct browser->Groq calls that previously leaked a VITE_AI_KEY.

import { requireUser } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_BASE_URL = Deno.env.get("AI_BASE_URL") ?? "https://api.groq.com/openai/v1";
const AI_MODEL = Deno.env.get("AI_MODEL") ?? "llama3-70b-8192";
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;

  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "AI key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const prompt: string = typeof body?.prompt === "string" ? body.prompt : "";
  const maxTokens: number = Math.min(Math.max(Number(body?.max_tokens ?? 2000), 100), 4000);
  const temperature: number = Math.min(Math.max(Number(body?.temperature ?? 0.7), 0), 1);

  if (!prompt || prompt.length > 16000) {
    return new Response(JSON.stringify({ error: "prompt missing or too long" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[clarity-ai] upstream err", upstream.status, text);
    return new Response(JSON.stringify({ error: "AI upstream error" }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const data = await upstream.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  return new Response(JSON.stringify({ content }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
