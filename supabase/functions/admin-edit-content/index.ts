// Admin-only inline AI editor. Takes the existing cached content + admin
// instruction and asks Groq for a revised version, then upserts the cache.
// Only the configured admin email may invoke this.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["nuruddinshabbir3@gmail.com", "alvyu.official@gmail.com"];
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const GROQ_KEY = Deno.env.get("GROQ_API_KEY")!;

const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

async function callGroqJson(system: string, user: string) {
  let lastErr = "";
  for (const model of MODELS) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature: 0.4,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      }),
    });
    const txt = await res.text();
    if (!res.ok) { lastErr = txt; continue; }
    try {
      const data = JSON.parse(txt);
      const content = data?.choices?.[0]?.message?.content || "";
      return JSON.parse(content);
    } catch (e) { lastErr = String(e); continue; }
  }
  throw new Error(`Groq edit failed: ${lastErr.slice(0, 300)}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { target, instruction, scope, board, subject, unit_number, topic } = body;
    if (!target || !instruction) {
      return new Response(JSON.stringify({ error: "missing target/instruction" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminDb = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Persistent modifier branch — save and return immediately.
    if (scope === "all") {
      await adminDb.from("admin_ai_modifiers").insert({
        feature: target,
        board: board === "cie" ? "cie" : board === "edexcel" ? "edexcel" : "all",
        instruction,
        is_active: true,
      });
      return new Response(JSON.stringify({ ok: true, mode: "modifier_saved" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // "this only" — fetch existing cached content, run Groq edit, upsert.
    const cacheBoard = board === "cie" ? "cie" : "edexcel";
    if (target === "notes") {
      const { data: row } = await adminDb.from("cached_topic_notes").select("content")
        .eq("board", cacheBoard).eq("subject", subject).eq("unit_number", unit_number).eq("topic", topic).maybeSingle();
      if (!row?.content) {
        return new Response(JSON.stringify({ error: "no cached note to edit" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const system = `You are an A-Level revision-notes editor. You receive existing structured notes JSON and an admin instruction. Apply the instruction precisely and return the FULL updated notes JSON in the EXACT SAME SHAPE (all keys preserved). Output JSON only.`;
      const userMsg = `EXISTING NOTES JSON:\n${JSON.stringify(row.content)}\n\nADMIN INSTRUCTION:\n${instruction}\n\nReturn the updated notes JSON.`;
      const updated = await callGroqJson(system, userMsg);
      await adminDb.from("cached_topic_notes").update({ content: updated, updated_at: new Date().toISOString() })
        .eq("board", cacheBoard).eq("subject", subject).eq("unit_number", unit_number).eq("topic", topic);
      return new Response(JSON.stringify({ ok: true, content: updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (target === "faq") {
      const { data: row } = await adminDb.from("cached_faq_questions").select("questions")
        .eq("board", cacheBoard).eq("subject", subject).eq("topic", topic).maybeSingle();
      if (!row?.questions) {
        return new Response(JSON.stringify({ error: "no cached FAQs to edit" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const system = `You are an A-Level FAQ editor. You receive an array of exam questions (each with question_text, marks, mark_scheme) plus an admin instruction. Apply the instruction. Return JSON in this exact shape: { "questions": [...] }. Keep all 3 questions and preserve mark-scheme phrasing rules (one marking point per line, each ending with (1)).`;
      const userMsg = `EXISTING FAQ JSON:\n${JSON.stringify({ questions: row.questions })}\n\nADMIN INSTRUCTION:\n${instruction}\n\nReturn the updated JSON.`;
      const updated = await callGroqJson(system, userMsg);
      const questions = Array.isArray(updated?.questions) ? updated.questions : row.questions;
      await adminDb.from("cached_faq_questions").update({ questions, updated_at: new Date().toISOString() })
        .eq("board", cacheBoard).eq("subject", subject).eq("topic", topic);
      return new Response(JSON.stringify({ ok: true, questions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "unknown target" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-edit-content error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
