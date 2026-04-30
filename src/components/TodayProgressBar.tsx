import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Thin 8px progress bar showing % of today's roadmap sessions completed.
// Sits directly under the countdown bar.

export const TodayProgressBar = () => {
  const { user } = useAuth();
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);

  const load = async () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("roadmap_sessions")
      .select("status")
      .eq("user_id", user.id)
      .eq("session_date", today);
    if (data) {
      setTotal(data.length);
      setDone(data.filter((d: any) => d.status === "complete").length);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    const handler = () => load();
    window.addEventListener("apex-roadmap-change", handler);
    return () => { clearInterval(id); window.removeEventListener("apex-roadmap-change", handler); };
  }, [user]);

  if (!user || total === 0) return null;
  const pct = Math.round((done / total) * 100);

  return (
    <div
      className="fixed left-0 right-0 z-40 group"
      style={{ top: 44, height: 8, background: "hsl(var(--background-elevated))" }}
      title={`${done} of ${total} tasks complete today`}
    >
      <div
        className="h-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: pct === 100
            ? "hsl(var(--success))"
            : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
        }}
      />
      <div className="absolute right-2 top-2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition pointer-events-none bg-background-elevated px-1.5 py-0.5 rounded">
        {done}/{total} today
      </div>
    </div>
  );
};
