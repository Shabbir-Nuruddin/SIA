// Creates a Dodo Payments hosted checkout session and returns the URL.
// Frontend redirects (or opens in popup) to that URL. Success → /dashboard?checkout=success.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DODO_SECRET_KEY = Deno.env.get("DODO_SECRET_KEY");
// Dodo live API; switch host to "test.dodopayments.com" for sandbox.
const DODO_API = "https://live.dodopayments.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!DODO_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Payments not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { product_id, return_url } = await req.json();
    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth — derive user from JWT
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a subscription checkout session via Dodo's API
    const payload = {
      product_id,
      quantity: 1,
      payment_link: true,
      return_url: return_url || `${new URL(req.url).origin}/dashboard?checkout=success`,
      customer: { email: user.email, name: user.user_metadata?.first_name ?? user.email },
      metadata: { user_id: user.id, user_email: user.email ?? "" },
      allowed_payment_method_types: ["credit", "debit"],
      billing_currency: "USD",
    };

    const res = await fetch(`${DODO_API}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DODO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[dodo-checkout] error", res.status, text);
      return new Response(JSON.stringify({ error: "Dodo checkout failed", detail: text }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(text);
    const url = data.payment_link || data.checkout_url || data.url;
    if (!url) {
      return new Response(JSON.stringify({ error: "No checkout URL", raw: data }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ url }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[dodo-checkout] unhandled", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
