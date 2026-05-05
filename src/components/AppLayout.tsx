import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { TodayProgressBar } from "@/components/TodayProgressBar";
import { PomodoroPill } from "@/components/PomodoroPill";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useNotificationScheduler } from "@/lib/useNotificationScheduler";
import { Loader2, Wrench } from "lucide-react";

export const AppLayout = ({ children, hideChrome }: { children: ReactNode; hideChrome?: boolean }) => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  useNotificationScheduler();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (!user) return <Navigate to="/auth" replace />;

  const isExam = pathname.startsWith("/mock-papers/exam");
  const chromeHidden = hideChrome || isExam;
  const topOffset = chromeHidden ? 0 : 52;

  return (
    <div className="min-h-screen flex bg-background" style={{ paddingTop: topOffset }}>
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500/90 text-black text-center text-sm font-medium py-2 flex items-center justify-center gap-2">
        <Wrench className="h-4 w-4" /> AI features are temporarily under maintenance while we make improvements. Back
        very soon.
      </div>
      {!chromeHidden && <CountdownOverlay />}
      {!chromeHidden && <TodayProgressBar />}
      {!chromeHidden && <AppSidebar />}
      <main className="flex-1 overflow-x-hidden min-w-0">{children}</main>
      <PomodoroPill />
      <MusicPlayer />
      <FloatingAssistant />
    </div>
  );
};
