// Hard-delete a student account. Admin-only.
// Removes the auth.users row (which cascades any RLS-scoped data tied to user_id)
// plus best-effort cleanup of public.profiles + user_roles to be safe.
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

    // Verify caller is admin via role table (canonical source of truth)
    const { data: roleRow } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const targetId = String(body?.user_id ?? "");
    if (!targetId || targetId === user.id) {
      return new Response(JSON.stringify({ error: "Invalid target user_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Guard: never let an admin nuke another admin via this endpoint.
    const { data: targetRole } = await admin
      .from("user_roles").select("role").eq("user_id", targetId).eq("role", "admin").maybeSingle();
    if (targetRole) {
      return new Response(JSON.stringify({ error: "Cannot delete another admin account." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Best-effort cleanup. Most user_id-scoped tables don't FK to auth.users, so wipe them explicitly.
    const tables = [
      "active_device_sessions", "ai_questions", "exams", "feedback_replies", "feedback_tickets",
      "mock_paper_questions", "mock_papers", "note_annotations", "roadmap_nodes",
      "roadmap_sessions", "study_sessions", "topic_notes", "topic_progress",
      "user_activity", "user_roles", "user_subjects", "profiles",
    ];
    for (const t of tables) {
      try {
        await admin.from(t).delete().eq(t === "profiles" ? "id" : "user_id", targetId);
      } catch (_) { /* ignore per-table failures so the auth delete still proceeds */ }
    }

    const { error: delErr } = await admin.auth.admin.deleteUser(targetId);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, deleted: targetId }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[admin-delete-user]", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
