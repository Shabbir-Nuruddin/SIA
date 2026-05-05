// Creates a Dodo Payments hosted checkout session and returns the URL.
// Auto-detects test vs live mode (tries live first, falls back to test on 401),
// so the same function works with either a live or test DODO_SECRET_KEY.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DODO_SECRET_KEY = Deno.env.get("DODO_SECRET_KEY");
// If your DODO_SECRET_KEY is a TEST key, set DODO_TEST_PRODUCT_ID to the
// product ID created in the Dodo TEST dashboard. Live and test products are
// separate — the live product ID will return 404 against the test API.
const DODO_TEST_PRODUCT_ID = Deno.env.get("DODO_TEST_PRODUCT_ID");
// Heuristic: most Dodo test keys are prefixed (e.g. sk_test_...). Fall back to
// trying live first regardless.
const IS_TEST_KEY = (DODO_SECRET_KEY ?? "").toLowerCase().includes("test");
const DODO_LIVE = "https://live.dodopayments.com";
const DODO_TEST = "https://test.dodopayments.com";

async function callDodo(host: string, payload: unknown) {
  return await fetch(`${host}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DODO_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

function friendlyDodoMessage(status: number, text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("insufficient_funds")) return "Your card does not have enough funds for this payment. Please try another card or add funds, then retry checkout.";
  if (lower.includes("card_declined") || lower.includes("declined")) return "Your bank declined the payment. Please try another card or contact your bank.";
  if (lower.includes("discount code")) return "That promo code is not active yet. You can still retry checkout and enter a valid code there.";
  if (lower.includes("not_found") || lower.includes("not found")) return "Checkout is not fully set up yet. Please contact support so we can fix the Pro product setup.";
  if (lower.includes("currency")) return "Checkout could not open in AED. Please try again, or contact support if it keeps happening.";
  if (status === 401 || status === 403) return "Payment settings need to be checked before checkout can open.";
  return "Checkout could not open right now. Please try again in a minute.";
}

function prepareCheckoutUrl(rawUrl: string, currency: string) {
  const url = new URL(rawUrl);
  url.searchParams.set("showDiscounts", "true");
  url.searchParams.set("paymentCurrency", currency);
  url.searchParams.set("showCurrencySelector", currency === "INR" ? "true" : "false");
  return url.toString();
}

// AED base price → other currencies (must roughly match src/lib/currency.ts)
const RATE_FROM_AED: Record<string, number> = {
  AED: 1,
  INR: 23.0,
  GBP: 0.2126,
  USD: 0.2723,
};
const BASE_AED = 39.99;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!DODO_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Payments not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const return_url = body.return_url;
    const discount_code = body.discount_code;
    const requestedCurrency = (typeof body.currency === "string" ? body.currency.toUpperCase() : "AED");
    const currency = RATE_FROM_AED[requestedCurrency] ? requestedCurrency : "AED";
    const isIndia = currency === "INR";
    const productPriceMinor = Math.round(BASE_AED * RATE_FROM_AED[currency] * 100);
    const liveProductId = body.product_id;
    const product_id = IS_TEST_KEY && DODO_TEST_PRODUCT_ID ? DODO_TEST_PRODUCT_ID : liveProductId;
    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let appOrigin = new URL(req.url).origin;
    try {
      if (return_url) appOrigin = new URL(return_url).origin;
    } catch {
      // Keep the function origin fallback if the provided URL is malformed.
    }

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

    // If the user previously subscribed (and likely cancelled), skip the
    // 3-day trial on re-subscribe and charge immediately.
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: profile } = await adminClient
      .from("profiles")
      .select("dodo_customer_id, dodo_subscription_id, subscription_status")
      .eq("id", user.id)
      .maybeSingle();
    const hasSubscribedBefore = Boolean(
      (profile as any)?.dodo_customer_id ||
      (profile as any)?.dodo_subscription_id ||
      (profile as any)?.subscription_status,
    );
    const trialDays = hasSubscribedBefore ? 0 : 3;

    const createPayload = (host: string, includeDiscount = true): Record<string, unknown> => {
      const selectedProductId = host === DODO_TEST && DODO_TEST_PRODUCT_ID ? DODO_TEST_PRODUCT_ID : liveProductId;
      const payload: Record<string, unknown> = {
        product_cart: [{ product_id: selectedProductId, quantity: 1 }],
        return_url: return_url || `${appOrigin}/dashboard?checkout=success`,
        cancel_url: `${appOrigin}/pricing?checkout=retry`,
        customer: {
          email: user.email,
          name: user.user_metadata?.full_name ?? user.user_metadata?.first_name ?? user.email,
        },
        billing_address: isIndia
          ? { city: "Mumbai", country: "IN", state: "Maharashtra", street: "N/A", zipcode: "400001" }
          : { city: "Dubai", country: "AE", state: "Dubai", street: "N/A", zipcode: "00000" },
        metadata: { user_id: user.id, user_email: user.email ?? "", base_price_aed: "39.99", currency },
        allowed_payment_method_types: isIndia
          ? ["upi_collect", "upi_intent", "credit", "debit"]
          : ["credit", "debit"],
        billing_currency: currency,
        subscription_data: {
          trial_period_days: trialDays,
          product_currency: currency,
          product_price: productPriceMinor,
        },
        feature_flags: {
          allow_currency_selection: isIndia,
          allow_discount_code: true,
          allow_tax_id: true,
          allow_customer_editing_country: true,
          allow_customer_editing_zipcode: true,
        },
        customization: {
          pay_button_text: trialDays > 0 ? "Start 3-day free trial" : "Subscribe to Pro",
        },
      };
      if (includeDiscount && discount_code) payload.discount_code = discount_code;
      return payload;
    };

    // Try the host that matches the key first, fall back on 401 (mode mismatch).
    const firstHost = IS_TEST_KEY ? DODO_TEST : DODO_LIVE;
    const secondHost = IS_TEST_KEY ? DODO_LIVE : DODO_TEST;
    let res = await callDodo(firstHost, createPayload(firstHost));
    let usedHost = firstHost;
    if (res.status === 401) {
      console.warn("[dodo-checkout]", firstHost, "returned 401, retrying on", secondHost);
      res = await callDodo(secondHost, createPayload(secondHost));
      usedHost = secondHost;
    }

    const text = await res.text();
    if (!res.ok) {
      if (discount_code && text.toLowerCase().includes("discount code")) {
        console.warn("[dodo-checkout] discount code rejected; retrying without prefilled code");
        const retry = await callDodo(usedHost, createPayload(usedHost, false));
        const retryText = await retry.text();
        if (retry.ok) {
          const retryData = JSON.parse(retryText);
          const retryUrl = retryData.payment_link || retryData.checkout_url || retryData.url;
          if (retryUrl) {
            return new Response(JSON.stringify({ url: prepareCheckoutUrl(retryUrl, currency), session_id: retryData.session_id, mode: usedHost === DODO_LIVE ? "live" : "test" }), {
              status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
        console.error("[dodo-checkout] retry without discount failed", usedHost, retry.status, retryText);
      }
      console.error("[dodo-checkout] error", usedHost, res.status, text);
      return new Response(JSON.stringify({ error: friendlyDodoMessage(res.status, text) }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(text);
    const url = data.payment_link || data.checkout_url || data.url;
    if (!url) {
      return new Response(JSON.stringify({ error: "Checkout opened, but the payment provider did not send back a checkout link. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ url: prepareCheckoutUrl(url, currency), session_id: data.session_id, mode: usedHost === DODO_LIVE ? "live" : "test" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[dodo-checkout] unhandled", err);
    return new Response(JSON.stringify({ error: "Checkout could not open right now. Please try again in a minute." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
