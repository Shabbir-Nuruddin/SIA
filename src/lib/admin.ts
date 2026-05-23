// Admin gate + test-mode hook. Test mode lets an admin appear as a normal student
// (hides admin UI everywhere) without signing out. Stored in localStorage.
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Multiple admin emails are supported. ADMIN_EMAIL stays as the primary owner
// (used for display strings); use isAdminEmail() everywhere for checks.
export const ADMIN_EMAILS = [
  "nuruddinshabbir3@gmail.com",
  "alvyu.official@gmail.com",
] as const;
export const ADMIN_EMAIL = ADMIN_EMAILS[0];

export const isAdminEmail = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);

const TEST_MODE_KEY = "mmr.admin.test_mode";

const read = () => {
  try { return localStorage.getItem(TEST_MODE_KEY) === "1"; } catch { return false; }
};

export const useTestMode = (): [boolean, (v: boolean) => void] => {
  const [v, setV] = useState<boolean>(read);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === TEST_MODE_KEY) setV(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const set = (next: boolean) => {
    try { localStorage.setItem(TEST_MODE_KEY, next ? "1" : "0"); } catch { /* ignore */ }
    setV(next);
    window.dispatchEvent(new CustomEvent("mmr:test-mode-change", { detail: next }));
  };
  return [v, set];
};

/** Returns true only if the current user is an admin AND test mode is OFF. */
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  const [testMode] = useTestMode();
  if (!user) return false;
  if (!isAdminEmail(user.email)) return false;
  return !testMode;
};
