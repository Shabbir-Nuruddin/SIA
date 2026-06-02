import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { applyTheme } from "@/lib/theme";
import { startActivityHeartbeat, stopActivityHeartbeat } from "@/lib/activityHeartbeat";
import type { UserRole } from "@/lib/auth/validators";

export interface SIAProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  role: UserRole;
  approved: boolean;
  onboarded: boolean;
}

interface AuthCtx {
  user: User | null;
  profile: SIAProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

const isInvalidRefreshToken = (error: unknown) => {
  const value = error as { message?: string; code?: string } | null;
  return (
    value?.code === "refresh_token_not_found" ||
    /invalid refresh token|refresh token not found/i.test(value?.message ?? "")
  );
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
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: meta.display_name || fullName,
      first_name: meta.first_name || meta.given_name || fullName.split(" ")[0] || null,
      last_name: meta.last_name || meta.family_name || null,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
};

const fetchProfile = async (userId: string): Promise<SIAProfile | null> => {
  const { data } = await supabase
    .from("profiles")
    .select("id,first_name,last_name,display_name,email,role,approved,onboarded")
    .eq("id", userId)
    .single();
  if (!data) return null;
  return {
    id: data.id,
    first_name: data.first_name ?? null,
    last_name: data.last_name ?? null,
    display_name: (data as any).display_name ?? null,
    email: (data as any).email ?? null,
    role: ((data as any).role as UserRole) ?? "student",
    approved: (data as any).approved ?? true,
    onboarded: data.onboarded ?? false,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<SIAProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error && isInvalidRefreshToken(error)) clearStoredAuthSession();
        setSession(error ? null : data.session);
        setLoading(false);

        const authListener = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setLoading(false);
        });
        subscription = authListener.data.subscription;
      })
      .catch((error) => {
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
      setProfile(null);
      return;
    }
    const uid = session.user.id;
    startActivityHeartbeat();
    ensureProfile(session.user).catch(() => {});

    fetchProfile(uid).then((p) => setProfile(p));

    supabase
      .from("profiles")
      .select("theme")
      .eq("id", uid)
      .single()
      .then(({ data }) => {
        if (data?.theme) applyTheme(data.theme);
      });

    return () => {
      stopActivityHeartbeat();
    };
  }, [session?.user?.id]);

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        profile,
        session,
        loading,
        signOut: async () => {
          clearStoredAuthSession();
          setSession(null);
          setProfile(null);
          await supabase.auth.signOut({ scope: "local" });
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
