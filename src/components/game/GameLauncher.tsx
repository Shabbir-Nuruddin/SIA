import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Gamepad2, ArrowDown } from "lucide-react";
import { getPomoState } from "@/lib/pomodoro";
import { grantOwnerBonusIfNeeded } from "@/lib/leaderboard";
import GameModal from "./GameModal";
import { formatMarks } from "./StudyTycoon";

/**
 * Standalone game launcher, docked just above the Pomodoro pill (bottom-right) so
 * the timer and its reward sit together. Locked only DURING an active focus block
 * (keeps students studying); freely continuable when idle or on a break. Shows the
 * player's running mark count so progress feels alive even when they're not playing.
 */
function readMarks(): number {
  try { const r = JSON.parse(localStorage.getItem("mmr_tycoon_v3") || "{}"); return Math.floor(r.marks || 0); } catch { return 0; }
}

export default function GameLauncher() {
  const { pathname } = useLocation();
  const [pomo, setPomo] = useState(() => getPomoState());
  const [open, setOpen] = useState(false);
  const [marks, setMarks] = useState(() => readMarks());
  const [nudge, setNudge] = useState(false);

  useEffect(() => { grantOwnerBonusIfNeeded().then(() => setMarks(readMarks())); }, []);

  useEffect(() => {
    const tick = () => { setPomo(getPomoState()); setMarks(readMarks()); };
    const id = setInterval(tick, 1000);
    window.addEventListener("apex-pomo-change", tick);
    window.addEventListener("focus", tick);
    return () => { clearInterval(id); window.removeEventListener("apex-pomo-change", tick); window.removeEventListener("focus", tick); };
  }, []);

  const hide =
    pathname === "/" || pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") || pathname.startsWith("/mock-papers/exam");
  if (hide) return null;

  const isBreak = pomo.active && pomo.mode === "break";
  const hasProgress = marks > 0;

  const handleClose = (v: boolean) => {
    setOpen(v);
    if (!v && readMarks() > 0) { setNudge(true); setTimeout(() => setNudge(false), 6000); }
  };

  // Always playable — a reward you can dip into any time (incl. while things load).
  // The Pomodoro break just promotes/celebrates it rather than gating it.
  const label = isBreak ? "Break bonus — play!" : hasProgress ? `Continue · ${formatMarks(marks)}` : "Brain game";

  return (
    <>
      {nudge && (
        <div className="fixed bottom-[12.5rem] right-5 z-40 max-w-[220px] rounded-xl border border-primary/40 bg-card p-3 shadow-xl animate-fade-in">
          <div className="text-xs font-semibold mb-0.5">Your game is saved ✅</div>
          <div className="text-[11px] text-muted-foreground">Continue any time from here →</div>
          <ArrowDown className="absolute -bottom-2 right-6 h-4 w-4 text-primary animate-bounce" />
        </div>
      )}

      <button
        data-tutorial="break-game"
        onClick={() => setOpen(true)}
        title={isBreak ? "Break time — play the Break Arcade!" : "Open the Break Arcade — earn marks, climb the leaderboard"}
        className={`fixed bottom-32 right-5 z-40 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full shadow-lg border transition-transform hover:scale-105 ${
          isBreak
            ? "bg-gradient-to-r from-primary to-accent text-white border-transparent"
            : "bg-card text-foreground border-primary/30 ring-1 ring-primary/15 hover:ring-primary/40"
        }`}
        style={{ minWidth: 150 }}
      >
        <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
          {isBreak && <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 animate-ping" />}
          <Gamepad2 className="relative h-5 w-5" />
        </span>
        <span className="text-sm font-bold truncate">{label}</span>
      </button>

      <GameModal open={open} onOpenChange={handleClose} reason={isBreak ? "On your break — earn marks!" : "Earn marks & climb the board"} />
    </>
  );
}
