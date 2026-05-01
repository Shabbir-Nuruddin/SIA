import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paddle-signature",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const eventType: string | undefined = body?.event_type;
    // Paddle sends custom_data on the data object (subscription / transaction)
    const userId: string | undefined =
      body?.data?.custom_data?.user_id ??
      body?.data?.subscription?.custom_data?.user_id;

    const customerId: string | undefined = body?.data?.customer_id;
    const subscriptionId: string | undefined =
      body?.data?.id && eventType?.startsWith("subscription.") ? body.data.id : body?.data?.subscription_id;

    console.log("[paddle-webhook]", eventType, "user:", userId);

    if (!userId) {
      // Acknowledge anyway so Paddle doesn't retry forever
      return new Response("no user_id", { status: 200, headers: corsHeaders });
    }

    if (
      eventType === "subscription.activated" ||
      eventType === "subscription.created" ||
      eventType === "subscription.updated" ||
      eventType === "transaction.completed"
    ) {
      const nextBilledAt: string | undefined =
        body?.data?.next_billed_at ?? body?.data?.current_billing_period?.ends_at;
      const expiresAt = nextBilledAt
        ? new Date(nextBilledAt).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("subscriptions") as any).upsert(
        {
          user_id: userId,
          plan: "pro",
          status: "active",
          paddle_subscription_id: subscriptionId ?? null,
          paddle_customer_id: customerId ?? null,
          started_at: new Date().toISOString(),
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      if (error) console.error("[paddle-webhook] upsert err", error);
    }

    if (eventType === "subscription.canceled" || eventType === "subscription.cancelled") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("subscriptions") as any)
        .update({ plan: "free", status: "cancelled", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[paddle-webhook] error", err);
    return new Response("Error: " + (err as Error).message, { status: 500, headers: corsHeaders });
  }
});
