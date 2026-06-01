import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Crown } from "lucide-react";
import RevisionRunner from "./RevisionRunner";
import { getLeaderboard, submitScore, getPersonalBest, type ScoreRow } from "@/lib/leaderboard";

const NAME_KEY = "mmr_game_name";

export default function GameModal({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reason?: string;
}) {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [name, setName] = useState<string>(() => {
    try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; }
  });
  const [best, setBest] = useState(getPersonalBest());

  const refresh = () => { getLeaderboard(15).then(setRows).catch(() => {}); };

  useEffect(() => { if (open) refresh(); }, [open]);

  const handleGameOver = async (score: number) => {
    setLastScore(score);
    const display = (name || "You").trim().slice(0, 24);
    await submitScore(display, score);
    setBest(getPersonalBest());
    refresh();
  };

  const onNameChange = (v: string) => {
    setName(v);
    try { localStorage.setItem(NAME_KEY, v); } catch { /* ignore */ }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Revision Runner
            {reason && <span className="text-xs font-normal text-muted-foreground ml-1">· {reason}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
          {/* Game */}
          <div className="space-y-3">
            <RevisionRunner onGameOver={handleGameOver} />
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Your leaderboard name"
                maxLength={24}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                Best <span className="font-bold text-foreground">{best}</span>
              </div>
            </div>
            {lastScore !== null && (
              <p className="text-xs text-muted-foreground">
                {lastScore >= best && lastScore > 0 ? "🎉 New personal best — saved to the leaderboard!" : "Score saved. Beat it next break!"}
              </p>
            )}
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl border border-border bg-background-elevated p-3">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-amber-400" /> Global top 15
            </div>
            <ol className="space-y-0.5 max-h-[280px] overflow-y-auto">
              {rows.map((r, i) => (
                <li
                  key={`${r.name}-${i}`}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${r.you ? "bg-primary/15 text-primary font-semibold" : ""}`}
                >
                  <span className={`w-5 text-right tabular-nums ${i < 3 ? "text-amber-400 font-bold" : "text-muted-foreground"}`}>{i + 1}</span>
                  <span className="flex-1 truncate">{r.name}{r.you ? " (you)" : ""}</span>
                  <span className="font-mono tabular-nums">{r.score}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
