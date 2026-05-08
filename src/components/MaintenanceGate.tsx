import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Wrench } from "lucide-react";

const ALLOWED_EMAIL = "nuruddinshabbir3@gmail.com";
// Bumping this key forces every existing session to be re-evaluated and signs
// out anyone who isn't the allowed account.
const MAINT_VERSION_KEY = "mmr.maint.v1";

export const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (loading) return;
    const run = async () => {
      const seen = localStorage.getItem(MAINT_VERSION_KEY);
      if (user) {
        const email = (user.email || "").toLowerCase();
        if (email !== ALLOWED_EMAIL) {
          // Force-sign-out and show maintenance screen.
          await supabase.auth.signOut();
          setBlocked(true);
        } else {
          localStorage.setItem(MAINT_VERSION_KEY, "1");
        }
      } else if (!seen) {
        // First visit since maintenance went live: clear any stale auth tokens.
        localStorage.setItem(MAINT_VERSION_KEY, "1");
      }
      setChecked(true);
    };
    run();
  }, [user, loading]);

  if (loading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-5">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Make Me Revise is under maintenance</h1>
          <p className="text-muted-foreground">
            We're polishing a few things behind the scenes. The site will be back online very soon — thank you for your
            patience.
          </p>
          <p className="text-xs text-muted-foreground/70 font-mono uppercase tracking-widest">Coming soon</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceGate;
