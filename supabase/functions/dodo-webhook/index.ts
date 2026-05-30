// Dodo Payments webhook handler.
// Verifies signature using DODO_WEBHOOK_SECRET when configured.
// Updates profiles.is_pro based on event type.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, webhook-signature, dodo-signature",
};

const DODO_WEBHOOK_SECRET = Deno.env.get("DODO_WEBHOOK_SECRET") ?? "";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!signature || !DODO_WEBHOOK_SECRET) return false;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(DODO_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
    const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
    // Accept either raw hex or "sha256=hex" forms
    const provided = signature.replace(/^sha256=/, "").trim().toLowerCase();
    return provided === hex.toLowerCase();
  } catch (e) {
    console.error("[dodo-webhook] verify err", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const raw = await req.text();
  const signature = req.headers.get("webhook-signature") ?? req.headers.get("dodo-signature");

  // Always enforce signature verification. If the signing secret is missing,
  // refuse all requests rather than silently accepting forged webhooks that
  // could grant Pro status to arbitrary users.
  if (!DODO_WEBHOOK_SECRET || !signature || !(await verifySignature(raw, signature))) {
    console.warn("[dodo-webhook] missing or invalid signature (secret configured:", !!DODO_WEBHOOK_SECRET, ")");
    return new Response("invalid signature", { status: 401, headers: corsHeaders });
  }

  let body: any;
  try { body = JSON.parse(raw); } catch {
    return new Response("invalid json", { status: 400, headers: corsHeaders });
  }

  const eventType: string = body?.type ?? body?.event_type ?? "";
  const data = body?.data ?? body;
  const subscriptionId: string | undefined =
    data?.subscription_id ??
    data?.subscription?.subscription_id ??
    data?.subscription?.id ??
    (eventType.includes("subscription") ? data?.id : undefined);
  const customerId: string | undefined =
    data?.customer_id ??
    data?.customer?.customer_id ??
    data?.customer?.id;
  const userId: string | undefined =
    data?.metadata?.user_id ??
    data?.subscription?.metadata?.user_id ??
    data?.payment?.metadata?.user_id;
  const email: string | undefined =
    data?.metadata?.user_email ??
    data?.customer?.email;

  console.log("[dodo-webhook]", eventType, "user:", userId, "email:", email);

  if (!userId && !email) {
    return new Response("no user", { status: 200, headers: corsHeaders });
  }

  // Find target user id
  let targetId = userId;
  if (!targetId && email) {
    const { data: u } = await supabase.from("profiles").select("id").eq("id", email).maybeSingle();
    if (u?.id) targetId = u.id;
  }
  if (!targetId) return new Response("ok", { status: 200, headers: corsHeaders });

  const setPro = async (isPro: boolean, status?: string) => {
    const { error } = await supabase.from("profiles")
      .update({
        is_pro: isPro,
        plan: isPro ? "pro" : "free",
        subscription_status: status ?? (isPro ? "active" : "cancelled"),
        ...(isPro ? { trial_start_date: new Date().toISOString() } : { trial_start_date: null }),
        ...(subscriptionId ? { dodo_subscription_id: subscriptionId } : {}),
        ...(customerId ? { dodo_customer_id: customerId } : {}),
      } as any)
      .eq("id", targetId);
    if (error) console.error("[dodo-webhook] update err", error);
  };

  if (
    eventType.includes("payment.succeeded") ||
    eventType.includes("subscription.active") ||
    eventType.includes("subscription.renewed") ||
    eventType.includes("subscription.created")
  ) {
    await setPro(true, "active");
  } else if (
    eventType.includes("subscription.cancelled") ||
    eventType.includes("subscription.canceled") ||
    eventType.includes("subscription.expired") ||
    eventType.includes("subscription.failed") ||
    eventType.includes("subscription.on_hold") ||
    eventType.includes("payment.failed")
  ) {
    await setPro(false, eventType.includes("on_hold") || eventType.includes("failed") ? "payment_failed" : "cancelled");
  }

  return new Response("ok", { status: 200, headers: corsHeaders });
});
