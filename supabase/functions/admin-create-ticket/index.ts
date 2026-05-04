import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: prof } = await admin.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
    if (!prof?.is_admin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { target_user_id, subject, message } = await req.json();
    if (!target_user_id || !subject?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create ticket on behalf of target user, then post the admin's first reply.
    const { data: ticket, error: tErr } = await admin
      .from("feedback_tickets")
      .insert({
        user_id: target_user_id,
        subject: subject.trim(),
        message: "(Message from Support team)",
        status: "open",
      })
      .select()
      .single();
    if (tErr || !ticket) {
      return new Response(JSON.stringify({ error: tErr?.message ?? "Failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("feedback_replies").insert({
      ticket_id: ticket.id,
      author_id: user.id,
      message: message.trim(),
      is_admin_reply: true,
    });

    return new Response(JSON.stringify({ ticket_id: ticket.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[admin-create-ticket]", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
