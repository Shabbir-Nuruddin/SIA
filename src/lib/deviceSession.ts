import { supabase } from "@/integrations/supabase/client";

export type DeviceType = "phone" | "tablet" | "laptop";

const DEVICE_ID_KEY = "mmr_device_id";

export const getDeviceType = (): DeviceType => {
  const ua = navigator.userAgent || "";
  // iPad on iPadOS 13+ reports as Mac — detect via touch
  const isIpad = /iPad/i.test(ua) || (/(Macintosh)/i.test(ua) && navigator.maxTouchPoints > 1);
  if (isIpad) return "tablet";
  if (/Tablet|PlayBook|Silk|Kindle/i.test(ua)) return "tablet";
  // Android tablet heuristic: Android UA without "Mobile"
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android.*Mobile|Opera Mini|IEMobile|BlackBerry/i.test(ua)) return "phone";
  return "laptop";
};

export const getDeviceId = (): string => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

/** Claim this device-type slot for the user, kicking any prior device of the same type. */
export const claimDeviceSlot = async (userId: string): Promise<void> => {
  const device_type = getDeviceType();
  const device_id = getDeviceId();
  const user_agent = navigator.userAgent?.slice(0, 500) ?? null;
  await supabase
    .from("active_device_sessions")
    .upsert(
      { user_id: userId, device_type, device_id, user_agent, last_seen: new Date().toISOString() },
      { onConflict: "user_id,device_type" }
    );
};

/** Returns true if THIS device still owns the slot for its device_type. */
export const verifyDeviceSlot = async (userId: string): Promise<boolean> => {
  const device_type = getDeviceType();
  const device_id = getDeviceId();
  const { data, error } = await supabase
    .from("active_device_sessions")
    .select("device_id")
    .eq("user_id", userId)
    .eq("device_type", device_type)
    .maybeSingle();
  if (error) return true; // network/transient — don't kick the user
  if (!data) return false;
  return data.device_id === device_id;
};

export const releaseDeviceSlot = async (userId: string): Promise<void> => {
  const device_type = getDeviceType();
  const device_id = getDeviceId();
  await supabase
    .from("active_device_sessions")
    .delete()
    .eq("user_id", userId)
    .eq("device_type", device_type)
    .eq("device_id", device_id);
};
