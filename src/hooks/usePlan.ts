import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  evaluateLimit,
  getPlanState,
  incrementUsage,
  type LimitKey,
  type PlanState,
  LIMIT_LABELS,
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
    async (key: LimitKey, currentSubjectsCount?: number): Promise<boolean> => {
      const fresh = await getPlanState();
      if (!fresh) return false;
      setState(fresh);
      const result = evaluateLimit(fresh, key, currentSubjectsCount);
      if (!result.allowed) {
        setUpgrade({ open: true, key, used: result.used, limit: result.limit });
        return false;
      }
      if (result.warnSoft) {
        toast.warning(
          `${result.remaining} ${LIMIT_LABELS[key]} left on free plan`,
          { description: "Upgrade to Pro for unlimited access.", action: { label: "Upgrade", onClick: () => (window.location.href = "/pricing") } },
        );
      }
      return true;
    },
    [],
  );

  const bumpUsage = useCallback(async (key: Parameters<typeof incrementUsage>[0]) => {
    await incrementUsage(key);
    await refresh();
  }, [refresh]);

  const closeUpgrade = useCallback(() => setUpgrade((u) => ({ ...u, open: false })), []);

  return { state, loading, refresh, checkAndWarn, bumpUsage, upgrade, closeUpgrade };
};
