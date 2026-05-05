import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { applyTheme } from "@/lib/theme";
import { claimDeviceSlot, verifyDeviceSlot, releaseDeviceSlot } from "@/lib/deviceSession";
import { startActivityHeartbeat, stopActivityHeartbeat } from "@/lib/activityHeartbeat";
import { toast } from "sonner";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: true, signOut: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const claimedForUserRef = useRef<string | null>(null);
  const pollRef = useRef<number | null>(null);

  const forceSignOut = async (reason: string) => {
    toast.error(reason);
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);
      if (s?.user) {
        setTimeout(() => {
          supabase.from("profiles").select("theme").eq("id", s.user.id).single()
            .then(({ data }) => {
              if (data?.theme) applyTheme(data.theme);
            });
        }, 0);
        // Claim device slot on sign-in / refresh (only once per user per session)
        if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && claimedForUserRef.current !== s.user.id)) {
          const uid = s.user.id;
          claimedForUserRef.current = uid;
          setTimeout(() => { claimDeviceSlot(uid).catch(() => {}); }, 0);
          setTimeout(() => { startActivityHeartbeat(); }, 0);
        }
      } else {
        claimedForUserRef.current = null;
        stopActivityHeartbeat();
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Poll device-slot ownership; sign out if another device of the same type took over.
  useEffect(() => {
    if (!session?.user) {
      if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }
    const uid = session.user.id;
    const check = async () => {
      const ok = await verifyDeviceSlot(uid);
      if (!ok) await forceSignOut("Signed out — your account was logged in on another device.");
    };
    // First check after a short delay (gives claim time to land)
    const t = window.setTimeout(check, 5000);
    pollRef.current = window.setInterval(check, 30000);
    const onFocus = () => { check(); };
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearTimeout(t);
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
      window.removeEventListener("focus", onFocus);
    };
  }, [session?.user?.id]);

  return (
    <Ctx.Provider value={{
      user: session?.user ?? null,
      session,
      loading,
      signOut: async () => {
        const uid = session?.user?.id;
        if (uid) await releaseDeviceSlot(uid).catch(() => {});
        await supabase.auth.signOut();
      }
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
