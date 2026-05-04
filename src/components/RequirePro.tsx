import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

/**
 * Wrap a route to require an active Pro plan or trial.
 * Free users get a clear toast and are redirected to /pricing.
 */
export const RequirePro = ({ children, featureName }: { children: ReactNode; featureName: string }) => {
  const { isPro, loading } = useSubscription();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!isPro) {
    toast.error(`${featureName} is a Pro feature.`, {
      description: "Start your 5-day free trial to unlock it. You won't be charged during the trial.",
    });
    return <Navigate to="/pricing" replace />;
  }
  return <>{children}</>;
};
