import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { openProCheckout } from "@/lib/dodo";

export type SubPlan = "free" | "pro";

const TRIAL_DAYS = 5;

export interface SubscriptionState {
  plan: SubPlan;
  isPro: boolean;
  inTrial: boolean;
  trialDaysLeft: number;
  loading: boolean;
  refresh: () => Promise<void>;
  upgrade: () => Promise<void>;
}

export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubPlan>("free");
  const [inTrial, setInTrial] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setPlan("free"); setInTrial(false); setTrialDaysLeft(0); setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("is_pro,trial_start_date,is_admin")
      .eq("id", user.id)
      .maybeSingle();

    let isPro = false;
    let trialing = false;
    let daysLeft = 0;
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d: any = data;
      if (d.is_pro || d.is_admin) isPro = true;
      if (d.trial_start_date) {
        const started = new Date(d.trial_start_date).getTime();
        const elapsedDays = (Date.now() - started) / 86400000;
        if (elapsedDays < TRIAL_DAYS) {
          trialing = true;
          daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - elapsedDays));
        }
      }
    }
    setPlan(isPro || trialing ? "pro" : "free");
    setInTrial(trialing);
    setTrialDaysLeft(daysLeft);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const upgrade = useCallback(async () => {
    await openProCheckout();
  }, []);

  return { plan, isPro: plan === "pro", inTrial, trialDaysLeft, loading, refresh, upgrade };
};
