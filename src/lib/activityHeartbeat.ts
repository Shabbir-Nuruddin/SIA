import { supabase } from "@/integrations/supabase/client";

let interval: number | null = null;

const ping = async () => {
  if (document.hidden) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("record_activity_heartbeat");
};

export const startActivityHeartbeat = () => {
  stopActivityHeartbeat();
  // initial ping creates the row, subsequent pings every 60s add elapsed time
  ping().catch(() => {});
  interval = window.setInterval(() => { ping().catch(() => {}); }, 60_000);
  document.addEventListener("visibilitychange", onVisibility);
};

export const stopActivityHeartbeat = () => {
  if (interval) { window.clearInterval(interval); interval = null; }
  document.removeEventListener("visibilitychange", onVisibility);
};

const onVisibility = () => { if (!document.hidden) ping().catch(() => {}); };
