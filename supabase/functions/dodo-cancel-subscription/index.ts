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

function friendlyCancelError(status: number, text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("not_found") || lower.includes("not found")) return "We could not find an active subscription for this account. If you already cancelled, you will not be charged again.";
  if (status === 401 || status === 403) return "Payment settings need to be checked before cancellation can be completed.";
  return "We could not cancel your subscription right now. Please try again in a minute.";
}

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!DODO_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Payments are not configured yet." }), {
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
      return new Response(JSON.stringify({ error: "Please sign in again before cancelling." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: profile } = await adminClient
      .from("profiles")
      .select("dodo_subscription_id")
      .eq("id", user.id)
      .maybeSingle();

    const host = IS_TEST_KEY ? DODO_TEST : DODO_LIVE;
    let subscriptionId = (profile as any)?.dodo_subscription_id as string | undefined;

    if (!subscriptionId) {
      const body = await req.json().catch(() => ({}));
      const params = new URLSearchParams({ page_size: "20", page_number: "0", status: "active" });
      const productId = IS_TEST_KEY && DODO_TEST_PRODUCT_ID ? DODO_TEST_PRODUCT_ID : body.product_id;
      if (productId) params.set("product_id", productId);
      const listRes = await dodoFetch(host, `/subscriptions?${params.toString()}`);
      const list = listRes.ok ? await listRes.json() : { items: [] };
      const match = (list.items ?? []).find((item: any) => {
        const meta = item.metadata ?? {};
        const customerEmail = item.customer?.email ?? item.customer_email;
        return meta.user_id === user.id || meta.user_email === user.email || customerEmail === user.email;
      });
      subscriptionId = match?.subscription_id ?? match?.id;
    }

    if (!subscriptionId) {
      await adminClient.from("profiles").update({ is_pro: false, plan: "free", subscription_status: "cancelled", trial_start_date: null } as any).eq("id", user.id);
      return new Response(JSON.stringify({ message: "No active subscription was found. You will not be charged again." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cancelRes = await dodoFetch(host, `/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        cancel_at_next_billing_date: true,
        cancellation_comment: "Cancelled from Make Me Revise account settings",
      }),
    });
    const text = await cancelRes.text();
    if (!cancelRes.ok) {
      console.error("[dodo-cancel-subscription]", cancelRes.status, text);
      return new Response(JSON.stringify({ error: friendlyCancelError(cancelRes.status, text) }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await adminClient.from("profiles").update({ is_pro: false, plan: "free", subscription_status: "cancelled", trial_start_date: null } as any).eq("id", user.id);
    return new Response(JSON.stringify({ message: "Cancelled. You will not be charged again." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[dodo-cancel-subscription]", err);
    return new Response(JSON.stringify({ error: "We could not cancel your subscription right now. Please try again in a minute." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});