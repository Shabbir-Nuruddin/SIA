import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["nuruddinshabbir3@gmail.com", "alvyu.official@gmail.com"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify caller is admin — by email (works on any backend) or profiles.is_admin.
    let isAdmin = ADMIN_EMAILS.includes((user.email || "").toLowerCase());
    if (!isAdmin) {
      const { data: prof } = await admin
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      isAdmin = !!prof?.is_admin;
    }
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name, is_pro, plan, subscription_status, created_at");

    // Total seconds on site per user (from heartbeat-tracked user_activity)
    const minutesById: Record<string, number> = {};
    {
      const { data } = await admin
        .from("user_activity")
        .select("user_id, total_seconds");
      for (const r of (data ?? []) as any[]) {
        minutesById[r.user_id] = Math.floor((r.total_seconds ?? 0) / 60);
      }
    }

    // Fetch emails from auth.users via admin API (paged)
    const emailById: Record<string, string> = {};
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) break;
      for (const u of data.users) emailById[u.id] = u.email ?? "";
      if (data.users.length < 1000) break;
      page++;
      if (page > 20) break;
    }

    const users = (profiles ?? []).map((p: any) => ({
      id: p.id,
      email: emailById[p.id] ?? "",
      display_name: p.display_name,
      is_pro: !!p.is_pro,
      plan: p.plan,
      subscription_status: p.subscription_status,
      created_at: p.created_at,
      study_minutes: minutesById[p.id] ?? 0,
    }));

    const total = users.length;
    const pro = users.filter((u) => u.is_pro).length;

    return new Response(JSON.stringify({ total, pro, users }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[admin-list-users]", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
