import { useEffect, useRef, useState } from "react";
import { submitScore } from "@/lib/leaderboard";

/**
 * Study Tycoon — an idle/clicker game themed to revision.
 *
 * Tap the brain to earn MARKS, then spend them on study tools (flashcards, coffee,
 * tutors…) that auto-generate marks every second. Progress is saved to localStorage
 * and keeps earning while you're away (offline earnings), so students come back to
 * it each Pomodoro break. Lifetime marks earned = the global leaderboard score.
 */

interface Upgrade { id: string; name: string; emoji: string; baseCost: number; perSec: number; }

// Costs/production tuned on classic idle-game ratios so each tier feels worth saving for.
const UPGRADES: Upgrade[] = [
  { id: "flashcards", name: "Flashcards",    emoji: "🃏", baseCost: 15,        perSec: 0.2 },
  { id: "coffee",     name: "Coffee",        emoji: "☕", baseCost: 110,       perSec: 1 },
  { id: "notes",      name: "AI Notes",      emoji: "📝", baseCost: 1_200,     perSec: 8 },
  { id: "pastpaper",  name: "Past Papers",   emoji: "📄", baseCost: 13_000,    perSec: 47 },
  { id: "buddy",      name: "Study Buddy",   emoji: "🤝", baseCost: 140_000,   perSec: 260 },
  { id: "tutor",      name: "Private Tutor", emoji: "👩‍🏫", baseCost: 1_600_000, perSec: 1_400 },
  { id: "allnighter", name: "All-Nighter",   emoji: "🌙", baseCost: 22_000_000, perSec: 7_800 },
  { id: "galaxy",     name: "Galaxy Brain",  emoji: "🧠", baseCost: 330_000_000, perSec: 44_000 },
];

const SAVE_KEY = "mmr_tycoon_v1";
const NAME_KEY = "mmr_game_name";
const OFFLINE_CAP_S = 4 * 3600;

interface TState { marks: number; totalEarned: number; upgrades: Record<string, number>; lastSeen: number; }
const DEFAULT_STATE: TState = { marks: 0, totalEarned: 0, upgrades: {}, lastSeen: Date.now() };

function loadState(): TState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}
function saveState(s: TState) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...s, lastSeen: Date.now() })); } catch { /* ignore */ }
}

export function formatMarks(n: number): string {
  n = Math.floor(n);
  if (n < 1000) return String(n);
  const units = ["K", "M", "B", "T", "Qa", "Qi"];
  let u = -1, v = n;
  while (v >= 1000 && u < units.length - 1) { v /= 1000; u++; }
  return `${v.toFixed(v < 10 ? 2 : v < 100 ? 1 : 0)}${units[u]}`;
}

const perSecOf = (upg: Record<string, number>) =>
  UPGRADES.reduce((s, u) => s + (upg[u.id] || 0) * u.perSec, 0);
const costOf = (u: Upgrade, count: number) => Math.ceil(u.baseCost * Math.pow(1.15, count));

export default function StudyTycoon({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<TState>(() => loadState());
  const [welcome, setWelcome] = useState<number | null>(null);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; v: number }[]>([]);
  const [pop, setPop] = useState(false);
  const floatId = useRef(0);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const perSec = perSecOf(state.upgrades);
  const perClick = 1 + Math.floor(perSec * 0.05);

  // Offline earnings (once on mount)
  useEffect(() => {
    const s = loadState();
    const elapsed = Math.min(OFFLINE_CAP_S, Math.max(0, (Date.now() - (s.lastSeen || Date.now())) / 1000));
    const earned = Math.floor(perSecOf(s.upgrades) * elapsed * 0.5);
    if (earned > 0) {
      setState((p) => ({ ...p, marks: p.marks + earned, totalEarned: p.totalEarned + earned }));
      setWelcome(earned);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Passive income tick
  useEffect(() => {
    const id = setInterval(() => {
      setState((p) => {
        const ps = perSecOf(p.upgrades);
        if (ps <= 0) return p;
        const add = ps * 0.2;
        return { ...p, marks: p.marks + add, totalEarned: p.totalEarned + add };
      });
    }, 200);
    return () => clearInterval(id);
  }, []);

  // Debounced save
  useEffect(() => { const t = setTimeout(() => saveState(state), 400); return () => clearTimeout(t); }, [state]);

  // Periodic leaderboard submit + final submit/save on unmount
  useEffect(() => {
    const id = setInterval(() => {
      submitScore(localStorage.getItem(NAME_KEY) || "You", Math.floor(stateRef.current.totalEarned));
    }, 20000);
    return () => {
      clearInterval(id);
      saveState(stateRef.current);
      submitScore(localStorage.getItem(NAME_KEY) || "You", Math.floor(stateRef.current.totalEarned));
    };
  }, []);

  const click = (e: React.MouseEvent | React.PointerEvent) => {
    const gain = perClick;
    setState((p) => ({ ...p, marks: p.marks + gain, totalEarned: p.totalEarned + gain }));
    setPop(true);
    setTimeout(() => setPop(false), 90);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (("clientX" in e ? e.clientX : 0) - rect.left) || rect.width / 2;
    const y = (("clientY" in e ? e.clientY : 0) - rect.top) || rect.height / 2;
    const id = ++floatId.current;
    setFloats((f) => [...f, { id, x, y, v: gain }]);
    setTimeout(() => setFloats((f) => f.filter((ff) => ff.id !== id)), 850);
  };

  const buy = (u: Upgrade) =>
    setState((p) => {
      const count = p.upgrades[u.id] || 0;
      const cost = costOf(u, count);
      if (p.marks < cost) return p;
      return { ...p, marks: p.marks - cost, upgrades: { ...p.upgrades, [u.id]: count + 1 } };
    });

  return (
    <div className="select-none">
      <style>{`@keyframes mmrFloatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-46px) scale(1.25)}}`}</style>

      {welcome !== null && (
        <div className="mb-3 rounded-lg bg-primary/10 border border-primary/25 px-3 py-2 text-xs text-primary">
          👋 Welcome back! Your study tools earned <b>+{formatMarks(welcome)}</b> marks while you were away.
        </div>
      )}

      {/* Score header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold tabular-nums leading-none">{formatMarks(state.marks)}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mt-1">marks</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary tabular-nums">{formatMarks(perSec)}/s</div>
          <div className="text-[10px] text-muted-foreground">+{formatMarks(perClick)} / tap</div>
        </div>
      </div>

      {/* Big tap target */}
      <div className="relative flex items-center justify-center mb-4">
        <button
          onPointerDown={click}
          className={`relative h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl flex items-center justify-center text-6xl transition-transform ${pop ? "scale-95" : "hover:scale-105"}`}
          style={{ touchAction: "manipulation" }}
          aria-label="Earn marks"
        >
          🧠
        </button>
        {floats.map((f) => (
          <span
            key={f.id}
            className="pointer-events-none absolute text-sm font-bold text-primary"
            style={{ left: f.x, top: f.y, animation: "mmrFloatUp 0.85s ease-out forwards" }}
          >
            +{formatMarks(f.v)}
          </span>
        ))}
      </div>

      {/* Upgrades */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-2 ${compact ? "max-h-[240px]" : "max-h-[300px]"} overflow-y-auto pr-1`}>
        {UPGRADES.map((u) => {
          const count = state.upgrades[u.id] || 0;
          const cost = costOf(u, count);
          const afford = state.marks >= cost;
          const unlocked = count > 0 || state.totalEarned >= u.baseCost * 0.35;
          if (!unlocked) return null;
          return (
            <button
              key={u.id}
              onClick={() => buy(u)}
              disabled={!afford}
              className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${afford ? "border-primary/40 hover:bg-primary/10 cursor-pointer" : "border-border opacity-60 cursor-not-allowed"}`}
            >
              <span className="text-2xl shrink-0">{u.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{u.name} {count > 0 && <span className="text-muted-foreground font-normal">×{count}</span>}</div>
                <div className="text-[11px] text-muted-foreground">+{formatMarks(u.perSec)} /s each</div>
              </div>
              <div className={`text-xs font-mono font-bold tabular-nums shrink-0 ${afford ? "text-primary" : "text-muted-foreground"}`}>
                {formatMarks(cost)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        Lifetime: <span className="font-bold text-foreground">{formatMarks(state.totalEarned)}</span> marks · this is your leaderboard score
      </div>
    </div>
  );
}
