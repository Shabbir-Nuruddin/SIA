import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { applyTheme } from "@/lib/theme";
import { startActivityHeartbeat, stopActivityHeartbeat } from "@/lib/activityHeartbeat";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: true, signOut: async () => {} });

const isInvalidRefreshToken = (error: unknown) => {
  const value = error as { message?: string; code?: string } | null;
  return value?.code === "refresh_token_not_found" || /invalid refresh token|refresh token not found/i.test(value?.message ?? "");
};

const clearStoredAuthSession = () => {
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of Object.keys(storage)) {
      if (key.startsWith("sb-") && key.includes("auth-token")) storage.removeItem(key);
    }
  }
};

const ensureProfile = async (user: User) => {
  const meta = user.user_metadata as Record<string, string | undefined>;
  const fullName = meta.full_name || meta.name || user.email?.split("@")[0] || "Student";
  await supabase.from("profiles").upsert({
    id: user.id,
    display_name: meta.display_name || fullName,
    first_name: meta.first_name || meta.given_name || fullName.split(" ")[0] || null,
    last_name: meta.last_name || meta.family_name || null,
  }, { onConflict: "id", ignoreDuplicates: true });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error && isInvalidRefreshToken(error)) clearStoredAuthSession();
      setSession(error ? null : data.session);
      setLoading(false);

      const authListener = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setLoading(false);
      });
      subscription = authListener.data.subscription;
    }).catch((error) => {
      if (isInvalidRefreshToken(error)) clearStoredAuthSession();
      if (!mounted) return;
      setSession(null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      stopActivityHeartbeat();
      return;
    }
    const uid = session.user.id;
    startActivityHeartbeat();
    ensureProfile(session.user).catch(() => {});
    supabase.from("profiles").select("theme").eq("id", uid).single()
      .then(({ data }) => {
        if (data?.theme) applyTheme(data.theme);
      });
    return () => {
      stopActivityHeartbeat();
    };
  }, [session?.user?.id]);

  return (
    <Ctx.Provider value={{
      user: session?.user ?? null,
      session,
      loading,
      signOut: async () => {
        clearStoredAuthSession();
        setSession(null);
        await supabase.auth.signOut({ scope: "local" });
      }
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
