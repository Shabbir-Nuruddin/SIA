import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Crown, Volume2, VolumeX, Share2 } from "lucide-react";
import { submitScore, getLeaderboard, getPersonalBest, type ScoreRow, type GameId } from "@/lib/leaderboard";
import { sfx, isMuted, setMuted } from "@/lib/gameSound";
import { supabase } from "@/integrations/supabase/client";

/**
 * Break Arcade — a juicy idle/clicker (Study Tycoon) + a CPS Test.
 * Tap the brain to earn MARKS, build a click-combo multiplier, grab golden notes,
 * and buy study tools that boost taps or auto-earn. Saves + earns offline.
 */

type Mode = "tycoon" | "cps";
type UpKind = "auto" | "click";
// `effect` upgrades add a visual/audio distraction to the arena (Stimulation-Clicker
// style) as well as earning marks. "dvd" is special — it earns marks PER BOUNCE.
type FX = "dvd" | "disco" | "rain" | "news" | "lofi" | "press" | "pet";
interface Upgrade { id: string; name: string; emoji: string; baseCost: number; kind: UpKind; rate: number; desc: string; fx?: FX; }

// Whole-number rates so early upgrades feel real. Ordered by cost; distraction
// upgrades are interleaved so the screen gets more chaotic as you progress.
const UPGRADES: Upgrade[] = [
  { id: "flashcards", name: "Flashcards",    emoji: "🃏", baseCost: 15,         kind: "auto",  rate: 1,      desc: "A deck that drills itself." },
  { id: "highlighter",name: "Highlighter",   emoji: "🖊️", baseCost: 50,         kind: "click", rate: 1,      desc: "Every tap is worth more." },
  { id: "dvd",        name: "Bouncing Logo", emoji: "📀", baseCost: 80,         kind: "auto",  rate: 0,      desc: "An SIA logo bounces the corners — marks per bounce!", fx: "dvd" },
  { id: "coffee",     name: "Coffee",        emoji: "☕", baseCost: 120,        kind: "auto",  rate: 5,      desc: "The original study drug." },
  { id: "energy",     name: "Energy Drink",  emoji: "🥤", baseCost: 1_100,      kind: "click", rate: 6,      desc: "Taps, supercharged." },
  { id: "notes",      name: "AI Notes",      emoji: "📝", baseCost: 1_300,      kind: "auto",  rate: 25,     desc: "Revises while you sleep." },
  { id: "disco",      name: "Disco Mode",    emoji: "🪩", baseCost: 4_000,      kind: "auto",  rate: 40,     desc: "Flashing lights. Everywhere.", fx: "disco" },
  { id: "rain",       name: "Rain Ambience", emoji: "🌧️", baseCost: 9_000,      kind: "auto",  rate: 80,     desc: "Cosy rain on the window.", fx: "rain" },
  { id: "pastpaper",  name: "Past Papers",   emoji: "📄", baseCost: 14_000,     kind: "auto",  rate: 120,    desc: "Predict the exam." },
  { id: "news",       name: "Breaking News", emoji: "📰", baseCost: 30_000,     kind: "auto",  rate: 220,    desc: "A 24/7 study-news ticker.", fx: "news" },
  { id: "lofi",       name: "Lo-fi Beats",   emoji: "🎧", baseCost: 60_000,     kind: "auto",  rate: 380,    desc: "Chill beats to grind to.", fx: "lofi" },
  { id: "press",      name: "Hydraulic Press", emoji: "🗜️", baseCost: 90_000,   kind: "auto",  rate: 500,    desc: "Smash it for a burst of marks!", fx: "press" },
  { id: "pet",        name: "Study Owl",     emoji: "🦉", baseCost: 280_000,    kind: "auto",  rate: 1_600,  desc: "A wise owl hoots you on.", fx: "pet" },
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

interface TState { marks: number; totalEarned: number; clicks: number; upgrades: Record<string, number>; degrees: number; lastSeen: number; }
const DEFAULT_STATE: TState = { marks: 0, totalEarned: 0, clicks: 0, upgrades: {}, degrees: 0, lastSeen: Date.now() };

// Prestige ("Graduate"): degrees you'd earn by graduating now, from lifetime marks.
const degreesFromEarned = (totalEarned: number) => Math.floor(Math.sqrt(Math.max(0, totalEarned) / 1_000_000));

const ACHIEVEMENTS: { id: string; name: string; desc: string; check: (s: TState) => boolean }[] = [
  { id: "first",  name: "First Mark",        desc: "Earn your first mark",        check: (s) => s.totalEarned >= 1 },
  { id: "tap100", name: "Warming Up",        desc: "Tap 100 times",               check: (s) => s.clicks >= 100 },
  { id: "k",      name: "Straight A's",      desc: "Reach 1,000 lifetime marks",  check: (s) => s.totalEarned >= 1_000 },
  { id: "dvd",    name: "Corner Hit",        desc: "Buy the Bouncing Logo",       check: (s) => (s.upgrades.dvd || 0) >= 1 },
  { id: "disco",  name: "Disco Inferno",     desc: "Turn on Disco Mode",          check: (s) => (s.upgrades.disco || 0) >= 1 },
  { id: "tap1k",  name: "Finger Cramp",      desc: "Tap 1,000 times",             check: (s) => s.clicks >= 1_000 },
  { id: "m",      name: "Top of the Class",  desc: "Reach 1,000,000 lifetime marks", check: (s) => s.totalEarned >= 1_000_000 },
  { id: "grad",   name: "Graduate",          desc: "Graduate for the first time", check: (s) => s.degrees >= 1 },
  { id: "phd",    name: "Doctorate",         desc: "Earn 10 degrees",             check: (s) => s.degrees >= 10 },
  { id: "galaxy", name: "Galaxy Brain",      desc: "Own a Galaxy Brain",          check: (s) => (s.upgrades.galaxy || 0) >= 1 },
];
const ACH_KEY = "mmr_tycoon_ach_v1";

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
const costForN = (u: Upgrade, count: number, n: number) => { let c = 0, k = count; for (let i = 0; i < n; i += 1) { c += costOf(u, k); k += 1; } return c; };
const maxAffordable = (u: Upgrade, count: number, marks: number) => { let n = 0, k = count, m = marks; while (n < 10000) { const c = costOf(u, k); if (m < c) break; m -= c; k += 1; n += 1; } return n; };

// ─────────────────────────────────────────────────────────────────────────────
export default function StudyTycoon({ compact = false, showLeaderboard = false }: { compact?: boolean; showLeaderboard?: boolean }) {
  const [mode, setMode] = useState<Mode>("tycoon");
  return (
    <div className="select-none">
      <style>{GAME_CSS}</style>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex gap-1 p-1 rounded-lg bg-secondary/60 w-fit">
          {(["tycoon", "cps"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${mode === m ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
              {m === "tycoon" ? "🧠 Study Tycoon" : "⚡ CPS Test"}
            </button>
          ))}
        </div>
        {!compact && <ShareButton />}
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

function ShareButton() {
  const onShare = async () => {
    let earned = 0;
    try {
      const raw = JSON.parse(localStorage.getItem("mmr_tycoon_v3") || "{}");
      earned = Math.max(Number(raw.totalEarned) || 0, getPersonalBest("study_tycoon"));
    } catch { /* ignore */ }
    const score = formatMarks(earned);
    const text = `I just racked up ${score} marks in the SIA Smart Revision Break Arcade 🧠 — think you can beat me?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "SIA Smart Revision Break Arcade", text });
        return;
      }
    } catch { /* user cancelled or unsupported — fall through to copy */ }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Score copied — paste it anywhere!");
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };
  return (
    <button onClick={onShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition">
      <Share2 className="h-3.5 w-3.5" /> Share score
    </button>
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
  const initials = (n: string) => (n || "?").trim().charAt(0).toUpperCase();
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const medal = ["🥇", "🥈", "🥉"];
  const ringColor = ["#C8102E", "#9ca3af", "#b45309"];
  // Podium display order: 2nd · 1st · 3rd, with 1st raised.
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumIdx = top3.length === 3 ? [1, 0, 2] : top3.map((_, i) => i);

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-4 h-fit shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center bg-primary/10 shrink-0">
          <Crown className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-foreground leading-tight">School Leaderboard</div>
          <div className="text-[10px] text-muted-foreground">Live · everyone at SIA is competing</div>
        </div>
      </div>

      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3 items-end">
          {podiumOrder.map((r, slot) => {
            const rank = podiumIdx[slot];
            const raised = rank === 0;
            return (
              <div key={slot} className={`relative rounded-xl border p-2 text-center ${r.you ? "border-primary bg-primary/10" : "border-border bg-card"} ${raised ? "-mt-2 pb-3" : ""}`}>
                <div className={raised ? "text-2xl leading-none" : "text-lg leading-none"}>{medal[rank]}</div>
                <div className="mx-auto my-1 grid place-items-center rounded-full text-white font-bold"
                  style={{ height: raised ? 34 : 28, width: raised ? 34 : 28, fontSize: raised ? 13 : 11, background: ringColor[rank] }}>
                  {initials(r.name)}
                </div>
                <div className="text-[11px] font-bold truncate text-foreground">{r.name}{r.you ? " (you)" : ""}</div>
                <div className="text-[11px] font-mono font-extrabold text-primary">{fmt(r.score)}</div>
              </div>
            );
          })}
        </div>
      )}

      <ol className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
        {rest.map((r, i) => (
          <li key={`${r.name}-${i}`} className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${r.you ? "bg-primary/15 ring-1 ring-primary/30" : "hover:bg-secondary/60"}`}>
            <span className="w-5 text-center text-xs font-bold tabular-nums text-muted-foreground">{i + 4}</span>
            <span className="h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold text-white shrink-0 bg-gradient-to-br from-primary to-accent">{initials(r.name)}</span>
            <span className={`flex-1 truncate ${r.you ? "font-bold text-primary" : "text-foreground"}`}>{r.name}{r.you ? " (you)" : ""}</span>
            <span className="font-mono tabular-nums text-xs font-semibold text-foreground">{fmt(r.score)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Light SIA red + white arena: soft white canvas, drifting red glow blobs and
// floating study emojis. Clean and collegiate — no dark night sky.
const ARENA_PARTICLES = ["📚", "✏️", "🧪", "📐", "✨", "💡"];
function Arena({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <div
      className={`relative ${tall ? "h-72" : "h-56"} mb-3 rounded-2xl overflow-hidden border`}
      style={{ background: "#ffffff", borderColor: "rgba(200,16,46,0.18)" }}
    >
      <div className="mmr-arena-bg absolute inset-0" />
      <div className="mmr-blob absolute -top-16 -left-10 h-56 w-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(200,16,46,0.20), transparent 70%)" }} />
      <div className="mmr-blob absolute -bottom-20 -right-8 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(122,10,28,0.16), transparent 70%)", animationDelay: "2.4s" }} />
      <div className="mmr-blob absolute top-1/3 left-1/2 h-40 w-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,215,221,0.55), transparent 70%)", animationDelay: "1.2s" }} />
      {ARENA_PARTICLES.map((e, i) => (
        <span key={i} className="mmr-particle absolute text-base opacity-80" style={{ left: `${10 + i * 15}%`, bottom: "-10%", animationDelay: `${i * 1.3}s`, animationDuration: `${8 + (i % 3) * 2}s` }}>{e}</span>
      ))}
      <div className="relative z-[2] h-full">{children}</div>
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
  const [sparks, setSparks] = useState<{ id: number; dx: number; dy: number; c: string }[]>([]);
  const floatId = useRef(0);
  const sparkId = useRef(0);
  const comboRef = useRef({ count: 0, last: 0 });
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const degrees = state.degrees || 0;
  const degreeMult = 1 + degrees * 0.1;                 // +10% marks per degree (permanent)
  const rawAuto = autoOf(state.upgrades);
  const auto = rawAuto * degreeMult;
  const basePerClick = Math.max(1, Math.round((1 + clickBonus(state.upgrades) + Math.floor(rawAuto * 0.05)) * degreeMult));
  const pendingDegrees = Math.max(0, degreesFromEarned(state.totalEarned) - degrees);
  const mult = 1 + Math.min(combo * 0.12, 4); // up to x5 on a hot streak
  const [buyMode, setBuyMode] = useState<1 | 10 | 100 | "max">(1);
  // Owner-only cheat (nuruddinshabbir3@gmail.com). Checks the signed-in email
  // directly (not the localStorage flag, which can be missing). Adds spendable
  // marks WITHOUT touching totalEarned, so it never inflates the leaderboard.
  const [isOwner, setIsOwner] = useState(() => { try { return localStorage.getItem("mmr_owner") === "1"; } catch { return false; } });
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser()
      .then(({ data }) => {
        if (alive && (data?.user?.email || "").toLowerCase() === "nuruddinshabbir3@gmail.com") setIsOwner(true);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const cheatMarks = () => {
    setState((p) => ({ ...p, marks: p.marks + 1_000_000_000 }));
    sfx.golden?.();
    toast.success("+1B marks (owner) 🪙");
  };

  useEffect(() => {
    const s = loadState();
    const elapsed = Math.min(OFFLINE_CAP_S, Math.max(0, (Date.now() - (s.lastSeen || Date.now())) / 1000));
    const earned = Math.floor(autoOf(s.upgrades) * (1 + (s.degrees || 0) * 0.1) * elapsed * 0.5);
    if (earned > 0) { setState((p) => ({ ...p, marks: p.marks + earned, totalEarned: p.totalEarned + earned })); setWelcome(earned); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setState((p) => {
        const a = autoOf(p.upgrades) * (1 + (p.degrees || 0) * 0.1);
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
    sfx.click(); if (crit) sfx.crit();
    setState((p) => ({ ...p, marks: p.marks + gain, totalEarned: p.totalEarned + gain, clicks: p.clicks + 1 }));
    setPop(true); setTimeout(() => setPop(false), 80);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = ++floatId.current;
    const fx = e.clientX - rect.left + (Math.random() * 24 - 12);
    setFloats((f) => [...f, { id, x: fx, y: e.clientY - rect.top, v: gain, crit }]);
    setTimeout(() => setFloats((f) => f.filter((ff) => ff.id !== id)), 850);

    // Spark burst out of the brain (juicy click feedback).
    const colours = ["#ffffff", "#fde68a", "#f9a8d4", "#a5b4fc", "#5eead4"];
    const n = crit ? 12 : 7;
    const burst = Array.from({ length: n }, () => {
      const ang = Math.random() * Math.PI * 2;
      const dist = 36 + Math.random() * 46;
      return { id: ++sparkId.current, dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, c: colours[Math.floor(Math.random() * colours.length)] };
    });
    setSparks((s) => [...s, ...burst]);
    const ids = new Set(burst.map((b) => b.id));
    setTimeout(() => setSparks((s) => s.filter((sp) => !ids.has(sp.id))), 600);
  };

  const grabGolden = () => {
    const bonus = Math.max(50, Math.floor(auto * 60), basePerClick * 30);
    setState((p) => ({ ...p, marks: p.marks + bonus, totalEarned: p.totalEarned + bonus }));
    setGolden(null);
    sfx.golden();
    toast("✨ Golden note!", { description: `+${formatMarks(bonus)} marks` });
  };

  const buyN = (u: Upgrade) =>
    setState((p) => {
      let count = p.upgrades[u.id] || 0;
      let marks = p.marks;
      let bought = 0;
      const target = buyMode === "max" ? Infinity : buyMode;
      while (bought < target) {
        const cost = costOf(u, count);
        if (marks < cost) break;
        marks -= cost; count += 1; bought += 1;
      }
      if (bought === 0) return p;
      sfx.buy();
      return { ...p, marks, upgrades: { ...p.upgrades, [u.id]: count } };
    });

  const graduate = () => {
    if (pendingDegrees < 1) return;
    // Owner perk: always restart a fresh run with 3M instead of 0.
    let start = 0;
    try { if (localStorage.getItem("mmr_owner") === "1") start = 3_000_000; } catch { /* ignore */ }
    // Lifetime earnings reset on graduate — leaderboard shows current run total.
    setState((p) => ({ ...p, degrees: (p.degrees || 0) + pendingDegrees, marks: start, totalEarned: start, upgrades: {} }));
    sfx.golden();
    try { window.dispatchEvent(new Event("mmr-degrees-change")); } catch { /* ignore */ }
    // Push the reset score immediately so the global board reflects the new run.
    submitScore("", start, "study_tycoon");
    try { localStorage.setItem("mmr_game_pb_study_tycoon", String(start)); } catch { /* ignore */ }
    toast("🎓 Graduated!", { description: `+${pendingDegrees} degree${pendingDegrees > 1 ? "s" : ""} — a permanent +${pendingDegrees * 10}% to all marks! Your 🎓 badge levelled up.` });
  };

  // Distraction helpers
  const owns = (id: string) => (state.upgrades[id] || 0) > 0;
  const dvdCount = state.upgrades["dvd"] || 0;
  const spb = Math.max(1, Math.round(dvdCount * 3 * degreeMult)); // marks per DVD bounce
  const dvdSpeed = 1 + dvdCount * 0.25;
  const onBounce = () => setState((p) => ({ ...p, marks: p.marks + spb, totalEarned: p.totalEarned + spb }));
  const pressBurst = () => {
    const amt = Math.max(10, Math.round(auto * 2));
    setState((p) => ({ ...p, marks: p.marks + amt, totalEarned: p.totalEarned + amt }));
    sfx.bounce();
  };
  const [mute, setMute] = useState(isMuted());
  const toggleMute = () => { const m = !mute; setMute(m); setMuted(m); };
  const [achCount, setAchCount] = useState(() => { try { return (JSON.parse(localStorage.getItem(ACH_KEY) || "[]") as string[]).length; } catch { return 0; } });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Unlock achievements as the state changes.
  useEffect(() => {
    let unlocked: string[] = [];
    try { unlocked = JSON.parse(localStorage.getItem(ACH_KEY) || "[]"); } catch { /* ignore */ }
    let changed = false;
    for (const a of ACHIEVEMENTS) {
      if (!unlocked.includes(a.id) && a.check(state)) { unlocked.push(a.id); changed = true; toast(`🏅 ${a.name}`, { description: a.desc }); }
    }
    if (changed) { try { localStorage.setItem(ACH_KEY, JSON.stringify(unlocked)); } catch { /* ignore */ } setAchCount(unlocked.length); }
  }, [state]);

  // Lo-fi music: loop a calm track when the Lo-fi upgrade is owned and not muted.
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    if ((state.upgrades.lofi || 0) > 0 && !mute) { a.volume = 0.38; a.play().catch(() => {}); }
    else { a.pause(); }
  }, [state.upgrades, mute]);

  return (
    <div>
      {welcome !== null && (
        <div className="mb-3 rounded-lg bg-primary/10 border border-primary/25 px-3 py-2 text-xs text-primary">
          👋 Welcome back! Your tools earned <b>+{formatMarks(welcome)}</b> while you were away.
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 text-[11px]">
        {degrees > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-500 font-bold">🎓 {degrees} · +{degrees * 10}% marks</span>}
        <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">🏅 {achCount}/{ACHIEVEMENTS.length}</span>
        {pendingDegrees > 0 && (
          <button onClick={graduate} title={`Reset this run for +${pendingDegrees * 10}% permanent marks`}
            className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold hover:scale-105 transition shadow">
            🎓 Graduate +{pendingDegrees}
          </button>
        )}
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-4xl font-extrabold tabular-nums leading-none mmr-marks">{formatMarks(state.marks)}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">marks</span>
            {isOwner && (
              <button onClick={cheatMarks}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 hover:bg-amber-400/35 transition"
                title="Owner cheat: add 1,000,000,000 spendable marks">
                +1B 🪙
              </button>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary tabular-nums">{formatMarks(auto)}/s</div>
          <div className="text-[10px] text-muted-foreground">+{formatMarks(basePerClick)} / tap{dvdCount > 0 ? ` · +${formatMarks(spb)}/bounce` : ""}</div>
        </div>
      </div>

      <Arena tall>
        <div className="relative h-full flex items-center justify-center">
          <span className="mmr-glow" />
          {owns("disco") && <div className="mmr-disco absolute inset-0 z-0 pointer-events-none" />}
          {owns("rain") && <RainLayer />}
          {owns("lofi") && <LofiNotes />}
          {owns("pet") && <StudyOwl />}
          {owns("press") && <HydraulicPress onPress={pressBurst} />}
          {dvdCount > 0 && Array.from({ length: Math.min(dvdCount, 5) }).map((_, i) => (
            <BouncingDVD key={i} idx={i} speed={dvdSpeed} onBounce={onBounce} />
          ))}
          <button onClick={toggleMute} className="absolute top-2 right-2 z-40 h-7 w-7 grid place-items-center rounded-full bg-black/30 text-white/80 hover:text-white" title={mute ? "Unmute" : "Mute"}>
            {mute ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          {golden && (
            <button onClick={grabGolden} className="mmr-golden absolute top-4 text-4xl z-20 hover:scale-125 transition-transform" title="Grab the golden note!">✨</button>
          )}
          {combo > 3 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-sm font-extrabold drop-shadow" style={{ color: "#C8102E" }}>
              🔥 x{mult.toFixed(1)} <span className="text-[10px] font-mono" style={{ color: "#7A0A1C" }}>combo</span>
            </div>
          )}
          <button onPointerDown={click}
            className={`mmr-orb relative z-[5] h-32 w-32 rounded-full flex items-center justify-center text-6xl ${pop ? "mmr-pop" : ""}`}
            style={{ touchAction: "manipulation" }} aria-label="Earn marks">
            <span className="mmr-shine" />
            🧠
          </button>
          {floats.map((f) => (
            <span key={f.id} className={`pointer-events-none absolute font-extrabold z-20 ${f.crit ? "text-amber-500 text-lg" : "text-sm"}`}
              style={{ left: `calc(50% + ${f.x - 90}px)`, top: f.y, color: f.crit ? undefined : "#C8102E", animation: "mmrFloatUp 0.85s ease-out forwards", textShadow: "0 1px 5px rgba(255,255,255,0.8)" }}>
              {f.crit ? "CRIT " : ""}+{formatMarks(f.v)}
            </span>
          ))}
          {sparks.map((sp) => (
            <span key={sp.id} className="mmr-spark" style={{ ["--dx" as any]: `${sp.dx}px`, ["--dy" as any]: `${sp.dy}px`, background: sp.c }} />
          ))}
          {owns("news") ? <NewsTicker /> : (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-medium" style={{ color: "rgba(122,10,28,0.7)" }}>Tap the brain — fast taps build a combo!</div>
          )}
        </div>
      </Arena>

      <div className="flex items-center gap-1 mb-2">
        <span className="text-[10px] text-muted-foreground mr-1">Buy</span>
        {([1, 10, 100, "max"] as const).map((m) => (
          <button key={String(m)} onClick={() => setBuyMode(m)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${buyMode === m ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {m === "max" ? "Max" : `×${m}`}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-2 ${compact ? "max-h-[200px]" : "max-h-[260px]"} overflow-y-auto pr-1`}>
        {UPGRADES.map((u) => {
          const count = state.upgrades[u.id] || 0;
          const unlocked = count > 0 || state.totalEarned >= u.baseCost * 0.3;
          if (!unlocked) return null;
          const aff = maxAffordable(u, count, state.marks);
          const n = buyMode === "max" ? aff : buyMode;
          const cost = buyMode === "max" ? (aff > 0 ? costForN(u, count, aff) : costOf(u, count)) : costForN(u, count, n);
          const afford = buyMode === "max" ? aff > 0 : state.marks >= cost;
          const rateLabel = u.fx === "dvd" ? "+3 per bounce each" : u.kind === "auto" ? `+${formatMarks(u.rate)}/s each` : `+${formatMarks(u.rate)} per tap each`;
          return (
            <button key={u.id} onClick={() => buyN(u)} disabled={!afford}
              className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${afford ? "border-primary/50 bg-gradient-to-br from-primary/[0.09] to-transparent hover:from-primary/20 hover:-translate-y-0.5 hover:shadow-md cursor-pointer" : "border-border/70 bg-card cursor-not-allowed"}`}>
              <span className={`grid place-items-center h-11 w-11 rounded-xl text-2xl shrink-0 transition-transform group-hover:scale-110 ${afford ? "bg-primary/15" : "bg-muted"}`}>{u.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground truncate">
                  {u.name}{count > 0 && <span className="ml-1 align-middle text-[10px] font-extrabold text-primary">×{count}</span>}
                </div>
                <div className="text-[11px] text-muted-foreground truncate leading-tight">{u.desc}</div>
                <div className="mt-0.5 text-[10px] font-bold text-primary">{rateLabel}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-sm font-mono font-extrabold tabular-nums ${afford ? "text-primary" : "text-muted-foreground"}`}>{formatMarks(cost)}</div>
                <div className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground">
                  {afford ? (buyMode === 1 ? "buy" : buyMode === "max" ? `buy ×${aff}` : `buy ×${buyMode}`) : "need more"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        Lifetime <span className="font-bold text-foreground">{formatMarks(state.totalEarned)}</span> · {state.clicks.toLocaleString()} taps · your leaderboard score
      </div>
      <audio ref={audioRef} loop preload="none" src="https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deliberate%20Thought.mp3" />
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
        submitScore("", final, "cps_test");
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
            <div className="text-sm font-bold" style={{ color: "#7A0A1C" }}>{running ? `${clicks} clicks` : last !== null ? `Result: ${(last / 5).toFixed(1)} cps` : "Tap as fast as you can!"}</div>
            <div className="text-[11px]" style={{ color: "rgba(122,10,28,0.7)" }}>{running ? "go go go!" : "Tap to start the 5-second sprint"}</div>
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

// ─── Distraction layers (Stimulation-Clicker inspired) ───────────────────────
function BouncingDVD({ speed, onBounce, idx = 0 }: { speed: number; onBounce: () => void; idx?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({
    x: 16 + idx * 47,
    y: 16 + idx * 31,
    vx: (idx % 2 === 0 ? 1 : -1) * (1.3 + idx * 0.18),
    vy: (idx % 3 === 0 ? 1 : -1) * (1.0 + idx * 0.13),
    hue: (idx * 67) % 360,
  });
  const raf = useRef(0);
  const speedRef = useRef(speed); speedRef.current = speed;
  const onBounceRef = useRef(onBounce); onBounceRef.current = onBounce;
  useEffect(() => {
    const step = () => {
      const el = ref.current;
      if (el && el.parentElement) {
        const W = el.parentElement.clientWidth - el.offsetWidth;
        const H = el.parentElement.clientHeight - el.offsetHeight;
        const p = pos.current; const s = speedRef.current;
        p.x += p.vx * s; p.y += p.vy * s;
        let hit = false;
        if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); hit = true; } else if (p.x >= W) { p.x = W; p.vx = -Math.abs(p.vx); hit = true; }
        if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); hit = true; } else if (p.y >= H) { p.y = H; p.vy = -Math.abs(p.vy); hit = true; }
        if (hit) { p.hue = (p.hue + 53) % 360; onBounceRef.current(); sfx.bounce(); }
        el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        el.style.color = `hsl(${p.hue}, 90%, 66%)`;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return (
    <div ref={ref} className="absolute left-0 top-0 z-30 pointer-events-none select-none" style={{ color: "#fff" }}>
      <span className="px-3 py-1.5 rounded-lg border-[3px] border-current text-2xl font-black tracking-tighter" style={{ textShadow: "0 0 18px currentColor", boxShadow: "0 0 24px currentColor" }}>SIA</span>
    </div>
  );
}

const RAIN = Array.from({ length: 24 });
function RainLayer() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {RAIN.map((_, i) => (
        <span key={i} className="mmr-rain-drop" style={{ left: `${(i * 4.3) % 100}%`, animationDelay: `${(i % 7) * 0.2}s`, animationDuration: `${0.7 + (i % 5) * 0.15}s` }} />
      ))}
    </div>
  );
}

const NOTES = ["🎵", "🎶", "🎧", "♪", "🎵", "🎶", "🎧", "♪"];
function LofiNotes() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {NOTES.map((n, i) => (
        <span key={i} className="mmr-particle absolute text-base" style={{ left: `${8 + i * 11}%`, bottom: "-10%", animationDelay: `${i * 0.9}s`, animationDuration: `${6 + (i % 3) * 2}s` }}>{n}</span>
      ))}
    </div>
  );
}

const HEADLINES = [
  "BREAKING: Local student discovers studying actually works",
  "Scientists baffled as combo multiplier hits ×5 again",
  "Markets surge as marks-per-second reaches all-time high",
  "Golden note spotted near the top of the screen",
  "Report: 9 out of 10 brains recommend one more tap",
];
function NewsTicker() {
  const text = HEADLINES.join("    •    ");
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-red-600 text-white text-[11px] font-bold overflow-hidden flex items-center">
      <span className="bg-white text-red-600 px-2 py-0.5 shrink-0">LIVE</span>
      <div className="overflow-hidden flex-1"><div className="mmr-ticker whitespace-nowrap py-0.5">{text}    •    {text}</div></div>
    </div>
  );
}

function HydraulicPress({ onPress }: { onPress: () => void }) {
  const [squish, setSquish] = useState(false);
  const press = (e: React.MouseEvent) => { e.stopPropagation(); setSquish(true); setTimeout(() => setSquish(false), 160); onPress(); };
  return (
    <button onClick={press} className="absolute top-2 left-2 z-30 flex flex-col items-center text-white/90 hover:scale-105 transition" title="Smash the press for a burst!">
      <span className={`text-lg leading-none transition-transform ${squish ? "translate-y-1" : ""}`}>🗜️</span>
      <span className="text-[8px] font-bold uppercase tracking-wide bg-black/40 px-1 rounded">smash</span>
    </button>
  );
}

function StudyOwl() {
  return (
    <div className="mmr-owl absolute bottom-6 z-20 text-xl pointer-events-none" style={{ left: 0 }}>🦉</div>
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
.mmr-arena-bg{background:linear-gradient(130deg,#ffffff,#fff0f2,#ffe1e6,#fff0f2,#ffffff);background-size:320% 320%;animation:mmrBgShift 16s ease infinite}
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
.mmr-zap{animation:mmrZap 1.4s ease-in-out infinite;filter:drop-shadow(0 0 10px rgba(200,16,46,.6))}
.mmr-glow{position:absolute;left:50%;top:50%;width:170px;height:170px;border-radius:9999px;transform:translate(-50%,-50%);background:radial-gradient(circle,hsl(var(--primary)/0.55),transparent 64%);animation:mmrGlow 2.4s ease-in-out infinite;pointer-events:none;z-index:0}
@keyframes mmrGlow{0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(1)}50%{opacity:.75;transform:translate(-50%,-50%) scale(1.14)}}
.mmr-spark{position:absolute;left:50%;top:50%;width:7px;height:7px;border-radius:9999px;pointer-events:none;z-index:25;animation:mmrSpark .6s ease-out forwards}
@keyframes mmrSpark{0%{transform:translate(-50%,-50%) translate(0,0) scale(1);opacity:1}100%{transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0);opacity:0}}
.mmr-disco{background:conic-gradient(from 0deg,#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6,#ec4899,#ef4444);animation:mmrSpin 6s linear infinite,mmrDisco 1s steps(1) infinite;opacity:.22;mix-blend-mode:screen}
@keyframes mmrDisco{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
.mmr-rain-drop{position:absolute;top:-12%;width:2px;height:14px;background:linear-gradient(to bottom,transparent,rgba(180,210,255,.8));animation-name:mmrRain;animation-iteration-count:infinite;animation-timing-function:linear}
@keyframes mmrRain{0%{transform:translateY(0);opacity:0}10%{opacity:.8}100%{transform:translateY(260px);opacity:0}}
.mmr-ticker{display:inline-block;padding-left:100%;animation:mmrTicker 14s linear infinite}
@keyframes mmrTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.mmr-owl{animation:mmrOwl 9s ease-in-out infinite}
@keyframes mmrOwl{0%{transform:translateX(8px) scaleX(1)}48%{transform:translateX(280px) scaleX(1)}50%{transform:translateX(280px) scaleX(-1)}98%{transform:translateX(8px) scaleX(-1)}100%{transform:translateX(8px) scaleX(1)}}
.mmr-sky{background:radial-gradient(120% 90% at 50% 110%,#1e1b4b 0%,#0b0a24 45%,#05060f 100%)}
.mmr-star{position:absolute;border-radius:9999px;background:#fff;box-shadow:0 0 3px #fff;opacity:.6;animation:mmrTwinkle 3.4s ease-in-out infinite}
@keyframes mmrTwinkle{0%,100%{opacity:.18;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.mmr-aurora{filter:blur(22px);opacity:.55;animation:mmrAurora 11s ease-in-out infinite}
@keyframes mmrAurora{0%,100%{transform:translateX(-6%) skewX(-4deg)}50%{transform:translateX(6%) skewX(4deg)}}
`;
