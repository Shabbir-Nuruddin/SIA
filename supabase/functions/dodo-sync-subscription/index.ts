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

async function dodoGet(host: string, path: string) {
  return fetch(`${host}${path}`, {
    headers: { Authorization: `Bearer ${DODO_SECRET_KEY}` },
  });
}

function itemBelongsToUser(item: Record<string, any>, userId: string, email?: string) {
  const meta = item.metadata ?? {};
  const customerEmail = item.customer?.email ?? item.customer_email;
  return meta.user_id === userId || (email && (meta.user_email === email || customerEmail === email));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!DODO_SECRET_KEY) {
      return new Response(JSON.stringify({ is_pro: false, message: "Payment sync is not configured yet." }), {
        status: 200,
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
      return new Response(JSON.stringify({ is_pro: false, message: "Please sign in again before syncing your plan." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const liveProductId = body.product_id;
    const productId = IS_TEST_KEY && DODO_TEST_PRODUCT_ID ? DODO_TEST_PRODUCT_ID : liveProductId;
    const host = IS_TEST_KEY ? DODO_TEST : DODO_LIVE;
    const params = new URLSearchParams({ page_size: "20", page_number: "0" });
    if (productId) params.set("product_id", productId);

    const [paymentsRes, subsRes] = await Promise.all([
      dodoGet(host, `/payments?${params.toString()}&status=succeeded`),
      dodoGet(host, `/subscriptions?${params.toString()}&status=active`),
    ]);
    const payments = paymentsRes.ok ? await paymentsRes.json() : { items: [] };
    const subs = subsRes.ok ? await subsRes.json() : { items: [] };
    const ownedSubscriptions = (subs.items ?? []).filter((item) => itemBelongsToUser(item, user.id, user.email));
    const ownedPayments = (payments.items ?? []).filter((item) => itemBelongsToUser(item, user.id, user.email));
    const ownedItems = [...ownedSubscriptions, ...ownedPayments];
    const paid = ownedItems.length > 0;

    if (paid) {
      const subscription = ownedSubscriptions[0] ?? {};
      const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await adminClient.from("profiles").update({
        is_pro: true,
        plan: "pro",
        subscription_status: "active",
        dodo_subscription_id: subscription.subscription_id ?? subscription.id ?? null,
        dodo_customer_id: subscription.customer_id ?? subscription.customer?.id ?? subscription.customer?.customer_id ?? null,
      } as any).eq("id", user.id);
    }

    return new Response(JSON.stringify({ is_pro: paid }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[dodo-sync-subscription]", err);
    return new Response(JSON.stringify({ is_pro: false, message: "We could not sync your payment yet. Please try again in a moment." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
