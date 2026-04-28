import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { Loader2 } from "lucide-react";

export const AppLayout = ({ children, hideChrome }: { children: ReactNode; hideChrome?: boolean }) => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const isExam = pathname.startsWith("/mock-papers/exam");
  const chromeHidden = hideChrome || isExam;

  return (
    <div className="min-h-screen flex bg-background" style={{ paddingTop: chromeHidden ? 0 : 36 }}>
      {!chromeHidden && <CountdownOverlay />}
      {!chromeHidden && <AppSidebar />}
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
};
