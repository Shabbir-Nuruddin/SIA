import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import StudyTycoon from "./StudyTycoon";

/**
 * Shown inside long loading states (notes generation, roadmap building). Appears
 * after a short delay so quick loads don't flash it. The game is the persistent
 * Study Tycoon, so progress + scores carry over to the break game and leaderboard.
 */
export default function LoadingGameCard({
  delayMs = 1200,
  className = "",
  note = "This is loading in the background — keep tapping, it'll be ready soon.",
}: {
  delayMs?: number;
  className?: string;
  note?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!show) return null;

  return (
    <div className={`rounded-2xl border border-border bg-background-elevated p-4 animate-fade-in ${className}`}>
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
        <Gamepad2 className="h-4 w-4 text-primary" /> Play while you wait
      </div>
      <StudyTycoon compact />
      <p className="mt-2 text-[11px] text-muted-foreground text-center">{note}</p>
    </div>
  );
}
