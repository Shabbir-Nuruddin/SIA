import { useCallback, useEffect, useState } from "react";
import {
  getPlanState,
  incrementUsage,
  type LimitKey,
  type PlanState,
} from "@/lib/plan";

export const usePlan = () => {
  const [state, setState] = useState<PlanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrade, setUpgrade] = useState<{ open: boolean; key: LimitKey; used: number; limit: number }>({
    open: false, key: "questions_per_day", used: 0, limit: 0,
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    setState(await getPlanState());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /**
   * Check if the user can perform an action.
   * - Returns true if allowed; shows soft-warning toast at >=80%.
   * - Returns false and opens upgrade modal if blocked.
   */
  const checkAndWarn = useCallback(
    // Pricing is disabled: nothing is ever gated, so every action is allowed and
    // no upgrade modal or usage warning is shown. (Args kept for call-site compat.)
    async (_key: LimitKey, _currentSubjectsCount?: number): Promise<boolean> => true,
    [],
  );

  const bumpUsage = useCallback(async (key: Parameters<typeof incrementUsage>[0]) => {
    await incrementUsage(key);
    await refresh();
  }, [refresh]);

  const closeUpgrade = useCallback(() => setUpgrade((u) => ({ ...u, open: false })), []);

  return { state, loading, refresh, checkAndWarn, bumpUsage, upgrade, closeUpgrade };
};
