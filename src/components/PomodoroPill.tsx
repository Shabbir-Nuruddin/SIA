import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pause, Play, X, Timer, ChevronDown, ChevronUp, Gamepad2 } from "lucide-react";
import {
  formatMMSS,
  getPomoState,
  pausePomodoro,
  resumePomodoro,
  startPomodoro,
  stopPomodoro,
} from "@/lib/pomodoro";
import GameModal from "@/components/game/GameModal";

// Floating Pomodoro pill — always visible (except active mock exam).
// When idle, shows a compact "Start focus" pill. When running, shows countdown.
// User can minimise to a tiny icon, or pause / end.

const MIN_KEY = "apex_pomo_minimised";

export const PomodoroPill = () => {
  const { pathname } = useLocation();
  const [state, setState] = useState(() => getPomoState());
  const [minimised, setMinimised] = useState<boolean>(() => localStorage.getItem(MIN_KEY) === "1");
  const [gameOpen, setGameOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const s = getPomoState();
      setState(s);
      if (s.active && !s.paused && s.remainingSeconds === 0) {
        playChime();
        if (s.mode === "focus") {
          notify("Focus complete — break starting (5 min)");
          // Auto-cycle into break
          startPomodoro({ mode: "break", minutes: 5, topic: s.topic });
        } else {
          notify("Break over — ready for the next focus session");
          stopPomodoro();
        }
      }
    };
    const id = setInterval(tick, 250);
    const onChange = () => setState(getPomoState());
    window.addEventListener("apex-pomo-change", onChange);
    window.addEventListener("focus", onChange);
    return () => { clearInterval(id); window.removeEventListener("apex-pomo-change", onChange); window.removeEventListener("focus", onChange); };
  }, []);

  const toggleMin = () => {
    setMinimised(m => {
      const next = !m;
      localStorage.setItem(MIN_KEY, next ? "1" : "0");
      return next;
    });
  };

  const hideOnExam = pathname.startsWith("/mock-papers/exam");
  if (hideOnExam) return null;

  // Minimised — tiny round icon
  if (minimised) {
    return (
      <button
        onClick={toggleMin}
        data-tutorial="pomodoro" className="fixed bottom-20 right-5 z-40 h-10 w-10 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{ background: state.active ? (state.mode === "break" ? "hsl(var(--success))" : "hsl(var(--primary))") : "hsl(var(--secondary))" }}
        aria-label="Open Pomodoro"
        title={state.active ? `Pomodoro · ${formatMMSS(state.remainingSeconds)}` : "Start Pomodoro"}
      >
        {state.active ? (
          <span className="text-[10px] font-mono font-bold">{formatMMSS(state.remainingSeconds)}</span>
        ) : (
          <Timer className="h-4 w-4" />
        )}
      </button>
    );
  }

  // Idle — start button
  if (!state.active) {
    return (
      <div
        data-tutorial="pomodoro" className="fixed bottom-20 right-5 z-40 flex items-center gap-1.5 pl-3 pr-1.5 py-2 rounded-full shadow-lg text-foreground border border-primary/30 bg-card ring-1 ring-primary/15 hover:ring-primary/40 transition"
        style={{ minWidth: 184 }}
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <Timer className="h-4 w-4 text-primary shrink-0" />
        <button
          onClick={() => startPomodoro({ mode: "focus", minutes: 25 })}
          className="flex-1 text-left text-sm font-semibold hover:text-primary transition-colors px-1"
          title="Start a 25-min focus session — earn a game on your break"
        >
          Start focus · 25m
        </button>
        <button
          onClick={toggleMin}
          className="p-1 rounded-full hover:bg-secondary transition"
          aria-label="Minimise"
          title="Minimise"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // Active — countdown
  const ratio = state.totalSeconds === 0 ? 0 : (state.totalSeconds - state.remainingSeconds) / state.totalSeconds;
  const C = 2 * Math.PI * 14;
  const isBreak = state.mode === "break";
  const bg = isBreak ? "hsl(var(--success))" : "hsl(var(--primary))";

  return (
    <div
      data-tutorial="pomodoro" className="fixed bottom-20 right-5 z-40 flex items-center gap-2 pl-2.5 pr-1 py-1.5 rounded-full shadow-lg text-white"
      style={{ background: bg, minWidth: 200 }}
    >
      <span className="text-base leading-none">{isBreak ? "☕" : "🍅"}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wider opacity-80 leading-tight">
          {isBreak ? "Break" : "Focus"}{state.paused ? " · paused" : ""}
        </div>
        <div className="font-mono font-bold tabular text-sm leading-tight">
          {formatMMSS(state.remainingSeconds)}
        </div>
      </div>
      <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90 shrink-0">
        <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - ratio)} />
      </svg>
      {/* Break game — greyed out during focus, unlocks on the 5-min break. */}
      <button
        onClick={() => { if (isBreak) setGameOpen(true); }}
        disabled={!isBreak}
        className={`relative p-1 rounded-full transition ${isBreak ? "hover:bg-white/20 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
        aria-label={isBreak ? "Play the break game" : "Game unlocks on your break"}
        title={isBreak ? "Break time — play Revision Runner!" : "Finish your focus session to unlock the break game"}
      >
        <Gamepad2 className="h-3.5 w-3.5" />
        {isBreak && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-300 animate-ping" />}
        {isBreak && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-300" />}
      </button>
      <GameModal open={gameOpen} onOpenChange={setGameOpen} reason="On your break — play till focus time" />
      <button
        onClick={() => state.paused ? resumePomodoro() : pausePomodoro()}
        className="p-1 rounded-full hover:bg-white/20 transition"
        aria-label={state.paused ? "Resume" : "Pause"}
      >
        {state.paused ? <Play className="h-3.5 w-3.5" fill="currentColor" /> : <Pause className="h-3.5 w-3.5" fill="currentColor" />}
      </button>
      <button
        onClick={() => { if (confirm("End this session?")) stopPomodoro(); }}
        className="p-1 rounded-full hover:bg-white/20 transition"
        aria-label="End"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={toggleMin}
        className="p-1 rounded-full hover:bg-white/20 transition"
        aria-label="Minimise"
        title="Minimise"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; o.type = "sine";
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start(); o.stop(ctx.currentTime + 0.6);
  } catch {}
}

function notify(text: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Make Me Revise", { body: text });
    }
  } catch {}
}
