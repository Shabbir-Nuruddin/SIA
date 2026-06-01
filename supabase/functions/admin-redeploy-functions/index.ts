// Admin-only: pings every edge function in parallel to wake cold instances
// and verify each is healthy. Edge function source is auto-deployed on save,
// so this is the runtime equivalent of a "redeploy / warm" button.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["nuruddinshabbir3@gmail.com", "alvyu.official@gmail.com"];
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

// All deployed functions. Keep in sync with supabase/functions/*.
const FUNCTIONS = [
  "admin-ai-keys",
  "admin-cache-clear",
  "admin-create-ticket",
  "admin-delete-user",
  "admin-edit-content",
  "admin-list-users",
  "admin-redeploy-functions",
  "ai-mock-paper",
  "ai-note-visuals",
  "ai-notes",
  "ai-question",
  "ai-tutor",
  "auth-email-hook",
  "clarity-ai",
  "dodo-cancel-subscription",
  "dodo-checkout",
  "dodo-sync-subscription",
  "dodo-webhook",
  "faq-questions",
  "generate-study-plan",
  "process-email-queue",
  "send-onboarding-email",
  "youtube-search",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = await Promise.all(
      FUNCTIONS.map(async (name) => {
        const t0 = Date.now();
        try {
          // OPTIONS preflight — every function handles it and returns CORS headers,
          // so it's a safe no-op that still forces the runtime to spin up the instance.
          const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
            method: "OPTIONS",
            headers: {
              apikey: ANON,
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": "authorization, content-type",
              Origin: "https://admin.local",
            },
          });
          return {
            name,
            ok: res.ok || res.status === 204,
            status: res.status,
            ms: Date.now() - t0,
          };
        } catch (e) {
          return {
            name,
            ok: false,
            status: 0,
            ms: Date.now() - t0,
            error: e instanceof Error ? e.message : String(e),
          };
        }
      }),
    );

    return new Response(JSON.stringify({ ok: true, count: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
