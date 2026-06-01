import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Gamepad2, Lock } from "lucide-react";
import { toast } from "sonner";
import { getPomoState } from "@/lib/pomodoro";
import GameModal from "./GameModal";

/**
 * Standalone, always-visible Break Game launcher (separate from the Pomodoro pill).
 * Locked by default — it only unlocks during a Pomodoro break, which is the whole
 * motivation loop: finish a 25-min focus block → earn your 5-min break game.
 */
export default function GameLauncher() {
  const { pathname } = useLocation();
  const [pomo, setPomo] = useState(() => getPomoState());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => setPomo(getPomoState());
    const id = setInterval(tick, 500);
    window.addEventListener("apex-pomo-change", tick);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("apex-pomo-change", tick);
      window.removeEventListener("focus", tick);
    };
  }, []);

  const hide =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/mock-papers/exam");
  if (hide) return null;

  const isBreak = pomo.active && pomo.mode === "break";

  const onClick = () => {
    if (isBreak) { setOpen(true); return; }
    toast("🎮 Break game locked", {
      description: "Finish a 25-minute Pomodoro focus block — the game unlocks on your 5-minute break.",
    });
  };

  return (
    <>
      <button
        onClick={onClick}
        title={isBreak ? "Break time — play Study Tycoon!" : "Finish your 25-minute Pomodoro block to unlock the break game"}
        className={`fixed bottom-5 left-5 z-40 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full shadow-lg border transition-transform ${
          isBreak
            ? "bg-gradient-to-r from-primary to-accent text-white border-transparent hover:scale-105"
            : "bg-card text-muted-foreground border-border hover:text-foreground"
        }`}
      >
        {isBreak ? (
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 animate-ping" />
            <Gamepad2 className="relative h-5 w-5" />
          </span>
        ) : (
          <Lock className="h-4 w-4" />
        )}
        <span className="text-sm font-bold">{isBreak ? "Play break game" : "Break game"}</span>
      </button>
      <GameModal open={open} onOpenChange={setOpen} reason="On your break — earn marks!" />
    </>
  );
}
