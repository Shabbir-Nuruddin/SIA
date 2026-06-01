import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Crown } from "lucide-react";
import StudyTycoon, { formatMarks } from "./StudyTycoon";
import { getLeaderboard, type ScoreRow } from "@/lib/leaderboard";

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
  const [name, setName] = useState<string>(() => {
    try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; }
  });

  const refresh = () => { getLeaderboard(15).then(setRows).catch(() => {}); };

  // Refresh the board while the modal is open (the game submits in the background).
  useEffect(() => {
    if (!open) return;
    refresh();
    const id = setInterval(refresh, 6000);
    return () => clearInterval(id);
  }, [open]);

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
            Study Tycoon
            {reason && <span className="text-xs font-normal text-muted-foreground ml-1">· {reason}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-5">
          {/* Game */}
          <div className="space-y-3">
            <StudyTycoon />
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your leaderboard name"
              maxLength={24}
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl border border-border bg-background-elevated p-3 h-fit">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-amber-400" /> Global top 15
            </div>
            <ol className="space-y-0.5 max-h-[360px] overflow-y-auto">
              {rows.map((r, i) => (
                <li
                  key={`${r.name}-${i}`}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${r.you ? "bg-primary/15 text-primary font-semibold" : ""}`}
                >
                  <span className={`w-5 text-right tabular-nums ${i < 3 ? "text-amber-400 font-bold" : "text-muted-foreground"}`}>{i + 1}</span>
                  <span className="flex-1 truncate">{r.name}{r.you ? " (you)" : ""}</span>
                  <span className="font-mono tabular-nums">{formatMarks(r.score)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-[10px] text-muted-foreground">Earn marks, climb the board. Your tools keep earning while you're away.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
