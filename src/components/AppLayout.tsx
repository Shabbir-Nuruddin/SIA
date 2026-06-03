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
import { Loader2, ChevronDown, Wrench } from "lucide-react";

export const AppLayout = ({ children, hideChrome }: { children: ReactNode; hideChrome?: boolean }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // Collapse the floating tools cluster (game / focus / music / assistant) so it
  // doesn't clutter the screen — persisted, like the sidebar's collapsed state.
  const [dockOpen, setDockOpen] = useState(() => {
    try { return localStorage.getItem("sia_dock_open") !== "0"; } catch { return true; }
  });
  // Whether the exam countdown bar is currently showing — drives the top inset so
  // we only reserve the 44px strip when there's actually an upcoming exam.
  const [countdownVisible, setCountdownVisible] = useState(false);
  const toggleDock = (open: boolean) => {
    setDockOpen(open);
    try { localStorage.setItem("sia_dock_open", open ? "1" : "0"); } catch { /* ignore */ }
  };
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
      {!chromeHidden && <CountdownOverlay onVisibilityChange={setCountdownVisible} />}
      {!chromeHidden && <AppSidebar visible={sidebarVisible} topInset={countdownVisible} onClose={() => setSidebarVisible(false)} onOpen={() => setSidebarVisible(true)} />}
      {/* Top inset rules:
          - mobile: always reserve 44px for the fixed hamburger button.
          - desktop: reserve 44px ONLY when the exam countdown bar is showing,
            otherwise flush to the top (no dead white strip). */}
      <main className={`flex-1 min-w-0 h-dvh overflow-y-auto overscroll-contain ${chromeHidden ? "" : `pt-11 ${countdownVisible ? "lg:pt-11" : "lg:pt-0"}`}`}>{children}</main>

      {/* Floating tools cluster. In exam mode (chromeHidden) it stays as-is. On
          normal pages it can be minimised to a single small button. */}
      {chromeHidden ? (
        <>
          <PomodoroPill />
          <MusicPlayer />
          <FloatingAssistant />
        </>
      ) : dockOpen ? (
        <>
          <GameLauncher />
          <PomodoroPill />
          <MusicPlayer />
          <FloatingAssistant />
          <button
            onClick={() => toggleDock(false)}
            title="Hide tools"
            aria-label="Hide floating tools"
            className="fixed bottom-44 right-5 z-40 flex items-center gap-1 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground shadow-md backdrop-blur hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ChevronDown className="h-3.5 w-3.5" /> Hide
          </button>
        </>
      ) : (
        <button
          onClick={() => toggleDock(true)}
          title="Show tools (game, focus timer, music, assistant)"
          aria-label="Show floating tools"
          className="fixed bottom-5 right-5 z-40 h-11 w-11 rounded-full bg-card border border-primary/30 ring-1 ring-primary/15 shadow-lg flex items-center justify-center text-primary hover:scale-105 transition-transform"
        >
          <Wrench className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
