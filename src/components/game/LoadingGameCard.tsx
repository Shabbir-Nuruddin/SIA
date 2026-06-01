import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import RevisionRunner from "./RevisionRunner";
import { submitScore, getPersonalBest } from "@/lib/leaderboard";

/**
 * Shown inside long loading states (notes generation, roadmap building). After a
 * short delay it offers the runner so the wait feels shorter. Scores still count
 * toward the global leaderboard / personal best.
 */
export default function LoadingGameCard({
  delayMs = 3500,
  className = "",
  note = "This is loading in the background — keep playing, it'll be ready soon.",
}: {
  delayMs?: number;
  className?: string;
  note?: string;
}) {
  const [show, setShow] = useState(false);
  const [best, setBest] = useState(getPersonalBest());

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!show) return null;

  return (
    <div className={`rounded-2xl border border-border bg-background-elevated p-4 animate-fade-in ${className}`}>
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
        <Gamepad2 className="h-4 w-4 text-primary" /> Play while you wait
        <span className="ml-auto text-xs text-muted-foreground">Best <span className="font-bold text-foreground">{best}</span></span>
      </div>
      <RevisionRunner
        onGameOver={(s) => { submitScore(localStorage.getItem("mmr_game_name") || "You", s); setBest(getPersonalBest()); }}
      />
      <p className="mt-2 text-[11px] text-muted-foreground text-center">{note}</p>
    </div>
  );
}
