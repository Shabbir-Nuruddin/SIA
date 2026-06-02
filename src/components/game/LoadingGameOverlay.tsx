import { useEffect, useState } from "react";
import { X, Gamepad2 } from "lucide-react";
import StudyTycoon from "./StudyTycoon";

/**
 * A top overlay that shows the break game while something is generating
 * (notes, roadmap, onboarding). It pops up over the page after a short delay,
 * has a close (X) button, and AUTO-CLOSES the moment `open` goes false (i.e.
 * generation finished). The game is the persistent Study Tycoon so progress and
 * scores carry over to the break game and leaderboard.
 */
export default function LoadingGameOverlay({
  open,
  delayMs = 1500,
  note = "This is loading in the background — keep tapping. It'll close itself the moment it's ready.",
}: {
  open: boolean;
  delayMs?: number;
  note?: string;
}) {
  const [show, setShow] = useState(false); // delayed appearance so quick loads don't flash
  const [dismissed, setDismissed] = useState(false); // manual close for this load

  useEffect(() => {
    if (!open) {
      // Loading finished (or never started) → reset so the next load can show again.
      setShow(false);
      setDismissed(false);
      return;
    }
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [open, delayMs]);

  if (!open || !show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/55 p-3 backdrop-blur-sm animate-fade-in sm:p-6">
      <div className="relative mt-4 w-full max-w-5xl rounded-2xl border border-border bg-background-elevated shadow-2xl sm:mt-8">
        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Gamepad2 className="h-4 w-4 text-primary" /> SIA Break Arcade
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-5">
          <div className="mb-4 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-center">
            <div className="text-sm font-extrabold text-foreground">⏳ Hang tight — we're building your personalised revision roadmap.</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Meanwhile, play <b className="text-primary">Study Tycoon</b>: tap the brain to earn marks, buy study tools, and climb the SIA leaderboard.
              This closes itself the moment your roadmap is ready. 🎉
            </div>
          </div>
          <StudyTycoon showLeaderboard />
          <p className="mt-3 text-center text-[11px] text-muted-foreground">{note}</p>
        </div>
      </div>
    </div>
  );
}
