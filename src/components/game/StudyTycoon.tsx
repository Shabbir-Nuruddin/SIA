import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import { submitScore, getLeaderboard, getPersonalBest, type ScoreRow, type GameId } from "@/lib/leaderboard";

/**
 * Break Arcade — a juicy idle/clicker (Study Tycoon) + a CPS Test.
 * Tap the brain to earn MARKS, build a click-combo multiplier, grab golden notes,
 * and buy study tools that boost taps or auto-earn. Saves + earns offline.
 */

type Mode = "tycoon" | "cps";
type UpKind = "auto" | "click";
interface Upgrade { id: string; name: string; emoji: string; baseCost: number; kind: UpKind; rate: number; desc: string; }

// Whole-number rates so early upgrades feel real (the old fractional rates floored to "0").
const UPGRADES: Upgrade[] = [
  { id: "flashcards", name: "Flashcards",    emoji: "🃏", baseCost: 15,         kind: "auto",  rate: 1,      desc: "A deck that drills itself." },
  { id: "highlighter",name: "Highlighter",   emoji: "🖊️", baseCost: 50,         kind: "click", rate: 1,      desc: "Every tap is worth more." },
  { id: "coffee",     name: "Coffee",        emoji: "☕", baseCost: 120,        kind: "auto",  rate: 5,      desc: "The original study drug." },
  { id: "energy",     name: "Energy Drink",  emoji: "🥤", baseCost: 1_100,      kind: "click", rate: 6,      desc: "Taps, supercharged." },
  { id: "notes",      name: "AI Notes",      emoji: "📝", baseCost: 1_300,      kind: "auto",  rate: 25,     desc: "Revises while you sleep." },
  { id: "pastpaper",  name: "Past Papers",   emoji: "📄", baseCost: 14_000,     kind: "auto",  rate: 120,    desc: "Predict the exam." },
  { id: "buddy",      name: "Study Buddy",   emoji: "🤝", baseCost: 150_000,    kind: "auto",  rate: 600,    desc: "Keeps you accountable." },
  { id: "tutor",      name: "Private Tutor", emoji: "👩‍🏫", baseCost: 1_600_000,  kind: "auto",  rate: 3_200,  desc: "On permanent retainer." },
  { id: "allnighter", name: "All-Nighter",   emoji: "🌙", baseCost: 22_000_000, kind: "auto",  rate: 16_000, desc: "Sleep is for after exams." },
  { id: "galaxy",     name: "Galaxy Brain",  emoji: "🧠", baseCost: 330_000_000,kind: "auto",  rate: 90_000, desc: "Your brain reaches orbit." },
];

const SAVE_KEY = "mmr_tycoon_v3";
const NAME_KEY = "mmr_game_name";
const MS_KEY = "mmr_tycoon_ms_v3";
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
  if (n < 1000) return n < 10 && n % 1 !== 0 ? n.toFixed(1) : String(Math.floor(n));
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
      <style>{GAME_CSS}</style>
      <div className="flex gap-1 mb-3 p-1 rounded-lg bg-secondary/60 w-fit">
        {(["tycoon", "cps"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${mode === m ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
            {m === "tycoon" ? "🧠 Study Tycoon" : "⚡ CPS Test"}
          </button>
        ))}
      </div>
      <div className={`grid gap-4 ${showLeaderboard && !compact ? "md:grid-cols-[1.4fr_1fr]" : "grid-cols-1"}`}>
        <div>
          {mode === "tycoon" ? <TycoonMode compact={compact} /> : <CpsMode />}
        </div>
        {showLeaderboard && !compact && <Leaderboard game={mode === "cps" ? "cps_test" : "study_tycoon"} />}
      </div>
    </div>
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
      <ol className="space-y-0.5 max-h-[330px] overflow-y-auto">
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

// Animated, colourful arena background — gradient mesh + rotating light rays +
// drifting blobs + rising study particles, so it reads as a living game scene.
const ARENA_PARTICLES = ["📚", "✏️", "🧪", "📐", "⚗️", "🧬", "📝", "🔬", "✨", "💡"];
function Arena({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-56 mb-3 rounded-2xl overflow-hidden border border-white/10" style={{ background: "#0d0b1a" }}>
      <div className="mmr-bg absolute inset-0" />
      <div className="mmr-rays absolute left-1/2 top-1/2 h-[160%] w-[160%]" />
      <div className="mmr-blob absolute h-40 w-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.55), transparent 70%)", top: "-20%", left: "5%", animationDelay: "0s" }} />
      <div className="mmr-blob absolute h-44 w-44 rounded-full" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5), transparent 70%)", bottom: "-25%", right: "8%", animationDelay: "-4s" }} />
      <div className="mmr-blob absolute h-36 w-36 rounded-full" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.45), transparent 70%)", top: "30%", right: "30%", animationDelay: "-8s" }} />
      {ARENA_PARTICLES.map((e, i) => (
        <span key={i} className="mmr-particle absolute text-base" style={{ left: `${6 + i * 9}%`, bottom: "-10%", animationDelay: `${i * 1.1}s`, animationDuration: `${7 + (i % 4) * 2}s` }}>{e}</span>
      ))}
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}

// ─── Tycoon mode ──────────────────────────────────────────────────────────────
function TycoonMode({ compact }: { compact: boolean }) {
  const [state, setState] = useState<TState>(() => loadState());
  const [welcome, setWelcome] = useState<number | null>(null);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; v: number; crit: boolean }[]>([]);
  const [pop, setPop] = useState(false);
  const [combo, setCombo] = useState(0);
  const [golden, setGolden] = useState<{ id: number } | null>(null);
  const floatId = useRef(0);
  const comboRef = useRef({ count: 0, last: 0 });
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const auto = autoOf(state.upgrades);
  const basePerClick = Math.max(1, 1 + clickBonus(state.upgrades) + Math.floor(auto * 0.05));
  const mult = 1 + Math.min(combo * 0.12, 4); // up to x5 on a hot streak

  useEffect(() => {
    const s = loadState();
    const elapsed = Math.min(OFFLINE_CAP_S, Math.max(0, (Date.now() - (s.lastSeen || Date.now())) / 1000));
    const earned = Math.floor(autoOf(s.upgrades) * elapsed * 0.5);
    if (earned > 0) { setState((p) => ({ ...p, marks: p.marks + earned, totalEarned: p.totalEarned + earned })); setWelcome(earned); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => { t = setTimeout(() => { setGolden({ id: Date.now() }); setTimeout(() => setGolden(null), 6000); schedule(); }, 22000 + Math.random() * 28000); };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // Persist on EVERY change (not debounced) so closing the modal can never lose
  // progress — this was the "my game resets" bug.
  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => {
    const id = setInterval(() => submitScore("", Math.floor(stateRef.current.totalEarned), "study_tycoon"), 20000);
    return () => { clearInterval(id); saveState(stateRef.current); submitScore("", Math.floor(stateRef.current.totalEarned), "study_tycoon"); };
  }, []);

  const click = (e: React.PointerEvent) => {
    const now = performance.now();
    const c = comboRef.current;
    c.count = now - c.last < 700 ? c.count + 1 : 1;
    c.last = now;
    setCombo(c.count);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => { comboRef.current.count = 0; setCombo(0); }, 900);

    const m = 1 + Math.min(c.count * 0.12, 4);
    const crit = c.count > 0 && c.count % 12 === 0;
    const gain = Math.max(1, Math.round(basePerClick * m * (crit ? 3 : 1)));
    setState((p) => ({ ...p, marks: p.marks + gain, totalEarned: p.totalEarned + gain, clicks: p.clicks + 1 }));
    setPop(true); setTimeout(() => setPop(false), 80);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = ++floatId.current;
    const fx = e.clientX - rect.left + (Math.random() * 24 - 12);
    setFloats((f) => [...f, { id, x: fx, y: e.clientY - rect.top, v: gain, crit }]);
    setTimeout(() => setFloats((f) => f.filter((ff) => ff.id !== id)), 850);
  };

  const grabGolden = () => {
    const bonus = Math.max(50, Math.floor(auto * 60), basePerClick * 30);
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
          👋 Welcome back! Your tools earned <b>+{formatMarks(welcome)}</b> while you were away.
        </div>
      )}

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-4xl font-extrabold tabular-nums leading-none mmr-marks">{formatMarks(state.marks)}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mt-1">marks</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary tabular-nums">{formatMarks(auto)}/s</div>
          <div className="text-[10px] text-muted-foreground">+{formatMarks(basePerClick)} / tap</div>
        </div>
      </div>

      <Arena>
        <div className="relative h-full flex items-center justify-center">
          {golden && (
            <button onClick={grabGolden} className="mmr-golden absolute top-4 text-4xl z-20 hover:scale-125 transition-transform" title="Grab the golden note!">✨</button>
          )}
          {combo > 3 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-sm font-extrabold text-amber-300 drop-shadow">
              🔥 x{mult.toFixed(1)} <span className="text-[10px] font-mono text-amber-200/80">combo</span>
            </div>
          )}
          <button onPointerDown={click}
            className={`mmr-orb relative z-[5] h-32 w-32 rounded-full flex items-center justify-center text-6xl ${pop ? "mmr-pop" : ""}`}
            style={{ touchAction: "manipulation" }} aria-label="Earn marks">
            <span className="mmr-shine" />
            🧠
          </button>
          {floats.map((f) => (
            <span key={f.id} className={`pointer-events-none absolute font-extrabold z-20 ${f.crit ? "text-amber-300 text-lg" : "text-white text-sm"}`}
              style={{ left: `calc(50% + ${f.x - 90}px)`, top: f.y, animation: "mmrFloatUp 0.85s ease-out forwards", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
              {f.crit ? "CRIT " : ""}+{formatMarks(f.v)}
            </span>
          ))}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-white/70 font-medium">Tap the brain — fast taps build a combo!</div>
        </div>
      </Arena>

      <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-2 ${compact ? "max-h-[200px]" : "max-h-[260px]"} overflow-y-auto pr-1`}>
        {UPGRADES.map((u) => {
          const count = state.upgrades[u.id] || 0;
          const cost = costOf(u, count);
          const afford = state.marks >= cost;
          const unlocked = count > 0 || state.totalEarned >= u.baseCost * 0.3;
          if (!unlocked) return null;
          return (
            <button key={u.id} onClick={() => buy(u)} disabled={!afford}
              className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${afford ? "border-primary/40 bg-primary/5 hover:bg-primary/15 hover:scale-[1.01] cursor-pointer" : "border-border opacity-55 cursor-not-allowed"}`}>
              <span className={`grid place-items-center h-10 w-10 rounded-lg text-2xl shrink-0 ${afford ? "bg-primary/15" : "bg-secondary"}`}>{u.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{u.name}{count > 0 && <span className="text-muted-foreground font-normal"> ×{count}</span>}</div>
                <div className="text-[11px] text-muted-foreground truncate">{u.desc}</div>
                <div className="text-[10px] text-primary/90 font-semibold">{u.kind === "auto" ? `+${formatMarks(u.rate)}/s each` : `+${formatMarks(u.rate)} per tap each`}</div>
              </div>
              <div className={`text-xs font-mono font-bold tabular-nums shrink-0 ${afford ? "text-primary" : "text-muted-foreground"}`}>{formatMarks(cost)}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        Lifetime <span className="font-bold text-foreground">{formatMarks(state.totalEarned)}</span> · {state.clicks.toLocaleString()} taps · your leaderboard score
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
        clearInterval(id); setRunning(false);
        const final = clicksRef.current; setLast(final);
        submitScore(localStorage.getItem(NAME_KEY) || "You", final, "cps_test");
        setBest(getPersonalBest("cps_test"));
      }
    }, 50);
    return () => clearInterval(id);
  }, [running]);

  const tap = () => {
    if (!running) { startRef.current = performance.now(); clicksRef.current = 1; setClicks(1); setLast(null); setRunning(true); setTimeLeft(CPS_DURATION); return; }
    clicksRef.current += 1; setClicks(clicksRef.current);
  };

  const elapsed = running ? Math.max(0.001, CPS_DURATION - timeLeft) : CPS_DURATION;
  const liveCps = running ? clicks / elapsed : last !== null ? last / CPS_DURATION : 0;

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-4xl font-extrabold tabular-nums leading-none mmr-marks">{liveCps.toFixed(1)}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mt-1">clicks / sec</div>
        </div>
        <div className="text-right text-xs">
          <div className="text-primary font-bold">Best {(best / 5).toFixed(1)} cps</div>
          <div className="text-muted-foreground">{running ? `${timeLeft.toFixed(1)}s left` : "5-second sprint"}</div>
        </div>
      </div>
      <button onPointerDown={tap} className="w-full active:scale-[0.99] transition">
        <Arena>
          <div className="h-full flex flex-col items-center justify-center gap-1">
            <div className="text-6xl mmr-zap">⚡</div>
            <div className="text-sm font-bold text-white">{running ? `${clicks} clicks` : last !== null ? `Result: ${(last / 5).toFixed(1)} cps` : "Tap as fast as you can!"}</div>
            <div className="text-[11px] text-white/70">{running ? "go go go!" : "Tap to start the 5-second sprint"}</div>
          </div>
        </Arena>
      </button>
      {running && (
        <div className="-mt-1 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
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

const GAME_CSS = `
@keyframes mmrFloatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-56px) scale(1.35)}}
@keyframes mmrBgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes mmrBlob{0%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-16px) scale(1.15)}100%{transform:translate(0,0) scale(1)}}
@keyframes mmrGoldenMove{0%{left:-12%;top:8%}100%{left:108%;top:22%}}
@keyframes mmrZap{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.12) rotate(4deg)}}
.mmr-bg{background:linear-gradient(120deg,#6366f1,#ec4899,#8b5cf6,#14b8a6,#6366f1);background-size:300% 300%;animation:mmrBgShift 14s ease infinite;opacity:.34;filter:saturate(1.25)}
.mmr-blob{filter:blur(8px);animation:mmrBlob 9s ease-in-out infinite}
.mmr-rays{transform:translate(-50%,-50%);background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,0.06) 0deg 5deg,transparent 5deg 16deg);animation:mmrSpin 26s linear infinite;opacity:.5;pointer-events:none}
@keyframes mmrSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
.mmr-particle{opacity:0;animation-name:mmrRise;animation-timing-function:linear;animation-iteration-count:infinite;filter:drop-shadow(0 0 4px rgba(255,255,255,0.25))}
@keyframes mmrRise{0%{transform:translateY(0) rotate(0deg);opacity:0}12%{opacity:.55}88%{opacity:.55}100%{transform:translateY(-230px) rotate(35deg);opacity:0}}
.mmr-marks{background:linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)));-webkit-background-clip:text;background-clip:text;color:transparent}
.mmr-orb{background:radial-gradient(circle at 32% 28%,#fff7,transparent 38%),linear-gradient(145deg,hsl(var(--primary)),hsl(var(--accent)));box-shadow:0 12px 36px hsl(var(--primary)/0.55),inset 0 -8px 18px rgba(0,0,0,0.25);transition:transform .08s}
.mmr-orb:hover{transform:scale(1.06)}
.mmr-pop{transform:scale(.9)!important}
.mmr-shine{position:absolute;inset:0;border-radius:9999px;background:radial-gradient(circle at 30% 22%,rgba(255,255,255,.85),transparent 30%);pointer-events:none}
.mmr-golden{animation:mmrGoldenMove 6s linear forwards;filter:drop-shadow(0 0 8px gold)}
.mmr-zap{animation:mmrZap 1.4s ease-in-out infinite;filter:drop-shadow(0 0 10px rgba(99,102,241,.7))}
`;
