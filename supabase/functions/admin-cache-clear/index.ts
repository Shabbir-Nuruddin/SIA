// Admin-only cache clearing. Verifies the caller's JWT belongs to the
// allowed admin email before deleting any cached AI content.
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
    const { target } = await req.json();
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const map: Record<string, string[]> = {
      // Notes are cached in two places: the shared AI cache and each user's saved
      // generated note row. Clear both so the next visit truly regenerates.
      notes: ["cached_topic_notes", "cached_topic_images", "topic_notes"],
      faq: ["cached_faq_questions"],
      questions: ["cached_topic_questions"],
    };
    const tables = map[target];
    if (!tables) {
      return new Response(JSON.stringify({ error: "invalid target" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const deletedByTable: Record<string, number> = {};
    for (const table of tables) {
      const { error, count } = await admin
        .from(table)
        .delete({ count: "exact" })
        .neq("id", "00000000-0000-0000-0000-000000000000");
      // Some installs may not have optional cache tables yet — swallow that case.
      if (error && !/(relation .* does not exist|Could not find the table .* in the schema cache)/i.test(error.message)) {
        return new Response(JSON.stringify({ error: error.message, table }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      deletedByTable[table] = count ?? 0;
    }
    const deleted = Object.values(deletedByTable).reduce((sum, n) => sum + n, 0);
    return new Response(JSON.stringify({ ok: true, deleted, table: tables.join(", "), deletedByTable }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
