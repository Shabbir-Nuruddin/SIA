import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { openProCheckout } from "@/lib/paddle";

export type SubPlan = "free" | "pro";

export interface SubscriptionState {
  plan: SubPlan;
  isPro: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  upgrade: () => Promise<void>;
}

export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubPlan>("free");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setPlan("free");
      setLoading(false);
      return;
    }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("subscriptions") as any)
      .select("plan,expires_at,status")
      .eq("user_id", user.id)
      .maybeSingle();

    let resolved: SubPlan = "free";
    if (data?.plan === "pro" && data?.status !== "cancelled") {
      const exp = data.expires_at ? new Date(data.expires_at).getTime() : 0;
      if (!exp || exp > Date.now()) resolved = "pro";
    }
    setPlan(resolved);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const upgrade = useCallback(async () => {
    await openProCheckout({ email: user?.email, userId: user?.id });
  }, [user]);

  return { plan, isPro: plan === "pro", loading, refresh, upgrade };
};
