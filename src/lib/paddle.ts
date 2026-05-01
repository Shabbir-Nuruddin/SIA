import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { supabase } from "@/integrations/supabase/client";

// Public client-side token — safe to expose in frontend code.
// Override via VITE_PADDLE_CLIENT_TOKEN if set.
export const PADDLE_CLIENT_TOKEN =
  (import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined) ||
  "live_4e8b42efb6ae503af0f8798cbb5";

export const PADDLE_PRICE_ID =
  (import.meta.env.VITE_PADDLE_PRICE_ID as string | undefined) ||
  "pri_01kqfzqdttq1sz367smd0e5brp";

let paddleInstance: Paddle | undefined;
let initPromise: Promise<Paddle | undefined> | null = null;

export const getPaddle = async (): Promise<Paddle | undefined> => {
  if (paddleInstance) return paddleInstance;
  if (initPromise) return initPromise;

  initPromise = initializePaddle({
    environment: "production",
    token: PADDLE_CLIENT_TOKEN,
    eventCallback: async (event) => {
      try {
        if (event?.name === "checkout.completed") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userId = (event.data as any)?.custom_data?.user_id as string | undefined;
          if (userId) {
            // Optimistic local upsert; webhook is source of truth.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from("subscriptions") as any).upsert({
              user_id: userId,
              plan: "pro",
              status: "active",
              started_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
            window.location.reload();
          }
        }
      } catch (err) {
        console.error("[paddle] eventCallback error", err);
      }
    },
  }).then((p) => {
    paddleInstance = p;
    return p;
  });

  return initPromise;
};

export const openProCheckout = async (opts: { email?: string; userId?: string }) => {
  const paddle = await getPaddle();
  if (!paddle) {
    console.error("[paddle] failed to initialize");
    return;
  }
  paddle.Checkout.open({
    items: [{ priceId: PADDLE_PRICE_ID, quantity: 1 }],
    customer: opts.email ? { email: opts.email } : undefined,
    customData: opts.userId ? { user_id: opts.userId } : undefined,
  });
};
