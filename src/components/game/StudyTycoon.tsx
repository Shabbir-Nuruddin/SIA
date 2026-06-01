import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import { submitScore, getLeaderboard, getPersonalBest, type ScoreRow, type GameId } from "@/lib/leaderboard";

/**
 * Study Tycoon — a polished idle/clicker game themed to revision, with a second
 * CPS Test mode. Tap the brain to earn MARKS; buy study tools (some boost your
 * tap power, some auto-earn). Golden notes drift past for bonus bursts. Progress
 * saves + earns offline. Lifetime marks = the Study Tycoon leaderboard; the CPS
 * Test (clicks in a 5s sprint) has its own board.
 */

type Mode = "tycoon" | "cps";
type UpKind = "auto" | "click";
interface Upgrade { id: string; name: string; emoji: string; baseCost: number; kind: UpKind; rate: number; desc: string; }

const UPGRADES: Upgrade[] = [
  { id: "flashcards", name: "Flashcards",    emoji: "🃏", baseCost: 15,        kind: "auto",  rate: 0.3,    desc: "A deck that quietly drills itself." },
  { id: "highlighter",name: "Highlighter",   emoji: "🖊️", baseCost: 60,        kind: "click", rate: 1,      desc: "Every tap is worth more." },
  { id: "coffee",     name: "Coffee",        emoji: "☕", baseCost: 110,       kind: "auto",  rate: 1.5,    desc: "The original study drug." },
  { id: "energy",     name: "Energy Drink",  emoji: "🥤", baseCost: 1_200,     kind: "click", rate: 4,      desc: "Wings optional. Taps supercharged." },
  { id: "notes",      name: "AI Notes",      emoji: "📝", baseCost: 1_400,     kind: "auto",  rate: 9,      desc: "Notes that revise while you sleep." },
  { id: "pastpaper",  name: "Past Papers",   emoji: "📄", baseCost: 14_000,    kind: "auto",  rate: 50,     desc: "Past papers predict the future." },
  { id: "buddy",      name: "Study Buddy",   emoji: "🤝", baseCost: 150_000,   kind: "auto",  rate: 280,    desc: "Keeps you accountable." },
  { id: "tutor",      name: "Private Tutor", emoji: "👩‍🏫", baseCost: 1_600_000, kind: "auto",  rate: 1_500,  desc: "On permanent retainer." },
  { id: "allnighter", name: "All-Nighter",   emoji: "🌙", baseCost: 22_000_000, kind: "auto", rate: 8_200,  desc: "Sleep is for after exams." },
  { id: "galaxy",     name: "Galaxy Brain",  emoji: "🧠", baseCost: 330_000_000, kind: "auto", rate: 46_000, desc: "Your brain achieves orbit." },
];

const SAVE_KEY = "mmr_tycoon_v2";
const NAME_KEY = "mmr_game_name";
const MS_KEY = "mmr_tycoon_milestones";
const OFFLINE_CAP_S = 4 * 3600;
const MILESTONES = [1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

interface TState { marks: number; totalEarned: number; clicks: number; upgrades: Record<string, number>; lastSeen: number; }
const DEFAULT_STATE: TState = { marks: 0, totalEarned: 0, clicks: 0, upgrades: {}, lastSeen: Date.now() };

function loadState(): TState {
  try { const raw = localStorage.getItem(SAVE_KEY); if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }; } catch { /* ignore */ }
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

const autoOf = (upg: Record<string, number>) =>
  UPGRADES.reduce((s, u) => s + (u.kind === "auto" ? (upg[u.id] || 0) * u.rate : 0), 0);
const clickBonus = (upg: Record<string, number>) =>
  UPGRADES.reduce((s, u) => s + (u.kind === "click" ? (upg[u.id] || 0) * u.rate : 0), 0);
const costOf = (u: Upgrade, count: number) => Math.ceil(u.baseCost * Math.pow(1.15, count));

// ─────────────────────────────────────────────────────────────────────────────
export default function StudyTycoon({ compact = false, showLeaderboard = false }: { compact?: boolean; showLeaderboard?: boolean }) {
  const [mode, setMode] = useState<Mode>("tycoon");

  return (
    <div className="select-none">
      <style>{`
        @keyframes mmrFloatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-52px) scale(1.3)}}
        @keyframes mmrDrift{0%{transform:translateY(110%) translateX(0);opacity:0}10%{opacity:.5}90%{opacity:.5}100%{transform:translateY(-20%) translateX(18px);opacity:0}}
        @keyframes mmrGolden{0%{left:-12%}100%{left:112%}}
      `}</style>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-3 p-1 rounded-lg bg-secondary/60 w-fit">
        {(["tycoon", "cps"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {m === "tycoon" ? "🧠 Study Tycoon" : "⚡ CPS Test"}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${showLeaderboard && !compact ? "md:grid-cols-[1.4fr_1fr]" : "grid-cols-1"}`}>
        <div>
          {mode === "tycoon" ? <TycoonMode compact={compact} /> : <CpsMode />}
          <NameField />
        </div>
        {showLeaderboard && !compact && <Leaderboard game={mode === "cps" ? "cps_test" : "study_tycoon"} />}
      </div>
    </div>
  );
}

// ─── Shared bits ──────────────────────────────────────────────────────────────
function NameField() {
  const [name, setName] = useState<string>(() => { try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; } });
  return (
    <input
      value={name}
      onChange={(e) => { setName(e.target.value); try { localStorage.setItem(NAME_KEY, e.target.value); } catch { /* ignore */ } }}
      placeholder="Your leaderboard name"
      maxLength={24}
      className="mt-3 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
    />
  );
}

function Leaderboard({ game }: { game: GameId }) {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  useEffect(() => {
    let alive = true;
    const load = () => getLeaderboard(15, game).then((r) => { if (alive) setRows(r); }).catch(() => {});
    load();
    const id = setInterval(load, 6000);
    return () => { alive = false; clearInterval(id); };
  }, [game]);
  const fmt = (n: number) => (game === "cps_test" ? `${(n / 5).toFixed(1)} cps` : formatMarks(n));
  return (
    <div className="rounded-xl border border-border bg-background-elevated p-3 h-fit">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
        <Crown className="h-3.5 w-3.5 text-amber-400" /> Top 15
      </div>
      <ol className="space-y-0.5 max-h-[320px] overflow-y-auto">
        {rows.map((r, i) => (
          <li key={`${r.name}-${i}`} className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${r.you ? "bg-primary/15 text-primary font-semibold" : ""}`}>
            <span className={`w-5 text-right tabular-nums ${i < 3 ? "text-amber-400 font-bold" : "text-muted-foreground"}`}>{i + 1}</span>
            <span className="flex-1 truncate">{r.name}{r.you ? " (you)" : ""}</span>
            <span className="font-mono tabular-nums">{fmt(r.score)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const BG_EMOJI = ["📚", "✏️", "🧪", "📐", "⚗️", "🧬", "📝", "🔬"];
function GameBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />
      {BG_EMOJI.map((e, i) => (
        <span
          key={i}
          className="absolute text-xl"
          style={{ left: `${8 + i * 11}%`, bottom: 0, animation: `mmrDrift ${9 + (i % 4) * 2}s linear ${i * 1.3}s infinite` }}
        >{e}</span>
      ))}
    </div>
  );
}

// ─── Tycoon mode ──────────────────────────────────────────────────────────────
function TycoonMode({ compact }: { compact: boolean }) {
  const [state, setState] = useState<TState>(() => loadState());
  const [welcome, setWelcome] = useState<number | null>(null);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; v: number }[]>([]);
  const [pop, setPop] = useState(false);
  const [golden, setGolden] = useState<{ id: number } | null>(null);
  const floatId = useRef(0);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const auto = autoOf(state.upgrades);
  const perClick = Math.max(1, 1 + clickBonus(state.upgrades) + Math.floor(auto * 0.04));

  // offline earnings (once)
  useEffect(() => {
    const s = loadState();
    const elapsed = Math.min(OFFLINE_CAP_S, Math.max(0, (Date.now() - (s.lastSeen || Date.now())) / 1000));
    const earned = Math.floor(autoOf(s.upgrades) * elapsed * 0.5);
    if (earned > 0) {
      setState((p) => ({ ...p, marks: p.marks + earned, totalEarned: p.totalEarned + earned }));
      setWelcome(earned);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // passive tick + milestone checks
  useEffect(() => {
    const id = setInterval(() => {
      setState((p) => {
        const a = autoOf(p.upgrades);
        if (a <= 0) return p;
        const next = { ...p, marks: p.marks + a * 0.2, totalEarned: p.totalEarned + a * 0.2 };
        checkMilestone(next.totalEarned);
        return next;
      });
    }, 200);
    return () => clearInterval(id);
  }, []);

  // golden note spawner
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => { t = setTimeout(() => { setGolden({ id: Date.now() }); setTimeout(() => setGolden(null), 6000); schedule(); }, 25000 + Math.random() * 30000); };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // save (debounced) + submit on unmount + periodic submit
  useEffect(() => { const t = setTimeout(() => saveState(state), 400); return () => clearTimeout(t); }, [state]);
  useEffect(() => {
    const id = setInterval(() => submitScore(localStorage.getItem(NAME_KEY) || "You", Math.floor(stateRef.current.totalEarned), "study_tycoon"), 20000);
    return () => { clearInterval(id); saveState(stateRef.current); submitScore(localStorage.getItem(NAME_KEY) || "You", Math.floor(stateRef.current.totalEarned), "study_tycoon"); };
  }, []);

  const addFloat = (x: number, y: number, v: number) => {
    const id = ++floatId.current;
    setFloats((f) => [...f, { id, x, y, v }]);
    setTimeout(() => setFloats((f) => f.filter((ff) => ff.id !== id)), 850);
  };

  const click = (e: React.PointerEvent) => {
    const gain = perClick;
    setState((p) => ({ ...p, marks: p.marks + gain, totalEarned: p.totalEarned + gain, clicks: p.clicks + 1 }));
    setPop(true); setTimeout(() => setPop(false), 90);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    addFloat(e.clientX - rect.left, e.clientY - rect.top, gain);
  };

  const grabGolden = () => {
    const bonus = Math.max(50, Math.floor(auto * 45), perClick * 20);
    setState((p) => ({ ...p, marks: p.marks + bonus, totalEarned: p.totalEarned + bonus }));
    setGolden(null);
    toast("✨ Golden note!", { description: `+${formatMarks(bonus)} marks` });
  };

  const buy = (u: Upgrade) =>
    setState((p) => {
      const count = p.upgrades[u.id] || 0;
      const cost = costOf(u, count);
      if (p.marks < cost) return p;
      return { ...p, marks: p.marks - cost, upgrades: { ...p.upgrades, [u.id]: count + 1 } };
    });

  return (
    <div>
      {welcome !== null && (
        <div className="mb-3 rounded-lg bg-primary/10 border border-primary/25 px-3 py-2 text-xs text-primary">
          👋 Welcome back! Your study tools earned <b>+{formatMarks(welcome)}</b> while you were away.
        </div>
      )}

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold tabular-nums leading-none">{formatMarks(state.marks)}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mt-1">marks</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary tabular-nums">{formatMarks(auto)}/s</div>
          <div className="text-[10px] text-muted-foreground">+{formatMarks(perClick)} / tap</div>
        </div>
      </div>

      {/* Tap arena */}
      <div className="relative flex items-center justify-center h-44 mb-3 rounded-2xl border border-border bg-background-elevated overflow-hidden">
        <GameBackground />
        {golden && (
          <button
            onClick={grabGolden}
            className="absolute top-3 text-3xl z-10 hover:scale-125 transition-transform"
            style={{ animation: "mmrGolden 6s linear forwards" }}
            title="Quick! Grab the golden note"
          >✨</button>
        )}
        <button
          onPointerDown={click}
          className={`relative z-[1] h-28 w-28 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl flex items-center justify-center text-5xl transition-transform ${pop ? "scale-90" : "hover:scale-105"}`}
          style={{ touchAction: "manipulation", boxShadow: "0 10px 30px hsl(var(--primary)/0.45)" }}
          aria-label="Earn marks"
        >🧠</button>
        {floats.map((f) => (
          <span key={f.id} className="pointer-events-none absolute text-sm font-bold text-primary z-10" style={{ left: `calc(50% + ${f.x - 88}px)`, top: f.y, animation: "mmrFloatUp 0.85s ease-out forwards" }}>
            +{formatMarks(f.v)}
          </span>
        ))}
      </div>

      {/* Upgrades */}
      <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-2 ${compact ? "max-h-[200px]" : "max-h-[280px]"} overflow-y-auto pr-1`}>
        {UPGRADES.map((u) => {
          const count = state.upgrades[u.id] || 0;
          const cost = costOf(u, count);
          const afford = state.marks >= cost;
          const unlocked = count > 0 || state.totalEarned >= u.baseCost * 0.3;
          if (!unlocked) return null;
          return (
            <button key={u.id} onClick={() => buy(u)} disabled={!afford}
              className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${afford ? "border-primary/40 hover:bg-primary/10 cursor-pointer" : "border-border opacity-60 cursor-not-allowed"}`}>
              <span className="text-2xl shrink-0">{u.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{u.name} {count > 0 && <span className="text-muted-foreground font-normal">×{count}</span>}</div>
                <div className="text-[11px] text-muted-foreground truncate">{u.desc}</div>
                <div className="text-[10px] text-primary/80">{u.kind === "auto" ? `+${formatMarks(u.rate)}/s each` : `+${formatMarks(u.rate)} / tap each`}</div>
              </div>
              <div className={`text-xs font-mono font-bold tabular-nums shrink-0 ${afford ? "text-primary" : "text-muted-foreground"}`}>{formatMarks(cost)}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        Lifetime <span className="font-bold text-foreground">{formatMarks(state.totalEarned)}</span> · {state.clicks.toLocaleString()} taps · this is your leaderboard score
      </div>
    </div>
  );
}

function checkMilestone(total: number) {
  let reached: number[] = [];
  try { reached = JSON.parse(localStorage.getItem(MS_KEY) || "[]"); } catch { /* ignore */ }
  for (const m of MILESTONES) {
    if (total >= m && !reached.includes(m)) {
      reached.push(m);
      try { localStorage.setItem(MS_KEY, JSON.stringify(reached)); } catch { /* ignore */ }
      toast("🏆 Milestone!", { description: `${formatMarks(m)} marks earned — keep grinding!` });
    }
  }
}

// ─── CPS Test mode ────────────────────────────────────────────────────────────
const CPS_DURATION = 5;
function CpsMode() {
  const [clicks, setClicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CPS_DURATION);
  const [last, setLast] = useState<number | null>(null);
  const [best, setBest] = useState(getPersonalBest("cps_test"));
  const startRef = useRef(0);
  const clicksRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const left = Math.max(0, CPS_DURATION - elapsed);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        setRunning(false);
        const final = clicksRef.current;
        setLast(final);
        submitScore(localStorage.getItem(NAME_KEY) || "You", final, "cps_test");
        setBest(getPersonalBest("cps_test"));
      }
    }, 50);
    return () => clearInterval(id);
  }, [running]);

  const tap = () => {
    if (!running) {
      startRef.current = performance.now();
      clicksRef.current = 1;
      setClicks(1); setLast(null); setRunning(true); setTimeLeft(CPS_DURATION);
      return;
    }
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  };

  const elapsed = running ? Math.max(0.001, (CPS_DURATION - timeLeft)) : CPS_DURATION;
  const liveCps = running ? clicks / elapsed : last !== null ? last / CPS_DURATION : 0;

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-4xl font-extrabold tabular-nums leading-none">{liveCps.toFixed(1)}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mt-1">clicks / sec</div>
        </div>
        <div className="text-right text-xs">
          <div className="text-primary font-bold">Best {(best / 5).toFixed(1)} cps</div>
          <div className="text-muted-foreground">{running ? `${timeLeft.toFixed(1)}s left` : "5-second sprint"}</div>
        </div>
      </div>

      <button
        onPointerDown={tap}
        className="relative w-full h-44 rounded-2xl border border-border bg-background-elevated overflow-hidden flex flex-col items-center justify-center gap-1 active:scale-[0.99] transition"
      >
        <GameBackground />
        <div className="relative z-[1] text-6xl">⚡</div>
        <div className="relative z-[1] text-sm font-semibold">{running ? `${clicks} clicks` : last !== null ? `Result: ${(last / 5).toFixed(1)} cps` : "Tap as fast as you can!"}</div>
        <div className="relative z-[1] text-[11px] text-muted-foreground">{running ? "go go go!" : "Tap to start the 5-second sprint"}</div>
      </button>

      {running && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-75" style={{ width: `${(timeLeft / CPS_DURATION) * 100}%` }} />
        </div>
      )}
      {last !== null && !running && (
        <p className="mt-2 text-xs text-center text-muted-foreground">
          {last >= best ? "🎉 New personal best!" : `Best is ${(best / 5).toFixed(1)} cps — go again!`}
        </p>
      )}
    </div>
  );
}
