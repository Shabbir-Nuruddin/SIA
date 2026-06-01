import { useCallback, useEffect, useRef, useState } from "react";

/**
 * RevisionRunner — a lightweight Chrome-dino-style endless runner.
 *
 * Self-contained: all game state lives in a ref + a <canvas>, so it never causes
 * React re-renders during the loop. Jump with Space / ↑ / click / tap. Score rises
 * ~10/sec and the world speeds up, so runs naturally end. Calls onGameOver(score)
 * once per game so the host can offer to submit the score.
 */

type Phase = "idle" | "playing" | "over";

interface Obstacle { x: number; w: number; h: number; }
interface GameState {
  phase: Phase;
  startedAt: number;
  score: number;
  playerY: number;     // top of player (logical px)
  vy: number;
  obstacles: Obstacle[];
  nextSpawnAt: number; // ms timestamp
  speed: number;       // px/frame at 60fps baseline
  raf: number;
}

const W = 640;
const H = 200;
const GROUND = H - 28;
const PLAYER_X = 64;
const PLAYER_SIZE = 30;
const GRAVITY = 0.9;
const JUMP_V = -14;

export default function RevisionRunner({
  onGameOver,
  className = "",
}: {
  onGameOver?: (score: number) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>({
    phase: "idle", startedAt: 0, score: 0, playerY: GROUND - PLAYER_SIZE,
    vy: 0, obstacles: [], nextSpawnAt: 0, speed: 5, raf: 0,
  });
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, g: GameState) => {
    ctx.clearRect(0, 0, W, H);
    // ground line
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + PLAYER_SIZE);
    ctx.lineTo(W, GROUND + PLAYER_SIZE);
    ctx.stroke();

    // player (book) — rounded rect + emoji
    const py = g.playerY;
    ctx.fillStyle = "#6366f1";
    roundRect(ctx, PLAYER_X, py, PLAYER_SIZE, PLAYER_SIZE, 6);
    ctx.fill();
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📖", PLAYER_X + PLAYER_SIZE / 2, py + PLAYER_SIZE / 2 + 1);

    // obstacles
    for (const o of g.obstacles) {
      ctx.fillStyle = "#ec4899";
      roundRect(ctx, o.x, GROUND + PLAYER_SIZE - o.h, o.w, o.h, 4);
      ctx.fill();
    }
  }, []);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    const g = stateRef.current;
    if (!canvas || g.phase !== "playing") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const now = performance.now();

    // score & difficulty
    g.score = Math.floor((now - g.startedAt) / 100);
    g.speed = 5 + g.score / 90; // ramps up over time

    // physics
    g.vy += GRAVITY;
    g.playerY += g.vy;
    const floor = GROUND - PLAYER_SIZE;
    if (g.playerY > floor) { g.playerY = floor; g.vy = 0; }

    // spawn obstacles
    if (now >= g.nextSpawnAt) {
      const h = 22 + Math.random() * 26;
      g.obstacles.push({ x: W + 10, w: 16 + Math.random() * 12, h });
      const gap = 900 - Math.min(450, g.score * 1.2); // closer together over time
      g.nextSpawnAt = now + Math.max(420, gap) + Math.random() * 300;
    }

    // move + cull + collide
    const px1 = PLAYER_X + 4, px2 = PLAYER_X + PLAYER_SIZE - 4;
    const pyTop = g.playerY + 3, pyBot = g.playerY + PLAYER_SIZE - 2;
    for (const o of g.obstacles) o.x -= g.speed;
    g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10);
    for (const o of g.obstacles) {
      const oyTop = GROUND + PLAYER_SIZE - o.h;
      if (px2 > o.x && px1 < o.x + o.w && pyBot > oyTop) {
        // collision → game over
        g.phase = "over";
        setPhase("over");
        setScore(g.score);
        onGameOver?.(g.score);
        draw(ctx, g);
        return;
      }
    }

    setScore(g.score);
    draw(ctx, g);
    g.raf = requestAnimationFrame(loop);
  }, [draw, onGameOver]);

  const start = useCallback(() => {
    const g = stateRef.current;
    cancelAnimationFrame(g.raf);
    g.phase = "playing";
    g.startedAt = performance.now();
    g.score = 0;
    g.playerY = GROUND - PLAYER_SIZE;
    g.vy = 0;
    g.obstacles = [];
    g.speed = 5;
    g.nextSpawnAt = performance.now() + 600;
    setPhase("playing");
    setScore(0);
    g.raf = requestAnimationFrame(loop);
  }, [loop]);

  const jump = useCallback(() => {
    const g = stateRef.current;
    if (g.phase === "idle" || g.phase === "over") { start(); return; }
    if (g.playerY >= GROUND - PLAYER_SIZE - 1) g.vy = JUMP_V;
  }, [start]);

  // input + crisp canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) { ctx.scale(dpr, dpr); draw(ctx, stateRef.current); }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(stateRef.current.raf);
    };
  }, [draw, jump]);

  return (
    <div className={className}>
      <div
        className="relative w-full overflow-hidden rounded-xl border border-border bg-background-elevated cursor-pointer select-none"
        onPointerDown={(e) => { e.preventDefault(); jump(); }}
        role="button"
        tabIndex={0}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
        <div className="absolute top-2 right-3 font-mono text-sm font-bold text-foreground/80 tabular-nums">
          {String(score).padStart(4, "0")}
        </div>
        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/55 backdrop-blur-[1px]">
            <div className="text-lg font-bold">
              {phase === "over" ? `Score ${score}` : "Revision Runner"}
            </div>
            <div className="text-xs text-muted-foreground">
              {phase === "over" ? "Tap or press Space to play again" : "Tap / Space / ↑ to jump"}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); start(); }}
              className="mt-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
            >
              {phase === "over" ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
