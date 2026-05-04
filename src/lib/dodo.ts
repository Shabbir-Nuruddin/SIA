import { supabase } from "@/integrations/supabase/client";

// Dodo Payments product ID for the Pro plan. Override via VITE_DODO_PRODUCT_ID.
export const DODO_PRODUCT_ID =
  (import.meta.env.VITE_DODO_PRODUCT_ID as string | undefined) ||
  "pdt_0Ne3qcXu6NfcYOf4gvH4v";

/**
 * Open Dodo Payments hosted checkout for the Pro plan.
 * Server creates the session (with discount code field enabled by Dodo by default),
 * then we redirect the user to the hosted URL.
 */
export async function openProCheckout(): Promise<void> {
  const returnUrl = `${window.location.origin}/dashboard?checkout=success`;
  const { data, error } = await supabase.functions.invoke("dodo-checkout", {
    body: { product_id: DODO_PRODUCT_ID, return_url: returnUrl },
  });
  if (error || !data?.url) {
    throw new Error(error?.message || "Failed to start checkout");
  }
  window.location.href = data.url as string;
}
