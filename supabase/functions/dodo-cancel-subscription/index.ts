import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DODO_SECRET_KEY = Deno.env.get("DODO_SECRET_KEY") ?? "";
const DODO_TEST_PRODUCT_ID = Deno.env.get("DODO_TEST_PRODUCT_ID") ?? "";
const IS_TEST_KEY = DODO_SECRET_KEY.toLowerCase().includes("test");
const DODO_LIVE = "https://live.dodopayments.com";
const DODO_TEST = "https://test.dodopayments.com";

async function dodoFetch(host: string, path: string, init?: RequestInit) {
  return fetch(`${host}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${DODO_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

async function findSubscriptionId(host: string, opts: { userId: string; email?: string; customerId?: string; productId?: string }): Promise<string | undefined> {
  const tryListWith = async (params: URLSearchParams) => {
    const r = await dodoFetch(host, `/subscriptions?${params.toString()}`);
    if (!r.ok) return [] as any[];
    const j = await r.json().catch(() => ({}));
    return (j.items ?? j.data ?? []) as any[];
  };

  // Search active subs (paginated, broad).
  const baseParams = new URLSearchParams({ page_size: "50", page_number: "0" });
  if (opts.productId) baseParams.set("product_id", opts.productId);

  // 1. By customer_id if we have one
  if (opts.customerId) {
    const params = new URLSearchParams(baseParams);
    params.set("customer_id", opts.customerId);
    const items = await tryListWith(params);
    const match = items.find((it) => ["active", "trialing", "on_hold"].includes(String(it.status ?? "").toLowerCase()));
    if (match) return match.subscription_id ?? match.id;
  }

  // 2. By scanning recent subs and matching metadata / email
  const items = await tryListWith(baseParams);
  const lcEmail = opts.email?.toLowerCase();
  const match = items.find((it) => {
    const meta = it.metadata ?? {};
    const customerEmail = (it.customer?.email ?? it.customer_email ?? "").toLowerCase();
    const status = String(it.status ?? "").toLowerCase();
    const isOpen = ["active", "trialing", "on_hold", "pending"].includes(status);
    return isOpen && (
      meta.user_id === opts.userId ||
      (lcEmail && (meta.user_email?.toLowerCase() === lcEmail || customerEmail === lcEmail))
    );
  });
  return match?.subscription_id ?? match?.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!DODO_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Payments are not configured yet. Please contact support." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Please sign in again to cancel your subscription." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: profile } = await adminClient
      .from("profiles")
      .select("dodo_subscription_id, dodo_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    const host = IS_TEST_KEY ? DODO_TEST : DODO_LIVE;
    const body = await req.json().catch(() => ({} as any));
    const productId = IS_TEST_KEY && DODO_TEST_PRODUCT_ID ? DODO_TEST_PRODUCT_ID : body.product_id;

    let subscriptionId: string | undefined = (profile as any)?.dodo_subscription_id ?? undefined;
    const customerId: string | undefined = (profile as any)?.dodo_customer_id ?? undefined;

    if (!subscriptionId) {
      try {
        subscriptionId = await findSubscriptionId(host, {
          userId: user.id,
          email: user.email ?? undefined,
          customerId,
          productId,
        });
      } catch (e) {
        console.warn("[dodo-cancel-subscription] lookup failed", e);
      }
    }

    // Mark profile as cancelled locally AFTER Dodo confirms cancellation.
    // We keep is_pro = true until the period ends — Dodo's webhook
    // (subscription.cancelled / expired) will flip is_pro to false.
    const markPendingCancel = async (extra: Record<string, unknown> = {}) => {
      await adminClient
        .from("profiles")
        .update({
          subscription_status: "cancelled",
          ...extra,
        } as any)
        .eq("id", user.id);
    };

    if (!subscriptionId) {
      // We have no subscription ID to cancel on Dodo's side. Do NOT silently
      // mark the user cancelled — surface this so support can investigate.
      console.warn("[dodo-cancel-subscription] no subscription id for user", user.id);
      return new Response(JSON.stringify({
        error: "We could not find an active subscription on file. Please contact support so we can cancel it for you.",
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check whether the subscription is still in its trial period. If so, we
    // must cancel immediately (not at period end) so no payment is collected,
    // and drop the user back to Free right away.
    let inTrial = false;
    try {
      const subRes = await dodoFetch(host, `/subscriptions/${subscriptionId}`, { method: "GET" });
      let subJson: any = subRes.ok ? await subRes.json().catch(() => ({})) : {};
      if (!subRes.ok) {
        const altHost = host === DODO_LIVE ? DODO_TEST : DODO_LIVE;
        const altRes = await dodoFetch(altHost, `/subscriptions/${subscriptionId}`, { method: "GET" });
        if (altRes.ok) subJson = await altRes.json().catch(() => ({}));
      }
      const status = String(subJson?.status ?? "").toLowerCase();
      const trialEnd = subJson?.trial_end_date ?? subJson?.trial_ends_at ?? subJson?.trial_end;
      if (status === "trialing" || status === "trial") inTrial = true;
      if (!inTrial && trialEnd) {
        const endMs = new Date(trialEnd).getTime();
        if (Number.isFinite(endMs) && endMs > Date.now()) inTrial = true;
      }
    } catch (e) {
      console.warn("[dodo-cancel-subscription] trial lookup failed", e);
    }

    // Cancel on Dodo. During trial: cancel immediately so no charge is made.
    // After trial: cancel at period end so the user keeps the time they paid for.
    const cancelBody = JSON.stringify(
      inTrial
        ? {
            status: "cancelled",
            cancel_at_next_billing_date: false,
            cancellation_comment: "Cancelled during free trial — no payment to be taken",
          }
        : {
            cancel_at_next_billing_date: true,
            cancellation_comment: "Cancelled from Make Me Revise account settings",
          },
    );
    let cancelRes = await dodoFetch(host, `/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: cancelBody,
    });
    let text = await cancelRes.text();

    // Test/live mismatch — retry on the other host.
    if ((cancelRes.status === 401 || cancelRes.status === 403 || cancelRes.status === 404)) {
      const altHost = host === DODO_LIVE ? DODO_TEST : DODO_LIVE;
      const retry = await dodoFetch(altHost, `/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        body: cancelBody,
      });
      if (retry.ok) {
        cancelRes = retry;
        text = await retry.text();
      } else {
        const retryText = await retry.text().catch(() => "");
        console.error("[dodo-cancel-subscription] retry on alt host failed", altHost, retry.status, retryText);
      }
    }

    if (!cancelRes.ok) {
      console.error("[dodo-cancel-subscription] dodo error", cancelRes.status, text);
      return new Response(JSON.stringify({
        error: "We could not cancel your subscription on the payment provider right now. Your card has NOT been charged. Please try again in a minute or contact support.",
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Dodo confirmed cancellation.
    if (inTrial) {
      // Drop to free immediately — no payment was taken.
      await adminClient
        .from("profiles")
        .update({
          is_pro: false,
          plan: "free",
          subscription_status: "cancelled",
          trial_start_date: null,
        } as any)
        .eq("id", user.id);
      return new Response(JSON.stringify({
        message: "Cancelled during your free trial. You have not been charged and your account is back on the free Starter plan.",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Post-trial: keep Pro until period end; webhook flips is_pro on expiry.
    await markPendingCancel();
    return new Response(JSON.stringify({
      message: "Cancelled with the payment provider. You will keep Pro until the end of your current billing period, and no further payments will be taken.",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[dodo-cancel-subscription] unhandled", err);
    return new Response(JSON.stringify({
      error: "We could not cancel your subscription right now. Please try again in a minute.",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
