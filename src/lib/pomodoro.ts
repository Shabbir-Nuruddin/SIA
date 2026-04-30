// Persistent Pomodoro state — survives navigation, tab switches, refresh.
// All countdown rendering reads this on every tick (calculated from start timestamp,
// not driven by setInterval).

const KEY_START = "apex_pomo_start";
const KEY_DURATION = "apex_pomo_duration_s";
const KEY_MODE = "apex_pomo_mode";       // "focus" | "break"
const KEY_PAUSED_AT = "apex_pomo_paused_at";
const KEY_TOPIC = "apex_pomo_topic";

export type PomoMode = "focus" | "break";

export interface PomoState {
  active: boolean;
  paused: boolean;
  mode: PomoMode;
  remainingSeconds: number;
  totalSeconds: number;
  topic?: string;
}

export function getPomoState(): PomoState {
  if (typeof window === "undefined") return { active: false, paused: false, mode: "focus", remainingSeconds: 0, totalSeconds: 0 };
  const start = localStorage.getItem(KEY_START);
  const duration = localStorage.getItem(KEY_DURATION);
  if (!start || !duration) return { active: false, paused: false, mode: "focus", remainingSeconds: 0, totalSeconds: 0 };
  const totalSeconds = parseInt(duration, 10);
  const startMs = parseInt(start, 10);
  const pausedAt = localStorage.getItem(KEY_PAUSED_AT);
  const mode = (localStorage.getItem(KEY_MODE) as PomoMode) || "focus";
  const topic = localStorage.getItem(KEY_TOPIC) || undefined;
  const reference = pausedAt ? parseInt(pausedAt, 10) : Date.now();
  const elapsed = Math.floor((reference - startMs) / 1000);
  const remaining = Math.max(0, totalSeconds - elapsed);
  return {
    active: true,
    paused: !!pausedAt,
    mode,
    remainingSeconds: remaining,
    totalSeconds,
    topic,
  };
}

export function startPomodoro(opts: { mode?: PomoMode; minutes?: number; topic?: string } = {}) {
  const mode = opts.mode || "focus";
  const minutes = opts.minutes ?? (mode === "focus" ? 25 : 5);
  localStorage.setItem(KEY_START, String(Date.now()));
  localStorage.setItem(KEY_DURATION, String(minutes * 60));
  localStorage.setItem(KEY_MODE, mode);
  localStorage.removeItem(KEY_PAUSED_AT);
  if (opts.topic) localStorage.setItem(KEY_TOPIC, opts.topic);
  else localStorage.removeItem(KEY_TOPIC);
  window.dispatchEvent(new CustomEvent("apex-pomo-change"));
}

export function pausePomodoro() {
  if (!localStorage.getItem(KEY_PAUSED_AT)) {
    localStorage.setItem(KEY_PAUSED_AT, String(Date.now()));
    window.dispatchEvent(new CustomEvent("apex-pomo-change"));
  }
}

export function resumePomodoro() {
  const pausedAt = localStorage.getItem(KEY_PAUSED_AT);
  const start = localStorage.getItem(KEY_START);
  if (pausedAt && start) {
    const drift = Date.now() - parseInt(pausedAt, 10);
    localStorage.setItem(KEY_START, String(parseInt(start, 10) + drift));
    localStorage.removeItem(KEY_PAUSED_AT);
    window.dispatchEvent(new CustomEvent("apex-pomo-change"));
  }
}

export function stopPomodoro() {
  localStorage.removeItem(KEY_START);
  localStorage.removeItem(KEY_DURATION);
  localStorage.removeItem(KEY_MODE);
  localStorage.removeItem(KEY_PAUSED_AT);
  localStorage.removeItem(KEY_TOPIC);
  window.dispatchEvent(new CustomEvent("apex-pomo-change"));
}

export function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
