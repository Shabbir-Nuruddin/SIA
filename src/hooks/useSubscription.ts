import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { openProCheckout } from "@/lib/dodo";

export type SubPlan = "free" | "pro";

const TRIAL_DAYS = 3;

export interface SubscriptionState {
  plan: SubPlan;
  isPro: boolean;
  inTrial: boolean;
  trialDaysLeft: number;
  loading: boolean;
  refresh: () => Promise<void>;
  upgrade: (discountCode?: string) => Promise<void>;
}

export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubPlan>("free");
  const [inTrial, setInTrial] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Pricing is disabled: every feature is free for everyone. We always report
    // "pro" so no upgrade gates or paywalls ever show. The Pro/checkout code is
    // intentionally left in place so billing can be switched back on later.
    setPlan("pro");
    setInTrial(false);
    setTrialDaysLeft(0);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const upgrade = useCallback(async (discountCode?: string) => {
    await openProCheckout(discountCode);
  }, []);

  return { plan, isPro: plan === "pro", inTrial, trialDaysLeft, loading, refresh, upgrade };
};
