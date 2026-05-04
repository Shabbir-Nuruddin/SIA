import { supabase } from "@/integrations/supabase/client";

// Dodo Payments product ID for the Pro plan. Override via VITE_DODO_PRODUCT_ID.
export const DODO_PRODUCT_ID =
  (import.meta.env.VITE_DODO_PRODUCT_ID as string | undefined) ||
  "pdt_0Ne3qcXu6NfcYOf4gvH4v";

export function friendlyCheckoutError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const lower = raw.toLowerCase();
  if (lower.includes("insufficient_funds")) return "Your card does not have enough funds. Please try another card or add funds, then retry checkout.";
  if (lower.includes("decline")) return "Your bank declined the payment. Please try another card or contact your bank.";
  if (lower.includes("not_found") || lower.includes("not found")) return "Checkout is not fully set up yet. Please contact support so we can fix it.";
  if (lower.includes("unauthorized") || lower.includes("401") || lower.includes("403")) return "Payment settings need to be checked before checkout can open.";
  return raw && !raw.includes("{") ? raw : "Checkout could not open right now. Please try again in a minute.";
}

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
    throw new Error(friendlyCheckoutError(data?.error));
  }
  window.location.href = data.url as string;
}

export async function syncProAfterCheckout(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-sync-subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ product_id: DODO_PRODUCT_ID }),
  });
  const data = await response.json().catch(() => null);
  return Boolean(response.ok && data?.is_pro);
}
