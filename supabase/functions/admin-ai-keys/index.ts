// Admin-only endpoint: returns Gemini key rotation status.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function listKeyNames(): string[] {
  const out: string[] = [];
  if (Deno.env.get("GEMINI_API_KEY")) out.push("GEMINI_API_KEY");
  // Start at _1 so keys named GEMINI_API_KEY_1, _2, _3, … are all reported.
  for (let i = 1; i <= 20; i++) {
    if (Deno.env.get(`GEMINI_API_KEY_${i}`)) out.push(`GEMINI_API_KEY_${i}`);
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: role } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!role) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const keyNames = listKeyNames();
    const { data: state } = await admin
      .from("ai_key_state").select("*").eq("provider", "gemini").maybeSingle();

    const currentIndex = Math.min((state?.current_index as number) ?? 0, Math.max(0, keyNames.length - 1));
    return new Response(JSON.stringify({
      provider: "gemini",
      keyNames,
      totalKeys: keyNames.length,
      currentIndex,
      currentKeyName: keyNames[currentIndex] ?? null,
      lastRotatedAt: state?.last_rotated_at ?? null,
      lastError: state?.last_error ?? null,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
