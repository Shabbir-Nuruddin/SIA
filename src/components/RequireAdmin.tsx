import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_EMAIL } from "@/lib/admin";

/**
 * Gate a route to the admin account only. Non-admins are bounced to /dashboard.
 * Used for Roadmap, Mock Papers, Exam FAQs, Podcast and Clarity Compass while
 * those features are still admin-only previews.
 */
export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export default RequireAdmin;
