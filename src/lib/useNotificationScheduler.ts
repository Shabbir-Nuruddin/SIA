import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showNotification, notificationsPermission } from "@/lib/notifications";

// Schedules a single daily browser notification at the user's preferred time.
// localStorage tracks the last fired date so we don't double-fire.
// Polls every 60s while the tab is open. (No service worker — only fires while app is open.)

const KEY = "apex_last_reminder_date";

function localDateString(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function useNotificationScheduler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let timer: number | undefined;

    let prefs: { enabled: boolean; time: string; first_name: string | null } | null = null;

    const loadPrefs = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("notification_enabled,notification_time,first_name")
        .eq("id", user.id)
        .single();
      if (data) prefs = { enabled: !!(data as any).notification_enabled, time: (data as any).notification_time || "16:00:00", first_name: (data as any).first_name };
    };

    const tick = async () => {
      if (cancelled) return;
      if (!prefs) await loadPrefs();
      if (!prefs?.enabled || notificationsPermission() !== "granted") return;

      const now = new Date();
      const today = localDateString(now);
      const last = localStorage.getItem(KEY);
      if (last === today) return;

      const [h, m] = prefs.time.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m || 0, 0, 0);

      // Fire if we're past the target time today and haven't fired yet.
      if (now.getTime() >= target.getTime()) {
        // Check if user has any pending nodes today.
        const { data: nodes } = await supabase
          .from("roadmap_nodes")
          .select("topic_name,subject")
          .eq("user_id", user.id)
          .eq("scheduled_date", today)
          .in("status", ["unlocked", "in_progress"]);
        const count = nodes?.length ?? 0;
        if (count > 0) {
          const first = nodes?.[0];
          showNotification(
            `${prefs.first_name ?? "Hey"} — your study session is ready`,
            count > 1 ? `${count} sessions scheduled today. First up: ${first?.topic_name ?? "your roadmap"}.` : `Today: ${first?.topic_name ?? "your roadmap"}.`
          );
          localStorage.setItem(KEY, today);
        }
      }
    };

    // Initial run + 60s polling.
    tick();
    timer = window.setInterval(tick, 60_000);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [user]);
}
