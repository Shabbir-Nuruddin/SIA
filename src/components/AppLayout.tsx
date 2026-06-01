import { ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { PomodoroPill } from "@/components/PomodoroPill";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { MusicPlayer } from "@/components/MusicPlayer";
import GameLauncher from "@/components/game/GameLauncher";
import { useNotificationScheduler } from "@/lib/useNotificationScheduler";
import { Loader2 } from "lucide-react";

export const AppLayout = ({ children, hideChrome }: { children: ReactNode; hideChrome?: boolean }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
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
  return (
    <div className="h-dvh min-h-screen overflow-hidden flex bg-background study-shell">
      {!chromeHidden && <CountdownOverlay />}
      {!chromeHidden && <AppSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} onOpen={() => setSidebarVisible(true)} />}
      <main className={`flex-1 min-w-0 h-dvh overflow-y-auto overscroll-contain ${chromeHidden ? "" : "pt-11"}`}>{children}</main>
      <PomodoroPill />
      <MusicPlayer />
      {!chromeHidden && <GameLauncher />}
      <FloatingAssistant />
    </div>
  );
};
