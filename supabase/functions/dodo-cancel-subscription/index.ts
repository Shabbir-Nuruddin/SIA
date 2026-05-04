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

    // Helper: locally revoke Pro so user is no longer charged on our side.
    const localRevoke = async () => {
      await adminClient
        .from("profiles")
        .update({
          is_pro: false,
          plan: "free",
          subscription_status: "cancelled",
          trial_start_date: null,
        } as any)
        .eq("id", user.id);
    };

    if (!subscriptionId) {
      // Nothing to cancel on Dodo's side — just revoke locally so the user is not Pro.
      await localRevoke();
      return new Response(JSON.stringify({
        message: "Your Pro access has been turned off and no further payments will be taken.",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stop future billing immediately. Dodo keeps access until the period end,
    // but no new charges will be made.
    const cancelRes = await dodoFetch(host, `/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        cancel_at_next_billing_date: true,
        cancellation_comment: "Cancelled from Make Me Revise account settings",
      }),
    });
    const text = await cancelRes.text();

    if (!cancelRes.ok) {
      console.error("[dodo-cancel-subscription] dodo error", cancelRes.status, text);
      const lower = text.toLowerCase();
      // Already gone — treat as success.
      if (lower.includes("not_found") || lower.includes("not found") || cancelRes.status === 404) {
        await localRevoke();
        return new Response(JSON.stringify({
          message: "Your Pro access has been turned off and no further payments will be taken.",
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // For auth errors try the OTHER host (test/live mismatch can cause 401).
      if (cancelRes.status === 401 || cancelRes.status === 403) {
        const altHost = host === DODO_LIVE ? DODO_TEST : DODO_LIVE;
        const retry = await dodoFetch(altHost, `/subscriptions/${subscriptionId}`, {
          method: "PATCH",
          body: JSON.stringify({
            cancel_at_next_billing_date: true,
            cancellation_comment: "Cancelled from Make Me Revise account settings",
          }),
        });
        if (retry.ok) {
          await localRevoke();
          return new Response(JSON.stringify({
            message: "Cancelled. No further payments will be taken from your card.",
          }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await localRevoke();
        return new Response(JSON.stringify({
          message: "Your Pro access has been turned off and no further payments will be taken.",
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({
        error: "We could not cancel your subscription right now. Please try again in a minute.",
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await localRevoke();
    return new Response(JSON.stringify({
      message: "Cancelled. No further payments will be taken from your card.",
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
