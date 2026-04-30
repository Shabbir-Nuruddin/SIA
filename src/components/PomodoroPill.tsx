import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pause, Play, X } from "lucide-react";
import {
  formatMMSS,
  getPomoState,
  pausePomodoro,
  resumePomodoro,
  stopPomodoro,
} from "@/lib/pomodoro";

// Floating Pomodoro pill — visible on every page except active mock exam.
// Reads timer state from localStorage on every render — survives navigation.

export const PomodoroPill = () => {
  const { pathname } = useLocation();
  const [state, setState] = useState(() => getPomoState());

  // Recompute every 250ms while a session is active
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const s = getPomoState();
      setState(s);
      if (s.active && !s.paused && s.remainingSeconds === 0) {
        playChime();
        notify(s.mode === "focus" ? "Focus session complete" : "Break over");
        stopPomodoro();
      }
    };
    const id = setInterval(tick, 250);
    const onChange = () => setState(getPomoState());
    window.addEventListener("apex-pomo-change", onChange);
    window.addEventListener("focus", onChange);
    return () => { clearInterval(id); cancelAnimationFrame(raf); window.removeEventListener("apex-pomo-change", onChange); window.removeEventListener("focus", onChange); };
  }, []);

  const hideOnExam = pathname.startsWith("/mock-papers/exam");
  if (hideOnExam || !state.active) return null;

  const ratio = state.totalSeconds === 0 ? 0 : (state.totalSeconds - state.remainingSeconds) / state.totalSeconds;
  const C = 2 * Math.PI * 14;
  const isBreak = state.mode === "break";
  const bg = isBreak ? "hsl(var(--success))" : "hsl(var(--primary))";

  return (
    <div
      className="fixed bottom-20 right-5 z-40 flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full shadow-lg text-white"
      style={{ background: bg, minWidth: 180 }}
    >
      <span className="text-base leading-none">{isBreak ? "☕" : "🍅"}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wider opacity-80 leading-tight">
          {isBreak ? "Break" : "Focus"}
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
      new Notification("Apex", { body: text });
    }
  } catch {}
}
