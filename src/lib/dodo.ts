import { supabase } from "@/integrations/supabase/client";

// Dodo Payments product ID for the Pro plan. Override via VITE_DODO_PRODUCT_ID.
export const DODO_PRODUCT_ID =
  (import.meta.env.VITE_DODO_PRODUCT_ID as string | undefined) ||
  "pdt_0Ne3qcXu6NfcYOf4gvH4v";

/**
 * Open Dodo Payments hosted checkout for the Pro plan.
 * Server creates the session with the discount-code field enabled,
 * then we redirect the user to the hosted URL.
 */
export async function openProCheckout(discountCode?: string): Promise<void> {
  const returnUrl = `${window.location.origin}/dashboard?checkout=success`;
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ product_id: DODO_PRODUCT_ID, return_url: returnUrl, discount_code: discountCode }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.url) {
    throw new Error(data?.error || "Checkout could not open right now. Please try again in a minute.");
  }
  window.location.href = data.url as string;
}
